export function createAnimations(scene){
    
    
    scene.anims.create({
        key: 'grindBeans',
        frames: scene.anims.generateFrameNumbers('grindingBeansAnim', { start: 0, end: 11}),
        frameRate: 6,
        repeat: 10
    });



}