import Snake from "./game/Snake.js";

class Population {
    constructor(size, mutationRate) {
        this.sample = [];
        this.mutationRate = mutationRate;
        this.generation = 0;
        this.lastBest = undefined;
        this.greatestSnake = undefined;

        for (let i = 0; i < size; ++i) {
            this.sample.push(new Snake(i));
        }
    }

    selection() {
        // choose random 2 snakes
        // save best snake and best snake of generation
        var newSample = [];
        newSample[0] = this.greatestSnake.copy();
        newSample[0].best = true;
        this.lastBest = this.bestSnake;
        newSample[1] = this.lastBest.copy();
        newSample[1].best = true;

        /* NEXT GENERATION */
        for (let i = 2; i < this.sample.length; ++i) {
            let momSnake = this.selectSnake();
            let dadSnake = this.selectSnake();

            let childSnake = new Snake(i);
            childSnake.neuralNet = momSnake.neuralNet.crossover(dadSnake.neuralNet);
            childSnake.neuralNet.mutate(this.mutationRate);

            newSample.push(childSnake);
        }

        this.generation++;
        this.sample = newSample;
    }

    selectSnake() {
        //this function works by randomly choosing a value between 0 and the sum of all the fitnesses
        //then go through all the snakes and add their fitness to a running sum and if that sum is greater than the random value generated that snake is chosen
        //since snakes with a higher fitness function add more to the running sum then they have a higher chance of being chosen


        //calculate the sum of all the fitnesses
        let fitnessSum = 0;
        for (let i = 0; i < this.sample.length; i++) {
            fitnessSum += this.sample[i].fitness;
        }


        //set random value
        let rand = Math.random() * fitnessSum;

        //initialise the running sum
        let runningSum = 0;

        for (let i = 0; i < this.sample.length; i++) {
            runningSum += this.sample[i].fitness;
            if (runningSum > rand) {
                return this.sample[i];
            }
        }
        //unreachable code to make the parser happy
        return this.sample[0];
    }

    calcFitness() {
        for (let snake of this.sample) {
            snake.calcFitness();

            if (!this.greatestSnake) {
                this.greatestSnake = snake;
            } else {
                if (snake.fitness > this.greatestSnake.fitness) {
                    this.greatestSnake = snake;
                }
            }
        }
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
        let bestFitness = -1;
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