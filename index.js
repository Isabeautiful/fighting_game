const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d'); //canvas context

canvas.width = 1024;
canvas.height = 576;

//Using the canvas api, fillRect fills the screen with a black rectangle, starting at the top of the canvas (0,0) and going to the end of width and height
c.fillRect(0, 0, canvas.width, canvas.height);


///creating a player
class Sprite {
  constructor(position) {
    this.position = position;
  }

  draw(){
    c.fillStyle = 'red';
    c.fillRect(this.position.x, this.position.y, 50,150)
  }
}

const player = new Sprite({
  x: 0,
  y: 0
})

player.draw();

const enemy = new Sprite({
  x: 400,
  y: 100
})

enemy.draw();

console.log(player);