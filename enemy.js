import { enemy, player, SPEED, STRENGHT_J } from "./index.js";

const E_ATTACK_COOLDOWN_TIME = 1500; // 1.5s
const DISTANCE_ARM = 170;
let enemyAttackCooldown = 0; //Cooldown of the Attack
let hasAttacked = false;

export function enemyAI() {
  const distanceToPlayer = player.position.x - enemy.position.x;

  //Attack
  if (
    Math.abs(distanceToPlayer) < DISTANCE_ARM &&
    !enemy.isAttacking &&
    !hasAttacked
  ) {
    enemy.attack();
    enemy.switchSprite("attack");
    enemyAttackCooldown = E_ATTACK_COOLDOWN_TIME; //INITIATE COOLDOWN
    hasAttacked = true;
    return;
  }

  // Movement Logic
  if (Math.abs(distanceToPlayer) > DISTANCE_ARM) {
    // Move towards the player
    enemy.velocity.x = distanceToPlayer > 0 ? SPEED : -SPEED;
    enemy.switchSprite("run");

    // Retreat if attack cooldown is active
    if (enemyAttackCooldown > 0) {
      enemy.velocity.x = distanceToPlayer > 0 ? -SPEED : SPEED; // Retreat in the opposite direction
      enemy.switchSprite("run");
      enemyAttackCooldown -= 16; // Reduce cooldown timer
    } else {
      hasAttacked = false; // Reset attack flag when cooldown is over
    }
  } else {
    // Stop moving if within attack range
    enemy.velocity.x = 0;
    enemy.switchSprite("idle");
  }

  //Jump
  if (Math.abs(distanceToPlayer) < DISTANCE_ARM && !enemy.isJumping) {
    enemy.velocity.y = -STRENGHT_J;
    enemy.isJumping = true;
  }

  // Handle Jumping and Falling Sprites
  if (enemy.velocity.y < 0 && enemy.isJumping) {
    enemy.switchSprite("jump"); // Currently jumping
  } else if (enemy.velocity.y > 0 && enemy.isJumping) {
    enemy.switchSprite("fall"); // Currently falling
  }
  
}
