import gameState from './gameState.js';


class Plants {
    constructor(name, growthTime, growthStage = 0, maxGrowthStage = 6) {
        this.name = name;
        this.growthTime = growthTime; // total time to fully grow
        this.growthStage = growthStage;
        this.maxGrowthStage = maxGrowthStage;
        this.sprite = null;
        this.growthTimer = null;
        this.growthCallback = null;
    }


assignSprite(sprite){
        this.sprite = sprite;
    }



startGrowth(){

    const intervalTime = this.growthTime / this.maxGrowthStage;

    const interval = setInterval(() =>{
        if(this.growthStage < this.maxGrowthStage){
            this.growthStage++;
            
                this.sprite.setFrame(this.growthStage);
            
            console.log(`${this.name} has reached growth stage ${this.growthStage}!`);

            if(this.onGrowthUpdateCallback){
                this.onGrowthUpdateCallback(this.growthStage);
            }



        } else{
            clearInterval(interval);
            console.log(`${this.name} is fully grown!`);
    
        }
    }, 1000);
   
}

destroy() {
    if (this.sprite) {
        this.sprite.destroy();
    }
    if (this.growthTimer) {
        clearInterval(this.growthTimer);
    }
}


 // Method to set the growth update callback
 onGrowthUpdate(callback) {
    this.onGrowthUpdateCallback = callback;
  }



}


export default Plants;


/*

plant ideas

--basic pot --
-> can put compost in
-> can put seeds in, if it has compost
-> can grow into small size coffee plant

--> small plant = 3 beans every 3 days

--> medium pot
--> same as basic
--> can grow into medium size coffee plant

--> medium plant = 5 beans every 3 days



--> large pot
--> can grow into coffee bean tree

--> large plant = 8 beans every 3 days





----> large pot can be planted as a tree

----> tree produces 10 beans every 2 days 






*/