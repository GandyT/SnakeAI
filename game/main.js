import { Config } from "./misc/gameConfig.js"
import Logger from "./misc/Logger.js"
import Render from "./game/Render.js";
import Snake from "./game/Snake.js";

const LOGGER = new Logger("SnakeAI");
LOGGER.info("Initializing Game")

var canvas = document.getElementById("gs");
var ctx = canvas.getContext("2d");

var screenWidth = canvas.width
var screenHeight = canvas.height

LOGGER.info(`GameScreen - w: ${screenWidth}, h: ${screenHeight}`);

const GameRender = new Render(ctx, screenWidth, screenHeight);

var SnakeHandles = [];

function gameLoop() {
    GameRender.clear();

    for (let snakeIndex in SnakeHandles) {
        let snake = SnakeHandles[snakeIndex];
        snake.move();

        if (snake.dead) {

            LOGGER.info(
                `Snake ${snakeIndex} died.\n` +
                `Length: ${snake.chain.length}`
            )

            /* 
                AI MODEL SAVE LOGIC HERE
            */

            /* ================================= */
            // remove from array
            SnakeHandles = [...SnakeHandles.slice(0, snakeIndex), ...SnakeHandles.slice(snakeIndex + 1)];

            continue;
        }

        GameRender.render(snake);
    }

    setTimeout(() => requestAnimationFrame(gameLoop), 1000 / Config.fps)
}

/* DEBUG */
SnakeHandles.push(new Snake()); // Debug Snake
document.body.addEventListener("keydown", (event) => {
    if (SnakeHandles[0]) {
        event.preventDefault();
        if (event.keyCode == 68 || event.keyCode == 39) {
            SnakeHandles[0].setVelocity([1, 0])
        } else if (event.keyCode == 65 || event.keyCode == 37) {
            SnakeHandles[0].setVelocity([-1, 0])
        } else if (event.keyCode == 83 || event.keyCode == 40) {
            SnakeHandles[0].setVelocity([0, 1])
        } else if (event.keyCode == 87 || event.keyCode == 38) {
            SnakeHandles[0].setVelocity([0, -1])
        }
    }
});
/* =============================== */

gameLoop();


