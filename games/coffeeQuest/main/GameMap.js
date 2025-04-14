export default class GameMap {
    constructor(scene, mapKey, ...tilesetKeys) {
        this.scene = scene;
        this.mapKey = mapKey;
        this.tilesetKeys = tilesetKeys;
        this.createMap();
    }


    createMap(){

        // Load the tilemap
        this.map = this.scene.make.tilemap({ key: this.mapKey });

        // Add the tileset image to the map to support multiple tilesets
        this.tilesetImages = this.tilesetKeys.map(key => {
            return this.map.addTilesetImage(key, key);
        });


        // Create the layers
        this.buildinglayer = this.map.createLayer("buildinglayer", this.tilesetImages, 0, 0);
        this.groundlayer = this.map.createLayer("groundlayer", this.tilesetImages, 0, 0);

        // (Optional) Set depth or enable collision here if needed
        this.buildinglayer.setCollisionByProperty({ collides: true });
        this.buildinglayer.setDepth(1);

        this.groundlayer.setDepth(0);
    }

    getSpawnPoint(name = "playerSpawn", layerName = "objectlayer") {
        const layer = this.map.getObjectLayer(layerName);

        if (!layer) {
            console.warn(`Object layer "${layerName}" not found.`);
            return { x: 0, y: 0 };
        }

        const point = layer.objects.find(obj => obj.name === name);

        if (!point) {
            console.warn(`Spawn point "${name}" not found in "${layerName}".`);
            return { x: 0, y: 0 };
        }

        return { x: point.x, y: point.y };
    }
}