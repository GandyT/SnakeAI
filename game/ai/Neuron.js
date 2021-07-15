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
            neurons: {},
            weights: {}
        }

        this.outgoing = {
            neurons: {},
            weights: {}
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
        this.outgoing.neurons[neuron.id] = neuron;
        this.outgoing.weights[neuron.id] = Math.random() * 2 - 1;
        neuron.incoming.neurons[this.id] = this;
        neuron.incoming.weights[this.id] = Math.random() * 2 - 1;
    }

    activate(input) {
        /* STARTING NEURON */
        if (input) {
            this.output = input;
        } else {
            // Hidden / Output Neurons

            var sum = this.bias;

            for (let [key, value] of Object.entries(this.incoming.neurons)) {
                sum += value.output * this.incoming.weights[key];
            }


            this.output = this.sigmoid(sum);
        }
    }

    mutate(mutationRate) {
        for (let key of Object.keys(this.incoming.weights)) {
            let random = Math.random();

            if (random < mutationRate) {
                this.incoming.weights[key] = Math.random() * 2 - 1;
            }
        }
    }
}

export default Neuron;