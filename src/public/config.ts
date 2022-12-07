export function phaserConfig(
  preload: () => void,
  create: () => void,
  update: () => void,
) {
  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
      preload: preload,
      create: create,
      update: update,
    },
  };
}
