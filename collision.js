import { OFFSET_C } from "./game-control.js";

export function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

export function handleAttackBoxOffset(sprite1, sprite2) {
  //Verificação do sprite 1
  if (sprite1.position.x <= sprite2.position.x) {
    sprite1.attackBox.offset.x = 0; //offset padrão, ataque para a direita
  } else {
    sprite1.attackBox.offset.x = OFFSET_C; //offset invertido, ataque para a esquerda
  }

  //Verificação do sprite 2
  if (sprite2.position.x <= sprite1.position.x) {
    sprite2.attackBox.offset.x = 0;
  } else {
    sprite2.attackBox.offset.x = OFFSET_C; //offset invertido
  }
}
