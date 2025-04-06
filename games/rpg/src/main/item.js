class Item extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, itemName){
        super(scene, x, y, texture);

        this.scene = scene;
        this.itemName = itemName; // e.g. "meat", "potion"
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.setInteractive(); //Allows interaction
        this.setDepth(1);

        //Add item to collision group with player
        scene.physics.add.overlap(scene.player, this, this.collectItem, null, this);
    
    }


    collectItem(player){
        if(Phaser.Input.Keyboard.JustDown(this.scene.input.keyboard.addKey('SPACE'))){
            console.log(`${this.itemName} collected!`);

            //Add to inventory
            this.scene.addToInventory(this.itemName);
            

            //Remove from the world
            this.destroy();
        }
    }


 
}

export default Item;