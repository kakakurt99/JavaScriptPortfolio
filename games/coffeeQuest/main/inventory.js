import Dialogue from './Dialogue.js';

const maxInventory = 10; 


class inventory {


    constructor(scene, slotImage, inventoryBox){
            this.inventoryItems = [];
            this.scene = scene;
            this.slotImage = slotImage;
            this.inventoryBox = inventoryBox;
            this.slotDisplayObjects = [];
            this.itemDisplayObjects = []; // Store item image objects
            this.itemNameDisplayObjects =[]; //store item names as objects
            this.itemAmountDisplayObjects = [];
            this.drawChars = [];


    }


    getItem(item){
        return this.items.find(item => item.name === itemName);
    }

    //METHOD TO ADD ITEM TO INV
    addItem(item){
        if(item.amount === 0 ){          
            item.amount++;
            this.inventoryItems.push(item);
            this.updateInventoryGUI(this.scene); //call to update after item is added
            
            console.log(`${item.name} has been added to the inventory`);
        }
        else {
           if(item.amount >= 1) {
            item.amount++;
            this.updateInventoryGUI(this.scene); //call to update after item is added
            console.log(`${item.name} + 1 - total amount: ${item.amount}`)
           }
        }
            
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


        this.dialogueFont = new Dialogue(this.scene, 'charSheet');
       


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
            for (let i = 0; i < numberOfSlots; i++) {
                let itemSlot = scene.add.image(xPos + (i % slotsInRow) * (slotSize + padding), yPos + Math.floor(i / slotsInRow) * (slotSize + padding), this.slotImage); // Slot background
                
                itemSlot.setScale(0.7); // Scale down the slot image if needed
                itemSlot.setScrollFactor(0); // Fix images to screen
                itemSlot.setDepth(0);
                this.slotDisplayObjects.push(itemSlot); // Save the slot reference
        }
    }
    
        

        // Loop through inventoryItems and display their images
        this.inventoryItems.forEach((item, index) => {
            let itemSlot = this.slotDisplayObjects[index];
            if (itemSlot) {
                let itemDisplay = scene.add.image(itemSlot.x, itemSlot.y, item.imageKey)
                    .setScale(0.7) // Scale down the item image if needed
                    .setScrollFactor(0); // Fix images to screen
               this.itemDisplayObjects.push(itemDisplay); // Store the item display object
            
                //let itemNameText = scene.add.text(itemSlot.x - 40, itemSlot.y - 50, item.name);
                
                this.dialogueFont.clearText();
                let itemNameText = this.dialogueFont.drawText(item.name, itemSlot.x - 30, itemSlot.y - 40);

                //itemNameText.setColor('#000000');
                //itemNameText.setScrollFactor(0);
                this.itemNameDisplayObjects.push(itemNameText);


                let itemAmountText = scene.add.text(itemSlot.x + 13, itemSlot.y + 7, "x" + item.amount);
 
                itemAmountText.setStyle({font: '10px', color: '#000000'});
                itemAmountText.setScrollFactor(0);
                this.itemAmountDisplayObjects.push(itemAmountText);
            }
        });
    }

     //update inventory item images without clearing the slots / everything in the scene
    updateInventoryGUI(scene){
      
        //clear previous item images
        this.itemDisplayObjects.forEach(itemDisplay => {
           if(itemDisplay) itemDisplay.destroy(); // Destroy only item images
        });

        //clear previous item name text
        this.itemNameDisplayObjects.forEach(itemNameText => {
            if(itemNameText) itemNameText.destroy(); // Destroy only item images
            this.dialogueFont.clearText();
        });

        //clear previous item amount number
        this.itemAmountDisplayObjects.forEach(itemAmountText => {
           if(itemAmountText) itemAmountText.destroy(); // Destroy only item images
   
        });
        this.itemDisplayObjects = []; // Reset the array of item images
        this.itemNameDisplayObjects = [];
        this.itemAmountDisplayObjects =[]; 

        //redraw the inventory based on current inventoryItems
        this.createInventoryGUI(scene);
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



    showSeedText() {
    this.dialogueFont.drawText("coffee seed", 850, 380);
}


}


export default inventory;