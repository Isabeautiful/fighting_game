const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); //canvas context

canvas.width = 1024;
canvas.height = 576;

//Using the canvas api, fillRect fills the screen with a black rectangle, starting at the top of the canvas (0,0) and going to the end of width and height
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.2;

///creating a player
class Sprite {
  constructor({position, velocity}) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw(){
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, 50, this.height)
  }

  update(){
    this.draw()
    
    this.position.y += this.velocity.y;
    //this.position.y + this.height é o pé do personagem
    //se o pé do personagem + a altura que ele ta do chão é maior ou igual que o fim do canvas
    //ele não cai mais pois está no chão
    if(this.position.y + this.height + this.velocity.y >= canvas.height){
      this.velocity.y = 0;
    }
    else{
      this.velocity.y += gravity;
    }
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  }
})

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  }
})

function animate(){
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0,0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

animate();