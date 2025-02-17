import { player, pauseGame, isPaused } from "./index.js";

export const keys = {
  a: { pressed: false },
  d: { pressed: false },
  w: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowUp: { pressed: false },
  Escape: { pressed: false },
};

window.addEventListener("keydown", (event) => {
  if (isPaused && event.key !== "Escape") {
    return;
  }

  if (!player.dead) {
    switch (event.key) {
      case " ":
        player.attack();
        break;

      case "ArrowUp":
        player.jump();
        break;

      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        player.lastKey = "ArrowRight";
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        player.lastKey = "ArrowLeft";
        break;

      case "Escape":
        keys.Escape.pressed = true;
        pauseGame(!isPaused);
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (isPaused && event.key != "Escape") {
    return;
  }

  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;

    case "Escape":
      keys.Escape.pressed = false;
      break;
  }
});
