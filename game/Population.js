import Snake from "./game/Snake.js";

class Population {
    constructor(size, mutationRate) {
        this.sample = [];
        this.mutationRate = mutationRate;

        for (let i = 0; i < size; ++i) {
            this.sample.push(new Snake(i));
        }
    }

    reproduce() {

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
}

export default Population;