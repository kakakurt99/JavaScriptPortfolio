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
        this.pipelayer = this.map.createLayer("pipelayer", this.tilesetImages, 0, 0);
        this.plantslayer = this.map.createDynamicLayer("plantslayer", this.tilesetImages, 0, 0);
        this.objectlayer = this.map.getObjectLayer("objectlayer");
        this.treelayer = this.map.createLayer("treelayer", this.tilesetImages, 0 , 0);

        // (Optional) Set depth or enable collision here if needed
        this.buildinglayer.setCollisionByProperty({ collides: true });
        this.groundlayer.setCollisionByProperty({ collides: true });
        this.treelayer.setCollisionByProperty({ collides: true });


        this.plantslayer.setDepth(5);
        this.pipelayer.setDepth(2);
        this.buildinglayer.setDepth(2);
        this.groundlayer.setDepth(0);

        const spawnPoint = this.getSpawnPoint("playerSpawn");
        console.log("Spawn point:", spawnPoint);  // Log spawn point location
    }

    getSpawnPoint(name = "playerSpawn", layerName = "objectlayer") {
        const layer = this.map.getObjectLayer(layerName);
        console.log("Object layer:", layer); // See if layer is found

        if (!layer) {
            console.warn(`Object layer "${layerName}" not found.`);
            return { x: 0, y: 0 };
        }

        const point = layer.objects.find(obj => obj.name === name);
        console.log("Found spawn point object:", point); //  See if object is found

        if (!point) {
            console.warn(`Spawn point "${name}" not found in "${layerName}".`);
            return { x: 0, y: 0 };
        }

        return { x: point.x, y: point.y };
    }

    createCollisionObjects(){

        const objectLayer = this.map.getObjectLayer('objectlayer');
        this.collisionObjects = this.scene.physics.add.staticGroup();


        if (!objectLayer) {
            console.warn('No object layer named "objectlayer" found!');
            return;
        }
        objectLayer.objects.forEach((obj) => {
           
        this.namedZones = {};
        
                if (obj.name === 'seedShopSpawn') {
                    const zone = this.scene.physics.add.staticImage(obj.x, obj.y, null)
                        .setSize(obj.width, obj.height)
                        .setOrigin(0, 0)
                        .setOffset(15, 15);

                    this.collisionObjects.add(zone);
                    this.namedZones.seedShop = zone;
                }
        });



    }
}

