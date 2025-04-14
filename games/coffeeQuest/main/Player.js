export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.sprite = scene.physics.add.sprite(x, y, 'player');
        this.sprite.setCollideWorldBounds(true);

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    /*update() {
        const sprite = this.sprite;
        sprite.setVelocity(0);

        if (this.cursors.left.isDown) {
            sprite.setVelocityX(-150);
        } else if (this.cursors.right.isDown) {
            sprite.setVelocityX(150);
        }

        if (this.cursors.up.isDown && sprite.body.blocked.down) {
            sprite.setVelocityY(-300);
        }
    }
        */
}