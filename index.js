module.exports = class MatrixLog {
  constructor(name, width, height) {
    this.width = width;
    this.height = height;
    this.widths = {};
    this.heights = {};
    this.name = name;
    this.root = {};
    this.rowSpacing = 30;
    for (let y = 0; y < height; y++) {
      let row = this.root[y] = {};
      for (let x = 0; x < width; x++) {
        row[x] = {};
      }
    }
  }
  add(patternName, rootX, rootY, patternX, patternY, patternWidth, patternHeight) {
    if (!this.root[rootY][rootX][patternName]) {
      this.widths[patternName] = 0;
      this.heights[patternName] = 0;
      this.root[rootY][rootX][patternName] = {};
    }
    const pattern = this.root[rootY][rootX][patternName];

    if (!pattern[patternY]) {
      pattern[patternY] = []
    }
    pattern[patternY].push(patternX);
    if (patternWidth > this.widths[patternName]) {
      this.widths[patternName] = patternWidth;
    }
    if (patternHeight > this.heights[patternName]) {
      this.heights[patternName] = patternHeight;
    }
  }
  toString(patternName) {
    const result = [];
    for (let rootY = 0; rootY < this.height; rootY++) {
      for (let rootX = 0; rootX < this.width; rootX++) {
        const pattern = this.root[rootY][rootX][patternName];
        if (!pattern) continue;
        const patternWidth = this.widths[patternName];
        const patternHeight = this.heights[patternName];

        const primaryHeader = `${ this.name } x=${rootX},y=${rootY}`;
        const primaryDimensions = `width=${this.width},height=${this.height}`;
        const patternHeader = patternName;
        const patternDimensions = `width=${patternWidth},height=${patternHeight}`;

        // draw headers
        const rows = [
          `${ primaryHeader }${ ' '.repeat(Math.max(this.rowSpacing  + (this.width * 3) - primaryHeader.length, 1)) }${ patternHeader }`,
          `${ primaryDimensions }${ ' '.repeat(Math.max(this.rowSpacing  + (this.width * 3) - primaryDimensions.length, 1)) }${ patternDimensions }`,
        ];

        for (let patternY = 0; patternY < patternHeight; patternY++) {
          let row = '';

          // draw primary matrix where y indexes match
          if (patternY < this.height) {
            for (let x = 0; x < this.width; x++) {
              if (x === rootX && patternY === rootY) {
                row += '[*]';
              } else {
                row += '[ ]';
              }
            }
            row += ' '.repeat(this.rowSpacing);
          }

          // provide spacing if pattern is larger than primary matrix
          if (patternY >= this.height) {
            row += ' '.repeat((this.width * 3) + this.rowSpacing);
          }

          // draw pattern matrix
          for (let patternX = 0; patternX < patternWidth; patternX++) {
            if (pattern[patternY] && pattern[patternY].indexOf(patternX) > -1) {
              row += '[*]';
            } else {
              row += '[ ]';
            }
          }

          rows.push(row);

          // continue to draw primary matrix on last pattern's y index
          if (patternY + 1 === patternHeight) {
            let beyondPatternHeight = patternY + 1;
            while (beyondPatternHeight < this.height) {
              let beyondRow = '';
              for (var x = 0; x < this.width; x++) {
                if (x === rootX && beyondPatternHeight === rootY) {
                  beyondRow += '[*]';
                } else {
                  beyondRow += '[ ]';
                }
              }
              rows.push(beyondRow);
              beyondPatternHeight++;
            }
          }

          // draw spacing after matrix
          if (patternY + 1 === patternHeight) {
            rows.push('');
          }
        }

        result.push(rows.join('\n'));
      }
    }
    return result.join('\n');
  }
};