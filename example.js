const assert = require('assert');
const MatrixLog = require('./index');

const weights = [
  [1,2,3,4],
  [5,6,7,8],
  [9,10,11,12],
  [13,14,15,16]
];

const targetValue = step1CPU();
assert.deepStrictEqual(step2CPUWithMatrixLog(), targetValue);
assert.deepStrictEqual(step3GPUStyleLoops(), targetValue);
assert.deepStrictEqual(step4GPUStyleKernel(), targetValue);
assert.deepStrictEqual(step5GPUKernel(), targetValue);

function step1CPU() {
  const filters = [
    [0,0],
    [0,0]
  ];
  for (let y = 0; y < 4; y++) {
    let filterY = y < 2 ? 0 : 1;
    for (let x = 0; x < 4; x++) {
      let filterX = x < 2 ? 0 : 1;
      filters[filterY][filterX] += weights[y][x];
    }
  }
  return filters;
}

function step2CPUWithMatrixLog() {
  const filters = [
    [0,0],
    [0,0]
  ];
  const matrixLog = new MatrixLog('filters', 2, 2);
  for (let y = 0; y < 4; y++) {
    let filterY = y < 2 ? 0 : 1;
    for (let x = 0; x < 4; x++) {
      let filterX = x < 2 ? 0 : 1;
      // IMPORTANT: GPU violation, we are reading (+) and writing (=) multiple times to a point in the filter matrix, CPU works fine, GPU explodes
      // Don't understand?
      //  * Watch this video: https://www.youtube.com/watch?v=-P28LKWTzrI and think of the
      //  * Think of the Leonardo 2's cannons talking with each other
      filters[filterY][filterX] += weights[y][x];

      // IMPORTANT: We added the following code to show us the shape of the algorithm
      matrixLog
        .at({
          x: filterX,
          y: filterY
        })
        .add({
          name: 'weights',
          x,
          y,
          width: weights[0].length,
          height: weights.length
        });
    }
  }

  console.log(filters);
  console.log(matrixLog.toString('weights'));
  return filters;
}

function step3GPUStyleLoops() {
  const filters = [
    [0,0],
    [0,0]
  ];
  const filterHeight = 2;
  const filterWidth = 2;

  for (let filterY = 0; filterY < filterHeight; filterY++) {
    for (let filterX = 0; filterX < filterWidth; filterX++) {
      // NOTE: += filters!
      let sum = filters[filterY][filterX];

      const yMin = filterHeight * filterY;
      const yMax = yMin + filterHeight;
      const xMin = filterWidth * filterX;
      const xMax = xMin + filterWidth;

      for (let y = yMin; y < yMax; y++) {
        for (let x = xMin; x < xMax; x++) {
          sum += weights[y][x];
        }
      }

      // IMPORTANT: single assignment
      filters[filterY][filterX] = sum;
    }
  }

  return filters;
}

function step4GPUStyleKernel() {
  const filters = [
    [0,0],
    [0,0]
  ];
  filters[0][0] = filterKernel(filters, 0, 0, 2, 2, weights);
  filters[0][1] = filterKernel(filters, 1, 0, 2, 2, weights);
  filters[1][0] = filterKernel(filters, 0, 1, 2, 2, weights);
  filters[1][1] = filterKernel(filters, 1, 1, 2, 2, weights);

  function filterKernel(filters, filterX, filterY, filterWidth, filterHeight, weights) {
    // NOTE: += filters!
    let sum = filters[filterY][filterX];

    const yMin = filterHeight * filterY;
    const yMax = yMin + filterHeight;
    const xMin = filterWidth * filterX;
    const xMax = xMin + filterWidth;

    for (let y = yMin; y < yMax; y++) {
      for (let x = xMin; x < xMax; x++) {
        sum += weights[y][x];
      }
    }

    // IMPORTANT: single assignment
    return sum;
  }
  return filters;
}

function step5GPUKernel() {
  const filters = [
    [0,0],
    [0,0]
  ];
  const GPU = require('gpu.js');
  const gpu = new GPU();

  const filterKernel = gpu.createKernel(function (filters, weights) {
    let sum = filters[this.thread.y][this.thread.x];

    const yMin = this.output.y * this.thread.y;
    const yMax = yMin + this.output.y;
    const xMin = this.output.x * this.thread.x;
    const xMax = xMin + this.output.x;

    for (let y = yMin; y < yMax; y++) {
      for (let x = xMin; x < xMax; x++) {
        sum += weights[y][x];
      }
    }
    // IMPORTANT: single assignment
    return sum;
  }, {
    output: [2, 2]
  });

  return filterKernel(filters, weights);
}