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
        for (let node of this.inputNodes) {
            node.mutate(mutationRate);
        }
        for (let node of this.hiddenNodes) {
            node.mutate(mutationRate);
        }
        for (let node of this.outputNodes) {
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

    reconnect() {
        for (let i = 0; i < this.outputNodes.length; ++i) {
            this.outputNodes[i].clearConnections();
            for (let k = 0; k < this.hiddenNodes.length; ++k) {
                this.outputNodes[i].incoming.neurons.push(this.hiddenNodes[k]);
            }
        }
        for (let i = 0; i < this.hiddenNodes.length; ++i) {
            this.hiddenNodes[i].clearConnections();
            for (let k = 0; k < this.inputNodes.length; ++k) {
                this.hiddenNodes[i].incoming.neurons.push(this.inputNodes[k]);
            }
        }
    }

    crossOver(MateNet) {
        // MateNet is another neural network
        /* 
        this essentially just takes half of mom dna half of dad dna
        but this could probably be improved "probably"
        */

        var child = new NeuralNet(this.inputNodes.length, this.hiddenNodes.length, this.outputNodes.length);

        var randomHiddenPoint = Math.floor(Math.random() * this.hiddenNodes.length);
        var randomOutputPoint = Math.floor(Math.random() * this.outputNodes);

        /* READJUST WEIGHTS */
        child.hiddenNodes = [...this.hiddenNodes.slice(0, randomHiddenPoint), ...MateNet.hiddenNodes.slice(randomHiddenPoint)]
        child.outputNodes = [...this.outputNodes.slice(0, randomOutputPoint), ...MateNet.outputNodes.slice(randomOutputPoint)];
        child.reconnect();

        return child;
    }

    toJson() {
        let netObj = {
            inputNeurons: [],
            hiddenNeurons: [],
            outputNeurons: []
        }

        this.inputNodes.forEach(neuron => {
            netObj.inputNeurons.push({
                bias: neuron.bias,
                weights: neuron.incoming.weights
            })
        })
        this.hiddenNodes.forEach(neuron => {
            netObj.hiddenNeurons.push({
                bias: neuron.bias,
                weights: neuron.incoming.weights
            })
        })
        this.outputNodes.forEach(neuron => {
            netObj.outputNeurons.push({
                bias: neuron.bias,
                weights: neuron.incoming.weights
            })
        })

        return JSON.stringify(netObj);
    }

    loadModel(model) {
        model.inputNeurons.forEach((neuron, i) => {
            this.inputNodes[i].bias = neuron.bias;
            this.inputNodes[i].incoming.weights = neuron.weights;
        })
        model.outputNeurons.forEach((neuron, i) => {
            this.outputNodes[i].bias = neuron.bias;
            this.outputNodes[i].incoming.weights = neuron.weights;
        })
        model.hiddenNeurons.forEach((neuron, i) => {
            this.hiddenNodes[i].bias = neuron.bias;
            this.hiddenNodes[i].incoming.weights = neuron.weights;
        })
    }
}

export default NeuralNet;