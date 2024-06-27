export const game = new PIXI.Application({
  width: 500,
  height: 500,
});

document.body.append(game.canvas);

export function createRootContainer() {
  return game.stage;
}
