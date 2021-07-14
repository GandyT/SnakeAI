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
}

export default Snake;