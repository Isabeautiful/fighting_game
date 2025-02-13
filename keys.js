import { STRENGHT_J, SPEED, GRAVITY, player, enemy } from './index.js';

export const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  },
  ArrowUp: {
    pressed: false
  }
}

window.addEventListener("keydown", (event)=>{
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
    break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
    break;
    case 'w':
      if(!player.isJumping){
        player.velocity.y = -STRENGHT_J;
        player.isJumping = true;
      }
    break;
    case ' ':
      player.attack();
    break;

    // Enemy
    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
    break;
    case 'ArrowUp':
      if(!enemy.isJumping){
        enemy.velocity.y = -STRENGHT_J;
        enemy.isJumping = true;
      }
    break;
    case 'ArrowDown':
      enemy.attack();
    break;
  }
})

window.addEventListener("keyup", (event)=>{
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
    break;
    case 'a':
      keys.a.pressed = false;
    break;
    case 'w':
      keys.w.pressed = false;
    break;
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
    break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
    break;
    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
    break;
  }
})