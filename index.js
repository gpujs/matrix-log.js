class MatrixLog {
  /**
   *
   * @param {string} name
   * @param {number} width
   * @param {number} height
   * @param {number} [depth]
   */
  constructor(name, width, height, depth = null) {
    this.width = width;
    this.height = height;
    this.depth = depth || 1;
    this.name = name;
    this.locations = {};
    this.is3d = depth > 1;
    this.rowSpacing = 30;
    this.location = null;
    for (let z = 0; z < this.depth; z++) {
      const layer = this.locations[z] = {};
      for (let y = 0; y < height; y++) {
        const row = layer[y] = {};
        for (let x = 0; x < width; x++) {
          const column = {};
          row[x] = column;
        }
      }
    }
  }

  /**
   *
   * @param {object} location
   * @param {number} location.x
   * @param {number} location.y
   * @param {number} [location.z]
   * @returns {MatrixLog}
   */
  at(location) {
    const x = location.x;
    const y = location.y;
    const z = location.z || 0;

    this.location = this.locations[z][y][x];
    return this;
  }

  /**
   *
   * @param {object} child
   * @param {string} child.name
   * @param {number} child.x
   * @param {number} child.y
   * @param {number} [child.z]
   * @param {number} child.width
   * @param {number} child.height
   * @param {number} [child.depth]
   * @returns {MatrixLog}
   */
  add(child) {
    const name = child.name;
    const x = child.x;
    const y = child.y;
    const z  = child.z || 0;
    const width = child.width;
    const height = child.height;
    const depth = child.depth || 1;

    if (!this.location[name]) {
      this.location[name] = {
        width: width,
        height: height,
        depth: depth
      };
    }
    const location = this.location[name];

    if (!location[z]) {
      location[z] = {}
    }
    if (!location[z][y]) {
      location[z][y] = []
    }
    location[z][y].push(x);
    return this;
  }

  /**
   * 
   * @param {string} childName
   * @returns {string}
   */
  toString(childName) {
    const result = [];
    for (let parentZ = 0; parentZ < this.depth; parentZ++) {
      for (let parentY = 0; parentY < this.height; parentY++) {
        for (let parentX = 0; parentX < this.width; parentX++) {
          const child = this.locations[parentZ][parentY][parentX][childName];
          if (!child) continue;
          const childWidth = child.width;
          const childHeight = child.height;
          const childDepth = child.depth;

          const parentHeader = this.is3d
            ? `${ this.name } x=${parentX},y=${parentY},z=${parentZ}`
            : `${ this.name } x=${parentX},y=${parentY}`;
          const parentDimensionsHeader = this.is3d
            ? `width=${this.width},height=${this.height},depth=${this.depth}`
            : `width=${this.width},height=${this.height}`;
          const childHeader = childName;
          const childDimensionsHeader = this.is3d
            ? `width=${childWidth},height=${childHeight},depth=${childDepth}`
            : `width=${childWidth},height=${childHeight}`;

          // draw headers
          const rows = [
            `${ parentHeader }${ ' '.repeat(Math.max(this.rowSpacing + (this.width * 3) - parentHeader.length, 1)) }${ childHeader }`,
            `${ parentDimensionsHeader }${ ' '.repeat(Math.max(this.rowSpacing + (this.width * 3) - parentDimensionsHeader.length, 1)) }${ childDimensionsHeader }`,
          ];

          for (let childY = 0; childY < childHeight; childY++) {
            let row = '';

            // draw parent matrix where y indexes match
            if (childY < this.height) {
              for (let x = 0; x < this.width; x++) {
                if (x === parentX && childY === parentY) {
                  row += '[*]';
                } else {
                  row += '[ ]';
                }
              }
              row += ' '.repeat(this.rowSpacing);
            }

            // provide spacing if child is larger than parent matrix
            if (childY >= this.height) {
              row += ' '.repeat((this.width * 3) + this.rowSpacing);
            }

            // draw child matrix
            for (let childX = 0; childX < childWidth; childX++) {
              if (child[0][childY] && child[0][childY].indexOf(childX) > -1) {
                row += '[*]';
              } else {
                row += '[ ]';
              }
            }

            rows.push(row);

            // continue to draw parent matrix on last child's y index
            if (childY + 1 === childHeight) {
              let beyondchildHeight = childY + 1;
              while (beyondchildHeight < this.height) {
                let beyondRow = '';
                for (let x = 0; x < this.width; x++) {
                  if (x === parentX && beyondchildHeight === parentY) {
                    beyondRow += '[*]';
                  } else {
                    beyondRow += '[ ]';
                  }
                }
                rows.push(beyondRow);
                beyondchildHeight++;
              }
            }

            // draw spacing after matrix
            if (childY + 1 === childHeight) {
              rows.push('');
            }
          }

          result.push(rows.join('\n'));
        }
      }
    }
    return result.join('\n');
  }
}

module.exports = MatrixLog;