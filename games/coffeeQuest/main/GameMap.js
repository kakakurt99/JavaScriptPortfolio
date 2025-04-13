export default class GameMap {
    constructor(scene, mapKey, tilesetConfigs) {
        this.scene = scene;

        // First, create the map
        this.map = scene.make.tilemap({ key: mapKey, tileWidth: 32, tileHeight: 32 });

        //add all tilesets
        
        const tilesetGround = this.map.addTilesetImage('tilesA', 'tilesAKey');
        const tilesBuildings = this.map.addTilesetImage('house1', 'taraHouseKey');
        const tilesExtras = this.map.addTilesetImage('extras', 'extrasKey'); 

        const tilesets = [tilesetGround, tilesBuildings, tilesExtras];

        this.groundLayer = this.map.createLayer("Ground", tilesets, 0,0);
        this.buildingLayer = this.map.createLayer("buildinglayer", tilesets, 0, 0);
        this.extrasLayer = this.map.createLayer("extras", tilesets, 0, 0);
        

        this.buildingLayer.setCollisionByProperty({ collides: true});
        this.extrasLayer.setCollisionByProperty({ collides: true});
        // Create layers using all tilesets
        const graphics = this.scene.add.graphics();

        this.buildingLayer.renderDebug(graphics, {
            tileColor: new Phaser.Display.Color(0, 0, 0, 0), // Transparent for non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255), // Red for colliding tiles
            faceColor: new Phaser.Display.Color(0, 255, 0, 255) // Green for tile faces
        });

        // Render only for the building layer
        this.extrasLayer.renderDebug(graphics, {
            tileColor: new Phaser.Display.Color(0, 0, 0, 0), // Green for regular tiles
            collidingTileColor: new Phaser.Display.Color(255, 0, 0, 255), // Red for colliding tiles
            faceColor: new Phaser.Display.Color(0, 255, 0, 255) // Green for tile faces
        });
        
        this.groundLayer.setDepth(0);
        this.buildingLayer.setDepth(2);
        //this.extrasLayer.setDepth(2);
        // Parse spawn points and objects
        this.spawnPoints = this._parseSpawnPoints('Objectlayer');

        console.log("map is here: " +this.map);
        console.log('Available layers:', this.map.layers);
    }

    _parseSpawnPoints(layerName) {
        const points = {};
        const layer = this.map.getObjectLayer(layerName);

        if (!layer) {
            console.error(`Layer "${layerName}" not found!`);
            return points;
        }

        if (!Array.isArray(layer.objects)) {
            console.error(`layer.objects is not an array:`, layer.objects);
            return points;
        }

        if (layer.objects.length === 0) {
            console.warn(`No objects found in the layer "${layerName}".`);
        }

        for (let obj of layer.objects) {
            points[obj.name] = obj;
        }

        return points;
    }

    getSpawnPoint(name = 'PlayerSpawn') {
        return this.spawnPoints[name] || { x: 0, y: 0 };
    }
}