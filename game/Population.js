import Snake from "./game/Snake.js";

class Population {
    constructor(size, mutationRate) {
        this.sample = [];
        this.mutationRate = mutationRate;
        this.generation = 0;
        this.lastBest = undefined;

        for (let i = 0; i < size; ++i) {
            this.sample.push(new Snake(i));
        }
    }

    selection() {
        var totalFitness = 0;

        for (let snake of this.sample) {
            totalFitness += snake.fitness;
        }

        var weights = [];

        for (let snake of this.sample) {
            // weighted fitness
            weights.push(snake.fitness / totalFitness);
        }


        // choose random 2 snakes

        var newSample = [];

        /* SAVE THE TOP 25% */
        var slicePoint = Math.floor(this.sample.length / 4);
        var sorted = this.sample.sort((sn1, sn2) => {
            return sn2.fitness - sn1.fitness
        });
        newSample = sorted.slice(0, slicePoint);

        for (let newSnake of newSample) {
            newSnake.revive();
            newSnake.best = false;
        }

        newSample[0].best = true;

        this.lastBest = this.bestSnake.copy();

        const chooseRandom = () => {
            var total = 0;
            var random = Math.random();
            var chosen = 0;

            for (let fitnessIndex in weights) {
                total += weights[fitnessIndex];

                if (random < total) {
                    chosen = fitnessIndex;
                    break;
                }
            }

            return chosen;
        }

        /* NEXT GENERATION */
        for (let i = slicePoint; i < this.sample.length; ++i) {
            let momSnake = this.sample[chooseRandom()];
            let dadSnake = this.sample[chooseRandom()];

            let childSnake = new Snake(i);
            childSnake.neuralNet = momSnake.neuralNet.crossOver(dadSnake.neuralNet);

            newSample.push(childSnake);
        }

        this.generation++;
        this.sample = newSample;
    }

    calcFitness() {
        for (let snake of this.sample) snake.calcFitness();
    }

    get isDone() {
        var flag = true;

        for (let i = 0; i < this.sample.length; ++i) {
            if (!this.sample[i].dead) {
                flag = false;
                break;
            }
        }

        return flag;
    }

    get bestSnake() {
        let bestFitness = 0;
        let bestSnake = undefined;

        for (let snake of this.sample) {
            if (snake.fitness > bestFitness) {
                bestFitness = snake.fitness;
                bestSnake = snake;
            }
        }

        return bestSnake;
    }

    get avgFit() {
        let totalFit = 0;
        for (let snake of this.sample) {
            totalFit += snake.fitness;
        }

        return totalFit / this.sample.length;
    }
}

export default Population;