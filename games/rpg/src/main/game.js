import GameScene from './GameScene.js';
import dialogBoxScene from './dialogBoxScene.js';
import inventory from './inventory.js';

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 640, //canvas height in pixels
    backgroundColor: '#ffffff',

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },

    scene: [GameScene, dialogBoxScene, inventory],
    };

    const game = new Phaser.Game(config);