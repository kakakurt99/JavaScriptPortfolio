import inventory from './inventory.js';



const gameState = {
    playerX: 320,
    playerY: 300,
    attacking: false,
    nearPlant: false,
    plantFrame: 1,
    playerCurrency: 100,
    gamePaused: false,
    playerInventory: [],
    centerX: null,
    centerY: null
};


export default gameState;