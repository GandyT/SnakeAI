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
const popSize = 10;

var SnakeHandles = [];

for (let i = 0; i < popSize; ++i) {
    SnakeHandles.push(new Snake(i)); // Debug Snakes
}

function gameLoop() {
    // clears entire frame with background color to redraw snake frames
    GameRender.clear();

    for (let snakeIndex = 0; snakeIndex < SnakeHandles.length; ++snakeIndex) {
        let snake = SnakeHandles[snakeIndex];
        if (snake.dead) continue;

        snake.getVision();
        snake.decide();
        snake.move(); // snake class calculates movement internally

        if (snake.dead) {

            LOGGER.info(
                `Snake ${snake.snakeNum} died.\n` +
                `Length: ${snake.chain.length}`
            )

            /* 
                AI MODEL SAVE LOGIC HERE
            */

            /* ================================= */

            continue;
        }

        GameRender.render(snake);
    }

    setTimeout(() => requestAnimationFrame(gameLoop), 1000 / Config.fps)
}

/* =============================== */

gameLoop();


