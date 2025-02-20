import { canvas, c, player, enemy } from "./index.js";
import {
  STRENGHT_J,
  GRAVITY,
  determineWinner,
  timerId,
} from "./game-control.js";

///creating a sprite class
export class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;

    this.image = new Image();
    this.image.onload = () => {};
    this.image.src = imageSrc;

    this.scale = scale;
    this.framesMax = framesMax;
    this.currentFrame = 0;

    this.framesElapsed = 0;
    this.framesHold = 5;

    this.offset = offset;
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

      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.currentFrame < this.framesMax - 1) this.currentFrame++;
      else this.currentFrame = 0;
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

///creating a Fighter class for players and enemies
export class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    //calls constructor of the parent (sprite)
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });
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
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.dead = false;

    this.sprites = sprites;
    //Properties of sprite
    this.currentFrame = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.flip = false;

    this.timeHitstop = 0; //frames do hitstop

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
  }

  draw() {
    c.save(); // Salva o estado atual do contexto
    if (this.flip) {
      c.scale(-1, 1); // Flip horizontalmente
      c.translate(-this.position.x * 2 - this.width, 0); // Ajusta a posição após o flip
    }
    super.draw();
    c.restore(); // Restaura o estado do contexto
  }

  update() {
    //if the hitstop is on, doesn't update the animation loop
    if (this.timeHitstop > 0) {
      this.draw();
      this.timeHitstop--;
      return;
    }

    this.draw();
    if (!this.dead) this.animateFrames();

    // Ajusta a posição da attackBox com base no flip
    if (this.flip) {
      this.attackBox.position.x =
        this.position.x - this.attackBox.offset.x - this.attackBox.width;
    } else {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    }
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    /*
    //attackbox hitbox (for debuging) 
    c.fillRect(
      this.attackBox.position.x,
      this.attackBox.position.y,
      this.attackBox.width,
      this.attackBox.height
    );

    
    //Draws player hitbox (collision of player and enemy, for debuging)
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    */

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Boundary checks: Impede que o jogador saia do canvas
    if (this.position.x < 0) {
      this.position.x = 0; // Impede que o jogador saia pela borda esquerda do canvas
    } else if (this.position.x + this.width > canvas.width) {
      this.position.x = canvas.width - this.width; // Impede que o jogador saia pela borda direita do canvas
    }

    //this.position.y + this.height é o pé do personagem
    //se o pé do personagem + a altura que ele ta do chão é maior ou igual que o fim do canvas
    //ele não cai mais pois está no chão, chão antes era canvas.height, agora é canvas.height - 96px pq o chão fica ali
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.isJumping = false;
      this.position.y = 330; //bug fix, console.log(this.position.y)
    } else {
      //só aplica gravidade quando ele está fora do chão
      this.velocity.y += GRAVITY;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  takeHit() {
    this.health -= 20;

    //switch sprites based on health
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  jump() {
    if (!this.isJumping) {
      this.velocity.y = -STRENGHT_J;
      this.isJumping = true;
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.currentFrame === this.sprites.death.framesMax - 1)
        this.dead = true;
      if (this.dead === true) determineWinner({ player, enemy, timerId }); //attack frame bug fix
      return;
    }

    //override the other animations for the attack sprite
    if (
      this.image === this.sprites.attack1.image &&
      this.currentFrame < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }
    //override the other animations for the takeDamage sprite
    if (
      this.image === this.sprites.takeHit.image &&
      this.currentFrame < this.sprites.takeHit.framesMax - 1
    ) {
      return;
    }

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;

          this.currentFrame = 0;
        }
        break;
      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;

          this.currentFrame = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;

          this.currentFrame = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;

          this.currentFrame = 0;
        }
        break;
      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;

          this.currentFrame = 0;
        }
        break;
      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;

          this.currentFrame = 0;
        }
        break;
      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;

          this.currentFrame = 0;
        }
        break;
    }
  }
}
