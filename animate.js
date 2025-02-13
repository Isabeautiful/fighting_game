import { STRENGHT_J, SPEED, GRAVITY, player, enemy, canvas, c } from './index.js';
import { keys } from './keys.js';
import { rectangularCollision, handleAttackBoxOffset } from './collision.js';

//animate the entire canvas
export function animate(){
  window.requestAnimationFrame(animate);
  
  c.fillStyle = 'black';
  c.fillRect(0,0, canvas.width, canvas.height);
  
  player.update();
  enemy.update();

  player.velocity.x = 0;

  if(keys.a.pressed && player.lastKey === 'a'){
    player.velocity.x = -SPEED;
  } else if(keys.d.pressed && player.lastKey === 'd'){
    player.velocity.x = SPEED;
  }

  enemy.velocity.x = 0;
  if(keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
    enemy.velocity.x = SPEED;
  } else if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
    enemy.velocity.x = -SPEED;
  }

  //check offset
  handleAttackBoxOffset(player,enemy);

  //detect for collision
  if(rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
  }) &&
  player.isAttacking)
  {
    player.isAttacking = false;
    console.log('hit');
  }

  if(rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) &&
  enemy.isAttacking)
  {
    enemy.isAttacking = false;
    console.log('hitE');
  }
}
