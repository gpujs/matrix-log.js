class MatrixLog {
  /**
   *
   * @param {string} name
   * @param {number} width
   * @param {number} height
   * @param {number|null} [depth]
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
          const column = {
            x: x,
            y: y,
            z: z
          };
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
    const z = child.z || 0;
    const width = child.width;
    const height = child.height;
    const depth = child.depth || 1;
    let location = this.location[name];

    if (!this.location[name]) {
      location = this.location[name] = {
        width: width,
        height: height,
        depth: depth,
        points: {},
        lowX: 0,
        highX: width - 1,
        lowY: 0,
        highY: height - 1
      };

      for (let z = 0; z < depth; z++) {
        location.points[z] = {};
        for (let y = 0; y < height; y++) {
          location.points[z][y] = [];
        }
      }
    }

    const points = location.points;

    // handle negative and positive
    if (y < location.lowY) {
      location.lowY = y;
      points[z][y] = [];
    } else if (y > location.highX) {
      location.highY = y;
      points[z][y] = [];
    }

    if (x < location.lowX) {
      location.lowX = x;
    } else if (x > location.highX) {
      location.highX = x;
    }

    points[z][y].push(x);
    return this;
  }

  /**
   * 
   * @param {string} childName
   * @returns {string}
   */
  toString(childName) {
    const result = [];
    for (let z = 0; z < this.depth; z++) {
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.at({ x, y, z });
          const child = this.location[childName];
          if (!child) continue;
          const childWidth = child.width;
          const childHeight = child.height;
          const childDepth = child.depth;

          const parentHeader = this.is3d
            ? `${ this.name } x=${x},y=${y},z=${z}`
            : `${ this.name } x=${x},y=${y}`;
          const parentDimensionsHeader = this.is3d
            ? `width=${this.width},height=${this.height},depth=${this.depth}`
            : `width=${this.width},height=${this.height}`;
          const childHeader = childName;
          const childDimensionsHeader = this.is3d
            ? `width=${childWidth},height=${childHeight},depth=${childDepth}`
            : `width=${childWidth},height=${childHeight}`;

          const parentLog = this.getParentLog();
          const childLog = this.getChildLog(childName);
          const parentGrid = this.logToGrid(parentLog, this.depth);
          const childGrid = this.logToGrid(childLog, childDepth);

          // draw headers
          const rows = this.mergeGrids(parentGrid, childGrid);

          rows.unshift(
            `${ parentHeader }${ ' '.repeat(Math.max(this.rowSpacing + parentGrid[0].length - parentHeader.length, 1)) }${ childHeader }`,
            `${ parentDimensionsHeader }${ ' '.repeat(Math.max(this.rowSpacing + parentGrid[0].length - parentDimensionsHeader.length, 1)) }${ childDimensionsHeader }`
          );

          rows.push('');
          result.push(rows.join('\n'));
        }
      }
    }
    return result.join('\n');
  }

  /**
   *
   * @returns {string[]}
   */
  getParentLog() {
    const log = [];
    for (let z = 0; z < this.depth; z++) {
      const matrix = [];
      for (let y = 0; y < this.height; y++) {
        const row = [];
        for (let x = 0; x < this.width; x++) {
          row.push(this.locations[z][y][x] === this.location ? '[*]' : '[ ]');
        }
        matrix.push(row.join(''));
      }
      log.push(matrix);
    }
    return log;
  }

  /**
   *
   * @param childName
   * @returns {string[]}
   */
  getChildLog(childName) {
    const location = this.location[childName];
    const points = location.points;

    const log = [];
    for (let z = 0; z < location.depth; z++) {
      const matrix = [];
      for (let y = location.lowY; y <= location.highY; y++) {
        const row = [];
        for (let x = location.lowX; x <= location.highX; x++) {
          if (y < 0 || x < 0 || y >= location.height || x >= location.width) {
            row.push(
              points[z][y] && points[z][y].indexOf(x) > -1
                ? MatrixLog.dependantPointOutString
                : MatrixLog.pointOutString
            );
          } else {
            row.push(
              points[z][y].indexOf(x) > -1
                ? MatrixLog.dependantPointInString
                : MatrixLog.pointInString
            );
          }
        }
        matrix.push(row.join(''));
      }
      log.push(matrix);
    }
    return log;
  }

  /**
   *
   * @param log
   * @param depth
   * @returns {string[]}
   */
  logToGrid(log, depth) {
    const gridWidth = Math.round(Math.sqrt(depth));
    const rows = [];
    let z = 0;
    while (z < depth) {
      for (let y = 0; y < log[0].length; y++) {
        const row = [];
        for (let i = 0; i < gridWidth && z + i < depth; i++) {
          row.push(log[z + i][y]);
        }
        rows.push(row.join('  '));
      }
      z += gridWidth;
      if (z < depth) {
        rows.push(' '.repeat(rows[rows.length - 1].length));
      }
    }
    return rows;
  }

  /**
   *
   * @param gridLeft
   * @param gridRight
   * @returns {string[]}
   */
  mergeGrids(gridLeft, gridRight) {
    let gridLeftRowIndex = 0;
    let gridRightRowIndex = 0;
    const result = [];
    while (gridLeftRowIndex < gridLeft.length || gridRightRowIndex < gridRight.length) {
      const row = [];
      if (gridLeftRowIndex < gridLeft.length) {
        row.push(gridLeft[gridLeftRowIndex]);
      }

      if (gridRightRowIndex < gridRight.length) {
        row.push(' '.repeat(this.rowSpacing + (gridLeft[0].length - (gridLeft[gridLeftRowIndex] ? gridLeft[gridLeftRowIndex].length : 0))));
        row.push(gridRight[gridRightRowIndex]);
      }

      result.push(row.join(''));
      gridLeftRowIndex++;
      gridRightRowIndex++;
    }
    return result;
  }
}

MatrixLog.dependantPointInString = '[*]';
MatrixLog.pointInString = '[ ]';
MatrixLog.dependantPointOutString = ' * ';
MatrixLog.pointOutString = ' - ';

module.exports = MatrixLog;