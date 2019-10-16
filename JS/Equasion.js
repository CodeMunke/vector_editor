'use strict';
/**
 * Для читаемости, где p и q - точки прямой
 */
const p_n = 1;
const q_n = 2;

function MultiplyMatrix(A,B)
{
    var rowsA = A.length, colsA = A[0].length,
        rowsB = B.length, colsB = B[0].length,
        C = [];
    if (colsA != rowsB) return false;
    for (var i = 0; i < rowsA; i++) C[ i ] = [];
    for (var k = 0; k < colsB; k++)
     { for (var i = 0; i < rowsA; i++)
        { var t = 0;
          for (var j = 0; j < rowsB; j++) t += A[ i ][j]*B[j][k];
          C[ i ][k] = t;
        }
     }
    return C;
}

class LineEquasion {
    constructor (p, q) {
        /*  Матрица прямой, заданная как векторное пр-ве 2-х точек:
            |i   j   k|
            |x1  y1  1|
            |x2  y2  1|
        */
        this.mat = [[1  , 1  , 1],
                    [p.x, p.y, 1],
                    [q.x, q.y, 1]];
    }

    get A () {
        return mat[p_n][1] * mat[q_n][2] - mat[p_n][2] * mat[q_n][1];
    }

    get B () {
        return mat[p_n][0] * mat[q_n][2] - mat[p_n][2] * mat[q_n][0];
    }

    get C () {
        return mat[p_n][0] * mat[q_n][1] - mat[p_n][1] * mat[q_n][0];
    }

    transfer (d) {
        let transf_matr = [[1  , 0  , 0],
                           [0  , 1  , 0],
                           [d.x, d.y, 1]];
        this.mat = MultiplyMatrix(mat, transf_matr);
    }

    updateEquasionByPoints (p, q) {
        this.mat[p_n][0] = p.x;
        this.mat[p_n][1] = p.y;
        this.mat[q_n][0] = q.x;
        this.mat[q_n][1] = q.y;
    }

    normalize () {
        this.A = A / this.C;
        this.B = B / this.C;
        this.C = 1;
    }

    toString () {
        return this.A + "x " + this.B + "y " + this.C;
    }
}