import { Config } from "../misc/gameConfig.js";

class Render {
    constructor(ctx, width, height) {
        this.ctx = this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    clear() {
        /* DRAW BACKGROUND */
        this.ctx.fillStyle = Config.backgroundColor;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    render(Snake, viewBest) {
        this.ctx.beginPath();
        var blockWidth = Math.floor(this.width / Config.length)

        /* DRAW SNAKE */
        this.ctx.fillStyle = Snake.color;
        for (let segment of Snake.chain) {
            this.ctx.fillRect(segment.x * blockWidth, segment.y * blockWidth, blockWidth, blockWidth);
        }

        /* DRAW APPLE */
        this.ctx.fillRect(Snake.apple.x * blockWidth, Snake.apple.y * blockWidth, blockWidth, blockWidth);

        /* RENDER VISION */
        let directions = [
            [-1, 0],
            [-1, -1],
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1]
        ];

        // render vision

        if (viewBest) {


            for (let direction of directions) {
                let position = JSON.parse(JSON.stringify(Snake.chain[0]));

                while (
                    (position.x < Config.length && position.y < Config.length) &&
                    (position.x >= 0 && position.y >= 0)
                ) {
                    this.ctx.strokeStyle = Config.snakeColor;

                    position.x += direction[0];
                    position.y += direction[1];

                    if (position.x == Snake.apple.x && position.y == Snake.apple.y) {
                        this.ctx.strokeStyle = Config.appleColor;
                        this.ctx.strokeRect(position.x * blockWidth, position.y * blockWidth, blockWidth, blockWidth);
                        break;
                    }

                    this.ctx.strokeRect(position.x * blockWidth, position.y * blockWidth, blockWidth, blockWidth);
                }
            }
        }


        return true;
    }
}

export default Render;