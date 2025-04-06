import inventory from './inventory.js';

class Character{
    
    constructor(name) {
    this.name = name;
    this.level = 1;
    this.exp = 0;
    this.health = 10; 
    this.strength = 1;
    this.weapon = "sword";

    //store inventory scene reference
    }

    getStrength(){
        return this.strength;
    }

    setStrength(value){
        this.strength = value;
    }

    gainExp(amount){
        this.exp += amount;
        this.checkLevelUp();
    }

    checkLevelUp(){
        const expToLevelUp = this.level * 100; 
        if(this.exp >= expToLevelUp){
            this.exp -= expToLevelUp;
            this.level++;
            this.strength += 1;
            this.health += 1;

            console.log(`${this.name} leveled up to Level ${this.level}!`);
        }
    }


    showPlayerStats(){

        console.log("Your name is: " + this.name);
        console.log("You are level: " + this.level);
        console.log("Current exp: " + this.exp);
        console.log("Your strength is: " + this.getStrength());
        
    }

}

export default Character;