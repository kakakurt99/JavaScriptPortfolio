class GameOverScene extends Phaser.Scene{
    constructor(){
        super({key: 'GameOverScene'});  //set the key of the scene to 'GameOverScene'
 
    }

    create(){
        this.add.text(325,250, 'GAME OVER! ', { FontSize: '80px', fill: '#ffffff', fontStyle: 'bold' });
        this.add.text(160, 300, 'Click anywhere to go back to the main menu.', { FontSize: '40px', fill: '#ffffff' });
        this.input.on('pointerdown', () => {

            this.scene.start('StartScene');
        })
    }
}