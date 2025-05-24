class howToPlayScene extends Phaser.Scene{
    constructor(){
        super({key: 'howToPlayScene'});
    }




    create(){
        this.add.text(325,100, 'HOW TO PLAY! ', { FontSize: '80px', fill: '#ffffff', fontStyle: 'bold' });
        this.add.text(150, 200, 'Use the UP arrow key to jump. Jump over the blocks.', { FontSize: '40px', fill: '#ffffff' });
        this.add.text(200, 300, 'Click anywhere to go back to the main menu.', { FontSize: '40px', fill: '#ffffff' });
        
        this.input.on('pointerdown', () => {

            this.scene.start('StartScene');
        })
    }
}