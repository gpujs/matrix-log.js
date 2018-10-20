const MatrixLog = require('../index');

describe('MatrixLog', () => {
  describe('2d mode', () => {
    describe('.add()', () => {
      it('can work on a smaller than parent pattern', () => {
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
        expect(matrixLog.locations[z][y][x]['child-matrix'].points[childZ][childY].indexOf(childX)).toBe(0);
      });
      it('can add to less than width and height on child', () => {
        const x = 0;
        const y = 0;
        const z = 0;
        const childX = -2;
        const childY = -2;
        const childZ = 0;
        const childWidth = 4;
        const childHeight = 4;
        const matrixLog = new MatrixLog('test-matrix', 2, 2);
        expect(matrixLog.is3d).toBe(false);
        matrixLog.at({ x: x, y: y })
          .add({
            name:'child-matrix',
            x: childX,
            y: childY,
            width: childWidth,
            height: childHeight
          });
        const location = matrixLog.locations[z][y][x]['child-matrix'];
        expect(location.lowX).toBe(childX);
        expect(location.lowY).toBe(childY);
        expect(location.highX).toBe(childWidth - 1);
        expect(location.highY).toBe(childHeight - 1);
        expect(location.points[childZ][childY].indexOf(childX)).toBe(0);
      });
      it('can add to greater than width and height on child', () => {
        const x = 0;
        const y = 0;
        const z = 0;
        const childX = 6;
        const childY = 6;
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
        const location = matrixLog.locations[z][y][x]['child-matrix'];
        expect(location.lowX).toBe(0);
        expect(location.lowY).toBe(0);
        expect(location.highX).toBe(childX);
        expect(location.highY).toBe(childY);
        expect(location.points[childZ][childY].indexOf(childX)).toBe(0);
      });
    });
    describe('.toString()', () => {
      it('repeats for every point logged', () => {
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
        describe('when in visible area of matrix', () => {
          test('0,0', () => {
            const matrixLog = new MatrixLog('test-matrix', 2, 2);
            matrixLog.at({ x: 0, y: 0 })
              .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
              .add({ name: 'child-matrix', x: 0, y: 1, width: 4, height: 4 })
              .add({ name: 'child-matrix', x: 1, y: 0, width: 4, height: 4 })
              .add({ name: 'child-matrix', x: 1, y: 1, width: 4, height: 4 });


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
        describe('when less than visible area of matrix', () => {
          test('0,0,', () => {
            const matrixLog = new MatrixLog('test-matrix', 2, 2);
            matrixLog.at({ x: 0, y: 0 })
              .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
              .add({ name: 'child-matrix', x: -1, y: -1, width: 4, height: 4 });

            const lines = matrixLog.toString('child-matrix').split(/\n/);

            expect(lines.length).toBe(8);
            expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
            expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
            expect(lines[2]).toBe('[*][ ]                               *  -  -  -  - ');
            expect(lines[3]).toBe('[ ][ ]                               - [*][ ][ ][ ]');
            expect(lines[4]).toBe('                                     - [ ][ ][ ][ ]');
            expect(lines[5]).toBe('                                     - [ ][ ][ ][ ]');
            expect(lines[6]).toBe('                                     - [ ][ ][ ][ ]');
            expect(lines[7]).toBe('');
          });
        });
        describe('when greater than visible area of matrix', () => {
          test('0,0,', () => {
            const matrixLog = new MatrixLog('test-matrix', 2, 2);
            matrixLog.at({ x: 0, y: 0 })
              .add({ name: 'child-matrix', x: 3, y: 3, width: 4, height: 4 })
              .add({ name: 'child-matrix', x: 4, y: 4, width: 4, height: 4 });

            const lines = matrixLog.toString('child-matrix').split(/\n/);
            expect(lines.length).toBe(8);
            expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
            expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
            expect(lines[2]).toBe('[*][ ]                              [ ][ ][ ][ ] - ');
            expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ] - ');
            expect(lines[4]).toBe('                                    [ ][ ][ ][ ] - ');
            expect(lines[5]).toBe('                                    [ ][ ][ ][*] - ');
            expect(lines[6]).toBe('                                     -  -  -  -  * ');
            expect(lines[7]).toBe('');
          });
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
      describe('child points used more than once in matrix', () => {
        it('can track 2 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [2][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });
        it('can track 5 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [5][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });
        it('can track 9 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [9][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });
        it('can track for more than 9 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 0, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [+][ ][ ][ ]');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ]');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ]');
          expect(lines[6]).toBe('');
        });
      });
      describe('child points used more than once out of matrix', () => {
        it('can track 2 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [ ][ ][ ][ ] 2 ');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ] - ');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[6]).toBe('');
        });
        it('can track 5 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [ ][ ][ ][ ] 5 ');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ] - ');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[6]).toBe('');
        });
        it('can track 9 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [ ][ ][ ][ ] 9 ');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ] - ');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[6]).toBe('');
        });
        it('can track for more than 9 points', () => {
          const matrixLog = new MatrixLog('test-matrix', 2, 2);
          matrixLog.at({ x: 0, y: 0 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 })
            .add({ name: 'child-matrix', x: 4, y: 0, width: 4, height: 4 });

          const lines = matrixLog.toString('child-matrix').split(/\n/);
          expect(lines.length).toBe(7);
          expect(lines[0]).toBe('test-matrix x=0,y=0                 child-matrix');
          expect(lines[1]).toBe('width=2,height=2                    width=4,height=4');
          expect(lines[2]).toBe('[*][ ]                              [ ][ ][ ][ ] + ');
          expect(lines[3]).toBe('[ ][ ]                              [ ][ ][ ][ ] - ');
          expect(lines[4]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[5]).toBe('                                    [ ][ ][ ][ ] - ');
          expect(lines[6]).toBe('');
        });
      });
    });
  });
  describe('3d mode', () => {
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
        expect(matrixLog.locations[z][y][x]['child-matrix'].points[childZ][childY].indexOf(childX)).toBe(0);
      });
      it('can add to less than width and height on child', () => {
        const x = 0;
        const y = 0;
        const z = 0;
        const childX = -2;
        const childY = -2;
        const childZ = 0;
        const matrixLog = new MatrixLog('test-matrix', 2, 2, 2);
        expect(matrixLog.is3d).toBe(true);
        matrixLog.at({ x: x, y: y })
          .add({
            name:'child-matrix',
            x: childX,
            y: childY,
            width: 4,
            height: 4
          });
        expect(matrixLog.locations[z][y][x]['child-matrix'].points[childZ][childY].indexOf(childX)).toBe(0);
      });
      it('can add to greater than width and height on child', () => {
        const x = 0;
        const y = 0;
        const z = 0;
        const childX = 6;
        const childY = 6;
        const childZ = 0;
        const matrixLog = new MatrixLog('test-matrix', 2, 2, 2);
        expect(matrixLog.is3d).toBe(true);
        matrixLog.at({ x: x, y: y })
          .add({
            name:'child-matrix',
            x: childX,
            y: childY,
            width: 4,
            height: 4
          });
        expect(matrixLog.locations[z][y][x]['child-matrix'].points[childZ][childY].indexOf(childX)).toBe(0);
      });
    });
    describe('.toString()', () => {
      describe('parent of 2x2x3, pattern 4,4,4', () => {
        describe('when in visible area of matrix', () => {
          test('0,0,', () => {
            const matrixLog = new MatrixLog('test-matrix', 2, 2, 3);
            matrixLog.at({ x: 0, y: 0, z: 2 })
              .add({ name: 'child-matrix', x: 0, y: 0, z: 3, width: 4, height: 4, depth: 4 })
              .add({ name: 'child-matrix', x: 0, y: 1, z: 3, width: 4, height: 4, depth: 4 })
              .add({ name: 'child-matrix', x: 1, y: 0, z: 3, width: 4, height: 4, depth: 4 })
              .add({ name: 'child-matrix', x: 1, y: 1, z: 3, width: 4, height: 4, depth: 4 });

            const lines = matrixLog.toString('child-matrix').split(/\n/);
            expect(lines.length).toBe(12);
            expect(lines[0]).toBe('test-matrix x=0,y=0,z=2                     child-matrix');
            expect(lines[1]).toBe('width=2,height=2,depth=3                    width=4,height=4,depth=4');
            expect(lines[2]).toBe('[ ][ ]  [ ][ ]                              [ ][ ][ ][ ]  [ ][ ][ ][ ]');
            expect(lines[3]).toBe('[ ][ ]  [ ][ ]                              [ ][ ][ ][ ]  [ ][ ][ ][ ]');
            expect(lines[4]).toBe('                                            [ ][ ][ ][ ]  [ ][ ][ ][ ]');
            expect(lines[5]).toBe('[*][ ]                                      [ ][ ][ ][ ]  [ ][ ][ ][ ]');
            expect(lines[6]).toBe('[ ][ ]                                                                ');
            expect(lines[7]).toBe('                                            [ ][ ][ ][ ]  [*][*][ ][ ]');
            expect(lines[8]).toBe('                                            [ ][ ][ ][ ]  [*][*][ ][ ]');
            expect(lines[9]).toBe('                                            [ ][ ][ ][ ]  [ ][ ][ ][ ]');
            expect(lines[10]).toBe('                                            [ ][ ][ ][ ]  [ ][ ][ ][ ]');
            expect(lines[11]).toBe('');
          });
        });
        describe('when less than visible area of matrix', () => {
          test('0,0,', () => {
            const matrixLog = new MatrixLog('test-matrix', 2, 2, 3);
            matrixLog.at({ x: 0, y: 0, z: 2 })
              .add({ name: 'child-matrix', x: 0, y: 0, z: 3, width: 4, height: 4, depth: 4 })
              .add({ name: 'child-matrix', x: -1, y: -1, z: 3, width: 4, height: 4, depth: 4 });

            const lines = matrixLog.toString('child-matrix').split(/\n/);
            expect(lines.length).toBe(14);
            expect(lines[0]).toBe('test-matrix x=0,y=0,z=2                     child-matrix');
            expect(lines[1]).toBe('width=2,height=2,depth=3                    width=4,height=4,depth=4');
            expect(lines[2]).toBe('[ ][ ]  [ ][ ]                               -  -  -  -  -    -  -  -  -  - ');
            expect(lines[3]).toBe('[ ][ ]  [ ][ ]                               - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[4]).toBe('                                             - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[5]).toBe('[*][ ]                                       - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[6]).toBe('[ ][ ]                                       - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[7]).toBe('                                                                            ');
            expect(lines[8]).toBe('                                             -  -  -  -  -    *  -  -  -  - ');
            expect(lines[9]).toBe('                                             - [ ][ ][ ][ ]   - [*][ ][ ][ ]');
            expect(lines[10]).toBe('                                             - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[11]).toBe('                                             - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[12]).toBe('                                             - [ ][ ][ ][ ]   - [ ][ ][ ][ ]');
            expect(lines[13]).toBe('');
          });
        });
        describe('when greater than visible area of matrix', () => {
          test('0,0,', () => {
            const matrixLog = new MatrixLog('test-matrix', 2, 2, 3);
            matrixLog.at({ x: 0, y: 0, z: 2 })
              .add({ name: 'child-matrix', x: 3, y: 3, z: 3, width: 4, height: 4, depth: 4 })
              .add({ name: 'child-matrix', x: 4, y: 4, z: 3, width: 4, height: 4, depth: 4 });

            const lines = matrixLog.toString('child-matrix').split(/\n/);
            expect(lines.length).toBe(14);
            expect(lines[0]).toBe('test-matrix x=0,y=0,z=2                     child-matrix');
            expect(lines[1]).toBe('width=2,height=2,depth=3                    width=4,height=4,depth=4');
            expect(lines[2]).toBe('[ ][ ]  [ ][ ]                              [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[3]).toBe('[ ][ ]  [ ][ ]                              [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[4]).toBe('                                            [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[5]).toBe('[*][ ]                                      [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[6]).toBe('[ ][ ]                                       -  -  -  -  -    -  -  -  -  - ');
            expect(lines[7]).toBe('                                                                            ');
            expect(lines[8]).toBe('                                            [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[9]).toBe('                                            [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[10]).toBe('                                            [ ][ ][ ][ ] -   [ ][ ][ ][ ] - ');
            expect(lines[11]).toBe('                                            [ ][ ][ ][ ] -   [ ][ ][ ][*] - ');
            expect(lines[12]).toBe('                                             -  -  -  -  -    -  -  -  -  * ');
            expect(lines[13]).toBe('');
          });
        });
      });
    });

    describe('.getChildLog()', () => {
      test('4,4,4', () => {
        const matrixLog = new MatrixLog('parent', 4, 4, 4);
        matrixLog.at({ x: 0, y: 0, z: 0 });
        matrixLog.add({
          name: 'child',
          x: 0,
          y: 0,
          z: 0,
          width: 4,
          height: 4,
          depth: 4
        });
        matrixLog.add({
          name: 'child',
          x: 1,
          y: 1,
          z: 1,
          width: 4,
          height: 4,
          depth: 4
        });
        matrixLog.add({
          name: 'child',
          x: 2,
          y: 2,
          z: 2,
          width: 4,
          height: 4,
          depth: 4
        });
        matrixLog.add({
          name: 'child',
          x: 3,
          y: 3,
          z: 3,
          width: 4,
          height: 4,
          depth: 4
        });

        const matrices = matrixLog.getChildLog('child');
        expect(matrices).toEqual([
            ['[*][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][*][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][*][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][*]']
          ]
        );
      });
    });
    describe('.getParentLog()', () => {
      test('4,4,4', () => {
        const matrixLog = new MatrixLog('parent', 4, 4, 4);
        matrixLog.at({ x: 0, y: 0, z: 0 });
        expect(matrixLog.getParentLog()).toEqual([
            ['[*][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]']
          ]
        );
        matrixLog.at({ x: 1, y: 1, z: 1 });
        expect(matrixLog.getParentLog()).toEqual([
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][*][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]']
          ]
        );
        matrixLog.at({ x: 2, y: 2, z: 2 });
        expect(matrixLog.getParentLog()).toEqual([
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][*][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]']
          ]
        );
        matrixLog.at({ x: 3, y: 3, z: 3 });
        expect(matrixLog.getParentLog()).toEqual([
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]'],
            ['[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][ ]', '[ ][ ][ ][*]']
          ]
        );
      });
    });
    describe('.logToGrid()', () => {
      test('4,4,4', () => {
        const matrixLog = new MatrixLog('parent', 4, 4, 4);
        expect(matrixLog.logToGrid([
          ['[1][2][3][4]', '[5][6][7][8]', '[9][10][11][12]', '[13][14][15][16]'],
          ['[17][18][19][20]', '[21][22][23][24]', '[25][26][27][28]', '[29][30][31][32]'],
          ['[33][34][35][36]', '[37][38][39][40]', '[41][42][43][44]', '[45][46][47][48]'],
          ['[49][50][51][52]', '[53][54][55][56]', '[57][58][59][60]', '[61][62][63][64]']
        ], 4)).toEqual([
            '[1][2][3][4]  [17][18][19][20]',
            '[5][6][7][8]  [21][22][23][24]',
            '[9][10][11][12]  [25][26][27][28]',
            '[13][14][15][16]  [29][30][31][32]',
            '                                  ',
            '[33][34][35][36]  [49][50][51][52]',
            '[37][38][39][40]  [53][54][55][56]',
            '[41][42][43][44]  [57][58][59][60]',
            '[45][46][47][48]  [61][62][63][64]'
          ]
        );
      });
    });
    describe('.mergeGrids()', () => {
      test('4,4,3', () => {
        const matrixLog = new MatrixLog('parent', 4, 4, 3);
        matrixLog.at({ x: 0, y: 0, z: 0 })
          .add({
            name: 'child',
            x: 0,
            y: 0,
            z: 0,
            width: 3,
            height: 3,
            depth: 3,
          });

        const parentGrid = matrixLog.logToGrid(matrixLog.getParentLog(), matrixLog.depth);
        const childGrid = matrixLog.logToGrid(matrixLog.getChildLog('child'), matrixLog.location['child'].depth);

        expect(matrixLog.mergeGrids(parentGrid, childGrid)).toEqual([
          '[*][ ][ ][ ]  [ ][ ][ ][ ]' + ' '.repeat(matrixLog.rowSpacing) + '[*][ ][ ]  [ ][ ][ ]',
          '[ ][ ][ ][ ]  [ ][ ][ ][ ]' + ' '.repeat(matrixLog.rowSpacing) + '[ ][ ][ ]  [ ][ ][ ]',
          '[ ][ ][ ][ ]  [ ][ ][ ][ ]' + ' '.repeat(matrixLog.rowSpacing) + '[ ][ ][ ]  [ ][ ][ ]',
          '[ ][ ][ ][ ]  [ ][ ][ ][ ]' + ' '.repeat(matrixLog.rowSpacing) + '                    ',
          '                          ' + ' '.repeat(matrixLog.rowSpacing) + '[ ][ ][ ]',
          '[ ][ ][ ][ ]              ' + ' '.repeat(matrixLog.rowSpacing) + '[ ][ ][ ]',
          '[ ][ ][ ][ ]              ' + ' '.repeat(matrixLog.rowSpacing) + '[ ][ ][ ]',
          '[ ][ ][ ][ ]',
          '[ ][ ][ ][ ]',
        ]);
      });
    });
  });
});