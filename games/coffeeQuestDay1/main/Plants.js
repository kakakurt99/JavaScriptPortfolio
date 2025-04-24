import inventory from './inventory.js';

let myInventory = new inventory();

class Plants {
    constructor(name, bean, growthTime, maxGrowthStage = 5, sprite = null){
        this.name = name;
        this.bean = bean;
        this.growthTime = growthTime; //time for seed to grow
        this.growthStage = 0; //initial stage
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


