const gameState = {
    score: 0,
    timer: 0,
}; 
const canvasHeight = 500; //canvas height in pixels 
const canvasWidth = 800; //canvas width in pixels 

class GameScene extends Phaser.Scene {  

constructor(){
    super({key: 'GameScene'});  //set the key of the scene to 'GameScene'
}


 preload(){
    this.load.image('spacebg1', 'assets/background/spacebganimated/spacebg (1).png');
    this.load.image('spacebg2', 'assets/background/spacebganimated/spacebg (2).png');
    this.load.image('spacebg3', 'assets/background/spacebganimated/spacebg (3).png');
    this.load.image('spacebg4', 'assets/background/spacebganimated/spacebg (4).png');
    this.load.image('spacebg5', 'assets/background/spacebganimated/spacebg (5).png');
    this.load.image('spacebg6', 'assets/background/spacebganimated/spacebg (6).png');
    this.load.image('spacebg7', 'assets/background/spacebganimated/spacebg (7).png');
    this.load.image('spacebg8', 'assets/background/spacebganimated/spacebg (8).png');
    this.load.image('spacebg9', 'assets/background/spacebganimated/spacebg (9).png');
    this.load.image('spacebg10', 'assets/background/spacebganimated/spacebg (10).png');
    //this.load.image('spacebg11', 'assets/background/spacebganimated/spacebg (11).png');
    
    
    this.load.image('enemy1', 'assets/enemies/enemy1.png');
    this.load.image('block1', 'assets/characters/block1.png');

   // this.load.atlas('player', 'animated/player.png', 'animated/player.json');
    this.load.atlas('playerDeath', 'animated/pExplode.png', 'animated/pExplode.json');

    this.load.atlas('player', 'animated/littleguy.png', 'animated/littleguy.json');

    this.load.audio('backgroundMusic', 'assets/audio/arcade1.mp3');
    this.load.audio('deathSFX', 'assets/audio/deathExplosion.wav');
    
}

 create(){
this.anims.create({
    key: 'backgroundAnim',
    frames: [
        { key: 'spacebg1'},
        { key: 'spacebg2'},
        { key: 'spacebg3'},
        { key: 'spacebg4'},
        { key: 'spacebg5'},
        { key: 'spacebg6'},
        { key: 'spacebg7'},
        { key: 'spacebg8'},
        { key: 'spacebg9'},
        { key: 'spacebg10'}
        //{ key: 'spacebg11'}

    ],
    frameRate: 5, //adjust framerate
    repeat: -1 //loop the animation
})


 //gameState.background1 =  this.add.image(0, 0, 'background1').setOrigin(0, 0); 
//gameState.background1.displayWidth = config.width;
//gameState.background1.displayHeight = config.height;

//gameState.background2 = this.add.image(0, 0, 'background2').setOrigin(0, 0); 
//gameState.background2.displayWidth = config.width;
//gameState.background2.displayHeight = config.height;

gameState.background3 = this.add.image(0, 0, 'spacebg').setOrigin(0,0);
gameState.background3.displayWidth = config.width;
gameState.background3.displayHeight = config.height;

const background = this.add.sprite(config.width / 2, config.height / 2, 'spacebg1');
background.play('backgroundAnim');

// Initially, show only the first background
//gameState.background2.setVisible(false);
//gameState.background1.setVisible(false);

    
    gameState.enemy1 = this.physics.add.image(-50, canvasHeight-50, 'enemy1');
    gameState.enemy1.setScale(.1); //change the size of the image

     
    // Define the animation
        gameState.player = this.physics.add.sprite(100, 100, 'player');
    
        gameState.player.setScale(1.5);
        gameState.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'running',
            frames: this.anims.generateFrameNames('player',{ start: 1, end: 3}),
            frameRate: 12,
            repeat: -1
        });

        

        this.anims.create({
            key: 'jump',
            frames: [ {key: 'player', frame: 4 },
            {key: 'player', frame: 5},
            {key: 'player', frame: 6, duration: 600},
            {key: 'player', frame: 7 },
            {key: 'player', frame: 8 },
            {key: 'player', frame: 9 },
            {key: 'player', frame: 10 },
            {key: 'player', frame: 11 }
            ],
            frameRate: 12,
            repeat: 0
        });

    gameState.player.play('running');



    gameState.block1 = this.physics.add.image(-200, canvasHeight-50, 'block1');
    gameState.block1.setScale(.2); //change the size of the image
    gameState.block1.setImmovable(true); //set the block to be immovable

    //ADD TEXT FOR THE SCORE
    

    //PLATFORM 

    // Create a graphics object to draw the platform
    const graphics = this.add.graphics();
    graphics.fillStyle(0x00ff00, 1); // Set the fill color to green
    graphics.fillRect(0, (config.height), config.width+500, 10); // Draw a rectangle (x, y, width, height)

    // Create a static physics body for the platform
    const platform = this.add.rectangle(config.width/2, config.height, config.width, 2); // Create a rectangle object
    this.physics.add.existing(platform, true); // Add physics to the rectangle and make it static

    //adjust the size and position of the physics body 
    platform.body.setSize(config.width+500, 2); // Set the size of the physics body 
    platform.body.setOffset(0, 0); // Set the offset of the physics body

    //COLLISIONS BETWEEN ENEMY AND PLATFORM
    this.physics.add.collider(gameState.enemy1, platform);   //add a collider between the enemy and the platform
    
    //COLLISION BETWEEN SQUARE AND PLATFORM 

    gameState.player.setCollideWorldBounds(true);   //set the square to collide with the world bounds
    this.physics.add.collider(gameState.player, platform, () => {
        gameState.isOnGround = true; // Set the flag to true when the square is colliding with the platform
    });   



    //BLOCK collision
    //gameState.block1.setCollideWorldBounds(true);   //set block1 to collide with the world bounds
    this.physics.add.collider(gameState.player, gameState.block1, () => {
        console.log('block hit');
        gameState.isOnGround = true;
    });


    //blocks group

    gameState.blocks = this.physics.add.group();   //create a group for blocks
     //COLLISION BETWEEN SQUARE AND BLOCK
     this.physics.add.collider(gameState.player, gameState.blocks, (player, block) => {
        console.log('Collision with block');
        
            gameState.isOnGround = true; // Set the flag to true when the square is colliding with the top of the block
            if (player.body.touching.right && block.body.touching.left) {
                gameState.score = 0;
                gameState.timer = 0;
                backgroundMusic.stop();
                this.scene.stop('GameScene');
                this.scene.start('GameOverScene');  //stop the game and start the GameOverScene
            }
    });
    


    //COLLISION BETWEEN SQUARE AND ENEMY


    // Calculate starting location
    gameState.playerHeight = gameState.player.displayHeight;
    gameState.startingLocation = 500 - ((gameState.playerHeight / 2));

    // Set position of the square
    gameState.player.y = gameState.startingLocation;

    

 

    //TIMER FOR SCORE
    gameState.scoreText = this.add.text(10,10, 'SCORE: ' + gameState.score, { FontSize: '40px', fill: '#000000' });

    this.time.addEvent({
        delay: 100,
        callback:() =>{
            gameState.score += 1;
            gameState.scoreText.setText('SCORE: ' + gameState.score);
            //console.log('SCORE: '+ gameState.score);
        },
        loop: true
        });
  




    //GAME TIMER

gameState.gameTimer = this.add.text(100,150, '' + gameState.timer, { FontSize: '40px', fill: '#ffffff' });

this.time.addEvent({
    delay: 100,
    callback:() =>{
        gameState.timer += 1;
        this.hideGameTimer();
       // console.log('TIME: '+ gameState.timer);
    },
    loop: true
    });


    //enemies group
    
    gameState.enemies = this.physics.add.group();   //create a group for enemies
   
    


    //COLLISIONS
    this.physics.add.collider(gameState.blocks, platform);

    this.physics.add.collider(gameState.enemies, platform);

    this.physics.add.collider(gameState.player, gameState.enemies, () => {
        gameState.score = 0;
        gameState.timer = 0;


       // gameState.player.setTexture('playerDeath');
        //gameState.player.play('playerExplode');

        backgroundMusic.stop();
        deathSFX.play();
        //timer delay 
       //play square explosion animation
        
        this.scene.start('GameOverScene');  //stop the game and start the GameOverScene


        gameState.player.on('animationcomplete', () => {
            this.scene.stop('GameScene');

            //timer
            //make sprite go up
            //end scene

            this.scene.start('GameOverScene');
        });


    });

    //timer for spawning enemies

    this.time.addEvent({
        delay: 2500,
        callback: this.spawnEnemiesBasedOnTimer,
        callbackScope: this,
        loop: true  //spawn an enemy every 2000 milliseconds
    });

    const backgroundMusic = this.sound.add('backgroundMusic', {volume: 0.1, loop: true});
    backgroundMusic.play({loop: true});

    const deathSFX = this.sound.add('deathSFX', { volume: 0.1, loop: false });

    // Add a timed event to switch backgrounds every 5 seconds
  /* this.time.addEvent({
        delay: 1000,
        callback: this.switchBackground,
        callbackScope: this,
        loop: true
    });
*/
    // Log the size of the image
    console.log('Image width:', gameState.player.displayWidth);
    console.log('Image height:', gameState.player.displayHeight);
    console.log('Starting location:', gameState.startingLocation);

    // Create your cursor object below
    gameState.cursors = this.input.keyboard.createCursorKeys();


    
}



spawnEnemiesBasedOnTimer(){
    if(gameState.timer > 0 && gameState.timer < 100){
        this.spawnEnemy();
    } else if (gameState.timer >= 100 && gameState.timer <= 200){
        this.spawnEnemy();
        this.spawnEnemyNextTo();
    } else if (gameState.timer >= 200 && gameState.timer <= 300){
        this.spawnEnemy();
    } else if (gameState.timer > 300 && gameState.timer < 400){
        this.spawnEnemy();
        setTimeout(() => {
            this.spawnEnemy();
            this.spawnEnemyNextTo();
        }, 900);

    } else if(gameState.timer > 400 && gameState.timer < 500){
        this.spawnEnemy();
    } else if(gameState.timer > 500 && gameState.timer < 700){
        this.spawnEnemy();
        setTimeout(() => {
            this.spawnEnemy();
            
        }, 350);
    } else if(gameState.timer > 700 && gameState.timer < 800){
        this.spawnBlockGround();
        setTimeout(() => {
            this.spawnEnemy();
        }, 150);
    }else if(gameState.timer > 800 && gameState.timer < 850){
        this.spawnBlockGround();
        setTimeout(() => {
            this.spawnBlock1();
        }, 1000);

} else if(gameState.timer >= 850 && gameState.timer <= 900){
    this.spawnEnemy();
    setTimeout(() => {
        this.spawnEnemy();
        this.spawnEnemyNextTo();
    }, 1000);
}
else if(gameState.timer > 900 && gameState.timer <= 1000){
    this.spawnBlockGround();
    setTimeout(() => {
        this.spawnBlock1();
    }, 1000);
} else if (gameState.timer >= 1000 && gameState.timer < 1050){
    this.spawnBlockGround();
    setTimeout(() => {
        
        this.spawnBlock2();
    }, 1000);
}
}

spawnBlockGround(){
    console.log('spawning block');
    const xCoord = config.width + 75;   //set the x coordinate to the width of the canvas
    const yCoord = config.height-50;   //set the y coordinate to a random number between 0 and the height of the canvas
    const block = gameState.blocks.create(xCoord, yCoord, 'block1');   //create a new enemy at the x and y coordinates with the 'enemy' image
    block.setScale(0.25);   //set the scale of the enemy
    block.setVelocityX(-200);   //set the velocity of the enemy to -100

}
spawnBlock1(){
    console.log('spawning block');
    const xCoord = config.width + 75;   //set the x coordinate to the width of the canvas
    const yCoord = config.height-50;   //set the y coordinate to a random number between 0 and the height of the canvas
    const block = gameState.blocks.create(xCoord, yCoord, 'block1');   //create a new enemy at the x and y coordinates with the 'enemy' image
    block.setScale(0.25, 0.5);   //set the scale of the enemy
    block.setVelocityX(-200);   //set the velocity of the enemy to -100

}
spawnBlock2(){
    console.log('spawning block');
    const xCoord = config.width + 75;   //set the x coordinate to the width of the canvas
    const yCoord = config.height-50;   //set the y coordinate to a random number between 0 and the height of the canvas
    const block = gameState.blocks.create(xCoord, yCoord, 'block1');   //create a new enemy at the x and y coordinates with the 'enemy' image
    block.setScale(0.25, 0.75);   //set the scale of the enemy
    block.setVelocityX(-200);   //set the velocity of the enemy to -100
    block.body.setAllowGravity(false);

}

spawnEnemy(){
    console.log('Spawning enemy');
    const xCoord = config.width+75;   //set the x coordinate to the width of the canvas
    const yCoord = config.height-80;   //set the y coordinate to a random number between 0 and the height of the canvas
    const enemy = gameState.enemies.create(xCoord, yCoord, 'enemy1');   //create a new enemy at the x and y coordinates with the 'enemy' image
    enemy.setScale(0.15);   //set the scale of the enemy 
    enemy.setVelocityX(-200);   //set the velocity of the enemy to -200
}

spawnEnemyNextTo(){
    console.log('Spawning enemy next to the previous one');
    const xCoord = config.width + 95;   //set the x coordinate to the width of the canvas + 50 pixels
    const yCoord = config.height - 80;   //set the y coordinate to a random number between 0 and the height of the canvas
    const enemy = gameState.enemies.create(xCoord, yCoord, 'enemy1');   //create a new enemy at the x and y coordinates with the 'enemy1' image
    enemy.setScale(0.15);   //set the scale of the enemy 
    enemy.setVelocityX(-150);   //set the velocity of the enemy to -100
}


deleteEnemy(){
    if (gameState.enemies < 0){
        gameState.enemies.destroy();
    }
}


level2(){
    
    if(gameState.timer > 50 && gameState.timer < 200){
        console.log('level up to level 2');
        this.spawnEnemy();
        gameState.enemies.setVelocityX(0);
    }
}
level3(){
    
    if(gameState.timer > 250 && gameState.timer < 500){
        console.log('level up to level 2');
        this.spawnEnemy();
        this.spawnEnemy();
        gameState.enemies.setVelocityX(0);
    }
}

switchBackground() {
    if (gameState.background1.visible) {
        gameState.background1.setVisible(false);
        gameState.background2.setVisible(true);
    } else {
        gameState.background1.setVisible(true);
        gameState.background2.setVisible(false);
    }
}


hideGameTimer(){
    gameState.gameTimer.setVisible(false);
}


 update(){

    const jumpSpeed = -250; //set the jump speed to 400

    /*if (gameState.cursors.left.isDown) {
        gameState.square.setVelocityX(-160);
    } else if (gameState.cursors.right.isDown) {
        gameState.square.setVelocityX(160);
    } else {
        gameState.square.setVelocityX(0);
    }*/

    if (gameState.cursors.up.isDown && gameState.isOnGround) {
        //if button is pushed then the square will jump at a velocity of 160
        //pushed = true until square is on the ground
        gameState.player.setVelocityY(jumpSpeed);
        gameState.player.play('jump');
        gameState.isOnGround = false;
        

    } /* else if (!gameState.cursors.up.isDown) {
        gameState.square.setVelocityY(0);
    }*/

    if(gameState.player.body.velocity.y ===0){
        gameState.isOnGround = true;
       
    } else {
        gameState.onGround = false;
    }
 
    if(gameState.isOnGround){

       gameState.player.play('running', true);
       
   }


}

}