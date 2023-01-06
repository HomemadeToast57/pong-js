import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import PauseMenu from "./PauseMenu.js";

const ball = new Ball(document.getElementById("ball"));
const playerPaddle = new Paddle(document.getElementById("player-paddle"));
const computerPaddle = new Paddle(document.getElementById("computer-paddle"));
const playerScoreElem = document.getElementById("player-score");
const computerScoreElem = document.getElementById("computer-score");
const pauseButtonElem = document.getElementById("pause-button");
const pauseMenu = new PauseMenu(document.getElementById("pause-menu"));

let lastTime;

let isPaused = false;
let iBetweenRounds = false;

function update(time) {
  pauseButtonElem.addEventListener("click", handlePause);

  if (lastTime != undefined && !isPaused) {
    pauseMenu.hide();
    const delta = time - lastTime;
    ball.update(delta, [playerPaddle.rect, computerPaddle.rect]);
    computerPaddle.update(ball.y, delta);

    const hue = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--hue")
    );

    document.documentElement.style.setProperty(
      "--hue",
      (hue + delta * 0.005) % 360
    );

    if (isLose()) handleLose();
  }

  lastTime = time;
  window.requestAnimationFrame(update);
}

function handleLose() {
  const ballRect = ball.rect();
  if (ballRect.right >= window.innerWidth) {
    playerScoreElem.textContent = parseInt(playerScoreElem.textContent) + 1;
  } else {
    computerScoreElem.textContent = parseInt(computerScoreElem.textContent) + 1;
  }
  ball.reset();
  playerPaddle.reset();
  computerPaddle.reset();
  newRoundPause();
}

function isLose() {
  const ballRect = ball.rect();
  return ballRect.right >= window.innerWidth || ballRect.left <= 0;
}

async function newRoundPause() {
  await pauseMenu.show("New Round");
  isPaused = true;
  await initiateCountDown(3);
  await pauseMenu.hide();
  //sleep for 1 second
  isPaused = false;
  await sleep(2000);
}

async function handlePause(string) {
  if (!isPaused) {
    // return initiateCountDown(3);
    pauseMenu.show("Game Paused");
    pauseButtonElem.innerHTML = '<i class="fa fa-play"></i>';
  } else {
    pauseButtonElem.innerHTML = '<i class="fa fa-pause"></i>';
    //disable the pause button

    console.log(pauseButtonElem.disabled);

    //do initiateCountDown(3) but make the whole function wait until the countdown is done
    await initiateCountDown(3);
    await pauseMenu.hide();
  }

  isPaused = !isPaused;
}

//when the user clicks the pause button call handlePause()

document.addEventListener("mousemove", (e) => {
  // if (!isPaused) {
  playerPaddle.position = (e.y / window.innerHeight) * 100;
  // }
});

async function initiateCountDown(seconds) {
  for (let i = seconds; i >= 0; i--) {
    pauseButtonElem.style.pointerEvents = "none";
    //if pause button is clicked, then break the loop and call handlePause()
    const breakPause = () => {
      removeEventListener("click", handlePause);
      // return out of the function
      return;
    };
    addEventListener("click", breakPause);

    if (i == 0) {
      pauseMenu.show(Math.random() <= 0.5 ? "Go!" : "Game On!");
      await sleep(500);
      pauseButtonElem.style.pointerEvents = "auto";
    } else {
      await pauseMenu.show(i);
      await sleep(1000);
    }
  }
}


async function startGame() {
  lastTime = undefined;

  //pause game and display "PONG"
  handlePause();
  await pauseMenu.show("PONG");
  //wait for 1 second
  await sleep(1000);
  await ball.show();

  window.requestAnimationFrame(update);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

startGame();