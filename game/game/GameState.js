import Render from "./Render.js"

class GameState extends Array {
    constructor(config, width, height) {
        super(config.length)
        this.config = config;
        this.renderer = undefined;
        this.width = width;
        this.height = height;
        this.flush();
    }

    flush() {
        for (let i = 0; i < this.config.length; ++i) {
            this[i] = [];
            for (let k = 0; k < this.config.length; ++k) {
                this[i][k] = 0;
            }
        }
    }

    render(ctx) {
        if (!this.renderer) {
            this.renderer = new Render(ctx, this.width, this.height, this.config);
        }

        this.renderer.render(this);
    }
}

export default GameState;