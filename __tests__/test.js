const MatrixLog = require('../index');

describe('MatrixLog', () => {
  describe('.add()', () => {
    it('can work on a smaller than primary pattern', () => {
      const matrixLog = new MatrixLog('test-matrix', 2, 2);
      matrixLog.add('child-matrix', 0, 0, 3, 3, 4, 4);
      expect(matrixLog.root[0][0]['child-matrix'][3].indexOf(3)).toBe(0);
    });
  });
  describe('.toString()', () => {
    test('repeats for every point logged', () => {
      const matrixLog = new MatrixLog('test-matrix', 2, 1);

      matrixLog.add('child-matrix', 0, 0, 0, 0, 4, 4);
      matrixLog.add('child-matrix', 1, 0, 0, 1, 4, 4);

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
    describe('primary of 2x2, pattern 4,4', () => {
      test('0,0', () => {
        const matrixLog = new MatrixLog('test-matrix', 2, 2);

        matrixLog.add('child-matrix', 0, 0, 0, 0, 4, 4);
        matrixLog.add('child-matrix', 0, 0, 0, 1, 4, 4);
        matrixLog.add('child-matrix', 0, 0, 1, 0, 4, 4);
        matrixLog.add('child-matrix', 0, 0, 1, 1, 4, 4);

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

        matrixLog.add('child-matrix', 1, 0, 2, 0, 4, 4);
        matrixLog.add('child-matrix', 1, 0, 3, 0, 4, 4);
        matrixLog.add('child-matrix', 1, 0, 2, 1, 4, 4);
        matrixLog.add('child-matrix', 1, 0, 3, 1, 4, 4);


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

        matrixLog.add('child-matrix', 0, 1, 0, 2, 4, 4);
        matrixLog.add('child-matrix', 0, 1, 1, 2, 4, 4);
        matrixLog.add('child-matrix', 0, 1, 0, 3, 4, 4);
        matrixLog.add('child-matrix', 0, 1, 1, 3, 4, 4);


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

        matrixLog.add('child-matrix', 1, 1, 2, 2, 4, 4);
        matrixLog.add('child-matrix', 1, 1, 3, 2, 4, 4);
        matrixLog.add('child-matrix', 1, 1, 2, 3, 4, 4);
        matrixLog.add('child-matrix', 1, 1, 3, 3, 4, 4);


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
    describe('primary of 8x8, pattern 4,4', () => {
      test('0,0', () => {
        const matrixLog = new MatrixLog('test-matrix', 8, 8);

        matrixLog.add('child-matrix', 0, 0, 0, 0, 4, 4);
        matrixLog.add('child-matrix', 0, 0, 0, 1, 4, 4);
        matrixLog.add('child-matrix', 0, 0, 1, 0, 4, 4);
        matrixLog.add('child-matrix', 0, 0, 1, 1, 4, 4);

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

        matrixLog.add('child-matrix', 1, 1, 2, 0, 4, 4);
        matrixLog.add('child-matrix', 1, 1, 3, 0, 4, 4);
        matrixLog.add('child-matrix', 1, 1, 2, 1, 4, 4);
        matrixLog.add('child-matrix', 1, 1, 3, 1, 4, 4);

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

        matrixLog.add('child-matrix', 2, 2, 0, 2, 4, 4);
        matrixLog.add('child-matrix', 2, 2, 1, 2, 4, 4);
        matrixLog.add('child-matrix', 2, 2, 0, 3, 4, 4);
        matrixLog.add('child-matrix', 2, 2, 1, 3, 4, 4);

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

        matrixLog.add('child-matrix', 3, 3, 2, 2, 4, 4);
        matrixLog.add('child-matrix', 3, 3, 3, 2, 4, 4);
        matrixLog.add('child-matrix', 3, 3, 2, 3, 4, 4);
        matrixLog.add('child-matrix', 3, 3, 3, 3, 4, 4);

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

        matrixLog.add('child-matrix', 4, 4, 1, 1, 4, 4);
        matrixLog.add('child-matrix', 4, 4, 2, 1, 4, 4);
        matrixLog.add('child-matrix', 4, 4, 1, 2, 4, 4);
        matrixLog.add('child-matrix', 4, 4, 2, 2, 4, 4);

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

        matrixLog.add('child-matrix', 5, 5, 0, 0, 4, 4);
        matrixLog.add('child-matrix', 5, 5, 3, 0, 4, 4);
        matrixLog.add('child-matrix', 5, 5, 0, 3, 4, 4);
        matrixLog.add('child-matrix', 5, 5, 3, 3, 4, 4);

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

        matrixLog.add('child-matrix', 6, 6, 1, 0, 4, 4);
        matrixLog.add('child-matrix', 6, 6, 3, 1, 4, 4);
        matrixLog.add('child-matrix', 6, 6, 0, 2, 4, 4);
        matrixLog.add('child-matrix', 6, 6, 2, 3, 4, 4);

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

        matrixLog.add('child-matrix', 7, 7, 0, 3, 4, 4);
        matrixLog.add('child-matrix', 7, 7, 1, 2, 4, 4);
        matrixLog.add('child-matrix', 7, 7, 2, 1, 4, 4);
        matrixLog.add('child-matrix', 7, 7, 3, 0, 4, 4);

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