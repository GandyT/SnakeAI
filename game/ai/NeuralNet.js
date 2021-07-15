import Neuron from "./Neuron.js";

class NeuralNet {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = [];
        this.hiddenNodes = [];
        this.outputNodes = [];

        for (let i = 0; i < outputNodes; ++i) {
            this.outputNodes.push(new Neuron());
        }
        for (let i = 0; i < hiddenNodes; ++i) {
            this.hiddenNodes.push(new Neuron());
            for (let k = 0; k < outputNodes; ++k) {
                this.hiddenNodes[i].connect(this.outputNodes[k]);
            }
        }
        for (let i = 0; i < inputNodes; ++i) {
            this.inputNodes.push(new Neuron());
            for (let k = 0; k < hiddenNodes; ++k) {
                this.inputNodes[i].connect(this.hiddenNodes[k]);
            }
        }
    }

    activate(input) {
        for (let node in this.inputNodes) {
            // figure out how to input snake vision data
            this.inputNodes[node].activate(input[node]);
        }
        for (let node of this.hiddenNodes) {
            node.activate();
        }
        let values = [];
        for (let node of this.outputNodes) {
            node.activate();
            values.push(node.output);
        }

        return values;
    }

    mutate(mutationRate) {
        for (let node in this.inputNodes) {
            node.mutate(mutationRate);
        }
        for (let node in this.hiddenNodes) {
            node.mutate(mutationRate);
        }
        for (let node in this.outputNodes) {
            node.mutate(mutationRate);
        }
    }

    dense() {
        /* CONNECT ALL NODES */

        for (let i = 0; i < this.hiddenNodes.length; ++i) {
            for (let k = 0; k < this.outputNodes.length; ++k) {
                this.hiddenNodes[i].connect(this.outputNodes[k]);
            }
        }
        for (let i = 0; i < this.inputNodes.length; ++i) {
            for (let k = 0; k < this.hiddenNodes.length; ++k) {
                this.inputNodes[i].connect(this.hiddenNodes[k]);
            }
        }

    }

    crossOver(MateNet) {
        // MateNet is another neural network
        /* 
        this essentially just takes half of mom dna half of dad dna
        but this could probably be improved "probably"
        */
        var inputMidpoint = Math.floor(this.inputNodes.length / 2);
        var hiddenMidpoint = Math.floor(this.hiddenNodes.length / 2);
        var outputMidpoint = Math.floor(this.outputNodes.length / 2);

        var child = new NeuralNet(this.inputNodes.length, this.hiddenNodes.length, MateNet.outputNodes.length);
        child.inputNodes = [...this.inputNodes.slice(0, inputMidpoint), ...MateNet.inputNodes.slice(inputMidpoint)];
        child.hiddenNodes = [...this.hiddenNodes.slice(0, hiddenMidpoint), ...MateNet.hiddenNodes.slice(hiddenMidpoint)];
        child.outputNodes = [...this.outputNodes.slice(0, outputMidpoint), ...MateNet.outputNodes.slice(outputMidpoint)];
        child.dense(); // create new connections

        return child;
    }
}

export default NeuralNet;