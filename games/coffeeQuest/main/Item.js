import inventory from './inventory.js';

class Item {

constructor(name, type, quality, amount, value, imageKey){

    this.name = name;
    this.type = type; 
    this.quality = quality;
    this.value = value;
    this.amount = amount; 
    this.imageKey = imageKey;
    this.MAX_BEANS = 10;


}

/*plantBeans(){
    if(this.amount > 0) {
        this.amount--;
        console.log("you plant a coffee bean");

        if(this.amount === 0){
            console.log("you've got no beans left lad.");
            myInventory.removeItem(coffeeBean);
        }
    } 
  
}
*/
plantGrowthCycle(){
    // timer - completion %
    //every 2 seconds completion increase by 25 
    //if completion is at 100
    //plant can be interacted with and give player item
}

}


export default Item;