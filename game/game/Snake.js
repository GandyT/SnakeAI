import { Config } from "../misc/gameConfig.js";
import NeuralNet from "../ai/NeuralNet.js";

const randomHex = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};

class Snake {
    constructor(snakeNum) {
        /* SNAKE IS IN THE SAME POSITION EVERY TIME IT STARTS*/
        let initX = Math.floor(Config.length / 2);
        let initY = initX;

        this.chain = [
            {
                x: initX,
                y: initY
            },
        ];

        let direction = Math.random();

        if (direction < 0.25) {
            this.chain.push(
                {
                    x: initX - 1,
                    y: initY,
                },
                {
                    x: initX - 2,
                    y: initY
                },
                {
                    x: initX - 3,
                    y: initY
                }
            )
        } else if (direction < 0.5) {
            this.chain.push(
                {
                    x: initX + 1,
                    y: initY,
                },
                {
                    x: initX + 2,
                    y: initY
                },
                {
                    x: initX + 3,
                    y: initY
                }
            )
        } else if (direction < 0.75) {
            this.chain.push(
                {
                    x: initX,
                    y: initY - 1,
                },
                {
                    x: initX,
                    y: initY - 2
                },
                {
                    x: initX,
                    y: initY - 3
                }
            )
        } else {
            this.chain.push(
                {
                    x: initX,
                    y: initY + 1
                },
                {
                    x: initX,
                    y: initY + 2
                },
                {
                    x: initX,
                    y: initY + 3
                }
            )
        }

        this.color = randomHex();
        this.snakeNum = snakeNum;
        this.apple = {};
        this.generateApple();
        this.velocity = [0, 0];
        this.dead = false;
        this.addPos = {};
        this.vision = []; // single column matrix
        this.neuralNet = new NeuralNet(24, 12, 4);
        this.maxMoves = 200;
        this.moves = this.maxMoves; // prevent infinite snakes


        this.maxLength = Config.length ** 2; // snake can take up the entire board
        this.fitness = 0;
    }

    generateApple() {
        do {
            this.apple.x = Math.floor(Math.random() * Config.length);
            this.apple.y = Math.floor(Math.random() * Config.length);
        } while (this.chain.find(coord => coord.x == this.apple.x && coord.y == this.apple.y))
    }

    grow() {
        this.chain.unshift({
            x: this.chain[0].x + this.velocity[0],
            y: this.chain[0].y + this.velocity[1]
        });
        this.addPos = this.chain.pop(); // save last position of last piece of snake so when snake eats something it puts new piece there
    }

    setVelocity(newVelocity) {
        this.velocity = newVelocity;
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

        this.grow();

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
        /* ALL 8 DIRECTIONS */
        var vision = [
            ...this.getDirection(-1, 0),
            ...this.getDirection(-1, -1),
            ...this.getDirection(0, -1),
            ...this.getDirection(1, -1),
            ...this.getDirection(1, 0),
            ...this.getDirection(1, 1),
            ...this.getDirection(0, 1),
            ...this.getDirection(-1, 1)
        ];

        this.vision = vision;
    }

    getDirection(rise, run) {
        // rise = x increment, run = y increment
        let temp = new Array(3);
        // food, tail, wall

        let position = JSON.parse(JSON.stringify(this.chain[0]));
        position.x += rise;
        position.y += run;
        let distance = 1;

        temp[0] = 0;
        temp[1] = 0;

        let bodyFound = false;
        let appleFound = false;

        while (
            (position.x < Config.length && position.y < Config.length) &&
            (position.x >= 0 && position.y >= 0)
        ) {
            if (!appleFound && position.x == this.apple.x && position.y == this.apple.y) {
                temp[0] = 1;
                appleFound = true;
            }
            if (!bodyFound && this.chain.find(seg => (seg.x == position.x && seg.y == position.y) && seg.x != this.chain[0].x && seg.y != this.chain[0].y)) {
                temp[1] = 1 / distance;
                bodyFound = true;
            }

            position.x += rise;
            position.y += run;
            distance++;
        }

        temp[2] = 1 / distance;

        return temp;
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
        var output = this.neuralNet.output(this.vision);

        var index = 0;
        var max = -1;

        for (let i in output) {
            if (output[i] > max) {
                max = output[i];
                index = Number(i);
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
        this.fitness = (this.maxMoves - this.moves) ** 2 * Math.pow(2, this.chain.length);
    }

    revive() {
        this.dead = false;
        this.moves = this.maxMoves;
        this.generateApple();
        let initX = Math.floor(Config.length / 2);
        let initY = initX;

        this.chain = [
            {
                x: initX,
                y: initY
            },
        ];

        let direction = Math.random();

        if (direction < 0.25) {
            this.chain.push(
                {
                    x: initX - 1,
                    y: initY,
                },
                {
                    x: initX - 2,
                    y: initY
                },
                {
                    x: initX - 3,
                    y: initY
                }
            )
        } else if (direction < 0.5) {
            this.chain.push(
                {
                    x: initX + 1,
                    y: initY,
                },
                {
                    x: initX + 2,
                    y: initY
                },
                {
                    x: initX + 3,
                    y: initY
                }
            )
        } else if (direction < 0.75) {
            this.chain.push(
                {
                    x: initX,
                    y: initY - 1,
                },
                {
                    x: initX,
                    y: initY - 2
                },
                {
                    x: initX,
                    y: initY - 3
                }
            )
        } else {
            this.chain.push(
                {
                    x: initX,
                    y: initY + 1
                },
                {
                    x: initX,
                    y: initY + 2
                },
                {
                    x: initX,
                    y: initY + 3
                }
            )
        }
    }

    copy() {
        let clone = new Snake(69);
        clone.neuralNet = this.neuralNet;
        clone.color = this.color;
        clone.fitness = this.fitness;
        return clone;
    }
}

export default Snake;