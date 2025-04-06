import GameScene from './GameScene.js';
import {gameState} from './GameScene.js';
import dialogBoxScene from './dialogBoxScene.js';

export default class levels{

    constructor(){
        ({key: 'levels'})
    }




    create(){

        
        startQuest();

    }

startQuest(){
    console.log("level1 = " + gameState.level1);
    console.log("level2 = " + gameState.level2);

    

        if(gameState.level1 && !GameScene.player.inventory.some(item => item.split(',')[0] === "meat")){
            currentLine = 0;
            dialogBoxScene.interactWithBodwin();
            /* IF PLAYER HAS MEAT gameState.level1 = false, level2 = true */
            console.log("inventory status: " + GameScene.player.inventory);
        }

        if(gameState.level1 && GameScene.player.inventory.includes("meat")){
                dialogNumber = 2; 
                dialogBoxScene.interactWithBodwin();
        }
        
        

        if(gameState.level2){
            console.log("level 2 begins");
        }
}
}