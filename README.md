# Matrix Log

A matrix log dependency utility. Useful for converting and testing algorithm behavior of CPU code to GPU code.

## Why?
GPU Principle: Your can only _write to_ or _read from_ Arrays (Textures).

CPU Principle: You can read or write to arrays _as you see fit_.

GPU Problem: Sometimes you'd like to convert your CPU code to GPU code.

By strategically using MatrixLog as a logger in your CPU algorithms, you can see which points are dependent from your source arrays to your target arrays.
This makes converting CPU code to run on GPU, using a utility like [GPU.js](http://gpu.rocks), much easier.

## API
```js
import * as MatrixLog from 'matrix-log';


// create a matrix log that will have dependencies called
const matrixLog =  new MatrixLog(parentMatrixName, width, height, depth); //depth is optional

matrixLog.at({
  x: parentX,
  y: parentY,
  z: parentZ  // optional
});

// in your algorithm, perhaps many times
matrixLog.add({
  name: childMatrixName,
  x: childX,
  y: childY,
  z: childZ,  // optional
  width: childWidth,
  height: childHeight,
  depth: childDepth // optional
});


// after your algorithm
const childMatrixLog = matrixLog.toString(childMatrixName); 
```

## What does a 2d log (output of `.toString(string)`) look like?

```
test-matrix x=0,y=0                 child-matrix
width=2,height=2                    width=4,height=4
[*][ ]                              [*][*][ ][ ]
[ ][ ]                              [*][*][ ][ ]
                                    [ ][ ][ ][ ]
                                    [ ][ ][ ][ ]

test-matrix x=1,y=0                 child-matrix
width=2,height=2                    width=4,height=4
[ ][*]                              [ ][ ][*][*]
[ ][ ]                              [ ][ ][*][*]
                                    [ ][ ][ ][ ]
                                    [ ][ ][ ][ ]

test-matrix x=0,y=1                 child-matrix
width=2,height=2                    width=4,height=4
[ ][ ]                              [ ][ ][ ][ ]
[*][ ]                              [ ][ ][ ][ ]
                                    [*][*][ ][ ]
                                    [*][*][ ][ ]

test-matrix x=1,y=1                 child-matrix
width=2,height=2                    width=4,height=4
[ ][ ]                              [ ][ ][ ][ ]
[ ][*]                              [ ][ ][ ][ ]
                                    [ ][ ][*][*]
                                    [ ][ ][*][*]

```

## What does this log mean?
1. Suppose we had a (contrived) block of CPU code we'd like to run on the GPU:
```js
const filters = [
  [0,0],
  [0,0]
];

const weights = [
  [1,2,3,4],
  [5,6,7,8],
  [9,10,11,12],
  [13,14,15,16]
];

for (let y = 0; y < 4; y++) {
  let filterY = y < 2 ? 0 : 1;
  for (let x = 0; x < 4; x++) {
    let filterX = x < filter.length ? 0 : 1;
    filters[filterY][filterX] += weights[y][x];
  }
}

console.log(filters); // -> [ [ 14, 22 ], [ 46, 54 ] ]
```

This code doesn't directly work on the GPU, because we can only _either_ read or write to arrays there.  Currently `filters` violates this.  However, we could use MatrixLog to _help us_ (note, there is a little thinking that needs to take place) solve this issue by finding the algorithm that `filters` needs.

2. Convert the code as follows and see the output below:
```js
const MatrixLog = require('./index');

const filters = [
  [0,0],
  [0,0]
];
const weights = [
  [1,2,3,4],
  [5,6,7,8],
  [9,10,11,12],
  [13,14,15,16]
];

const matrixLog = new MatrixLog('filters', 2, 2);
for (let y = 0; y < 4; y++) {
  let filterY = y < 2 ? 0 : 1;
  for (let x = 0; x < 4; x++) {
    let filterX = x < filter.length ? 0 : 1;
    filters[filterY][filterX] += weights[y][x];
    matrixLog
      .add('weights', filterX, filterY, x, y, weights[0].length, weights.length);
  }
}

console.log(matrixLog.toString('weights'));
```

Gives us the output:
```
filters x=0,y=0                     weights
width=2,height=2                    width=4,height=4
[*][ ]                              [*][*][ ][ ]
[ ][ ]                              [*][*][ ][ ]
                                    [ ][ ][ ][ ]
                                    [ ][ ][ ][ ]

filters x=1,y=0                     weights
width=2,height=2                    width=4,height=4
[ ][*]                              [ ][ ][*][*]
[ ][ ]                              [ ][ ][*][*]
                                    [ ][ ][ ][ ]
                                    [ ][ ][ ][ ]

filters x=0,y=1                     weights
width=2,height=2                    width=4,height=4
[ ][ ]                              [ ][ ][ ][ ]
[*][ ]                              [ ][ ][ ][ ]
                                    [*][*][ ][ ]
                                    [*][*][ ][ ]

filters x=1,y=1                     weights
width=2,height=2                    width=4,height=4
[ ][ ]                              [ ][ ][ ][ ]
[ ][*]                              [ ][ ][ ][ ]
                                    [ ][ ][*][*]
                                    [ ][ ][*][*]
```

3. Now we have enough logic to visibly see how to build out our algorythm that will work on the GPU.  For `filters`@`x=0,y=0` we can see we need the values from `weights`@`x=0,y=0`,`x=1,y=0`,`x=0,y=1`, and `x=1,y=1`. Then to get `filters`@`x=1,y=0`, we seem to increment by two on `weights`.  If we were to write a loop that emilates this behaviour, it'd look something like this:

```js
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

    // single assignment
    filters[filterY][filterX] = sum;
  }
}

console.log(filters); // -> [ [ 14, 22 ], [ 46, 54 ] ]
```

4. On the GPU we are writing from a kernel, which acts like the `filters` loop already, so we can ommit that and pretend that the function will run in its own "fragment" (like iteration of the inner most loops for building the value).  If that function was just simple Javascript that we imagined might work on a GPU kernel, it'd looks something like this:

```js
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

  return sum;
}

console.log(filterKernel(filters, 0, 0, 2, 2, weights)); // -> 14
console.log(filterKernel(filters, 1, 0, 2, 2, weights)); // -> 22
console.log(filterKernel(filters, 0, 1, 2, 2, weights)); // -> 46
console.log(filterKernel(filters, 1, 1, 2, 2, weights)); // -> 54
```

5. If we use a GPU environment, such as GPU.js, we could then then convert the kernel so that our algorithm actually works for setting the value of `filters` like this:

```js
import GPU from 'gpu.js';
const gpu = new GPU();

const filterKernel = gpu.createKernel(function(filters, weights) {
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
  return sum;
}, {
  output: [2, 2]
});

console.log(filterKernel(filters, weights));// -> [ [ 14, 22 ], [ 46, 54 ] ]
```

## What benefits are there to using MatrixLog?
1. Seeing is understanding
2. Automated unit testing new GPU algorithm against already existing CPU code with an output that can be understood by humans. 
