import inventory from './inventory.js';
import GameScene from './GameScene.js';
import {gameState} from './GameScene.js';

class equipment{

    constructor(inventoryScene, hero){


    this.inventoryScene = inventoryScene; //store inventory scene
    this.hero = hero; //store hero instance directly

    }


    updateEquipment(){

        //check if the player has a sword in the inventory.
        if(gameState.hero.inventory.includes("sword")){
            console.log("inventory has sword!!!!!!!!");
            console.log(this.hero);

            //modify character's strength if sword is in inventory. 
            if(this.hero){
                this.hero.setStrength(3); //increase character strength to 3 
                console.log("Character strength has increased to:", this.hero.strength);
                this.inventoryScene.updateStats();
            }
            
        }
        else{
            console.log("No sword is being detected :[");
        }
    }

}

export default equipment;