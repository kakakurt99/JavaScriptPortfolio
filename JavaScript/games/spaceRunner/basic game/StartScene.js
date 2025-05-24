const rocketx = 100;
const rockety = 500;



class StartScene extends Phaser.Scene{
    constructor(){
        super({key: 'StartScene'});  //set the key of the scene to 'StartScene'
 
    }

    

    create(){

       
        gameState.cursors = this.input.keyboard.createCursorKeys();

        // Create Enter key
        gameState.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
       
         // Possible positions for the arrow
         gameState.arrowPositions = [155, 205, 255];
         gameState.currentPositionIndex = 0; // Start at the first position
    
        // Flag to track if the arrow has moved
        gameState.arrowOption1 = true;
        gameState.arrowOption2 = false;
        gameState.arrowOption3 = false;

       // this.load.audio('openingMusic', 'assets/audio/openingmusic.wav');
        gameState.openingMusic = this.sound.add('openingMusic', {volume: 0.1, loop: true});
        gameState.openingMusic.play({loop: true});

        // Add the background image
        gameState.menu1 = this.add.image((config.width/3 + 30), 150, 'menu1').setOrigin(0, 0);
        gameState.menu1.setScale(0.2);

        gameState.menu2 =  this.add.image((config.width/3 + 30), 200, 'menu2').setOrigin(0, 0);
        gameState.menu2.setScale(0.2);

        gameState.menuExit = this.add.image((config.width/3 + 90), 250, 'menuExit').setOrigin(0, 0);
        gameState.menuExit.setScale(0.2);

        gameState.arrow1 = this.add.image(250, 155, 'arrow1').setOrigin(0, 0);
        gameState.arrow1.setScale(1);

        gameState.arrow2 = this.add.image(253, 155, 'arrow2').setOrigin(0,0);
        gameState.arrow2.setScale(1);

       // gameState.arrow2 = this.add.image(250, 205, 'arrow1').setOrigin(0, 0);
       // gameState.arrow1.setScale(1);


        

        this.anims.create({
            key: 'rocketAnim',
            frames: [
                { key: 'rocket1', frame: null, duration: 0, x: 0, y: 0, width: 64, height: 64, centerX: 32, centerY: 32 },
                { key: 'rocket2', frame: null, duration: 0, x: 0, y: 0, width: 64, height: 64, centerX: 32, centerY: 32 },
                { key: 'rocket3', frame: null, duration: 0, x: 0, y: 0, width: 64, height: 64, centerX: 32, centerY: 32 }
            ],
            frameRate: 5, //adjust frameratex
            repeat: -1 //loop the animation
        })


        gameState.rocket = this.add.sprite(rocketx, rockety, 'rocket1').setOrigin(0.5, 0.5);
        gameState.rocket.play('rocketAnim');
    



        // Add a tween to move the rocket upwards
        this.tweens.add({
            
            targets: gameState.rocket,
            y: '-=520', // move upwards by 200 pixels
            duration: 6000, // duration of the tween in milliseconds
            ease: 'Linear', // easing function
            onComplete: () => {
                //reposition the rocket at x = 400 and create a new tween to move it 
                gameState.rocket.x = 750;
        
                gameState.rocket.setFlipY(true);
                this.tweens.add({
                    targets: gameState.rocket,
                    y: '+=520', //move downwards by 700 pixels
                    duration: 6000, 
                    ease: 'Linear',
                    repeat: -1,
                    yoyo: false
                })
            }
        });



       gameState.rocket.setScale(1);
    


       // this.input.on('pointerdown', () => {
      //      this.scene.stop('StartScene');
       //     gameState.openingMusic.stop();
      //      this.scene.start('GameScene');
            //gameState.background3.setVisible(false);

            //gameState.background4.setVisible(false);


        //})



        // Initially, show only the first background
        gameState.arrow2.setVisible(false);

        this.time.addEvent({
            delay: 500,
            callback: this.switchArrow,
            callbackScope: this,
            loop: true
        });
        
    }

    preload(){

        this.load.image('rocket1', 'assets/characters/rocket1.png');
        this.load.image('rocket2', 'assets/characters/rocket2.png');
        this.load.image('rocket3', 'assets/characters/rocket3.png');
        this.load.image('menu1', 'assets/background/menu1.png');
        this.load.image('menu2', 'assets/background/menu2.png');
        this.load.image('menuExit', 'assets/background/menuExit.png');
        this.load.image('arrow1', 'assets/characters/arrow1.png');
        this.load.image('arrow2', 'assets/characters/arrow2.png');

        this.load.audio('openingMusic', 'assets/audio/openingmusic.wav');
        
    }


    update(){

        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.down)) {
            gameState.currentPositionIndex = (gameState.currentPositionIndex + 1) % gameState.arrowPositions.length;
            gameState.arrow1.y = gameState.arrowPositions[gameState.currentPositionIndex];
            gameState.arrow2.y = gameState.arrowPositions[gameState.currentPositionIndex];
            this.updateArrowFlags();
        }

        if (Phaser.Input.Keyboard.JustDown(gameState.cursors.up)) {
            gameState.currentPositionIndex = (gameState.currentPositionIndex - 1 + gameState.arrowPositions.length) % gameState.arrowPositions.length;
            gameState.arrow1.y = gameState.arrowPositions[gameState.currentPositionIndex];
            gameState.arrow2.y = gameState.arrowPositions[gameState.currentPositionIndex];
            this.updateArrowFlags();
        }
       
        
     

    if (Phaser.Input.Keyboard.JustDown(gameState.enterKey)) {
        if(gameState.arrowOption1){
            this.scene.stop('StartScene');
            gameState.openingMusic.stop();
            this.scene.start('GameScene');
        } else if(gameState.arrowOption2){
            this.scene.stop('StartScene');
            gameState.openingMusic.stop();
            this.scene.start('howToPlayScene');
        } else  if(gameState.arrowOption3){
            window.close(); //close the browser window
        }
    }
 
}
    
    /* else if (gameState.cursors.right.isDown) {
        gameState.square.setVelocityX(160);
    } else {
        gameState.square.setVelocityX(0);
    }*/



    switchArrow() {
        if (gameState.arrow1.visible) {
            gameState.arrow1.setVisible(false);
            gameState.arrow2.setVisible(true);
        } else {
            gameState.arrow1.setVisible(true);
            gameState.arrow2.setVisible(false);
        }
    }


    updateArrowFlags() {
        gameState.arrowOption1 = gameState.currentPositionIndex === 0;
        gameState.arrowOption2 = gameState.currentPositionIndex === 1;
        gameState.arrowOption3 = gameState.currentPositionIndex === 2;
    }

}
