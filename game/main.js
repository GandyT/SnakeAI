import { Config } from "./misc/gameConfig.js"
import Logger from "./misc/Logger.js"
import GameState from "./game/GameState.js";
import Snake from "./game/Snake.js";

const LOGGER = new Logger("SnakeAI");
LOGGER.info("Initializing Game")

var canvas = document.getElementById("gs");
var ctx = canvas.getContext("2d");

var screenWidth = canvas.width
var screenHeight = canvas.height

LOGGER.info(`GameScreen - w: ${screenWidth}, h: ${screenHeight}`);

const GameRef = new GameState(Config, screenWidth, screenHeight);

var SnakeHandles = [];

function gameLoop() {
    GameRef.flush();

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

        GameRef[snake.apple.y][snake.apple.x] = GameRef.config.appleColor;

        for (let coord of snake.chain) {
            GameRef[coord.y][coord.x] = GameRef.config.snakeColor;
        }
    }

    GameRef.render(ctx);

    setTimeout(() => requestAnimationFrame(gameLoop), 1000 / GameRef.config.fps)
}

/* DEBUG */
SnakeHandles.push(new Snake()); // Debug Snake
document.body.addEventListener("keydown", (event) => {
    if (SnakeHandles[0]) {
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


