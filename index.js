import { Sprite, Fighter } from "./sprite.js";
import { animate, decreaseTimer, timerId, timer } from "./animate.js";

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d"); //canvas context

canvas.width = 1024;
canvas.height = 576;

//Using the canvas api, fillRect fills the screen with a black rectangle, starting at the top of the canvas (0,0) and going to the end of width and height
c.fillRect(0, 0, canvas.width, canvas.height);

export const GRAVITY = 0.7;
export const SPEED = 5;
export const STRENGHT_J = 20;
export const OFFSET_C = -50;

export let isPaused = false;

export function pauseGame(pause) {
  isPaused = pause;

  if (isPaused) {
    clearTimeout(timerId);
  } else {
    if (timer > 0) {
      decreaseTimer();
    }
  }
}

//background
export const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: "./img/background.png"
})

//shop background
export const shop = new Sprite({
  position: {
    x: 600,
    y: 129
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6
})

//create player
export const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/samuraiMack/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 250,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },
  }
});

//create enemy
export const enemy = new Fighter({
  position: {
    x: canvas.width - 50, //width of the enemy
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: OFFSET_C,
    y: 0,
  },
});

animate();

decreaseTimer();
