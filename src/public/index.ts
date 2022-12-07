import Phaser from 'phaser';
import { phaserConfig } from './config';

function preload(this: any) {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude.png', {
    frameWidth: 32,
    frameHeight: 48,
  });
}

function create(this: any) {
  this.add.image(400, 300, 'sky');
  this.add.image(200, 300, 'ground');
  this.add.image(400, 300, 'star');
  this.add.image(400, 300, 'bomb');
}

function update() {}

const config = phaserConfig(preload, create, update);

new Phaser.Game(config);
