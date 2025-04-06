import GameScene from './GameScene.js';
import {gameState} from './GameScene.js';
import equipment from './equipment.js';

class inventory extends Phaser.Scene{
    constructor(){
        super({key: 'inventory'});
    }

create(){

    const GameScene = this.scene.get('GameScene');

    this.player = GameScene.player;

    this.hero = gameState.hero;
    gameState.hero.inventory = ["chicken"];
    gameState.hero.inventorySize = 4;

    this.equipment = new equipment();

    //this.manageInventory();
    this.showInventory();
    this.showPlayerInfo();
}

createInventoryBox(x, y, text){

    let width = 175;
    let height = 130;

    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.8);
    graphics.fillRoundedRect(0, 0, width, height, 10);

    let textObj = this.add.text(10,10, text, {fontsize: '16px', fill: '#fff'});
    let container = this.add.container(x,y,[graphics, textObj]);
    container.setDepth(10);
    container.setVisible(false);

    return {container, textObj };
}


showInventory(){

    
    let width = 150; 
    let height = 100;

    //fixed position for inventory. 
    this.camx = this.cameras.main.width - width - 30; //20px padding from right
    this.camy = 20; // 20 px padding from top

    console.log("INVENTORY SCENE LAUNCHED.");
    const {container, textObj} = this.createInventoryBox(this.camx, this.camy, this.formatInventory());
    this.inventoryMenu = container;
    this.inventoryText = textObj;
    
    
    this.inventoryMenu.setVisible(false);

    this.iKey = this.input.keyboard.on('keydown-I', () =>{
        this.updateInventory();
        console.log("Player Inventory: " + gameState.hero.inventory); 
       
        this.toggleMenu(this.inventoryMenu, 'invOpen');

    })
}

manageInventory(){
    

    this.input.keyboard.on('keydown-M', () =>{
        this.addItemToInventory("meat");
    })

    this.input.keyboard.on('keydown-C', () =>{
        if (!this.player.inventory.some(item => item.split(',')[0] === "meat")) {
            console.log("meat is not in record.")
        }
    })
}

removeItemFromInventory(item){
    gameState.hero.inventory = gameState.hero.inventory.filter(item => item !== "meat" );
    this.updateInventory();
}

updateInventoryBox(){
    this.inventoryMenu.setPosition(this.camx, this.camy -150);
}

updateInventory(){
    //this.inventoryMenu = this.createInventoryBox(this.camx, this.camy, this.formatInventory());
    if(this.inventoryText){
        this.inventoryText.setText(this.formatInventory());
    }
}

formatInventory(){
    return this.player && Array.isArray(gameState.hero.inventory)

    ? "Inventory: (" + gameState.hero.inventory.length + "/4)\n" + gameState.hero.inventory.join("\n")
    : "Inventory:\n(Empty)";

}


//FIGURE OUT HOW TO GET HEROS STATS ON THE SCREEN 
formatStats(){
    return this.hero && Array.isArray(this.hero)

    ? "Player stats: \n" + this.hero.join("\n")
    : "Player info \n  \n Name: " + this.hero.name + "\n Level: " + this.hero.level + "\n Exp: " + this.hero.exp + "\n Health: " + this.hero.health + "\n Strength: " + this.hero.strength;

}

showPlayerInfo(){

    let width = 150; 
    let height = 100;

    //fixed position for inventory. 
    this.camx = this.cameras.main.width - width - 30; //20px padding from right
    this.camy = 20; // 20 px padding from top

    console.log("PLAYER STATS OPENED");
    const {container, textObj} = this.createInventoryBox(this.camx, this.camy, this.formatStats());
    
    this.playerStatsMenu = container;
    this.playerStatsText = textObj;

    this.playerStatsMenu.setVisible(false);

    this.pKey = this.input.keyboard.on('keydown-P', () =>{

       
            this.toggleMenu(this.playerStatsMenu, 'statsOpen');
    })

}

updateStats(){
    //this.playerStatsMenu = this.createInventoryBox(this.camx, this.camy, this.formatStats());
    if(this.playerStatsText){
        this.playerStatsText.setText(this.formatStats());
    }
}


toggleMenu(menu, isOpenFlagName){
    if(!gameState[isOpenFlagName]){
        this.scene.pause('GameScene');
        menu.setVisible(true);
        gameState[isOpenFlagName] = true;
    }
    else{
        menu.setVisible(false);
        this.scene.resume('GameScene');
        gameState[isOpenFlagName] = false;
    }
}

}


export default inventory;