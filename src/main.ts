import Phaser from 'phaser';
import { LoginScene } from './scenes/LoginScene';
import { StartScene } from './scenes/StartScene';
import { CharacterSelectScene } from './scenes/CharacterSelectScene';
import { LevelSelectScene } from './scenes/LevelSelectScene';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#1a1a2e',
  parent: 'game-container',
  scene: [LoginScene, StartScene, CharacterSelectScene, LevelSelectScene, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  },
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
