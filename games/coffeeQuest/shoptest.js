

class shoptest{


    async createShop(){

        this.shopContainer = this.scene.add.container(480, 320);
        const elementsToAdd = [];


        const graphics = this.scene.add.graphics();

        graphics.lineStyle(2, 0xff0000, 1); // red box with line width of 2

        //draw a rectangle, positioned at containers top-left corner with container width/height
        graphics.strokeRect(-100, -100, 200, 200);

        this.shopContainer.add(graphics);

        const title = this.scene.add.text(0, 0, 'HITBOX', { font: '32px Arial', fill: '#fff' });
        this.shopContainer.add(title);

        // Add event listener for pointerdown
        this.shopContainer.on('pointerdown', () => {
            console.log('Container clicked!');
        });
        

    }



}





