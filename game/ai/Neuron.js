function uuid() {
    return '00-0-4-1-000'.replace(/[^-]/g,
        s => ((Math.random() + ~~s) * 0x10000 >> s).toString(16).padStart(4, '0')
    );
}

class Neuron {
    constructor() {
        this.bias = Math.random() * 2 - 1;
        this.id = uuid();
        this.incoming = {
            neurons: [],
            weights: []
        }

        this.output;
    }

    /* REQUIRED */

    sigmoid(x) {
        return 1 / (1 + Math.exp(-x))
    }
    sigmoidDer(x) {
        return this.sigmoid(x) * (1 - this.sigmoid(x));
    }

    /* ========= */

    connect(neuron) {
        neuron.incoming.neurons.push(this);
        neuron.incoming.weights.push(Math.random() * 2 - 1);
    }

    clearConnections() {
        this.incoming.neurons = [];
    }

    activate(input) {
        /* STARTING NEURON */
        if (input) {
            this.output = input;
        } else {
            // Hidden / Output Neurons

            var sum = this.bias;

            for (let iter in this.incoming.neurons) {
                sum += this.incoming.neurons[iter].output * this.incoming.weights[iter];
            }

            this.output = this.sigmoid(sum);
        }
    }

    mutate(mutationRate) {
        for (let key of Object.keys(this.incoming.weights)) {
            let random = Math.random();

            if (random < mutationRate) { // limit between -1, 1
                this.incoming.weights[key] += (Math.random() * 2 - 1) * 0.2;
                this.incoming.weights[key] = Math.min(1, Math.max(-1, this.incoming.weights[key]))
            }
        }

        let biasRandom = Math.random();

        if (biasRandom < mutationRate) { // limit between -1, 1
            this.bias += (Math.random() * 2 - 1) * 0.2;

            this.bias = Math.min(1, Math.max(-1, this.bias));
        }
    }
}

export default Neuron;