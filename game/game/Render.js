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

    render(Snake) {
        this.ctx.beginPath();
        var blockWidth = Math.floor(this.width / Config.length)

        /* DRAW SNAKE */
        this.ctx.fillStyle = Snake.color;
        for (let segment of Snake.chain) {
            this.ctx.fillRect(segment.x * blockWidth, segment.y * blockWidth, blockWidth, blockWidth);
        }

        /* DRAW APPLE */
        this.ctx.fillStyle = Snake.color;
        this.ctx.fillRect(Snake.apple.x * blockWidth, Snake.apple.y * blockWidth, blockWidth, blockWidth);

        return true;
    }
}

export default Render;