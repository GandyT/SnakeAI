import { Config } from "./misc/gameConfig.js"
import Logger from "./misc/Logger.js"
import Render from "./game/Render.js";
import Population from "./Population.js";
import saveAs from "../node_modules/file-saver/src/FileSaver.js";

const LOGGER = new Logger("SnakeAI");
LOGGER.info("Initializing Game")

var canvas = document.getElementById("gs");
var ctx = canvas.getContext("2d");
var snakeStats = document.getElementById("viewing");
var viewBestBtn = document.getElementById("viewBest");
var downloadBtn = document.getElementById("download");
var loadBtn = document.getElementById("loadBtn")
var lastGenStats = document.getElementById("lastGenStats");

var screenWidth = canvas.width
var screenHeight = canvas.height

LOGGER.info(`GameScreen - w: ${screenWidth}, h: ${screenHeight}`);

const GameRender = new Render(ctx, screenWidth, screenHeight);
const popSize = 2000;
const mutationRate = 0.01;

var singleSnake = false;

var SnakeHandles = new Population(popSize, mutationRate);

function gameLoop() {
    // clears entire frame with background color to redraw snake frames
    GameRender.clear();

    for (let snakeIndex = 0; snakeIndex < SnakeHandles.sample.length; ++snakeIndex) {
        let snake = SnakeHandles.sample[snakeIndex];
        if (snake.dead) continue;

        snake.getVision();

        if (singleSnake) {
            if (snake.best) {
                GameRender.render(snake, true);
                snakeStats.innerHTML = `Gen ${SnakeHandles.generation}, Length: ${snake.chain.length}, Moves ${snake.maxMoves - snake.moves}`
            }
        } else {
            GameRender.render(snake);
            snakeStats.innerHTML = `Gen ${SnakeHandles.generation}, Moves: ${snake.maxMoves - snake.moves}`
        }


        snake.decide();
        snake.move(); // snake class calculates movement internally

    }



    if (SnakeHandles.isDone) {
        if (SnakeHandles.sample.length > 1) {
            // new generation
            SnakeHandles.calcFitness();
            var bestSnake = SnakeHandles.bestSnake;
            var stats = `[GEN${SnakeHandles.generation}] AVG FIT: ${SnakeHandles.avgFit}, BEST: ${bestSnake.chain.length} (ALIVE: ${bestSnake.maxMoves - bestSnake.moves})`
            console.log(stats)
            lastGenStats.innerHTML = stats;
            SnakeHandles.selection();
        } else if (SnakeHandles.sample.length == 1) {
            SnakeHandles.sample[0].dead = false;
        }
    }

    setTimeout(() => requestAnimationFrame(gameLoop), 1000 / Config.fps)
}

/* BTN LISTENERS =============================== */

viewBestBtn.addEventListener("click", event => {
    singleSnake = !singleSnake;

    if (singleSnake) {
        viewBestBtn.innerHTML = "View All"
    } else {
        viewBestBtn.innerHTML = "View Best"
    }
});

downloadBtn.addEventListener("click", event => {
    let NetJSON = SnakeHandles.lastBest.neuralNet.toJson();
    var blob = new Blob([NetJSON], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "model.json");
});

loadBtn.addEventListener("click", event => {
    let inputFile = document.getElementById("chooseFile")
    var modelFile = inputFile.files[0];

    if (!modelFile) return window.alert("Invalid File");
    var fileReader = new FileReader();
    fileReader.addEventListener('load', event => {

        var netObj = JSON.parse(event.target.result);
        SnakeHandles = new Population(1, 0);
        SnakeHandles.sample[0].neuralNet.loadModel(netObj);

        SnakeHandles.sample[0].maxMoves = Number.MAX_VALUE;
        SnakeHandles.sample[0].moves = Number.MAX_VALUE;
        SnakeHandles.sample[0].best = true;
    })

    fileReader.readAsText(modelFile);
})

/*  ==================== */

gameLoop();


