
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


        this.shopContainer = this.scene.add.container(306,60);
        const elementsToAdd = [];

      //  const shopTitle = this.scene.add.text(260, 25, 'Shop', {
      //      font: '20px Arial',
     //       fill: '#fff'})
     //       .setOrigin(0.5);

            //get shop items from the server
            //await this.loadShopData();
            await this.loadItemData();

            //filter out items that aren't in the shop

            this.items = this.items.filter(item => item.isAvailableInShop !== false);


           // const elementsToAdd = []; // all display objects go in the container
            const bg = this.scene.add.graphics();
            bg.fillStyle(0xbf9a6e, 1);
            bg.fillRect(10, 0, 500, 400);

            bg.lineStyle(4, 0x000000, 1);
            bg.strokeRect(10, 0, 500, 400);
            
            elementsToAdd.push(bg);

            const itemsPerRow = 1;
            const spacingX = 260; 
            const spacingY = 40; 


            //display items in shop
            this.items.forEach((item, index) => {

                const row = Math.floor(index / itemsPerRow);
                const col = index % itemsPerRow;

                const xPos = 60+col*spacingX;
                const yPos = 20+row*spacingY;
                


               // const yPos = 150 + index * 50;
           
        const sprite = this.scene.add.sprite(60, yPos, 'shopItems'); //The index is the frame number
                sprite.setOrigin(0);
                sprite.setVisible(false);
            
            
                //create item text            
        const itemText = this.scene.add.text(xPos, yPos, `${item.name}`, {
                    font: 'bold 14px Arial',
                    fill: '#000000'
            });

            const itemPrice = this.scene.add.text(xPos+ 220, yPos, `${item.shopPrice} coins`, {
                font: 'bold 14px Arial',
                fill: '#000000'
        });

        //create buy button for each item
        const button = this.scene.add.text(xPos+396, yPos-2, 'Buy',{
                font: 'bold 14px Arial',
                fill: '#000000'
            })
            .setInteractive()
            .on('pointerdown', () => this.shopSellItemToPlayer(item));

        const buttonBg = this.scene.add.graphics();
        buttonBg.fillStyle(0xffd9a3, 1);
        buttonBg.fillRect(xPos+390, yPos-5, 45, 25);
        buttonBg.lineStyle(4, 0x000000, 1);
        buttonBg.strokeRect(xPos+390, yPos-5, 45, 25);

        

        this.buttons.push(button);
        elementsToAdd.push(sprite, itemText, itemPrice, buttonBg, button);

            });
            this.shopContainer.add(elementsToAdd);
            this.shopContainer.setDepth(15);
            this.guiCreated = true;       // 👈 flag it so we don’t recreate
    
    
        }

        async loadItemData() {
            if (this.isLoadingItemData) return; // Don't double fetch!
            this.isLoadingItemData = true;
        
            try {
                const response = await fetch('http://localhost:3000/items');
                if (!response.ok) {
                    throw new Error('Failed to fetch item data');
                }
                this.items = await response.json();
                console.log('Shop items: ', this.items);
            } catch (error) {
                console.log('Error loading shop data:', error);
            } finally {
                this.isLoadingItemData = false;
            }
        }

    async loadShopData() {
        if (this.isLoadingShopData) return; // Don't double fetch!
        this.isLoadingShopData = true;
    
        try {
            const response = await fetch('http://localhost:3000/shop');
            if (!response.ok) {
                throw new Error('Failed to fetch shop data');
            }
            this.items = await response.json();
            console.log('Shop items: ', this.items);
        } catch (error) {
            console.log('Error loading shop data:', error);
        } finally {
            this.isLoadingShopData = false;
        }
    }

    getItemData(id){
        return this.items[id];
    }


    getItem(name){
        console.log("attempting to get item..")
        const item = this.items.find(item => item.name === name);
        console.log(item);
        return item;

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