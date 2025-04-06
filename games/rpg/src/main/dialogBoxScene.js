import GameScene from './GameScene.js';
import {gameState} from './GameScene.js';
import inventory from './inventory.js';

let currentLine = 0;
const dialogText1 = [
    "hello traveller",
    "I'm hungry, could you find me some food?",
    "If you do I will give you a reward."
];

const dialogText2 = [
    "Thank you! Here take this..."
]

const dialogText3 = [
    "I have another request.",
    "Please could you kill that slime over there \nit's mocking me!"
]

//store the arrays in an object
const dialogSets = {
    1: dialogText1, 
    2: dialogText2,
    3: dialogText3
};

let dialogNumber = 1; 
let i = 1; 

class dialogBoxScene extends Phaser.Scene{

    constructor(){
        
        super({key: 'dialogBoxScene'});

    }

    create(){

    const GameScene = this.scene.get('GameScene'); //get reference to gamescene 
    const inventory = this.scene.get('inventory'); //get reference to inventory scene
        
    console.log("level1 = " + gameState.level1);
    console.log("level2 = " + gameState.level2);

    //begin dialog for level 1

        if(gameState.level1 && !gameState.hero.inventory.some(item => item.split(',')[0] === "meat")){
            currentLine = 0;
            this.interactWithBodwin();
            /* IF PLAYER HAS MEAT gameState.level1 = false, level2 = true */
            console.log("inventory status: " + gameState.hero.inventory);
        }

        else if(gameState.level1 && gameState.hero.inventory.includes("meat")){
                dialogNumber = 2; 
                this.interactWithBodwin();
                inventory.removeItemFromInventory("meat");
                GameScene.addToInventory("sword");
                gameState.level1 = false;
                console.log("gameState.level1 =" +  gameState.level1);
                gameState.level2 = true;
                console.log("gameState.level2 =" +  gameState.level2);

                return;

        }
        
        else if(gameState.level2){
            console.log("level 2 begins");
            dialogNumber = 3;
            this.interactWithBodwin();
        }
        

    }
    

interactWithBodwin(){
//create dialog box 1
this.dialog = this.createDialogBox(this, 400, 300, dialogSets[dialogNumber][currentLine]); 
//add spacebar input
this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

//this.updateDialogBox();

this.spaceBar.on('down', () => {
    if(gameState.nearBodwin){              
        this.dialog.setVisible(true);            
        console.log("dialog text length: " + dialogSets[dialogNumber].length);

        if(currentLine < dialogSets[dialogNumber].length-1){     
            //create the dialog box
                    
            currentLine++;       
        
            console.log("current line: " + currentLine);
            console.log("text: " + dialogSets[dialogNumber][currentLine]);
            
            this.updateDialogBox();
            
        } else{
            
            this.dialog.setVisible(false); //hide dialog box.
            this.scene.resume('GameScene');  
            currentLine = -1;
            //when the spacebar is clicked to minimise the dialog box, the currentline gets set to 0
            //then then it is pressed again to activate the dialog, it immediately changes to 1 and only displays the 
            //second line of dialog, never the first. That is why I need to change the currentline to -1, when it resets
            
            //this.updateDialogBox();
            console.log("this is happening!");
            console.log("gameState.level1 =" +  gameState.level1);
            console.log("gameState.level2 =" +  gameState.level2);
    }}
    
        else {                   
            console.log("you are not near bodwin dialog will not progress");
        }
});


    }

    createDialogBox(scene, x, y, text){
        let width = 300; 
        let height = 50;

        let dialogBoxX = 960/3;
        let dialogBoxY = 640/1.6;

        //create graphics object for dialog box
        let graphics = this.add.graphics();
        graphics.fillStyle(0x000000, 0.8);
        graphics.fillRoundedRect(dialogBoxX, dialogBoxY, width, height, 10);
        graphics.setInteractive(); // <-- Add this to avoid the error

        //create text object
        this.dialogText = this.add.text(dialogBoxX + 10, dialogBoxY + 10, text, {
            fontFamily: 'Georgia',
            fontSize: '14px',
            color: '#ffffff',
            WordWrap: { width: width - 40}
        });


       const dialogContainer = this.add.container(0, 0,[graphics, this.dialogText]);

        dialogContainer.setVisible(true);
        // Return the container so you can control it later
        return dialogContainer;
   
    }

    updateDialogBox() {
        this.dialogText.setText(dialogSets[dialogNumber][currentLine]);  // Update the dialog text
    }

    resetDialog(){
        currentLine = 0;
        this.dialog.destroy();
        this.dialog = this.createDialogBox(this, 400, 300, dialogSets[dialogNumber][currentLine]);
    }
    

}

export default dialogBoxScene;