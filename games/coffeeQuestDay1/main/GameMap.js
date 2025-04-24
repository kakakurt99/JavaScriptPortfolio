export default class Map {
    constructor(scene, mapKey, tilesetKey) {
        this.scene = scene;

        // Load map and tileset with key from main scene
        this.map = scene.make.tilemap({ key: mapKey, tileWidth: 32, tileHeight: 32 });
        this.tileset = this.map.addTilesetImage('tilesA', tilesetKey);

        // Create layers
        this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
        this.collisionLayer = this.map.createLayer('Collision', this.tileset, 0, 0);
        
        // Enable collisions
        this.collisionLayer.setCollisionByProperty({ collides: true });

        // Parse spawn points and objects
        this.spawnPoints = this._parseSpawnPoints('Object layer');

        console.log(this.map);
        console.log('Available layers:', this.map.layers);
        //this.groundLayer.setDebug(true);
    }

    _parseSpawnPoints(layerName) {
        const points = {};
        const layer = this.map.getObjectLayer(layerName);

        // Log the layer to check its structure
        console.log('Layer: ', layer);


        if (!layer) {
            console.error(`Layer "${layerName}" not found!`);
            return points;
        }

        // Check if layer.objects is an array
        if (!Array.isArray(layer.objects)) {
            console.error(`layer.objects is not an array:`, layer.objects);
            return points;
        }

        // If objects are found in the layer, log and process them
        if (layer.objects.length === 0) {
            console.warn(`No objects found in the layer "${layerName}".`);
        }

        console.log(layer.objects);  // Log the objects for inspection

        // Loop through objects in the layer and save them in points
        for (let obj of layer.objects) {
            points[obj.name] = obj;  // Use the name of the object as the key
        }

        return points;
    }

    getSpawnPoint(name = 'PlayerSpawn') {
        return this.spawnPoints[name] || { x: 0, y: 0 };  // Return default spawn if not found
   }
}