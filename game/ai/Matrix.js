class Matrix {

    //local variables

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //constructor
    constructor(r, c) {
        this.rows = r;
        this.cols = c;
        this.matrix = [];

        for (let i = 0; i < r; ++i) {
            this.matrix.push([])
        }
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //constructor from 2D array

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //print matrix
    output() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                console.log(this.matrix[i][j] + "  ");
            }
            console.log(" ");
        }
        console.log("\n")
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  

    //multiply by scalar
    multiply(n) {

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] *= n;
            }
        }
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a matrix which is this matrix dot product parameter matrix 
    dot(n) {
        let result = new Matrix(this.rows, n.cols);

        if (this.cols == n.rows) {
            //for each spot in the new matrix
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < n.cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < this.cols; k++) {
                        sum += this.matrix[i][k] * n.matrix[k][j];
                    }
                    result.matrix[i][j] = sum;
                }
            }
        }

        return result;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //set the matrix to random ints between -1 and 1
    randomize() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = Math.random() * 2 - 1
            }
        }
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //add a scalar to the matrix
    Add(n) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] += n;
            }
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    ///return a matrix which is this matrix + parameter matrix
    add(n) {
        let newMatrix = new Matrix(this.rows, this.cols);
        if (this.cols == n.cols && this.rows == n.rows) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMatrix.matrix[i][j] = this.matrix[i][j] + n.matrix[i][j];
                }
            }
        }
        return newMatrix;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a matrix which is this matrix - parameter matrix
    subtract(n) {
        let newMatrix = new Matrix(this.cols, this.rows);
        if (this.cols == n.cols && this.rows == n.rows) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMatrix.matrix[i][j] = this.matrix[i][j] - n.matrix[i][j];
                }
            }
        }
        return newMatrix;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a matrix which is this matrix * parameter matrix (element wise multiplication)
    multiply(n) {
        let newMatrix = new Matrix(this.rows, this.cols);
        if (this.cols == n.cols && this.rows == n.rows) {
            for (let i = 0; i < this.rows; i++) {
                for (let j = 0; j < this.cols; j++) {
                    newMatrix.matrix[i][j] = this.matrix[i][j] * n.matrix[i][j];
                }
            }
        }
        return newMatrix;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a matrix which is the transpose of this matrix
    transpose() {
        let n = new Matrix(this.cols, this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                n.matrix[j][i] = this.matrix[i][j];
            }
        }
        return n;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //Creates a single column array from the parameter array
    singleColumnMatrixFromArray(arr) {
        let n = new Matrix(arr.length, 1);
        for (let i = 0; i < arr.length; i++) {
            n.matrix[i][0] = arr[i];
        }
        return n;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //sets this matrix from an array
    fromArray(arr) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.matrix[i][j] = arr[j + i * this.cols];
            }
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------    
    //returns an array which represents this matrix
    toArray() {
        let arr = new Array(this.rows * this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                arr[j + i * this.cols] = this.matrix[i][j];
            }
        }
        return arr;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //for ix1 matrixes adds one to the bottom
    addBias() {
        let n = new Matrix(this.rows + 1, 1);
        for (let i = 0; i < this.rows; i++) {
            n.matrix[i][0] = this.matrix[i][0];
        }
        n.matrix[this.rows][0] = 1;
        return n;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //applies the activation function(sigmoid) to each element of the matrix
    activate() {
        let n = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                n.matrix[i][j] = this.sigmoid(this.matrix[i][j]);
            }
        }
        return n;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------    
    //sigmoid activation function
    sigmoid(x) {
        let y = 1 / (1 + Math.exp(-x));
        return y;
    }
    //returns the matrix that is the derived sigmoid function of the current matrix
    sigmoidDerived() {
        let n = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                n.matrix[i][j] = (this.matrix[i][j] * (1 - this.matrix[i][j]));
            }
        }
        return n;
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //returns the matrix which is this matrix with the bottom layer removed
    removeBottomLayer() {
        n = new Matrix(this.rows - 1, this.cols);
        for (let i = 0; i < n.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                n.matrix[i][j] = this.matrix[i][j];
            }
        }
        return n;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //Mutation function for genetic algorithm 

    mutate(mutationRate) {

        //for each element in the matrix
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let rand = Math.random();
                if (rand < mutationRate) {//if chosen to be mutated
                    this.matrix[i][j] += ((Math.random() * 2) - 1) / 5;//add a random value to it(can be negative)

                    //set the boundaries to 1 and -1
                    if (this.matrix[i][j] > 1) {
                        this.matrix[i][j] = 1;
                    }
                    if (this.matrix[i][j] < -1) {
                        this.matrix[i][j] = -1;
                    }
                }
            }
        }
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //returns a matrix which has a random number of values from this matrix and the rest from the parameter matrix
    crossover(partner) {
        let child = new Matrix(this.rows, this.cols);

        //pick a random point in the matrix
        let randC = Math.floor(Math.random() * this.cols);
        let randR = Math.floor(Math.random() * this.rows);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {

                if ((i < randR) || (i == randR && j <= randC)) { //if before the random point then copy from this matric
                    child.matrix[i][j] = this.matrix[i][j];
                } else { //if after the random point then copy from the parameter array
                    child.matrix[i][j] = partner.matrix[i][j];
                }
            }
        }
        return child;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a copy of this matrix
    clone() {
        clone = new Matrix(this.rows, this.cols);
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                clone.matrix[i][j] = this.matrix[i][j];
            }
        }
        return clone;
    }
}

export default Matrix;