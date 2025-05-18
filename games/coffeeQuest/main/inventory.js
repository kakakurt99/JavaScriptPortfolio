import gameState from './gameState.js'
import Dialogue from './Dialogue.js';
import Shop from './Shop.js';

const maxInventory = 10; 


class inventory {


    constructor(scene, slotImage, inventoryBox, imageKey){
            this.inventoryItems = gameState.playerInventory;
            this.scene = scene;
            this.slotImage = slotImage;
            this.inventoryBox = inventoryBox;
            this.imageKey = imageKey;
            this.selectedSlot = null;
            this.slotDisplayObjects = [];
            this.itemDisplayObjects = []; // Store item image objects
            this.itemNameDisplayObjects =[]; //store item names as objects
            this.itemAmountDisplayObjects = [];
            this.drawChars = [];
            this.coinPouchGUIX = 730;
            this.coinPouchGUIY = 140;
            this.itemInSlot;
            
            

            this.dialogueFont = new Dialogue(this.scene, 'charSheet');
            this.shop = new Shop();
 
            this.createToolTip(this.scene);
            this.createSelectorImage();
    }


    getItem(itemName){
        return this.inventoryItems.find(item => item.name === itemName);
    }

    //METHOD TO ADD ITEM TO INV
    addItem(newItem) {
        let existingItem = this.inventoryItems.find(item => item.name === newItem.name);
    
        if (existingItem) {
            existingItem.amount++;
            console.log(`${newItem.name} +1 - total amount: ${existingItem.amount}`);
        } else {
            newItem.amount = 1;
            this.inventoryItems.push(newItem);
            console.log(`${newItem.name} has been added to the inventory`);
        }
    
        this.updateInventoryGUI(this.scene);
        this.listItems();
    }

    removeItem(item){
        const index = this.inventoryItems.indexOf(item);
console.log("this happens...");
        if(item.amount === 1){
            if(index !== -1){
                this.inventoryItems.splice(index, 1);
                this.updateInventoryGUI(this.scene); //update GUI after item is removed.
                console.log(`${item.name} has been removed from the inventory.`);
                item.amount = 0;

                console.log("amount of seeds = " + item.amount);
            }
        }
         else {

            if(item.amount >= 1){
                item.amount --;
                this.updateInventoryGUI(this.scene);
                console.log("amount reduced");
            }
        }

        
        //this.inventoryItems = this.inventoryItems.filter(item => item.name !== "coffee seed"); 
    }

    createInventoryGUI(scene){   
        if(!scene){
            console.error("scene is currently undefined.");
            return;
        }
        const xPos = 200; // x position of first slot
        const yPos = 490; //y position of the bar
        const padding = -19; //space between each slot
        const slotSize = 64; //size of each inventory slot

        let numberOfSlots = 6;
        let slotsInRow = 6;

        let inventoryBoxImage = scene.add.image(xPos + 130, yPos, this.inventoryBox);
        inventoryBoxImage.setScrollFactor(0);
        inventoryBoxImage.setVisible(false);


        //create empty slots only once.
        if(this.slotDisplayObjects.length === 0){
            // Loop through and create empty inventory slots
            //CREATE INVENTORY SLOTS ON THE SCREEN
            for (let i = 0; i < numberOfSlots; i++) {
                let itemSlot = scene.add.image(xPos + (i % slotsInRow) * (slotSize + padding), yPos + Math.floor(i / slotsInRow) * (slotSize + padding), this.slotImage); // Slot background
                
                itemSlot.setScale(0.7); // Scale down the slot image if needed
                itemSlot.setScrollFactor(0); // Fix images to screen
                itemSlot.setDepth(10);
                this.slotDisplayObjects.push(itemSlot); // Save the slot reference
        }
    }
        // Loop through inventoryItems and display their images
        //CREATE IMAGE OF ITEM WHEN ITEM IS IN INVENTORY
        this.inventoryItems.forEach((item, index) => {
            let itemSlot = this.slotDisplayObjects[index];
            if (itemSlot) {
                console.log(item.imageKey);
                console.log(`Setting frame for ${item.name}: ${item.frame}`);

                let itemFrame = item.frame ?? 0;

                // Optional override for coffee cup logic
                // Update frame logic for coffee cup
                if (item.name.includes('Coffee Cup')) {
                    itemFrame = item.contains === 'water' ? 1 : 0;
                    console.log("Coffee Cup item frame set to: ", itemFrame);
        }


        //check if itemdisplay already exists
        let itemDisplay = this.itemDisplayObjects[index];

        if(itemDisplay){
            itemDisplay.setFrame(itemFrame);
            console.log("Updated frame for existing itemDisplay: ", itemFrame);
        } else{
                

                    itemDisplay = scene.add.sprite(itemSlot.x, itemSlot.y, item.imageKey, itemFrame)
                    .setInteractive({ useHandCursor: true}) // enable input + hand cursor
                    .setScale(0.7) // Scale down the item image if needed
                    .setOrigin(0.5)
                    .setSize(64,64)
                    .setDepth(12)
                    .setScrollFactor(0); // Fix images to screen

                this.itemDisplayObjects.push(itemDisplay); // Store the item display object
            }
                let itemAmountText = scene.add.text(itemSlot.x + 5, itemSlot.y + 10, "x" + item.amount);
                itemAmountText.setStyle({font: '8px', color: '#000000'});
                itemAmountText.setScrollFactor(0);
                itemAmountText.setDepth(12)
                this.itemAmountDisplayObjects.push(itemAmountText);

            //ADD INTERACTIONS WITH ITEMS ON SCREEN
            itemDisplay.on('pointerover', () => {
                console.log('pointer is over the item');
                this.itemInfoDisplay = this.showItemTooltip(item, itemDisplay.x, itemDisplay.y - 50);
                itemDisplay.setTint(0xffffaa);
            });
            
            itemDisplay.on('pointerout', () => {
                this.hideItemTooltip();
                itemDisplay.clearTint();
            });

            itemDisplay.on('pointerdown', () =>{
                this.selectSlot(index);
            })

            this.scene.input.setDefaultCursor('pointer');
       




            }
        });
    }
     //update inventory item images without clearing the slots / everything in the scene
    updateInventoryGUI(scene){
        console.log('Updating inventory GUI...');
        //clear previous item images
        this.itemDisplayObjects.forEach(itemDisplay => {
           if(itemDisplay) itemDisplay.destroy(); // image objects
        });

        //clear previous item name text
        this.itemNameDisplayObjects.forEach(itemNameText => {
            if(itemNameText) {
                this.dialogueFont.clearText(itemNameText);
            }
                
        });

        //clear previous item amount number
        this.itemAmountDisplayObjects.forEach(itemAmountText => {
           if(itemAmountText) itemAmountText.destroy(); // number objects
        });


        this.itemDisplayObjects = []; // Reset the array of item images
        this.itemNameDisplayObjects = [];
        this.itemAmountDisplayObjects =[]; 

        //redraw the inventory based on current inventoryItems
        this.createInventoryGUI(scene);
    }

    createMoneyPouchGUI(scene){
        let moneyGUI = scene.add.image(this.coinPouchGUIX, this.coinPouchGUIY, this.slotImage);
        moneyGUI.setScrollFactor(0);
        moneyGUI.setScale(1.5, 0.5);
        moneyGUI.setDepth(10);
        this.moneyGUIText = this.dialogueFont.drawText("coins: " + gameState.playerCurrency, moneyGUI.x-40, moneyGUI.y-10);

    }

    updateMoneyGUI(scene){
        if(this.moneyGUIText) {
            this.dialogueFont.clearText(this.moneyGUIText);
        }
        this.createMoneyPouchGUI(scene);
    }

    //method to list all items in inventory.
    listItems() {
        if(this.inventoryItems.length === 0){
            console.log("The inventory is empty.");
        } else{
            console.log("Items in the inventory: ");
            this.inventoryItems.forEach((item, index) => {
                console.log(`${index + 1}. ${item.name} - ${item.type} - (Value: ${item.value}) - amount: ${item.amount}`);
            });
        }
    }

    createToolTip(scene){
        this.tooltipText = scene.add.text(0, 0, '', {
            font: '16px Arial',
            fill: '#fff',
            backgroundColor: '#000',
            padding: {x:5, y:3},
        }).setDepth(1000).setVisible(false).setScrollFactor(0);
}

    showItemTooltip(item, x, y) {

        this.tooltipText.setText(`${item.name}\nValue: ${item.value}`);
        this.tooltipText.setPosition(x+10, y-10);
        this.tooltipText.setVisible(true);

    }

    hideItemTooltip(){
        this.tooltipText.setVisible(false);
    }

    updateItemTooltip(scene){
        
    }

    createSelectorImage() {
        if (!this.selectorImage) {
            this.selectorImage = this.scene.add.image(0, 0, this.slotImage)
                .setScale(0.8)
                .setScrollFactor(0)
                .setDepth(11)
                .setVisible(false);
        }
    }

    selectSlot(index) {
        const selectedSlot = this.slotDisplayObjects[index];
        this.itemInSlot = this.inventoryItems[index];


        if(selectedSlot){

            if(this.selectedSlot === selectedSlot){
                this.selectedItem = null;
                this.selectorImage.setVisible(false);
                this.hideItemTooltip();
                this.selectedSlot = null;
                this.itemInSlot = null;
            } else{

                this.selectedItem = selectedSlot.item || null; //null if no item in slot
                this.selectorImage.setPosition(selectedSlot.x, selectedSlot.y);
                this.selectorImage.setVisible(true);


                if(this.itemInSlot){
                    this.getItemInSlot();
                    console.log(`selected item: ${this.itemInSlot.name}`);
                } else {
                    console.log(`Empty slot selected (index: ${index})`);
                    //console.log("selected slot = slotDisplayObjects[index]", selectedSlot);
                    console.log("item in slot = inventoryitems[index]", this.itemInSlot);
                    console.log("does selectedslot have item?", selectedSlot.item);
                   // console.log("Does itemInSlot have item? ", itemInSlot.item);
                }


                // Update the reference to the currently selected slot
            this.selectedSlot = selectedSlot;
            }
            

        
    }

}


setItemInSlot(item){
    console.log("Setting item in slot: ", item);
    this.itemInSlot = item;
}


getItemInSlot(){
    return this.itemInSlot;
}





    enableInventoryControls() {
        const keys = this.scene.input.keyboard.addKeys({
            one: Phaser.Input.Keyboard.KeyCodes.ONE,
            two: Phaser.Input.Keyboard.KeyCodes.TWO,
            three: Phaser.Input.Keyboard.KeyCodes.THREE,
            four: Phaser.Input.Keyboard.KeyCodes.FOUR,
            five: Phaser.Input.Keyboard.KeyCodes.FIVE,
            six: Phaser.Input.Keyboard.KeyCodes.SIX,
        });
    
        keys.one.on('down', () => this.selectInventoryIndex(0));
        keys.two.on('down', () => this.selectInventoryIndex(1));
        keys.three.on('down', () => this.selectInventoryIndex(2));
        keys.four.on('down', () => this.selectInventoryIndex(3));
        keys.five.on('down', () => this.selectInventoryIndex(4));
        keys.six.on('down', () => this.selectInventoryIndex(5));
    }
    
    selectInventoryIndex(index) {
        if (index >= 0 && index < this.slotDisplayObjects.length) {
            this.selectedIndex = index;
            this.selectSlot(index);
        }
    }



    }


export default inventory;