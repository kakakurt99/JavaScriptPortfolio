const gameState = {
    score: 0,
    timer: 0,
}; 

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
    


    this.load.image('bg1', 'assets/background/bg1.png');
    this.load.image('bg2', 'assets/background/bg2.png');
    this.load.image('bg3', 'assets/background/bg3.png');

    
    this.load.image('enemy1', 'assets/enemies/enemy1.png');
    this.load.image('block1', 'assets/characters/block1.png');

   // this.load.atlas('player', 'animated/player.png', 'animated/player.json');
    this.load.atlas('playerDeath', 'animated/pExplode.png', 'animated/pExplode.json');

    this.load.atlas('player', 'animated/littleguy.png', 'animated/littleguy.json');

    this.load.audio('backgroundMusic', 'assets/audio/arcade1.mp3');
    this.load.audio('deathSFX', 'assets/audio/deathExplosion.wav');
    
}

 create(){

//this.playerScore();
this.createPlayer();
this.createParallaxBackgrounds();
this.playerCamera();


  



    gameState.block1 = this.physics.add.image(-200, config.height-50, 'block1');
    gameState.block1.setScale(.2); //change the size of the image
    gameState.block1.setImmovable(true); //set the block to be immovable

    //ADD TEXT FOR THE SCORE
    

    //PLATFORM 

    // Create a graphics object to draw the platform
    const graphics = this.add.graphics();
    graphics.fillStyle(0x1BD1F1, 1); // Set the fill color to green
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


                //pause 
                this.cameras.main.shake(240, .01, false);
                //this.scene.stop('GameScene');
                


                //setTimeout(function(){
               //     this.scene.start('GameOverScene');  //stop the game and start the GameOverScene
               // }, 2000);
                
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
        },
        loop: true
        });
  


//CREATE BOX FOR THE SCORE
graphics.fillStyle(0xffffff, 1); //color of the box (black 05 transparency)
graphics.fillRect(45, 165, 150, 25); //draw rect at x,y, width, height
graphics.setDepth(0);




    //GAME TIMER

gameState.gameTimer = this.add.text(50, 170, '' + gameState.timer, { FontSize: '40px', fill: '#000000' });
gameState.gameTimer.setDepth(1);

this.time.addEvent({
    delay: 100,
    callback:() =>{
        gameState.timer += 1;
        console.log(gameState.timer);
        gameState.gameTimer.setText('Score: ' + gameState.timer);
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

        backgroundMusic.stop();
        deathSFX.play();

        
        this.cameras.main.shake(240, .01, false);
        this.cameras.main.fadeOut(500);

        //delay 
        this.time.delayedCall(240, () => {
            // This runs after 240ms (same duration as the shake)
            // You can change this number if you want a delay after the shake ends
          
            console.log("Shake finished, now doing something else!");
          
            // For example, fade out the camera
             
             this.scene.stop();
             this.scene.start('GameOverScene');
          });
        
      //  this.scene.start('GameOverScene');  //stop the game and start the GameOverScene

     //   gameState.player.on('animationcomplete', () => {
    //        this.scene.stop('GameScene');

     //       this.scene.start('GameOverScene');
     //   });
//

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

    // Log the size of the image
    console.log('Image width:', gameState.player.displayWidth);
    console.log('Image height:', gameState.player.displayHeight);
    console.log('Starting location:', gameState.startingLocation);

    // Create your cursor object below
    gameState.cursors = this.input.keyboard.createCursorKeys();


    
}

createPlayer(){
    gameState.enemy1 = this.physics.add.image(-50, config.height - 50, 'enemy1');
    gameState.enemy1.setScale(.1); //change the size of the image

     
    // Define the animation
        gameState.player = this.physics.add.sprite(100, 100, 'player');
        gameState.player.setScale(1.5);
        gameState.player.setCollideWorldBounds(true);
        gameState.player.setDepth(3);

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

    gameState.bg1.tilePositionX -= this.scrollSpeed * 0.1;
    gameState.bg2.tilePositionX -= this.scrollSpeed * 0.3; // slower speed for parallax effect
    gameState.bg3.tilePositionX -= this.scrollSpeed * 1;


}

playerScore(){
     //TIMER FOR SCORE
     gameState.playerScore = this.add.text(10,10, 'SCORE: ' + gameState.score, { 
        FontSize: '40px', 
        fill: '#000000',
     }).setDepth(1);

     this.time.addEvent({
         delay: 100,
         callback:() =>{
             gameState.score += 1;
             gameState.scoreText.setText('SCORE: ' + gameState.score);
             console.log(gameState.score);
         },
         loop: true
         });
}

incrementScore(){
    this.playerScore += 1;
}


playerCamera(){
        //CAMERA CODE    
            this.cameras.main.setZoom(1.2); // Zoom in by a factor of 2
            this.cameras.main.centerOn(340, 290);
}


createParallaxBackgrounds(){
    this.scrollSpeed = -1.5; // negative for leftward scroll
    gameState.bg1 = this.add.tileSprite(0, 0, config.width, config.height, 'bg1').setOrigin(0, 0);
    gameState.bg2 = this.add.tileSprite(0, 0, config.width, config.height, 'bg2').setOrigin(0, 0);
    gameState.bg3 = this.add.tileSprite(0, 0, config.width, config.height, 'bg3').setOrigin(0, 0);

    gameState.bg1.setOrigin(0,0);
    gameState.bg2.setOrigin(0,0);
    gameState.bg3.setOrigin(0,0);

    const game_width = parseFloat(gameState.bg3.getBounds().width)
    gameState.width = game_width;
    const window_width = config.width

    const bg1_width = gameState.bg1.getBounds().width
    const bg2_width = gameState.bg2.getBounds().width
    const bg3_width = gameState.bg3.getBounds().width

    // Set the scroll factor for bg1, bg2, and bg3 here!

    //gameState.bg1.setScrollFactor((bg1_width - window_width) / (game_width - window_width));
 
    //gameState.bg2.setScrollFactor((bg2_width - window_width) / (game_width - window_width));


}






/*

if score 0-500 

timer -> spawn enemy 200 secs


else if score 501-1000

timer -> spawn enemy 150 secs


else if score 1001-1500 

timer-> spawn enemy 100 secs



*/
}