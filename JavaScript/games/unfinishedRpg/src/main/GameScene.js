import Character from './character.js';
import inventory from './inventory.js';
import equipment from './equipment.js';
import Item from "./item.js";

let currentLine1 = 0;

const bodwinLines = [
    "Hello. It seems that I am having trouble \nremembering my name...",
    "Could you please find me some food?"
];

class GameScene extends Phaser.Scene{
    
    constructor(){
        super({key: 'GameScene'});
    }




    preload(){
        this.load.image("tiles", "games/rpg/src/assets/map/tilesA.png");
        this.load.image("tilesBuilding", "games/rpg/src/assets/map/buildings.png");
        this.load.image("meat", "games/rpg/src/assets/items/meat1.png");
        this.load.image("sword", "games/rpg/src/assets/items/sword1.png");
         
        this.load.spritesheet("player", "games/rpg/src/assets/characters/player1.png", {
            frameWidth: 32,
            frameHeight: 32
        }); 

        this.load.spritesheet("bodwin", "games/rpg/src/assets/characters/bodwin.png", {
            frameWidth: 32,
            frameHeight: 32
        }); 
       
        this.load.tilemapTiledJSON('map', 'games/rpg/src/assets/map/map1.json');     

    }

    create(){

        

        gameState.hero = new Character('Aeon');

        this.inventory = this.scene.get('inventory');
        
        this.equipmentHandler = new equipment(this.inventory, gameState.hero);  // Initialize the equipment object
        

        this.cursors = this.input.keyboard.createCursorKeys();
       
        this.createMap();
        this.createPlayer();
        this.fixCamera();
        this.createBodwin();
        this.createItems();
        this.showStats();
        this.checkCoords();

        this.scene.launch('inventory');
        
        this.physics.add.overlap(this.player, this.bodwin, function() {       
            gameState.nearBodwin = true;            
        });

        




        this.input.keyboard.on('keydown-D', () => {
            console.log(`Player position: (${this.player.x}, ${this.player.y})`);
            console.log(`Items:`, this.items);
            console.log("inventory:" + gameState.hero.inventory);
        });


    }

    update(){ 
       // this.equipmentHandler.updateEquipment();
        this.player.setVelocity(0);      
    
       if(gameState.active === true){

            if(this.cursors.left.isDown){
                this.player.setVelocityX(-200);
            }
        
            if(this.cursors.right.isDown){
                this.player.setVelocityX(200);
                //this.player.play('player_walk_right', true);
            }
        
            if(this.cursors.up.isDown){
                this.player.setVelocityY(-200);
            }
        
            if(this.cursors.down.isDown){
                this.player.setVelocityY(200);
            }

            if(this.player && this.sword){
                this.sword.x = this.player.x;
                this.sword.y = this.player.y - 10;
            }

        }

        this.playerSpeakToBodwin();

        }           
         
   
    createMap(){
        const map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32}); //create the map 

        const tileset1 = map.addTilesetImage("tile_set1", "tiles"); //add the tileset image to the map
        const tileset2 = map.addTilesetImage('buildings', 'tilesBuilding');  
        const tilesets = [tileset1, tileset2];
        
        this.npcLayer = map.getObjectLayer("npclayer"); //get the object layer from the map

        this.groundLayer = map.createLayer("groundlayer", tilesets, 0, 0);
        this.treeLayer = map.createLayer("treelayer", tilesets, 0, 0);
        this.buildingLayer = map.createLayer("buildinglayer", tilesets, 0,0 );

    }

    createPlayer(){

        if(!this.player){
            this.npcLayer.objects.forEach(obj => {
                if(obj.name === "player"){
                    console.log("Spawning player at: ", obj.x, obj.y);

                    //CREATE PLAYER SPRITE
                    this.player = this.physics.add.sprite(obj.x, obj.y, "player", 0);
                    this.player.setCollideWorldBounds(true);
                    this.player.setSize(20,20);
                    this.player.setDepth(0);
                    this.player.setOrigin(0.5, 1);
                    this.player.setInteractive();  

                    //CREATE SWORD IMAGE AND POSITION IT RELATIVE TO PLAYER
                    this.sword = this.physics.add.image(this.player.x, this.player.y - 10, "sword");
                    this.sword.setSize(20,20);
                    this.sword.setOrigin(0.5,1);
                    this.sword.setDepth(2);
                    this.sword.setScale(0.5);
                    


                }            
            })
        }
    }

    checkCoords(){
        this.input.keyboard.on('keydown-G', ()=>{
            console.log("container: " + this.playerContainer.x, this.playerContainer.y); // Check container position
                    console.log("player: " + this.player.x, this.player.y); // Check player position
                    console.log("sword:" + this.sword.x, this.sword.y); // Check sword position
        })
    }

    createBodwin(){
        if(!this.bodwin){
            this.npcLayer.objects.forEach(obj => {
                if(obj.name === "bodwin"){
                    console.log("Spawning bodwin at: ", obj.x, obj.y);

                    this.bodwin = this.physics.add.sprite(obj.x, obj.y, "bodwin", 4);
                    this.bodwin.setCollideWorldBounds(true);
                    this.bodwin.setSize(30,30);
                    this.bodwin.setDepth(0);
                    this.bodwin.setOrigin(0.5, 1);
                    this.bodwin.setImmovable();
                }

              /*  this.anims.create({
                    key: 'bodwin_idle',
                    frames: this.anims.generateFrameNumbers('bodwin', { start: 4, end: 4 }),
                    frameRate: 10,
                    repeat: -1
                });*/
            })
        }
    }

    createMeat(){
        this.npcLayer.objects.forEach(obj => {
            if(obj.name === "meat1"){
                this.meat1 = this.physics.add.sprite(obj.x, obj.y, "meat1");
                this.meat1.setOrigin(0,1);
                this.meat1.setScale(0.5);
                this.meat1.setImmovable();
                this.meat1.setSize(32,32);
                this.meat1.setOffset(0);
            }
        })
       
    }

    fixCamera(){
    //CAMERA CODE    
        this.cameras.main.setZoom(2); // Zoom in by a factor of 2
        this.cameras.main.startFollow(this.player); // Follow the player sprite
    }

    createDialogBox(text){
        let width = 300; 
        let height = 50;

        let dialogBoxX = config.width/3;
        let dialogBoxY = config.height/1.6;


            //create graphics object for a dialog box

            let graphics = this.add.graphics();
            graphics.fillStyle(0x000000, 0.8);
            graphics.fillRoundedRect(dialogBoxX, dialogBoxY, width, height, 10);

            //create text object
            let dialogText = this.add.text(dialogBoxX + 10, dialogBoxY + 10, text, {
                fontFamily: 'Georgia',
                fontSize: '14px',
                color: '#ffffff',
                WordWrap: { width: width - 40}
            });

            this.dialogContainer = this.add.container(0, 0, [graphics, dialogText]);
            this.dialogContainer.setDepth(2);
            this.dialogContainer.setScrollFactor(0);
            this.dialogContainer.setVisible(true);
            this.dialogText = dialogText;

    //if dialog text already exists, update the text...

        

    }

    resetDialog(){
        currentLine1 = 0;
        if(this.dialog){
            this.dialog.setText(dialogText1[currentLine]);
            this.dialog.setVisible(true);
        }
    }

    playerSpeakToBodwin(){

        if(this.physics.overlap(this.player, this.bodwin)){
            gameState.nearBodwin = true;

        } 
        else{
            gameState.nearBodwin = false;
        }

       
            if(gameState.nearBodwin && this.cursors.space.isDown){

                let dialogBoxScene = this.scene.get("dialogBoxScene");

                    this.scene.pause('GameScene');
                    this.scene.launch('dialogBoxScene');        
            } 

        if(!this.physics.overlap(this.player, this.bodwin)){
            gameState.nearBodwin = false;    
        }
    }

    showStats(){
        this.input.keyboard.on('keydown-P', () =>{
                    
                    this.equipmentHandler.updateEquipment();
                    gameState.hero.showPlayerStats();
        })
        }
    
    createItems() {

        this.items = [];
        this.npcLayer.objects.forEach((obj) => {
            console.log(obj);
            if (obj.type === "item") {  // Check if it's an item in Tiled
                
                const item = new Item(this, obj.x, obj.y, obj.name, obj.name);
                this.items.push(item); //store item for later use
               
                console.log("items added: ", obj.name);

            }
        });
    }


    addToInventory(itemName){
       if(!gameState.hero.inventory){
        gameState.hero.inventory =[];
       }
       if(gameState.hero.inventory.length < gameState.hero.inventorySize){
            gameState.hero.inventory.push(itemName);
            console.log('Added ${itemName} to inventory:', gameState.hero.inventory);
       }
    }
}

export const gameState = {
        active: true,
        nearBodwin: false,
        level1: true,
        level2: false,
        hero: null,
        invOpen: false,
        statsOpen: false
      

};


export default GameScene;