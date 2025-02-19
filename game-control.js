import { player, enemy } from "./index.js";

export let timer = 60;
export let timerId;

export const GRAVITY = 0.7;
export const SPEED = 5;
export const STRENGHT_J = 20;
export const OFFSET_C = 170;

export let isPaused = false;

export function pauseGame(pause) {
  isPaused = pause;

  if (isPaused) {
    clearTimeout(timerId);
  } else {
    if (timer > 0) {
      decreaseTimer();
    }
  }
}

export function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId); //Stop the timer

  let result = document.querySelector("#result");
  result.style.display = "flex";

  if (player.health === enemy.health) {
    result.innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    result.innerHTML = "Player Won";
  } else {
    result.innerHTML = "Enemy Won";
  }

  //Pausa o jogo quando ele termina
  pauseGame(true);
}

export function decreaseTimer() {
  if (isPaused) {
    return;
  }

  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}
