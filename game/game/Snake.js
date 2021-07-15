import { Config } from "../misc/gameConfig.js";
import NeuralNet from "../ai/NeuralNet.js";

const randomHex = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};

class Snake {
    constructor(snakeNum) {
        this.chain = [
            {
                x: Math.floor(Math.random() * Config.length),
                y: Math.floor(Math.random() * Config.length)
            }
        ];

        this.color = randomHex();
        this.snakeNum = snakeNum;
        this.apple = {};
        this.generateApple();
        this.velocity = [0, 0];
        this.dead = false;
        this.addPos = {};
        this.vision = []; // single column matrix
        this.visionRadius = 3;
        this.neuralNet = new NeuralNet((this.visionRadius * 2) ** 2, 16, this.velocity.length ** 2);
        this.neuralNet.dense();
        this.moves = 200; // prevent infinite snakes

        this.maxLength = Config.length ** 2; // snake can take up the entire board
        this.fitness = 0;
    }

    generateApple() {
        do {
            this.apple.x = Math.floor(Math.random() * Config.length);
            this.apple.y = Math.floor(Math.random() * Config.length);
        } while (this.chain.find(coord => coord.x == this.apple.x && coord.y == this.apple.y))
    }

    setVelocity(newVelocity) {
        /* CHECK IF SNAKE'S HEAD WILL REVERSE INTO IT'S SECOND SEGMENT */
        if (this.chain.length > 1) {
            var head = this.chain[0];
            var neck = this.chain[1];

            if (head.x + newVelocity[0] == neck.x && head.y + newVelocity[1] == neck.y) return false;

            /* =============================== */

            this.velocity = newVelocity;
        } else {
            this.velocity = newVelocity;
        }
    }

    move() {
        /* DEATH DETECTION */
        if (
            ( // hit a wall
                this.chain[0].x + this.velocity[0] < 0 ||
                this.chain[0].y + this.velocity[1] < 0 ||
                this.chain[0].x + this.velocity[0] >= Config.length ||
                this.chain[0].y + this.velocity[1] >= Config.length
            ) ||
            ( // hit itself
                ( // is moving
                    this.velocity[0] || this.velocity[1]
                ) &&
                this.chain.find(coord => coord.x == this.chain[0].x + this.velocity[0] && coord.y == this.chain[0].y + this.velocity[1])
            ) || // ran out of moves
            this.moves <= 0
        ) {
            this.dead = true;
            return;
        }

        this.chain.unshift({
            x: this.chain[0].x + this.velocity[0],
            y: this.chain[0].y + this.velocity[1]
        });
        this.addPos = this.chain.pop(); // save last position of last piece of snake so when snake eats something it puts new piece there
        this.moves--;

        /* APPLE COLLISION DETECTION */
        if (
            this.chain[0].x == this.apple.x &&
            this.chain[0].y == this.apple.y
        ) {
            /* APPLE EATEN */
            this.generateApple();

            // add to back of snake (+1)
            this.chain.push(this.addPos);
        }
    }

    getVision() {
        var vision = [];

        for (let row = -this.visionRadius; row < this.visionRadius; ++row) {
            for (let column = -this.visionRadius; column < this.visionRadius; ++column) {
                let visionX = this.chain[0].x + row;
                let visionY = this.chain[0].y + column;
                if ( // within bounds
                    (visionX > 0 && visionY > 0) &&
                    (visionX < Config.length && visionY < Config.length)
                ) {
                    if (this.chain.find(seg => seg.x == visionX && seg.y == visionY)) {
                        // itself
                        vision.push(-1);
                    } else if (this.apple.x == visionX && this.apple.y == visionY) {
                        // apple
                        vision.push(1);
                    } else {
                        // empty space
                        vision.push(0);
                    }
                } else {
                    vision.push(-1);
                }
            }
        }

        this.vision = vision;
    }

    /* SIMPLER MOVEMENT INTERFACE */
    left() {
        this.setVelocity([-1, 0])
    }
    right() {
        this.setVelocity([1, 0])
    }
    up() {
        this.setVelocity([0, -1])
    }
    down() {
        this.setVelocity([0, 1])
    }
    decide() {
        var output = this.neuralNet.activate(this.vision);

        var totalDecision = 0;

        for (let i = 0; i < output.length; ++i) {
            output[i] = output[i] ** 2; // more weight on the better moves
            totalDecision += output[i];
        }

        for (let i = 0; i < output.length; ++i) {
            // weight all the decisions so all of them added is less than 1
            output[i] = output[i] / totalDecision;
        }

        var random = Math.random();
        var total = 0;
        var index = 0;

        for (let i = 0; i < output.length; ++i) {
            total += output[i];

            if (random < total) {
                index = i;
                break;
            }
        }

        switch (index) {
            case 0:
                this.left()
                break;
            case 1:
                this.up();
                break;
            case 2:
                this.right();
                break;
            case 3:
                this.down();
                break;
        }
    }

    calcFitness() {
        this.fitness = (this.chain.length / this.maxLength) ** 2; // squared error to give more weight to better fitness
    }
}

export default Snake;