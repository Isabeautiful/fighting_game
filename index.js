import { Sprite } from './sprite.js';
import { animate, decreaseTimer } from './animate.js';

export const canvas = document.querySelector('canvas');
export const c = canvas.getContext('2d'); //canvas context

canvas.width = 1024;
canvas.height = 576;

//Using the canvas api, fillRect fills the screen with a black rectangle, starting at the top of the canvas (0,0) and going to the end of width and height
c.fillRect(0, 0, canvas.width, canvas.height);

export const GRAVITY = 0.7;
export const SPEED = 5;
export const STRENGHT_J = 20;
export const OFFSET_C = -50;

//create player
export const player = new Sprite({
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
export const enemy = new Sprite({
  position: {
    x: canvas.width - 50, //width of the enemy
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: OFFSET_C,
    y: 0
  }
})

animate();

decreaseTimer();