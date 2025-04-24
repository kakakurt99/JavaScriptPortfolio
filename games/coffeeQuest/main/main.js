import Item from './Item.js';
import Plants from './plants.js';
import inventory from './inventory.js';
import GameMap from './GameMap.js';
import Player from './Player.js';
import gameState from './gameState.js';
import Dialogue from './Dialogue.js';
import Shop from './Shop.js';




let myPlants = new Plants();
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
    
    constructor(){
            super({key: 'main'});
            this.isShopOpen = false;
        }

async preload(){

this.load.image("house1", "../assets/map/house1.png");
this.load.image("groundtiles", "../assets/map/groundtiles.png");
this.load.image("plants&pots", "../assets/map/plants&pots.png");
this.load.tilemapTiledJSON("worldMap", "../assets/map/mapNew.json");

this.load.spritesheet('charSheet', '../assets/fonts/monogram/bitmap/monogram-bitmap.png', {
    frameWidth: 6,
    frameHeight: 12,
});

this.load.json('charMap', '../assets/fonts/monogram/bitmap/monogram-bitmap.json')
this.load.image("slotImage", "../assets/invSlot.png");
this.load.image("inventoryBox", "../assets/inventoryBG.png");
this.load.spritesheet('shopItems', '../assets/coffeebags.png', { frameWidth: 32, frameHeight: 32});
this.load.spritesheet('potItems', '../assets/basicpot.png', {frameWidth: 16, frameHeight: 16});
this.load.spritesheet('coffeecups', '../assets/coffeecup1.png', {frameWidth: 32, frameHeight: 32});

this.load.image("compostItems", "../assets/compostbag.png");

this.load.image('coffeeseed', '../assets/coffeeSeed.png', { frameWidth: 16, frameHeight: 16});
this.load.image('coffeebean', '../assets/coffeebean.png', { frameWidth: 16, frameHeight: 16});
this.load.spritesheet("plantStages", "../assets/basicplantstages.png", { frameWidth: 32, frameHeight: 32});
this.load.spritesheet("playerSprite", "../assets/newnpc.png", {
    frameWidth: 32,
    frameHeight: 32
});

}
async create(){
    //camera on player
const cam = this.cameras.main;
gameState.centerX = cam.centerX;
gameState.centerY = cam.centerY;

this.myMap = new GameMap(this, "worldMap", "house1", "plants&pots", "groundtiles");
this.potDataMap = new Map(); // Key: `${x},${y}` -> Value: pot object

//this.createPlant();
//get spawnpoint from GameMap after it's created.
const spawnPoint = this.myMap.getSpawnPoint("playerSpawn");

//create inventory GUI on start
this.myInventory = new inventory(this, "slotImage", "inventoryBox", "shopItems");
gameState.playerInventory = this.myInventory;

 // Reference to the shop class
 this.shop = new Shop(this);
await this.shop.loadShopData();


this.player = new Player(this, 'playerSprite', this.plant, spawnPoint);
this.physics.add.existing(this.player);

this.myMap.createCollisionObjects();

this.myInventory.createInventoryGUI(this);
this.myInventory.enableInventoryControls(); 
this.myInventory.createMoneyPouchGUI(this);

this.cameras.main.startFollow(this.player.player);
this.cameras.main.setBounds(0,0, this.myMap.widthInPixels, this.myMap.heightInPixels);
this.cameras.main.setZoom(1.5);
this.cameras.main.roundPixels = true;


this.physics.world.setBounds(0, 0, this.myMap.map.widthInPixels, this.myMap.map.HeightInPixels);

//Create the cursor keys object
this.cursors = this.input.keyboard.createCursorKeys();

this.input.keyboard.on('keydown-SPACE', () => {
    if(gameState.nearPlant){
        console.log("attempting to plant seeds or harvest crops...");
        this.plantSeedAction();
        this.harvestPlantAction();
    }
});

this.input.keyboard.on('keydown-I', () => {
    this.myInventory.listItems();
    console.log("money:", this.player.getCurrency());
    this.findUniqueTileIndex();


})

this.input.keyboard.on('keydown-M', () => {
    this.player.addCurrency(10);
    this.myInventory.updateMoneyGUI(this);

})



this.input.keyboard.on('keydown-F', () => {
    console.log("playerInventory:", gameState.playerInventory);
    this.fillCupAction();
})

this.input.keyboard.on('keydown-ESC', () => {
    this.shop.closeShop();
    this.spacePressedListener = false; //reset flag 

})

 // Initialize the flag to track whether the shop is open
 this.isShopOpen = false;

// Enable collision between the player and the buildings
this.physics.add.collider(this.player.player, this.myMap.buildinglayer);
this.physics.add.collider(this.player.player, this.myMap.groundlayer);

this.physics.add.overlap(
    this.player.player, 
    this.myMap.namedZones.seedShop, 
    this.handleOverlapPlayerSeedShop, // <-- this is where the overlap is detected
    null, // <-- leave this as `null` unless you need fine-tuned overlap filtering
    this
);


this.tryPlacePotOnClick();
//this.tryRemovePotOnClick();

this.putCompostInPot();
this.plantSeedInPot();
this.waterPlantWithBucket();
this.fillCupAction();

}

update(){

 if(this.player){
    this.player.update();


        if (this.isOverlappingSeedShop) {
            const playerBounds = this.player.player.getBounds();
            const shopBounds = this.myMap.namedZones.seedShop.getBounds();
        
            if (!Phaser.Geom.Intersects.RectangleToRectangle(playerBounds, shopBounds)) {
                this.isOverlappingSeedShop = false;
                console.log("Exited Seed Shop");
               // Reset listener flag after use
                // Optional: close shop or handle exit logic
            }
        }


    }

    if (this.tooltipText && this.tooltipText.visible) {
        this.tooltipText.setPosition(this.scene.input.x + 10, this.scene.input.y - 20);
    }
 }

tryPlacePotOnClick(){
    this.input.on('pointerdown', (pointer) => {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        const tileX = this.myMap.map.worldToTileX(worldX);
        const tileY = this.myMap.map.worldToTileY(worldY);
        const tileKey = `${tileX},${tileY}`;

        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

   //     console.log("when click you have: " , this.myInventory.itemInSlot);
   //     console.log("clicking at: " , worldX, worldY);

        // Check if something is already there
        if(plantsTile){
            if(plantsTile.properties.exists){
                console.log("You can't put something on this tile because it has a plant on.");
                console.log("index: " + plantsTile.index);
                return;
            }
        }

        // If the tile is empty and we have a basic pot
        if(!plantsTile && this.myInventory.itemInSlot?.name === 'basic pot'){
            if(groundTile?.properties?.plantable){
                console.log("Placing a basic pot.");
                const tile = this.myMap.map.putTileAt(964, tileX, tileY, false, this.myMap.plantslayer);
                this.basicpotprops = this.getTileProperties(tile);
                
                if (this.basicpotprops?.empty) {
                    console.log("This tile is marked as empty!");
                }

                // Now link this tile to a new pot object
                this.potDataMap.set(tileKey, {
                    hasPot: true,
                    hasCompost: false,
                    seed: null,
                    watered: false,
                    growthStage: 0,
                    growthTime: 0
                });

                console.log("Pot data added at", tileKey);
            }
        }
    });
}

putCompostInPot(){
    this.input.on('pointerdown', (pointer) => {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        const tileX = this.myMap.map.worldToTileX(worldX);
        const tileY = this.myMap.map.worldToTileY(worldY);
        
        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

        if(plantsTile){
            if(this.basicpotprops?.empty){
                console.log("You can put something in here...");
                console.log("index: " + plantsTile.index);
                if(this.myInventory.itemInSlot && this.myInventory.itemInSlot.name === 'compost'){

                    console.log("you put compost in da plant broski!");
                    this.myMap.map.putTileAt(965, tileX, tileY, false, this.myMap.plantslayer);
                    
                    //update compost status in potdatamap

                    const tileKey = `${tileX},${tileY}`;
                    const pot = this.potDataMap.get(tileKey);

                    if(pot){
                        pot.hasCompost = true;
                        this.potDataMap.set(tileKey, pot);
                        console.log("Pot data updated: hasCompost = ", pot.hasCompost);
                    } else {
                        console.log("No pot data found for tilekey: ", tileKey);
                    }







                    this.potDataMap.hasCompost = true;

                    console.log("Pot data added: hascompost", this.potDataMap.hasCompost);
                }
            } 
        }
    });

}

plantSeedInPot(){
    this.input.on('pointerdown', (pointer) => {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        const tileX = this.myMap.map.worldToTileX(worldX);
        const tileY = this.myMap.map.worldToTileY(worldY);
        
        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        this.basicpotprops = this.getTileProperties(tile);
        if(this.basicpotprops?.plantable && this.myInventory.itemInSlot.type === 'seed'){
            console.log("you can plant a seed in here..");
           // this.getInventoryItem();
            //change frame to seed pot
            //initiate growth stage 1 / timer.

            this.myMap.map.putTileAt(966, tileX, tileY, false, this.myMap.plantslayer);

            this.potDataMap.seed = this.myInventory.itemInSlot;

            console.log("You planted a : ", this.potDataMap.seed);
            console.log("The id for this plant is: ", this.potDataMap.seed.id);


        }
    });
}

waterPlantWithBucket(){
    this.input.on('pointerdown', (pointer) => {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        const tileX = this.myMap.map.worldToTileX(worldX);
        const tileY = this.myMap.map.worldToTileY(worldY);
        
       // const plantSprite = this.add.sprite(worldX + map.tileWidth / 2, worldY + map.tileHeight /2, 'plantStages', 0);
       //const seedInfo = this.shop.getSeedData();


        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        this.basicpotprops = this.getTileProperties(tile);
        if(this.basicpotprops?.sewed && this.myInventory.itemInSlot.contains === 'water'){
            console.log("you can plant water this pot");
           
            this.myMap.map.putTileAt(967, tileX, tileY, false, this.myMap.plantslayer);
            this.potDataMap.watered = true;    
            
            console.log("Your "+ this.potDataMap.seed.name + "plant will start to grow.");
            console.log("The id for this seed is:" + this.potDataMap.seed.id);
            this.startSeedGrowth(tileX, tileY, this.potDataMap.seed.id);
            
           // this.startPlantGrowth();

        }
    });
}


getTileProperties(tile) {
    if (!tile) return null;

    for (const tileset of this.myMap.map.tilesets) {
        const firstGid = tileset.firstgid;
        const lastGid = firstGid + tileset.total - 1;

        if (tile.index >= firstGid && tile.index <= lastGid) {
            const localIndex = tile.index - firstGid;
            return tileset.tileProperties[localIndex] || null;
        }
    }

    return null;
}

findUniqueTileIndex(){

    const tileset = this.myMap.map.tilesets.find(ts => ts.name === 'plants&pots');
    console.log(tileset.firstgid);
}

startSeedGrowth(){
let seedItem = this.myInventory.inventoryItems.find(item => item.type === "seed");

if(seedItem){
    
    //remove seed from inventory
    console.log("You are planting : " + seedItem.name);
        this.myInventory.removeItem(seedItem);
        this.newPlant.startGrowth();
    
}else {
        console.log("You don't have any seeds.");
    }
}

startSeedGrowth(tileX, tileY, seedId) {
    const seedInfo = this.getSeedInfoById(seedId);
    const worldX = tileX * this.map.tileWidth;
    const worldY = tileY * this.map.tileHeight;
  
    const sprite = this.add.sprite(worldX + this.map.tileWidth / 2, worldY + this.map.tileHeight / 2, 'plantStage', 0);
  
    const plant = new Plants(
      seedInfo.name,
      seedInfo.growthTime,
      0,
      seedInfo.maxGrowthStage
    );
  
    plant.assignSprite(sprite);
    plant.startGrowth();
  
    const key = `${tileX},${tileY}`;
    this.plantedCrops.set(key, plant);
  }

harvestPlantAction(){
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

pauseThisScene(){
    this.scene.pause();
}

resumeThisScene(){
    this.scene.resume();
}

toggleShop() {
    if (this.isShopOpen) {
        this.shop.closeShop();     // 👈 call method on the Shop instance
        this.isShopOpen = false;
        this.enablePlayerActions();  // Allow player actions (movement, interactions)
        //this.scene.resume();       // 👈 resume your game scene
    } else {
        this.shop.openShop();      // 👈 call method on the Shop instance
        this.isShopOpen = true;
        //this.disablePlayerActions(); // Disable player actions (movement, interactions)
       // this.scene.pause();        // 👈 pause your game scene
    }
}

fillCupAction(){
    

    this.input.on('pointerdown', (pointer) => {
        const worldX = pointer.worldX;
        const worldY = pointer.worldY;
        const tileX = this.myMap.map.worldToTileX(worldX);
        const tileY = this.myMap.map.worldToTileY(worldY);
        const tileKey = `${tileX},${tileY}`;

        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

        // If the tile is empty and we have a basic pot

        console.log(groundTile?.properties);
        console.log(plantsTile?.properties);


if(this.myInventory.itemInSlot){

    if(this.myInventory.itemInSlot?.name === 'coffee cup (empty)'){
        if(groundTile?.properties?.watersource || plantsTile?.properties?.watersource){
            console.log("Filling your cup with water...");
          
            this.myInventory.itemInSlot.contains = 'water';

            console.log("itemInSlot.contains: " , this.myInventory.itemInSlot.contains);



            const newItem = this.shop.getItem("coffee cup (water)");
 
            this.myInventory.updateInventoryGUI(this);


        }
    }
}
        
    });

    //if(coffeeCup){
    //    coffeeCup.contains = 'water';
     //   this.myInventory.updateInventoryGUI(scene);
    //}
}

emptyCupAction(){
    let coffeeCup = this.myInventory.find(item => item.name.includes('coffee cup') && item.contains === 'water');

    if(coffeeCup){
        coffeeCup.contains = null;
        this.myInventory.updateInventoryGUI(scene);
    }
}


handleOverlapPlayerSeedShop() {
    if (!this.isOverlappingSeedShop) {
        this.isOverlappingSeedShop = true;
        console.log("Entered Seed Shop");
    }

    this.input.keyboard.once('keydown-SPACE', () => {

        this.spacePressedListener = true;

        if(this.isOverlappingSeedShop && this.spacePressedListener){

            gameState.gamePaused = true;
            this.shop.openShop();

        }
        
       
    });
    
}

getInventoryItem(item){
    item = this.myInventory.itemInSlot.name;
    console.log("In your hand you have: ", this.myInventory.itemInSlot);
}




getSeedInfoById(seedId){
    
this.seedData = this.shop.getItemData(seedId);

if (!seedData) {
    console.warn(`No seed data found for ID: ${seedId}`);
    return null;
  }

  console.log("seed data:", seedData);
  console.log("name of seed: ", seedData.name);

  return seedData;

}

}


export default main;