import main from "./main.js";

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

    scene: [main],
    };

    const game = new Phaser.Game(config);