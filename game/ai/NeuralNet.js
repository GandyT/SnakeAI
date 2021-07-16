import Matrix from "./Matrix.js"

class NeuralNet {
    constructor(inputs, hiddenNo, outputNo) {

        //set dimensions from parameters
        this.iNodes = inputs;
        this.oNodes = outputNo;
        this.hNodes = hiddenNo;


        //create first layer weights 
        //included bias weight
        this.whi = new Matrix(this.hNodes, this.iNodes + 1);

        //create second layer weights
        //include bias weight
        this.whh = new Matrix(this.hNodes, this.hNodes + 1);

        //create second layer weights
        //include bias weight
        this.woh = new Matrix(this.oNodes, this.hNodes + 1);

        //set the matricies to random values
        this.whi.randomize();
        this.whh.randomize();
        this.woh.randomize();
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  

    //mutation function for genetic algorithm
    mutate(mr) {
        //mutates each weight matrix
        this.whi.mutate(mr);
        this.whh.mutate(mr);
        this.woh.mutate(mr);
    }

    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //calculate the output values by feeding forward through the neural network
    output(inputsArr) {

        //convert array to matrix
        //Note woh has nothing to do with it its just a function in the Matrix class
        let inputs = this.woh.singleColumnMatrixFromArray(inputsArr);

        //add bias 
        let inputsBias = inputs.addBias();


        //-----------------------calculate the guessed output

        //apply layer one weights to the inputs
        let hiddenInputs = this.whi.dot(inputsBias);

        //pass through activation function(sigmoid)
        let hiddenOutputs = hiddenInputs.activate();

        //add bias
        let hiddenOutputsBias = hiddenOutputs.addBias();

        //apply layer two weights
        let hiddenInputs2 = this.whh.dot(hiddenOutputsBias);
        let hiddenOutputs2 = hiddenInputs2.activate();
        let hiddenOutputsBias2 = hiddenOutputs2.addBias();

        //apply level three weights
        let outputInputs = this.woh.dot(hiddenOutputsBias2);
        //pass through activation function(sigmoid)
        let outputs = outputInputs.activate();
        //convert to an array and return
        return outputs.toArray();
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //crossover function for genetic algorithm
    crossover(partner) {

        //creates a new child with layer matrices from both parents
        let child = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
        child.whi = this.whi.crossover(partner.whi);
        child.whh = this.whh.crossover(partner.whh);
        child.woh = this.woh.crossover(partner.woh);
        return child;
    }
    //---------------------------------------------------------------------------------------------------------------------------------------------------------  
    //return a neural net which is a clone of this Neural net
    clone() {
        let clone = new NeuralNet(this.iNodes, this.hNodes, this.oNodes);
        clone.whi = this.whi.clone();
        clone.whh = this.whh.clone();
        clone.woh = this.woh.clone();

        return clone;
    }

    toJson() {
        let netObj = {
            whi: this.whi.toArray(),
            whh: this.whh.toArray(),
            woh: this.woh.toArray()
        }

        return JSON.stringify(netObj);
    }

    loadModel(netObj) {
        this.whi.fromArray(netObj.whi);
        this.whh.fromArray(netObj.whh);
        this.woh.fromArray(netObj.woh);
    }
}

export default NeuralNet;