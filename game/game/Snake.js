import { Config } from "../misc/gameConfig.js";

class Snake {
    constructor() {
        this.chain = [
            {
                x: Math.floor(Math.random() * Config.length),
                y: Math.floor(Math.random() * Config.length)
            }
        ];

        this.apple = {};
        this.generateApple();
        this.velocity = [0, 0];
        this.dead = false;
        this.addPos = {};
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
        }

        /* =============================== */

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
            )
        ) {
            this.dead = true;
            return;
        }

        this.chain.unshift({
            x: this.chain[0].x + this.velocity[0],
            y: this.chain[0].y + this.velocity[1]
        });
        this.addPos = this.chain.pop(); // save last position of last piece of snake so when snake eats something it puts new piece there

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
}

export default Snake;