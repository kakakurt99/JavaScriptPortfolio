import gameState from './gameState.js';


class Plants {
    constructor(name, growthTime, growthStage = 0, maxGrowthStage = 50, sprite = null){
        this.name = name;
        this.growthTime = growthTime; //time for seed to grow
        this.growthStage = growthStage; //initial stage
        this.maxGrowthStage = maxGrowthStage; //e.g. 3 growth stages
        this.sprite = sprite; //assign sprite later
    }

    assignSprite(sprite){
        this.sprite = sprite;
    }

startGrowth(){

    const interval = setInterval(() =>{
        if(this.growthStage < this.maxGrowthStage){
            this.growthStage++;
            
                this.sprite.setFrame(this.growthStage);
            
            console.log(`${this.name} has reached growth stage ${this.growthStage}!`);
        } else{
            clearInterval(interval);
            console.log(`${this.name} is fully grown!`);
        }
    }, this.growthTime);
   
}


harvestCrop(){
    this.growthStage = 0;
    this.sprite.setFrame(this.growthStage);
    console.log("growth stage is : " + this.growthStage);
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