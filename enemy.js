import { enemy, player, SPEED, STRENGHT_J } from "./index.js";

const E_ATTACK_COOLDOWN_TIME = 1500; // 1.5s
const DISTANCE_ARM = 50;
let enemyAttackCooldown = 0; //Cooldown of the Attack
let hasAttacked = false;

export function enemyAI() {
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