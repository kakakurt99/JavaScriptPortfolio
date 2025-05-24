import Item from './item.js';
import Plants from './plants.js';
import inventory from '../src/inventory.js';
import GameMap from './gameMap.js';
import Player from './player.js';
import gameState from '../src/gameState.js';
import imageIndexes from '../src/imageIndexes.js';
import globalIndexes from '../src/imageIndexes.js';
import Dialogue from './dialogue.js';
import Shop from './shop.js';
import CoffeeBean from '../coffeeBean.js';
import { createAnimations } from '../src/animations.js'; 





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

this.load.image("house1", "../src/assets/map/house1.png");
this.load.image("groundtiles", "../src/assets/map/groundtiles.png");
this.load.image("plants&pots", "../src/assets/map/plants&pots.png");
this.load.tilemapTiledJSON("worldMap", "../src/assets/map/mapNew.json");

this.load.spritesheet('charSheet', '../src/assets/fonts/monogram/bitmap/monogram-bitmap.png', {
    frameWidth: 6,
    frameHeight: 12,
});

this.load.json('charMap', '../src/assets/fonts/monogram/bitmap/monogram-bitmap.json')
this.load.image("slotImage", "../src/assets/images/invSlot.png");
this.load.image("inventoryBox", "../src/assets/images/inventoryBG.png");
this.load.spritesheet('shopItems', '../src/assets/images/coffeebags.png', { frameWidth: 32, frameHeight: 32});
this.load.spritesheet('coffeeBeans', '../src/assets/images/coffeebeans.png', { frameWidth: 32, frameHeight: 32});
this.load.spritesheet('potItems', '../src/assets/images/basicpot.png', {frameWidth: 16, frameHeight: 16});
this.load.spritesheet('coffeecups', '../src/assets/images/coffeecup1.png', {frameWidth: 32, frameHeight: 32});

this.load.image("compostItems", "../src/assets/images/compostbag.png");

this.load.image('coffeeseed', '../src/assets/images/coffeeSeed.png', { frameWidth: 16, frameHeight: 16});
this.load.image('coffeebean', '../src/assets/images/coffeebean.png', { frameWidth: 16, frameHeight: 16});
this.load.spritesheet("plantStages", "../src/assets/images/basicplantstages.png", { frameWidth: 16, frameHeight: 16});
this.load.spritesheet('plantStages2', "../src/assets/images/basicplantstages2.png", { frameWidth: 16, frameHeight: 32});
//this.load.spritesheet("playerSprite", "../assets/images/newnpc.png", {frameWidth: 32, frameHeight: 32});

this.load.spritesheet('playerSprite', '../src/assets/characters/playerCharacterFull.png', { frameWidth: 32, frameHeight: 32});
this.load.spritesheet('shopNPC1', '../src/assets/characters/girl3.png', {frameWidth: 32, frameHeight: 32});


this.load.spritesheet('grindingBeansAnim', '../src/assets/animations/beanGrindAnim.png', {
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





createAnimations(this);
this.beanTable = this.add.sprite(350, 335, 'grindingBeansAnim');
this.beanTable.setDepth(5);

const beansReady = true;

if(beansReady){
    this.beanTable.play('grindBeans'); 
    this.beansReady = false;
    console.log("beansReady = ", this.beansReady);
}





fetch('http://localhost:3000/beans')
.then(response => response.json())
.then(beans => {
  console.log("Beans for gameplay:", beans);
  this.beans = beans;
})
.catch(error => console.error('Error fetching beans:', error));


//this.createPlant();
//get spawnpoint from GameMap after it's created.
const spawnPoint = this.myMap.getSpawnPoint("playerSpawn");

//create inventory GUI on start
this.myInventory = new inventory(this, "slotImage", "inventoryBox", "shopItems");
gameState.playerInventory = this.myInventory;

 // Reference to the shop class
 this.shop = new Shop(this);
//await this.shop.loadShopData();


this.player = new Player(this, 'playerSprite', this.plant, spawnPoint);
this.physics.add.existing(this.player);

this.npc = this.physics.add.sprite(300, 330, 'shopNPC1');
this.npc.setScale(1.4);
this.npc.setInteractive();

 

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

this.input.keyboard.on('keydown-ESC', () => {
    this.shop.closeShop();
    this.spacePressedListener = false; //reset flag 

})

 // Initialize the flag to track whether the shop is open
 this.isShopOpen = false;

// Enable collision between the player and the buildings
this.physics.add.collider(this.player.player, this.myMap.buildinglayer);
this.physics.add.collider(this.player.player, this.myMap.groundlayer);
this.physics.add.collider(this.player.player, this.myMap.treelayer);

this.physics.add.overlap(
    this.player.player, 
    this.myMap.namedZones.seedShop, 
    this.handleOverlapPlayerSeedShop, // <-- this is where the overlap is detected
    null, // <-- leave this as `null` unless you need fine-tuned overlap filtering
    this
);


//this.tryRemovePotOnClick();



this.waterPlantWithCup();
this.fillCupAction();
this.emptyCupAction();
this.harvestCrop();
this.interactWithMocha();



 this.input.on('pointerdown', (pointer) => {
        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);    
        

        console.log("item in slot =? ", this.myInventory.itemInSlot);


        if(this.myInventory.itemInSlot){

        if(this.myInventory.itemInSlot.name === 'Plant Pot (Small)'){
            this.tryPlacePotOnClick(tileX, tileY);
        } else if(this.myInventory.itemInSlot.name === 'Compost'){
            this.putCompostInPot(tileX, tileY);
        } else if(this.myInventory.itemInSlot.type === 'seed'){
            console.log("trying to do something with a seed...");
            this.plantSeedInPot(tileX, tileY);
        } else if (this.myInventory.itemInSlot.contains === 'water'){
            this.waterPlantWithCup(tileX, tileY);
        }

        }

        
 });

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
        if(this.nearNpc){
            console.log("Near npc");
        }
        if(this.nearNpc && Phaser.Input.Keyboard.JustDown(this.talkKey)){
            this.startDialogue([
                "Hey farmer!",
                "Put some beans in me basket would ya",
                "if you do I'll give you some coins"
            ]);
        }

    }

    if (this.tooltipText && this.tooltipText.visible) {
        this.tooltipText.setPosition(this.scene.input.x + 10, this.scene.input.y - 20);
    }
 }

tryPlacePotOnClick(tileX, tileY){

    const tileKey = `${tileX},${tileY}`;
    
        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        // Check if something is already there
        if(plantsTile){
            if(plantsTile.properties.exists){
                console.log("You can't put something on this tile because it has a plant on.");
                return;
            }
        }


            if(groundTile?.properties?.plantable){
                console.log("Placing a basic pot.");
     
                const plantPotIndex = this.getGlobalIndexPlants(imageIndexes.PlantPot);

                const tile = this.myMap.map.putTileAt(plantPotIndex, tileX, tileY, false, this.myMap.plantslayer);
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
                    growthTime: 0,
                    maxGrowthStage: 6
                });
                console.log("Pot data added at", tileKey);
            }
        
    
}

putCompostInPot(tileX, tileY){
        
        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

        if(plantsTile){
            if(this.basicpotprops?.empty){

                if(this.myInventory.itemInSlot && this.myInventory.itemInSlot.name === 'Compost'){

                    console.log("you put compost in da plant broski!");

                    const compostPotIndex = this.getGlobalIndexPlants(imageIndexes.PotWithSoil);
                    
                    this.myMap.map.putTileAt(compostPotIndex, tileX, tileY, false, this.myMap.plantslayer);
                    
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
    

}

plantSeedInPot(tileX, tileY){

    console.log("plant seed in pot function running");
        const tileKey = `${tileX},${tileY}`;
        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        const compostPotIndex = this.getGlobalIndexPlants(imageIndexes.PotWithSoil);
        const seededPotIndex = this.getGlobalIndexPlants(imageIndexes.PotWithSeeds);
        
        //check if there's a pot on the tile
        if(tile && tile.index === compostPotIndex){
            const pot = this.potDataMap.get(tileKey);

        if(pot && this.myInventory.itemInSlot.type === 'seed' && !pot.seed){
            console.log("You can plant a seed here.");

            //place seed in pot and update pot data
            pot.seed = this.myInventory.itemInSlot;
            pot.growthStage = 0; //set initial growth stage


            

            this.myMap.map.putTileAt(seededPotIndex, tileX, tileY, false, this.myMap.plantslayer);
            // Remove the seed from the player's inventory
            this.myInventory.removeItem(this.myInventory.itemInSlot);

            console.log(`You planted a ${pot.seed.name} seed!`);

        }
        }

}

waterPlantWithCup(tileX, tileY) {
        const tileKey = `${tileX},${tileY}`;

        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        const pot = this.potDataMap.get(tileKey);
        const item = this.myInventory.itemInSlot;

        console.log("item is: ", item);

        if(item && item.name === 'Coffee Cup (water)'){
            console.log("You have a coffee cup with wate.");// Check conditions before watering
        if (tile && pot && pot.hasPot && pot.seed && !pot.watered && item && item.contains === 'water') {
            console.log(`Watering plant at ${tileKey}`);

            const wateredPlant = this.getGlobalIndexPlants(imageIndexes.PotSoilWatered);
            this.myMap.map.putTileAt(wateredPlant, tileX, tileY, false, this.myMap.plantslayer);
            pot.watered = true;
            this.startSeedGrowth(tileX, tileY, pot.seed.id);
        } else {
            console.log("Can't water this tile. It either has no pot, no seed, it's already watered, or you're not holding water.");
        }
        } 
        else{
            console.log("no item in hand");
        }

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

startSeedGrowth(tileX, tileY) {
    const tileKey = `${tileX},${tileY}`;
    const pot = this.potDataMap.get(tileKey);

    if (!pot || !pot.seed) {
        console.log(`No seed planted at ${tileKey}. Cannot start growth.`);
        return;
    }

    const seedInfo = pot.seed;
    const plantStartingFrame = 0;

    const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
    
    if(tile){
    //remove tile
    this.myMap.map.putTileAt(-1, tileX, tileY, false, this.myMap.plantslayer);

  const plantSprite = this.add.sprite(
    tile.pixelX + 16,
    tile.pixelY + 15.5,
    'plantStages2',
    plantStartingFrame);
    plantSprite.setDepth(10);
    plantSprite.setInteractive();

    plantSprite.on('pointerdown', () => {
        const currentGrowth = pot.growthStage;
        const maxGrowth = pot.maxGrowthStage;

        if(currentGrowth >= maxGrowth) {
            this.harvestCrop(tileX, tileY);
        }
        else{
            console.log(`${seedInfo.name} is not ready to harvest yet.`);

        }
    });
    // Create a new plant object with the seed's properties
    console.log(`Creating a new plant for seed: ${seedInfo.name}`);
    const plant = new Plants(
      seedInfo.name,
      seedInfo.growthTime,
      0,
      seedInfo.maxGrowthStage
    );

    plant.assignSprite(plantSprite);
    // When the plant grows, update the pot's growthStage
        plant.onGrowthUpdate((growthStage) => {
            console.log(`Plant at ${tileKey} grew to stage ${growthStage}`);
            pot.growthStage = growthStage
        });

    pot.maxGrowthStage = seedInfo.maxGrowthStage || 6; // Safely copy max stages
    pot.plant = plant; // Store the plant object inside the pot for reference

    plant.startGrowth();

    } else {
        console.log(`No tile found at ${tileX}, ${tileY}`);
    }
  }

  harvestCrop(tileX, tileY) {
    const tileKey = `${tileX},${tileY}`;
    const pot = this.potDataMap.get(tileKey);

    if (!pot || !pot.plant) {
        console.log(`No plant found at ${tileKey}. Cannot harvest.`);
        return;
    }

    const plant = pot.plant;
    const growthStage = pot.growthStage;
    const maxGrowthStage = pot.maxGrowthStage || 6; // Default to 6 if not set

    if (growthStage >= maxGrowthStage) {
        console.log(`Harvesting ${plant.name} at ${tileKey}`);
        
        // Remove the plant sprite from the game
        if (plant.sprite) {
            plant.sprite.destroy();
        }

        //add bean to inventory

            console.log("GrowthStage:", pot.growthStage);
            console.log("MaxGrowthStage:", pot.maxGrowthStage);

            if (pot.growthStage === pot.maxGrowthStage) {
                console.log("Plant can be harvested!");

                // Get seed data
                const seed = this.getItemById(pot.seed.id);
                console.log("Seed ID:", pot.seed.id);
                console.log("Seed object:", seed);
                
                const bean = this.getBeanFromSeed(seed);
                console.log("Bean from seed:", bean);

                if (bean) {
                    this.myInventory.addItem(bean);
                    console.log(`Added ${bean.name} to inventory.`);
                } else {
                    console.log("No matching bean found.");
                }

                // Reset plant sprite back to pot stem
                if (pot.plant.sprite) {
                    pot.plant.sprite.setFrame(0);  // Adjust as necessary
                }

                pot.growthStage = 0;
                pot.watered = false;

           /*     // Special case for Geisha Seed
                if (plant.name.toLowerCase() === "geisha seed") {
                    console.log("Harvesting Geisha Beans!");
                    const geishaBean = new CoffeeBean({ name: "Geisha Bean", quantity: 2, imageKey: 'coffeeBeans', frame: 0});
                    this.myInventory.addItem(geishaBean);
                    console.log("Added Geisha Beans to inventory!");
                }

                // Special case for Arabica Seed
                if (plant.name.toLowerCase() === "arabica seed") {
                    console.log("Harvesting Arabica Beans!");
                    const arabicaBean = new CoffeeBean({ name: "Arabica Bean", quantity: 2, imageKey: 'coffeeBeans', frame: 1});
                    this.myInventory.addItem(arabicaBean);
                    console.log("Added Arabica Beans to inventory!");
                }
                
                // Special case for Arabica Seed
                if (plant.name.toLowerCase() === "robusta seed") {
                    console.log("Harvesting Robusta Beans!");
                    const robustaBean = new CoffeeBean({ name: "Robusta Bean", quantity: 2,  imageKey: 'coffeeBeans', frame: 2});
                    this.myInventory.addItem(robustaBean);
                    console.log("Added Robusta Beans to inventory!");
                }
*/
                // Remove the tile from the map
                this.myMap.map.putTileAt(-1, tileX, tileY, false, this.myMap.plantslayer);

                // Reset pot data
                pot.hasPot = false; 
                pot.hasCompost = false; 
                pot.seed = null; 
                pot.watered = false; 
                pot.growthStage = 0;

                // Update inventory GUI
                this.myInventory.updateInventoryGUI(this); 
            } else {
                console.log("No crops ready for harvest.");
            }
    }
}


putBeansInBasket(){
    if(this.myInventory.itemInSlot.contains === 'bean'){
        //if player clicks on basket index
        //change basket tile to full basket
        // remove bean from player invy
        //start npc anim
        //npc remove basket. 
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
        this.shop.closeShop();     
        this.isShopOpen = false;
        this.enablePlayerActions();  // Allow player actions (movement, interactions)
        //this.scene.resume();       
    } else {
        this.shop.openShop();      
        this.isShopOpen = true;
        //this.disablePlayerActions(); // Disable player actions (movement, interactions)
       // this.scene.pause();        
    }
}

fillCupAction(){

    this.input.on('pointerdown', (pointer) => {

        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

        // If the tile is empty and we have a basic pot
        //console.log(groundTile?.properties);
       // console.log(plantsTile?.properties);

if(this.myInventory.itemInSlot){

    if(this.myInventory.itemInSlot?.name === 'Coffee Cup (empty)'){
        if(groundTile?.properties?.watersource || plantsTile?.properties?.watersource){
            console.log("Filling your cup with water...");
          
            const item = this.myInventory.itemInSlot;
            item.contains = 'water';
            item.name = 'Coffee Cup (water)';
            item.frame = 1; //if you want to visualise show it's filled
            this.myInventory.updateInventoryGUI(this);
        }
    }
}
    });
}

emptyCupAction(){

    this.input.on('pointerdown', (pointer) => {
    const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
    const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
    const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

    if(this.myInventory.itemInSlot?.name === 'Coffee Cup (water)'){

        console.log("Emptying the cup...");
        if(groundTile?.properties?.hole){
            const item = this.myInventory.itemInSlot;
            item.contains = null;
            item.name = 'Coffee Cup (empty)';
            item.frame = 0; //if you want to visualise show it's filled
            this.myInventory.updateInventoryGUI(this);
            console.log("Now you have: ", item);
        }


    }
    });
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

getBeanFromSeed(seedItem) {
    console.log("seedItem.id =", seedItem.id);
        console.log("all beans in shop =", this.shop.items.filter(i => i.type === 'bean'));
    if (!seedItem || seedItem.type !== 'seed') return null;
    return this.beans.find(item => item.cropId === seedItem.id);
  }
  
  getItemById(id) {
    console.log("Shop items:", this.shop.items);
    return this.shop.items.find(item => item.id === id);
  }

getSeedInfoById(seedId){
this.seedData = this.shop.getItemData(seedId);

if (!this.seedData) {
    console.warn(`No seed data found for ID: ${seedId}`);
    return null;
  }

  console.log("seed data:", this.seedData);
  console.log("name of seed: ", this.seedData.name);

  return this.seedData;
}

getTileCoordsFromPointer(pointer){
    const tileX = this.myMap.map.worldToTileX(pointer.worldX);
    const tileY = this.myMap.map.worldToTileY(pointer.worldY);
    return {tileX, tileY};
}


getGlobalIndexPlants(item){
    const tileset = this.myMap.map.getTileset('plants&pots');
    const globalIndex = tileset.firstgid + item;

    return globalIndex;
}


interactWithMocha(){
    this.talkKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.physics.add.overlap(this.player, this.npc, () => {
        this.nearNpc = true;
    }, null, this);
}


startDialogue(lines){
    this.currentLine = 0;
    this.dialogueLines = lines; 
    this.dialogueBox.setVisible(true);
    this.dialogueText.setVisible(true);
    this.dialogueText.setText(this.dialogueLines[this.currentLine]);

    this.input.keyboard.once('keyboard-SPACE', () => this.nextDialogueLine());
}

nextDialogueLine(){
    this.currentLine++;
    if(this.currentLine < this.dialogueLines.length){
        this.dialogueText.setText(this.dialogueLines[this.currentLine]);
        this.input.keyboard.once('keydwon-SPACE', () => this.nextDialogueLine());
    } else{
        this.dialogueBox.setVisible(false);
        this.dialogueText.setVisible(false);
    }
}


}


export default main;