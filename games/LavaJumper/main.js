let cursors;
let cameraOffset = 0;
let player, platforms, spikes;
let jumpPower = -300;

class main extends Phaser.Scene{

preload() {
  this.load.image('fire', 'assets/fire.png');
  this.load.image('bubble', 'assets/bubble.png');
  this.load.image('spike', 'assets/spike.png');
}

create() {
    platforms = this.physics.add.group({ allowGravity: false, immovable: true });
    spikes = this.physics.add.group({ allowGravity: false, immovable: true });
  
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(50, 350);
      const y = 600 - i * 100;
      const bubble = platforms.create(x, y, 'bubble');
      bubble.setVelocityX(Phaser.Math.Between(-40, 40));
      bubble.setBounce(1);
      bubble.setCollideWorldBounds(true);
    }
  
    player = this.physics.add.sprite(200, 500, 'fire');
    player.setCollideWorldBounds(true);
    player.setBounce(0.1);
  
    this.physics.add.collider(player, platforms);
  
    this.input.on('pointerdown', () => {
      if (player.body.touching.down) {
        player.setVelocityY(jumpPower);
      }
    });
    // Add spike at top every few seconds
  this.time.addEvent({
    delay: 2000,
    callback: () => {
      const x = Phaser.Math.Between(50, 350);
      const spike = spikes.create(x, player.y - 300, 'spike');
      spike.setSize(32, 32).setOffset(0, 0);
    },
    loop: true
  });

  this.physics.add.overlap(player, spikes, () => {
    this.scene.restart();
  }, null, this);

  this.cameras.main.startFollow(player);
  this.cameras.main.setDeadzone(100, 100);

}

update() {
  // Scroll camera up
  if (player.y < this.cameras.main.scrollY + 200) {
    this.cameras.main.scrollY = player.y - 200;
  }

  // Recycle platforms
  platforms.children.iterate(bubble => {
    if (bubble.y > player.y + 300) {
      bubble.y = player.y - Phaser.Math.Between(150, 200);
      bubble.x = Phaser.Math.Between(50, 350);
      bubble.setVelocityX(Phaser.Math.Between(-40, 40));
    }
  });

  // Remove old spikes
  spikes.children.iterate(spike => {
    if (spike.y > player.y + 400) {
      spike.destroy();
    }
  });

  // Game over if player falls
  if (player.y > this.cameras.main.scrollY + 600) {
    this.scene.restart();
  }
}

}

export default main;