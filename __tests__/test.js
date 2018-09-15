const MatrixLog = require('../index');

describe('MatrixLog', () => {
  describe('2d', () => {
    describe('.add()', () => {
      test('can work on a smaller than parent pattern', () => {
        const x = 0;
        const y = 0;
        const z = 0;
        const childX = 3;
        const childY = 3;
        const childZ = 0;
        const matrixLog = new MatrixLog('test-matrix', 2, 2);
        expect(matrixLog.is3d).toBe(false);
        matrixLog.at({ x: x, y: y })
          .add({
            name:'child-matrix',
            x: childX,
            y: childY,
            width: 4,
            height: 4
          });
        expect(matrixLog.locations[z][y][x]['child-matrix'][childZ][childY].indexOf(childX)).toBe(0);
      });
    });
    describe('.toString()', () => {
      test('repeats for every point logged', () => {
        const matrixLog = new MatrixLog('test-matrix', 2, 1);

        matrixLog.at({ x: 0, y: 0 })
          .add({
            name: 'child-matrix',
            x: 0,
            y: 0,
            width: 4,
            height: 4
          });
        matrixLog.at({ x: 1, y: 0 })
          .add({
            name: 'child-matrix',
            x: 0,
            y: 1,
            width: 4,
            height: 4
          });

        const lines = matrixLog.toString('child-matrix').split(/\n/);
        expect(lines.length).toBe(14);
        expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
        expect(lines[1]).toBe('width=2,height=1                    width=4,height=4');
        expect(lines[2]).toBe('[*][ ]                              [*][ ][ ][ ]');
        expect(lines[3]).toBe('                                    [ ][ ][ ][ ]');
        expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
        expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
        expect(lines[6]).toBe('');
        expect(lines[7]).toBe('test-matrix x=1,y=0                 child-matrix');
        expect(lines[8]).toBe('width=2,height=1                    width=4,height=4');
        expect(lines[9]).toBe('[ ][*]                              [ ][ ][ ][ ]');
        expect(lines[10]).toBe('                                    [*][ ][ ][ ]');
        expect(lines[11]).toBe('                                    [ ][ ][ ][ ]');
        expect(lines[12]).toBe('                                    [ ][ ][ ][ ]');
        expect(lines[13]).toBe('');
      });
      describe('parent of 2x2, pattern 4,4', () => {
        test('0,0', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 1, width: 4, height: 4 });

          console.log(matrixLog.toString('child-matrix'));

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [*][*][ ][ ]');
          expect(lines[3]).toBe('[ ][ ]                              [*][*][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });

        test('1,0', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 1, y: 0 })
            .add({ name: 'child-matrix', x: 2, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 1, width: 4, height: 4 });


          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=1,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[ ][*]                              [ ][ ][*][*]');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][*][*]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });

        test('0,1', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 1 })
            .add({ name: 'child-matrix', x: 0, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 3, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=1                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[*][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [*][*][ ][ ]');
          expect(lines[5]).toBe('                                    [*][*][ ][ ]');
          expect(lines[6]).toBe('');
        });

        test('1,1', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);

          matrixLog.at({ x: 1, y: 1 })
            .add({ name: 'child-matrix', x: 2, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 3, width: 4, height: 4 });


          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=1,y=1                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][*]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][*][*]');
          expect(lines[5]).toBe('                                    [ ][ ][*][*]');
          expect(lines[6]).toBe('');
        });
      });
      describe('parent of 8x8, pattern 4,4', () => {
        test('0,0', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 1, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=0,y=0                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[*][ ][ ][ ][ ][ ][ ][ ]                              [*][*][ ][ ]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [*][*][ ][ ]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('1,1', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);

          matrixLog.at({ x: 1, y: 1 })
            .add({ name: 'child-matrix', x: 2, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 1, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=1,y=1                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][*][*]');
          expect(lines[3]).toBe('[ ][*][ ][ ][ ][ ][ ][ ]                              [ ][ ][*][*]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('2,2', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);
          matrixLog.at({ x: 2, y: 2 })
            .add({ name: 'child-matrix', x: 0, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 3, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=2,y=2                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('[ ][ ][*][ ][ ][ ][ ][ ]                              [*][*][ ][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [*][*][ ][ ]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('3,3', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);

          matrixLog.at({ x: 3, y: 3 })
            .add({ name: 'child-matrix', x: 2, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 3, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=3,y=3                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][*][*]');
          expect(lines[5]).toBe('[ ][ ][ ][*][ ][ ][ ][ ]                              [ ][ ][*][*]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('4,4', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);

          matrixLog.at({ x: 4, y: 4 })
            .add({ name: 'child-matrix', x: 1, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 2, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=4,y=4                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][*][*][ ]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][*][*][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][*][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('5,5', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);

          matrixLog.at({ x: 5, y: 5 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 3, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=5,y=5                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [*][ ][ ][*]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [*][ ][ ][*]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][*][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('6,6', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);

          matrixLog.at({ x: 6, y: 6 })
            .add({ name: 'child-matrix', x: 1, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 3, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=6,y=6                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][*][ ][ ]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][*]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [*][ ][ ][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][*][ ]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][*][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[10]).toBe('');
        });

        test('7,7', () => {
          const matrixLog = new MatrixLog('test-matrix', 8, 8);

          matrixLog.at({ x: 7, y: 7 })
            .add({ name: 'child-matrix', x: 0, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(11);
          expect(lines[0]).toBe('test-matrix x=7,y=7                                   child-matrix');
          expect(lines[1]).toBe('width=8,height=8                                      width=4,height=4');
          expect(lines[2]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][ ][*]');
          expect(lines[3]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][ ][*][ ]');
          expect(lines[4]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [ ][*][ ][ ]');
          expect(lines[5]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]                              [*][ ][ ][ ]');
          expect(lines[6]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[7]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[8]).toBe('[ ][ ][ ][ ][ ][ ][ ][ ]');
          expect(lines[9]).toBe('[ ][ ][ ][ ][ ][ ][ ][*]');
          expect(lines[10]).toBe('');
        });
      });
    });
  });
  describe('3d', () => {
    describe('.add()', () => {
      test('can work on a smaller than parent pattern', () => {
        const x = 1;
        const y = 1;
        const z = 1;
        const childX = 3;
        const childY = 3;
        const childZ = 3;
        const matrixLog = new MatrixLog('test-matrix', 2, 2, 2);
        expect(matrixLog.is3d).toBe(true);
        matrixLog.at({ x: x, y: y, z: z })
          .add({
            name:'child-matrix',
            x: childX,
            y: childY,
            z: childZ,
            width: 4,
            height: 4,
            depth: 4
          });
        expect(matrixLog.locations[z][y][x]['child-matrix'][childZ][childY].indexOf(childX)).toBe(0);
      });
    });
    describe('.toString()', () => {
      describe('parent of 2x2, pattern 4,4', () => {
        test('0,0', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 1, width: 4, height: 4 });

          console.log(matrixLog.toString('child-matrix'));

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [*][*][ ][ ]');
          expect(lines[3]).toBe('[ ][ ]                              [*][*][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });

        test('1,0', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 1, y: 0 })
            .add({ name: 'child-matrix', x: 2, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 1, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 1, width: 4, height: 4 });


          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=1,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[ ][*]                              [ ][ ][*][*]');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][*][*]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });

        test('0,1', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 1 })
            .add({ name: 'child-matrix', x: 0, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 1, y: 3, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=1                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[*][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [*][*][ ][ ]');
          expect(lines[5]).toBe('                                    [*][*][ ][ ]');
          expect(lines[6]).toBe('');
        });

        test('1,1', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);

          matrixLog.at({ x: 1, y: 1 })
            .add({ name: 'child-matrix', x: 2, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 2, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 2, y: 3, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 3, y: 3, width: 4, height: 4 });


          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=1,y=1                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][*]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][*][*]');
          expect(lines[5]).toBe('                                    [ ][ ][*][*]');
          expect(lines[6]).toBe('');
        });
      });
    });
  });
});