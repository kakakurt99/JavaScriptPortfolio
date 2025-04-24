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
let myInventory = new inventory();
let myItems = new Item();

//let seedItem = {name: "coffee bean", quality: "premium"};
let seedItem = new Item("coffee seed", "seed", "premium", 0, 10);
let coffeeBean = new Item("coffee bean", "bean", "premium", 0, 100);

class main extends Phaser.Scene{   
interactables = [];
    constructor(){
        super({key: 'main'});
        this.myInventory = new inventory();
    }

preload(){
//load player, sword
//import character, sword

this.load.image("tilesA", "../assets/map/tilesA.png");
this.load.tilemapTiledJSON('forestMap', '../assets/map/coffeeQuest.json');
this.load.image("slotImage", "../assets/invSlot2.png");

this.load.spritesheet("playerSprite", "../assets/basicnpc.png", {
    frameWidth: 32,
    frameHeight: 32

});

this.load.spritesheet("plant", "../assets/coffeeplant1.png", { frameWidth: 16, frameHeight: 32});

}

create(){

//create the map object and pass the keys to the GameMap constructor
this.map = new GameMap(this, 'forestMap', 'tilesA');



//this.add.image(100, 580, "slotImage").setScale(1);
this.createPlayer();
this.createPlant();
console.log(this.map);

//create inventory GUI on start
this.myInventory = new inventory(this, "slotImage");
this.myInventory.createInventoryGUI(this);

//camera on player
this.cameras.main.startFollow(this.player);

this.cameras.main.setBounds(0,0, this.map.widthInPixels, this.map.heightInPixels);
this.cameras.main.setZoom(1);
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
})

}

update(){

//player movement
//sword movement
    if(this.cursors.left.isDown){
        this.player.x -= 2;

    } 
    if(this.cursors.right.isDown){
        this.player.x += 2;

    }
    if(this.cursors.up.isDown){
        this.player.y -= 2;

    }
    if(this.cursors.down.isDown){
        this.player.y += 2;

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

createPlayer(){
    //create spawn points for player 
    const spawnPoint = this.map.getSpawnPoint('PlayerSpawn');
    this.player = this.physics.add.image(spawnPoint.x, spawnPoint.y, "playerSprite");
    this.player.setScale(2);
    this.player.setSize(10,15);


    this.physics.add.collider(this.player, this.map.collisionLayer);
    
    //this.playerContainer = new Phase.GameObjects.Container(this.scene, 50, 50, this.sword);

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
let seedItem = this.myInventory.items.find(item => item.name === "coffee seed");

if(seedItem){
    //create the plant instance with a growth time. 
    this.newPlant = new Plants("Coffee Plant", seedItem, 500);
    this.newPlant.assignSprite(this.plant);

    //remove seed from inventory
    console.log("This is the seed item amount: " + seedItem.amount);
    if(seedItem.amount >= 1){
        seedItem.amount--;
        this.newPlant.startGrowth();
        if(seedItem.amount === 0){
            myInventory.removeItem(seedItem);
            console.log("This is the seed amount after being used: " + seedItem.amount);
        }
    }
    else {
        console.log("You don't have any seeds.");
    }
}
else{ 
    console.log("You don't have any coffee seeds to plant!");
}


}

harvestPlantAction(){
    //  if growthStage = maxGrowthStage -> inventory +1 coffee seed, plant frame = 0;
    if(this.newPlant.growthStage === this.newPlant.maxGrowthStage){
        console.log("plant finished growing.");
        //add item to inventory
        myInventory.addItem(coffeeBean);
        this.newPlant.harvestCrop();
        //reset plant frame to 0
    }
}
}

//create some items..
// Listen for key E - gives player 1 coffee bean seed
window.addEventListener("keydown", (event) => {
    if (event.key === "i") {
        myInventory.listItems();
    }
});


export default main;