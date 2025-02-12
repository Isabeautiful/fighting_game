const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); //canvas context

canvas.width = 1024;
canvas.height = 576;

//Using the canvas api, fillRect fills the screen with a black rectangle, starting at the top of the canvas (0,0) and going to the end of width and height
c.fillRect(0, 0, canvas.width, canvas.height);

const GRAVITY = 0.7;
const SPEED = 5;
const STRENGHT_J = 20;

///creating a sprite class for players and enemies
class Sprite {
  constructor({position, velocity, color = 'red', offset}) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.isJumping = false;
    this.isAttacking = false;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,
      width: 100,
      height: 50
    }
    this.color = color;
  }

  draw(){
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height)

    //attack box
    if(this.isAttacking){
      c.fillStyle = 'green';

      c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
    }
  }

  update(){
    this.draw()
    
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //this.position.y + this.height é o pé do personagem
    //se o pé do personagem + a altura que ele ta do chão é maior ou igual que o fim do canvas
    //ele não cai mais pois está no chão
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0;
      this.isJumping = false;
    }
    else{ //só aplica gravidade quando ele está fora do chão
      this.velocity.y += GRAVITY;
    }
  }
  attack(){
    this.isAttacking = true;
    setTimeout(()=>{
      this.isAttacking = false
    }, 100)
  }
}



//create player
const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  }
})

//create enemy
const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
})

const keys = {
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

function rectangularCollision({
  rectangle1,
  rectangle2
}){
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

//animate the entire canvas
function animate(){
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

animate();

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