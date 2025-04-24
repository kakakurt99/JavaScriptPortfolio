const maxInventory = 10; 


class inventory {


    constructor(scene, slotImage){
            this.inventoryItems = [];
            this.scene = scene;
            this.slotImage = slotImage;
    }



   

    //METHOD TO ADD ITEM TO INV

    addItem(item){
        if(item.amount === 0 ){
            item.amount++;
            this.inventoryItems.push(item);
            this.updateInventoryGUI(); //call to update after item is added
            console.log(`${item.name} has been added to the inventory`);
        }
        else {
           if(item.amount >= 1) {
            item.amount++;
            this.updateInventoryGUI(); //call to update after item is added
            console.log(`${item.name} + 1 - total amount: ${item.amount}`)
           }
        }
            
    }

    removeItem(item){
        const index = this.inventoryItems.indexOf(inventoryItems);
        if(index !== -1){
            this.inventoryItems.splice(index, 1);
            this.updateInventoryGUI(); //update GUI after item is removed.
        }

        //this.inventoryItems = this.inventoryItems.filter(item => item.name !== "coffee seed");
        
    }

    createInventoryGUI(scene){
        const xPos = 55; // x position of first slot
        const yPos = 590; //y position of the bar
        const padding = 8; //space between each slot
        const slotSize = 64; //size of each inventory slot

        let numberOfSlots = 6;
      
        // Loop through and create empty inventory slots
        for (let i = 0; i < numberOfSlots; i++) {
            // Create an empty inventory slot (this could be an empty image or a colored rectangle)
            let itemSlot = scene.add.image(xPos + (i % 6) * (slotSize + padding), yPos, this.slotImage); // Slot background
            itemSlot.setScale(1);  // Scale down the slot image if needed
            itemSlot.setScrollFactor(0); // fix images to screen.
        }

        this.inventory.forEach((item, index) => {
            let itemDisplay = scene.add.image(100 + index * 6, 100, item.imageKey);
        })
    }


    updateInventoryGUI(scene){
        //clear the existing inventoryItems form the screen first
        scene.children.removeAll();

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


    


}


export default inventory;