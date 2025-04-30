class CoffeeBean {

    constructor({name, quality, value, imageKey}){
        this.name = name;
        this.type = "bean";
        this.quality = quality; //quality of the bean, used for brewing
        this.value = value; //value of the bean, used for selling   
        this.imageKey = imageKey; //image key for the bean  

    }




    roast(){
        console.log(`${this.name} has been roasted!`); 
    }


toJSON(){
    return {
        name: this.name,
        type: this.type,
        quality: this.quality,
        value: this.value,
        imageKey: this.imageKey
    }
}
}

export default CoffeeBean;