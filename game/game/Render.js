class Render {
    constructor(ctx, width, height, config) {
        this.ctx = this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.config = config
    }

    /* 
        GAME STATE IS A MATRICE OF HEX COLOR VALUES, EACH ONE REPRESENTING A SQUARE
    */
    render(GameState) {
        this.ctx.beginPath();
        var blockWidth = Math.floor(this.width / GameState.length)

        for (let row = 0; row < this.config.length; ++row) {
            for (let column = 0; column < this.config.length; ++column) {
                if (!GameState[row][column]) {
                    this.ctx.fillStyle = this.config.backgroundColor;
                } else {
                    this.ctx.fillStyle = GameState[row][column]
                }

                this.ctx.fillRect(column * blockWidth, row * blockWidth, blockWidth, blockWidth);
            }
        }

        return true;
    }
}

export default Render;