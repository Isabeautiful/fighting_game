import { player, enemy, canvas, background, shop, c } from "./index.js";
import { keys } from "./keys.js";
import { rectangularCollision } from "./collision.js";
import { enemyAI } from "./enemy.js";
import { SPEED, isPaused, OFFSET_C } from "./game-control.js";

const HITSTOP_TIME = 3;
//animate the entire canvas
export function animate() {
  window.requestAnimationFrame(animate);

  //if the game is paused, we don't continue to render the game
  if (isPaused) {
    return;
  }

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.update();
  shop.update();

  c.fillStyle = "rgba(255,255,255, 0.15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  //Enemy AI
  enemyAI();

  player.velocity.x = 0;

  if (keys.ArrowLeft.pressed && player.lastKey === "ArrowLeft") {
    player.velocity.x = -SPEED;
    player.switchSprite("run");
  } else if (keys.ArrowRight.pressed && player.lastKey === "ArrowRight") {
    player.velocity.x = SPEED;
    player.switchSprite("run");
  } else {
    //idle é a animação padrão, só ocorre quando não pressionamos teclas de movimento
    if (!player.isHit && !enemy.isHit) player.switchSprite("idle");
  }

  //jump sprite
  if (player.velocity.y < 0) {
    ///currently on air
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  } //falling

  //check offset
  //handleAttackBoxOffset({player, enemy});

  //detect for collision: player hitting enemy
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.currentFrame === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    //activate hitstop when hitting the enemy
    player.timeHitstop = HITSTOP_TIME;
    enemy.timeHitstop = HITSTOP_TIME;

    document.querySelector("#enemy-health-H").style.width = enemy.health + "%";
  }

  //if player misses
  if (player.isAttacking && player.currentFrame === 4) {
    player.isAttacking = false;
  }

  //enemy collision detection: enemy hitting player
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.currentFrame === 1
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    //activate hitstop when hitting the player
    player.timeHitstop = HITSTOP_TIME;
    enemy.timeHitstop = HITSTOP_TIME;

    document.querySelector("#player-health-H").style.width =
      player.health + "%";
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.currentFrame === 2) {
    enemy.isAttacking = false;
  }

  //end the game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    if (enemy.health <= 0) enemy.switchSprite("death");
    if (player.health <= 0) player.switchSprite("death");
  }

  // Flip sprite based on position relative to the other fighter
  //player flip

  if (player.position.x > enemy.position.x) {
    player.flip = true;
    player.attackBox.offset.x = 0;
  } else {
    player.flip = false;
    player.attackBox.offset.x = 50;
  }
  //enemy flip
  if (enemy.position.x < player.position.x) {
    enemy.flip = true;
    enemy.attackBox.offset.x = -210;
  } else {
    enemy.flip = false;
    enemy.attackBox.offset.x = -OFFSET_C;
  }
}
