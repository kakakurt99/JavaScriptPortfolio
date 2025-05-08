import Item from './Item.js';
import Plants from './plants.js';
import inventory from './inventory.js';
import GameMap from './GameMap.js';
import Player from './Player.js';
import gameState from './gameState.js';
import Dialogue from './Dialogue.js';
import Shop from './Shop.js';
import CoffeeBean from './CoffeeBean.js';





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
           // this.myInventory = new inventory(this);
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
this.load.image("slotImage", "../assets/images/invSlot.png");
this.load.image("inventoryBox", "../assets/images/inventoryBG.png");
this.load.spritesheet('shopItems', '../assets/images/coffeebags.png', { frameWidth: 32, frameHeight: 32});
this.load.spritesheet('coffeeBeans', '../assets/images/coffeebeans.png', { frameWidth: 32, frameHeight: 32});
this.load.spritesheet('potItems', '../assets/images/basicpot.png', {frameWidth: 16, frameHeight: 16});
this.load.spritesheet('coffeecups', '../assets/images/coffeecup1.png', {frameWidth: 32, frameHeight: 32});

this.load.image("compostItems", "../assets/images/compostbag.png");

this.load.image('coffeeseed', '../assets/images/coffeeSeed.png', { frameWidth: 16, frameHeight: 16});
this.load.image('coffeebean', '../assets/images/coffeebean.png', { frameWidth: 16, frameHeight: 16});
this.load.spritesheet("plantStages", "../assets/images/basicplantstages.png", { frameWidth: 16, frameHeight: 16});
this.load.spritesheet('plantStages2', "../assets/images/basicplantstages2.png", { frameWidth: 16, frameHeight: 32});
this.load.spritesheet("playerSprite", "../assets/images/newnpc.png", {
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
this.waterPlantWithCup();
this.fillCupAction();
this.emptyCupAction();
this.harvestCrop();


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
        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
        const tileKey = `${tileX},${tileY}`;

        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

        console.log("this.shop =", this.shop);  // Should log the shop instance
        console.log("this.shop.items =", this.shop.items);  // Should log the array of items
        

        // Check if something is already there
        if(plantsTile){
            if(plantsTile.properties.exists){
                console.log("You can't put something on this tile because it has a plant on.");
                console.log("index: " + plantsTile.index);
                return;
            }
        }

        // If the tile is empty and we have a basic pot
        if(!plantsTile && this.myInventory.itemInSlot?.name.includes('Plant Pot')){
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
                    growthTime: 0,
                    maxGrowthStage: 6
                });

                console.log("Pot data added at", tileKey);
            }
        }
    });
}

putCompostInPot(){
    this.input.on('pointerdown', (pointer) => {
        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
        
        const groundTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.groundlayer);
        const plantsTile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);

        if(plantsTile){
            if(this.basicpotprops?.empty){
                console.log("You can put something in here...");
                console.log("index: " + plantsTile.index);
                if(this.myInventory.itemInSlot && this.myInventory.itemInSlot.name === 'Compost'){

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
        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
        const tileKey = `${tileX},${tileY}`;

        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        
        //check if there's a pot on the tile
        if(tile && tile.index === 965){
            const pot = this.potDataMap.get(tileKey);
        
        if(pot && this.myInventory.itemInSlot.type === 'seed' && !pot.seed){
            console.log("You can plant a seed here.");

            //place seed in pot and update pot data
            pot.seed = this.myInventory.itemInSlot;
            pot.growthStage = 0; //set initial growth stage

            this.myMap.map.putTileAt(966, tileX, tileY, false, this.myMap.plantslayer);
            // Remove the seed from the player's inventory
            this.myInventory.removeItem(this.myInventory.itemInSlot);

            console.log(`You planted a ${pot.seed.name} seed!`);

        }
        }

    });
}

waterPlantWithCup(){
    this.input.on('pointerdown', (pointer) => {


        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
        const tileKey = `${tileX},${tileY}`;

        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);
        const pot = this.potDataMap.get(tileKey);

<<<<<<< HEAD

    

        //check to see if seeds are in plant pot
        if(tile && pot && pot.hasPot && pot.seed && !pot.watered && this.myInventory.itemInSlot.contains === 'water'){
            console.log(`Watering plant at ${tileKey}`);
            //update image
            this.myMap.map.putTileAt(967, tileX, tileY, false, this.myMap.plantslayer);
            // Mark the pot as watered
            pot.watered = true;
=======
        if(this.myInventory.itemInSlot && this.myInventory.itemInSlot.contains === 'water'){
    //check to see if seeds are in plant pot
if(pot && pot.hasPot && pot.seed && !pot.watered){
    console.log(`Watering plant at ${tileKey}`);
    //update image
    this.myMap.map.putTileAt(967, tileX, tileY, false, this.myMap.plantslayer);
    // Mark the pot as watered
    pot.watered = true;

    
    this.startSeedGrowth(tileX, tileY, pot.seed.id);
} else {
console.log("Can't water this tile. It either has no pot, no seed or it's already watered!");
}   
        }
        else{
            return;
        }
>>>>>>> eca5a42 (complete restructure and version 0.11 coffee game)
        
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

harvestCrop(tileX, tileY){
    
<<<<<<< HEAD
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
        // Remove the plant sprite from the scene
        if (plant.sprite) {
            plant.sprite.destroy();
=======
    this.input.on('pointerdown', (pointer) => {
        const { tileX, tileY } = this.getTileCoordsFromPointer(pointer);
        const tileKey = `${tileX},${tileY}`;
        const tile = this.myMap.map.getTileAt(tileX, tileY, false, this.myMap.plantslayer);


        const pot = this.potDataMap.get(tileKey);
        if(!pot){
            console.log("No plant data at this tile.");
            return;
        }


        console.log("rowthStage: ", pot.growthStage);
        console.log("maxGrowthStage: ", pot.maxGrowthStage);

        if(pot.growthStage === pot.maxGrowthStage){
            console.log("Plant can be harvested!");
            
            //get bean from seed ID
            
            const seed = this.getItemById(pot.seed.id); // ✅ no .id
            console.log("pot.seed.id", pot.seed.id);
            console.log("seed =", seed);
            
            const bean = this.getBeanFromSeed(seed);
            console.log("bean from seed =", bean);

            if(bean){
                this.myInventory.addItem(bean);
                console.log(`Added ${bean.name} to inventory.`);

                //reset plant sprite back to pot stem
                const pot = this.potDataMap.get(tileKey);
                if(pot && pot.plant && pot.plant.sprite){
                    pot.plant.sprite.setFrame(0);

console.log(`tile: ${tile}, pot: ${pot}, pot.haspot: ${pot.hasPot}, pot.seed: ${pot.seed}, !pot.watered: ${!pot.watered}`)
                    tile && pot && pot.hasPot && pot.seed && !pot.watered
                }

                pot.growthStage = 0;
                pot.watered = false;
       
            } else{
                console.log("No matching bean found.");
            }

            //Reset tile & plant data

            
        }
        else {
            console.log("no crops brother.");
>>>>>>> eca5a42 (complete restructure and version 0.11 coffee game)
        }

        // Remove the tile from the map
        this.myMap.map.putTileAt(-1, tileX, tileY, false, this.myMap.plantslayer);

        const words = plant.name.split(" ");
        const withoutLastWord = words.slice(0, -1).join(" ");   
        // Add the harvested item to the player's inventory
        console.log("plant object: ", plant);


        //IF PLANT = GEISHA SEED  
        // GIVE 2 GEISHA BEANS 
        // plant.name = "geisha seed" 

        const harvestItem = harvestedItemMap[seedName];
        const bean = new CoffeeBean(harvestedItem);
    
        this.myInventory.addItem(bean); // Assuming harvestItem is defined in the plant object 
        console.log(`You harvested ${plant.name} and received ${withoutLastWord} beans!`); 
        this.myInventory.updateInventoryGUI(this); 

        // Reset pot data
        pot.hasPot = false; 
        pot.hasCompost = false; 
        pot.seed = null; 
        pot.watered = false; 
        pot.growthStage = 0; 
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


//ALSO EMPTY CUP WHEN PLAYER USES IT ON A PLANT. BUT NOT YET BECAUSE I CBA DOING THIS 1 MILLION TIMES TO PLANT TINGS
//^^^^^^^^^^^^^^^^^^^
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








}


export default main;