import gameState from './gameState.js';
import GameMap from './GameMap.js';




export default class Player {
    constructor(scene, playerImageKey, plant, spawnPoint) {
        this.scene = scene;
        this.playerImageKey = playerImageKey;
        this.plant = plant;
        this.nearPlant = false;


        this.cursors = scene.input.keyboard.createCursorKeys();
        this.createPlayer(spawnPoint);
        console.log("player sprite created at:" + spawnPoint.x, spawnPoint.y);
        scene.add.existing(this.player);
    }

    update() {

        if (this.player) {


            if(!gameState.gamePaused){

            
            // Reset velocity to 0 at the start of each frame
            this.player.setVelocity(0);
    
            // Check for movement input and set velocity accordingly
            if (this.cursors.left.isDown) {
                this.player.setVelocityX(-200); // Move left
                this.player.anims.play('moveLeft', true);
                this.lookLeft = true;
                this.lookRight = false;
                this.lookUp = false;
                this.lookDown = false;
            } 
            if (this.cursors.right.isDown) {
                this.player.setVelocityX(200); // Move right
                this.player.anims.play('moveRight', true);
                this.lookRight = true;
                this.lookLeft = false;
                this.lookUp = false;
                this.lookDown = false;
            } 
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-200); // Move up
                this.player.anims.play('moveUp', true);
                this.lookUp = true;
                this.lookDown = false;
                this.lookRight = false;
                this.lookLeft = false;
            } 
    
            if (this.cursors.down.isDown) {
                this.player.setVelocityY(200); // Move down
                this.player.anims.play('moveDown', true);
                this.lookDown = true;
                this.lookUp = false;
                this.lookLeft = false;
                this.lookRight = false;
            }
    
            // Stop animations if no movement keys are pressed
            if (!this.cursors.left.isDown && !this.cursors.right.isDown && 
                !this.cursors.up.isDown && !this.cursors.down.isDown) {
                if (this.lookDown) {
                    this.player.anims.play('idle', true);
                } else if (this.lookUp) {
                    this.player.anims.play('idleUp', true);
                } else if (this.lookLeft) {
                    this.player.anims.play('lookLeftIdle', true);
                } else if (this.lookRight) {
                    this.player.anims.play('lookRightIdle', true);
                }
            }


               
        }
    }

    }
    createPlayer(spawnPoint){
        
        this.player = this.scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, this.playerImageKey);
        this.player.setCollideWorldBounds(true);
        this.player.setScale(1.5);
        this.player.setSize(15,15);
        this.player.setDepth(1);


        this.scene.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 0, end: 0}),
            frameRate: 10,
            repeat: -1
         });
    
         this.scene.anims.create({
            key: 'idleUp',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 8, end: 8}),
            frameRate: 10,
            repeat: -1
         });
    
         this.scene.anims.create({
            key: 'lookLeftIdle',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 6, end: 6}),
            frameRate: 10,
            repeat: -1
         });
    
         this.scene.anims.create({
            key: 'lookRightIdle',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 4, end: 4}),
            frameRate: 10,
            repeat: -1
         });
    
    
        this.scene.anims.create({
           key: 'moveRight',
           frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 4, end: 5}),
           frameRate: 10,
           repeat: -1
        });
    
        this.scene.anims.create({
            key: 'moveLeft',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 6, end: 7}),
            frameRate: 10,
            repeat: -1
         });
    
         this.scene.anims.create({
            key: 'moveUp',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 11, end: 12}),
            frameRate: 10,
            repeat: -1
         });
    
         this.scene.anims.create({
            key: 'moveDown',
            frames: this.scene.anims.generateFrameNumbers(this.playerImageKey, { start: 1, end: 2}),
            frameRate: 10,
            repeat: -1
         });
    
    }


    addCurrency(amount){
        gameState.playerCurrency += amount;
        console.log("You get " + amount + " coins.");
    }

    spendCurrency(amount){
        if(this.currency >= amount){
            this.currency -= amount;
            console.log("You spent: " + amount + " coins.");
            return true; //successful

        } else{
            console.log("You don't have enough money.");
            return false; //failed

        }
    }

    setCurrency(){
        gameState.playerCurrency = gameState.playerCurrency;
    }

    getCurrency(){
        return gameState.playerCurrency;
    }
        
}