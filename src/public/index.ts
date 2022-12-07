import Phaser, { Scene } from 'phaser';
import { phaserConfig } from './config';

let platforms: Phaser.Physics.Arcade.StaticGroup;
let stars: Phaser.Physics.Arcade.Group;
let bombs: Phaser.Physics.Arcade.Group;
let player: Phaser.Physics.Arcade.Sprite;
let cursors: Phaser.Types.Input.Keyboard.CursorKeys;
let score = 0;
let scoreText: Phaser.GameObjects.Text;
let gameOver = false;

function hitBomb(
  this: Scene,
  object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
) {
  this.physics.pause();

  const playerObject = object1 as Phaser.Physics.Arcade.Sprite;

  playerObject.setTint(0xff0000);
  playerObject.anims.play('turn');
  gameOver = true;
}

function collectStar(
  object1: Phaser.Types.Physics.Arcade.GameObjectWithBody,
  object2: Phaser.Types.Physics.Arcade.GameObjectWithBody,
) {
  const star = object2 as unknown as Phaser.Physics.Arcade.Components.Enable;
  star.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      const starObject = child as Phaser.Physics.Arcade.Sprite;
      starObject.enableBody(true, starObject.x, 0, true, true);
    });

    const x =
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);

    const bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
  }
}

function preload(this: Scene) {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create(this: Scene) {
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();

  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  this.physics.add.collider(player, platforms);
  cursors = this.input.keyboard.createCursorKeys();

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    (child as Phaser.Physics.Arcade.Sprite).setBounceY(
      Phaser.Math.FloatBetween(0.4, 0.8),
    );
  });

  this.physics.add.collider(stars, platforms);
  this.physics.add.overlap(player, stars, collectStar, undefined, this);

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    color: 'purple',
  });

  bombs = this.physics.add.group();

  this.physics.add.collider(bombs, platforms);

  this.physics.add.collider(player, bombs, hitBomb, undefined, this);
}

function update(this: Scene) {
  if (gameOver) {
    scoreText.setText('GAME OVER');
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

const config = phaserConfig(preload, create, update);

new Phaser.Game(config);
