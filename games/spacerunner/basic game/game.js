
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 500, //canvas height in pixels
    backgroundColor: '#000000',
    
    
    physics: {
        default: 'arcade',
        arcade:{
            gravity:{y: 450},  //set gravity to 0 to allow free movement.  
            debug: false
        }
    },
    scene: [StartScene, howToPlayScene, GameScene, GameOverScene] //add the StartScene to the config
};

const game = new Phaser.Game(config);