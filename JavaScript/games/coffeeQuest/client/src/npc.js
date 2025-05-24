import gameState from './gameState.js';




export default class Npc {
    constructor(scene, npcImageKey, spawnPoint) {
        this.scene = scene;
        this.npcImageKey = npcImageKey;

        this.createNpc(spawnPoint);
        console.log("npc sprite is created at:" + spawnPoint.x, spawnPoint.y);
        scene.add.existing(this.npc);
    }

    createNpc(spawnPoint){
        
        this.npc = this.scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, this.npcImageKey);
        this.npc.setCollideWorldBounds(true);
        this.npc.setScale(1.4);
        this.npc.setSize(10,5);
        this.npc.setOffset(12,18);
        this.npc.setDepth(5);

    }







}