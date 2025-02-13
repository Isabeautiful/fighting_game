import {
  SPEED,
  STRENGHT_J,
  player,
  enemy,
  canvas,
  c,
  isPaused,
  pauseGame,
} from "./index.js";
import { keys } from "./keys.js";
import { rectangularCollision, handleAttackBoxOffset } from "./collision.js";

export let timer = 60;
export let timerId;

function determineWinner({ player, enemy, timerId }) {
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

//animate the entire canvas
export function animate() {
  window.requestAnimationFrame(animate);

  //if the game is paused, we don't continue to render the game
  if (isPaused) {
    return;
  }

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  //Enemy AI
  enemyAI();

  player.velocity.x = 0;

  if (keys.ArrowLeft.pressed && player.lastKey === "ArrowLeft") {
    player.velocity.x = -SPEED;
  } else if (keys.ArrowRight.pressed && player.lastKey === "ArrowRight") {
    player.velocity.x = SPEED;
  }

  //check offset
  handleAttackBoxOffset(player, enemy);

  //detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemy-health-H").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#player-health-H").style.width =
      player.health + "%";
  }

  //end the game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

const E_ATTACK_COOLDOWN_TIME = 1500; // 1.5s
const DISTANCE_ARM = 50;
let enemyAttackCooldown = 0; //Cooldown of the Attack
let hasAttacked = false;

function enemyAI() {
  const distanceToPlayer = player.position.x - enemy.position.x;

  //Movement
  if (distanceToPlayer > DISTANCE_ARM) {
    enemy.velocity.x = SPEED;
    //Update attack cooldown
    if (enemyAttackCooldown > 0) {
      enemy.velocity.x = -SPEED; //Retreat when can't attack
      enemyAttackCooldown -= 16;
    } else {
      hasAttacked = false;
    }
  } else if (distanceToPlayer < -DISTANCE_ARM) {
    enemy.velocity.x = -SPEED;
  } else {
    enemy.velocity.x = 0;
  }

  //Jump
  if (Math.abs(distanceToPlayer) < DISTANCE_ARM && !enemy.isJumping) {
    enemy.velocity.y = -STRENGHT_J;
    enemy.isJumping = true;
  }

  //Attack
  if (
    Math.abs(distanceToPlayer) < DISTANCE_ARM &&
    !enemy.isAttacking &&
    !hasAttacked
  ) {
    enemy.attack();
    enemyAttackCooldown = E_ATTACK_COOLDOWN_TIME; //INITIATE COOLDOWN
    hasAttacked = true;
  }
}
