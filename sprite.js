import { STRENGHT_J, GRAVITY, canvas, c } from "./index.js";

///creating a sprite class
export class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 }) {
    this.position = position;
    this.width = 50;
    this.height = 150;

    this.image = new Image();
    this.image.onload = () => {}
    this.image.src = imageSrc;

    this.scale = scale;
    this.framesMax = framesMax;
    this.currentFrame = 0;

    this.framesElapsed = 0;
    this.framesHold = 5;
  }

  draw() {
    //wich image, the crop properties, the position x and y, and the width and height of the sprite
    c.drawImage(
      this.image,

      //crop properties
      this.currentFrame * (this.image.width / this.framesMax), 
      0,
      this.image.width / this.framesMax,
      this.image.height,


      this.position.x, this.position.y, 
      (this.image.width / this.framesMax ) * this.scale, this.image.height * this.scale);
  }

  update() {
    this.draw();

    this.framesElapsed++;
    if(this.framesElapsed % this.framesHold === 0){
      if(this.currentFrame < this.framesMax - 1)
        this.currentFrame++;
      else
        this.currentFrame = 0;
    }
  }
}



///creating a Fighter class for players and enemies
export class Fighter {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.isJumping = false;
    this.isAttacking = false;
    this.health = 100;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box
    if (this.isAttacking) {
      c.fillStyle = "green";

      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  update() {
    this.draw();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    //this.position.y + this.height é o pé do personagem
    //se o pé do personagem + a altura que ele ta do chão é maior ou igual que o fim do canvas
    //ele não cai mais pois está no chão, chão antes era canvas.height, agora é canvas.height - 96px pq o chão fica ali
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.isJumping = false;
    } else {
      //só aplica gravidade quando ele está fora do chão
      this.velocity.y += GRAVITY;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  jump(){
    if (!this.isJumping) {
      this.velocity.y = -STRENGHT_J;
      this.isJumping = true;
    }
  }
}
