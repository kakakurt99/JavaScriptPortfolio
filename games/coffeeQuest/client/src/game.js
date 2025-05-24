import main from "../src/main.js";

const config = {
    type: Phaser.AUTO,
    antiAlias: false,
    width: 960,
    height: 640, //canvas height in pixels
    pixelArt: true, 
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    resolution: window.devicePixelRatio || 1, //use the devices pixel ratio
    backgroundColor: '#87ceeb',

    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

    scene: [main],
    input: {
        mouse: {
            target: window 
        }
    }
    };

    const game = new Phaser.Game(config);