import { SPEED, player, enemy, canvas, c, isPaused, pauseGame } from './index.js';
import { keys } from './keys.js';
import { rectangularCollision, handleAttackBoxOffset } from './collision.js';

export let timer = 10;
export let timerId;

function determineWinner({player, enemy, timerId}){
  clearTimeout(timerId); //Stop the timer

  let result = document.querySelector('#result');
  result.style.display = 'flex';

  if(player.health === enemy.health){
    result.innerHTML = 'Tie';
  }
  else if(player.health > enemy.health){
    result.innerHTML = 'Player Won';
  }
  else{
    result.innerHTML = 'Enemy Won';
  }
  pauseGame(true);
}

export function decreaseTimer(){
  if(isPaused){
    return;
  }

  if(timer > 0){
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if(timer === 0){
    determineWinner({player,enemy, timerId});
  }
}

//animate the entire canvas
export function animate(){
  window.requestAnimationFrame(animate);

  //if the game is paused, we don't continue to render the game
  if(isPaused){
    return;
  }
  
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
    enemy.health -= 20;
    document.querySelector('#enemy-health-H').style.width = enemy.health + '%';
  }

  if(rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) &&
  enemy.isAttacking)
  {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector('#player-health-H').style.width = player.health + '%';
  }

  //end the game based on health
  if(enemy.health <= 0 || player.health <= 0){
    determineWinner({player,enemy, timerId});
  }
}