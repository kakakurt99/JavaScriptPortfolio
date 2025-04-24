
import gameState from './gameState.js';
import inventory from './inventory.js';


class Shop {

    constructor(scene) {

    this.scene = scene;
    this.items = [];
    this.buttons = [];
    this.playerInventory = gameState.playerInventory;

    }



    resumeMainScene(){
        console.log("resumeMainScene executes.");
        if(gameState.paused){
            console.log("gameState.paused in shop class: " + gameState.paused);
            this.input.keyboard.on('keydown-R', () => {
                this.scene.pause();
                this.main.scene.resume();
            })
        }
    }


    //display items for sale 

    async createShopGUI(){   

        if (this.guiCreated) return;   // 👈 prevent multiple GUI creation

        if(!this.scene){
            console.error("scene is currently undefined.");
            return;
        }


        this.shopContainer = this.scene.add.container(306,80);
        const elementsToAdd = [];

        const shopTitle = this.scene.add.text(100, 25, 'Shop', {
            font: '20px Arial',
            fill: '#fff'})
            .setOrigin(0.5);

            //get shop items from the server
            await this.loadShopData();


           // const elementsToAdd = []; // all display objects go in the container
            const bg = this.scene.add.graphics();
            bg.fillStyle(0xbf9a6e, 1);
            bg.fillRect(10, 0, 500, 320);
            
            elementsToAdd.push(bg, shopTitle);

            //display items in shop
            this.items.forEach((item, index) => {
                const yPos = 150 + index * 50;
           
        const sprite = this.scene.add.sprite(60, yPos, 'shopItems'); //The index is the frame number
                sprite.setOrigin(0);
                sprite.setVisible(false);
            
            
                //create item text            
        const itemText = this.scene.add.text(75, yPos - 75, `${item.name} - Price: ${item.shopPrice} coins`, {
                    font: '16px Arial',
                    fill: '#fff'
            });

        //create buy button for each item
        const button = this.scene.add.text(450, yPos -72, 'Buy',{
                font: '16px Arial',
                fill: '#0f0'
            })
            .setInteractive()
            .on('pointerdown', () => this.shopSellItemToPlayer(item));

        const buttonBg = this.scene.add.graphics();
        buttonBg.fillStyle(0x000000, 1);
        buttonBg.fillRect(445, yPos -75, 45, 25);

        this.buttons.push(button);

        elementsToAdd.push(sprite, itemText, buttonBg, button);


            });

            this.shopContainer.add(elementsToAdd);
            this.shopContainer.setDepth(4);


            this.guiCreated = true;       // 👈 flag it so we don’t recreate
    }



    async loadShopData(){
        try {
            const response = await fetch('http://localhost:3000/shop');
            if(!response.ok){
                throw new Error('Failed to fetch shop data');
            }
            this.items = await response.json();
            console.log('Shop items: ', this.items);
        } catch (error){
            console.log('Error loading shop data:', error);
        }
    }

    getItemData(id){
        return this.items[id];
    }


    getItem(name){
        return this.items[name];
    }




    shopSellItemToPlayer(item) {
        const playerCoins = gameState.playerCurrency;

        if(playerCoins >= item.shopPrice){
            gameState.playerCurrency -= item.shopPrice; //deduct price from players coins
            console.log(`You bought ${item.name}!`);
            this.playerInventory.addItem(item);
            this.playerInventory.updateMoneyGUI(this.scene);
        } else {
            console.log(`You dont have enough coins for that!`);
        }
    }
    


    openShop() {
        if (this.scene) {
            this.createShopGUI();
            this.showShopUI();
        } else {
            console.error("Scene is undefined.");
        }
    }

    closeShop() {
        if (this.scene) {
            this.hideShopUI();
            gameState.paused = false;
        } else {
            console.error("Scene is undefined.");
        }
    }
  // Placeholder method for showing the UI (You can add additional elements here)
  showShopUI() {
    console.log("Shop UI is now visible.");
    // Add your shop UI logic here
    this.shopContainer.setVisible(true);
    }

    // Placeholder method for hiding the UI
    hideShopUI() {
        console.log("Shop UI is now hidden.");
        this.shopContainer.setVisible(false);
        gameState.gamePaused = false;
    }

    // Exit the shop scene
    exitScene() {
    }


    shopBuyItemFromPlayer() {
    }

    giveItemToPlayer() {
    }
}

export default Shop;