import Item from './Item.js';
import Plants from './plants.js';
import inventory from './inventory.js';
import GameMap from './GameMap.js';


const gameState = {
    playerX: 320,
    playerY: 300,
    attacking: false,
    nearPlant: false,
    plantFrame: 1
}

let myPlants = new Plants();
//let myInventory = new inventory();
let myItems = new Item();

let seedItem = {
    name: "coffee seed",
    type: "seed",
    quality: "premium",
    amount: 0,
    value: 10,
    imageKey: "coffeeseed"
};


let coffeeBean = {
    name: "coffee bean",
    type: "bean",
    quality: "premium",
    amount: 0,
    value: 100,
    imageKey: "coffeebean"
};

class main extends Phaser.Scene{   
interactables = [];
    constructor(){
        super({key: 'main'});
        this.myInventory = new inventory();
    }

async preload(){

this.load.image("tilesAKey", "../assets/map/tilesA.png");
this.load.image("taraHouseKey", "../assets/map/house1.png");
this.load.image("slotImage", "../assets/invSlot2.png");
this.load.image("extrasKey", "../assets/map/signpost1.png");
this.load.tilemapTiledJSON('forestMap', '../assets/map/coffeeQuest.json');


this.load.image('coffeeseed', '../assets/coffeeSeed.png', { frameWidth: 16, frameHeight: 16});
this.load.image('coffeebean', '../assets/coffeebean.png', { frameWidth: 16, frameHeight: 16});
this.load.spritesheet("plant", "../assets/coffeeplant1.png", { frameWidth: 16, frameHeight: 32});
this.load.spritesheet("playerSprite", "../assets/newnpc.png", {
    frameWidth: 32,
    frameHeight: 32

});
}

async create(){
//create and load crops from database
await this.loadCropData(); //wait until crops data has loaded

//when crop data is available, continue scene setup
if(this.crops){
    console.log('crops are ready:', this.crops);
} else {
    console.log("failed to load crops data.");
}

//create the map object and pass the keys to the GameMap constructor
this.myMap = new GameMap(this, 'forestMap', [
    { nameInTiled: 'tilesA', keyInPhaser: 'tilesAKey' },
    { nameInTiled: 'house1', keyInPhaser: 'taraHouseKey' },
    { nameInTiled: 'extras', keyInPhaser: 'extrasKey' }
]);



//this.add.image(100, 580, "slotImage").setScale(1);
this.createPlayer();
this.createPlant();
console.log("this: " + this.myMap);



//create inventory GUI on start
this.myInventory = new inventory(this, "slotImage");
this.myInventory.createInventoryGUI(this);

//camera on player
this.cameras.main.startFollow(this.player);
this.cameras.main.setBounds(0,0, this.myMap.widthInPixels, this.myMap.heightInPixels);
this.cameras.main.setZoom(1.5);
this.cameras.main.roundPixels = true;


//Create the cursor keys object
this.cursors = this.input.keyboard.createCursorKeys();

this.input.keyboard.on('keydown-SPACE', () => {
    if(gameState.nearPlant){
        console.log("attempting to plant seeds or harvest crops...");
        this.plantSeedAction();
        this.harvestPlantAction();
    }
});

this.input.keyboard.on('keydown-E', () => {
    this.myInventory.addItem(seedItem);

    const index = this.myInventory.inventoryItems.indexOf(seedItem);
 //   console.log(index);
 //   console.log(this.myInventory);
})


this.input.keyboard.on('keydown-I', () => {
    this.myInventory.listItems();
})


//create the plant instance with a growth time. 
    this.newPlant = new Plants("Coffee Plant", seedItem, 500, 0);
    this.newPlant.assignSprite(this.plant);


    const house = this.physics.add.staticGroup();
        house.create(200, 300, 'taraHouseKey'); // Position and texture of the object

        this.physics.add.collider(this.player, house, () => {
    console.log("Collision with house detected!");
});

}

update(){

    if (this.player) {
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
           // Check if the player is overlapping with the plant in the update loop
           if (this.physics.overlap(this.player, this.plant)) {
            if (!gameState.nearPlant) {
                gameState.nearPlant = true;
                console.log("Player is near the plant");
            }
        } else {
            if (gameState.nearPlant) {
                gameState.nearPlant = false;
                console.log("Player is no longer near the plant");
            }
        }
    }
    
}

createPlayer(){
    
    
    const spawnPoint = this.myMap.getSpawnPoint('PlayerSpawn');
    this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, "playerSprite");
    this.player.setScale(1.5);
    this.player.setSize(50,50);
    this.player.setDepth(1);
    
    this.anims.create({
        key: 'idle',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 0, end: 0}),
        frameRate: 10,
        repeat: -1
     });

     this.anims.create({
        key: 'idleUp',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 8, end: 8}),
        frameRate: 10,
        repeat: -1
     });

     this.anims.create({
        key: 'lookLeftIdle',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 6, end: 6}),
        frameRate: 10,
        repeat: -1
     });

     this.anims.create({
        key: 'lookRightIdle',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 4, end: 4}),
        frameRate: 10,
        repeat: -1
     });


    this.anims.create({
       key: 'moveRight',
       frames: this.anims.generateFrameNumbers('playerSprite', { start: 4, end: 5}),
       frameRate: 10,
       repeat: -1
    });

    this.anims.create({
        key: 'moveLeft',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 6, end: 7}),
        frameRate: 10,
        repeat: -1
     });

     this.anims.create({
        key: 'moveUp',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 11, end: 12}),
        frameRate: 10,
        repeat: -1
     });

     this.anims.create({
        key: 'moveDown',
        frames: this.anims.generateFrameNumbers('playerSprite', { start: 1, end: 2}),
        frameRate: 10,
        repeat: -1
     });


}

createPlant(){
    this.plant = this.physics.add.sprite(530, 90, 'plant', 0); //plant will start at frame 0.
    this.plant.setScale(1.5);
    this.plant.setSize(20,10);
    this.plant.setOffset(-1,20);
    
}

playerWeaponContainer(){
    if(this.player){
        this.playerContainer = this.add.container(50, 50, [this.player, this.sword]);
        console.log("player weapon container successfully made");
    }
}

setupInput(){
    this.input.keyboard.on('keydown-Z', () =>{
        if(!gameState.attacking){
            console.log("pressing letter Z");
            gameState.attacking = true;
            //Trigger attack animation or logic
        }
    });

    this.input.keyboard.on('keyup-Z', () =>{
        gameState.attacking = false;
        //optionally reset animation / state
    });
}

plantSeedAction(){
let seedItem = this.myInventory.inventoryItems.find(item => item.name === "coffee seed");

if(seedItem){
    
    //remove seed from inventory
    console.log("You are planting : " + seedItem.name);
        this.myInventory.removeItem(seedItem);
        this.newPlant.startGrowth();
    
}else {
        console.log("You don't have any seeds.");
    }
}


harvestPlantAction(){
    //  if growthStage = maxGrowthStage -> inventory +1 coffee seed, plant frame = 0;
    //console.log(this.newPlant.growthStage);

    if(this.newPlant.growthStage == this.newPlant.maxGrowthStage){
        console.log("plant finished growing.");
        //add item to inventory
        this.myInventory.addItem(coffeeBean);
        this.newPlant.harvestCrop();
        //reset plant frame to 0
    }
    else {
        console.log("no crops brother.");
    }
}

async loadCropData() {
    try {
        const response = await fetch('http://localhost:3000/crops');
        if (!response.ok) {
            throw new Error('Failed to fetch crops data');
        }
        const crops = await response.json();
        console.log('Loaded crops:', crops); // Log the entire crops array to inspect the structure

        // Check if crops data has the 'Arabica' crop
        const arabicaCrop = crops.find(crop => crop.name === 'Arabica');
        console.log('Arabica Crop:', arabicaCrop);  // Log the Arabica crop specifically

        if (arabicaCrop && arabicaCrop.seeds) {
            console.log("Arabica Seeds:", arabicaCrop.seeds);  // This should now show the seed data
        } else {
            console.log("Arabica crop or seeds not found.");
        }

        this.crops = crops; // Save it for later use
    } catch (error) {
        console.error('Error loading crops:', error);
    }
}

}


export default main;