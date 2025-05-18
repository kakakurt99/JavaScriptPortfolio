const express = require('express');
const app = express();

// Disable caching
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

const port = 3000;

// Item list
const items = [
  { 
    id: 1, 
    name: 'Arabica Seed', 
    isAvailableInShop: true,  
    shopPrice: 2,	
    value: 1, 
    type: 'seed',
    quantity: 0, 
    growthTime: 60,
    maxGrowthStage: 6,
    imageKey: 'shopItems',
    frame: 0 
  },
  {
    id: 2,
    cropId: 1,
    name: 'Arabica Bean',
    value: 1,
    quantity: 0,
    type: 'bean',
    imageKey: 'coffeeBeans',
    frame: 0
  },
  {
    id: 3, 
    name: 'Robusta Seed', 
    isAvailableInShop: true,  
    shopPrice: 5,	
    value: 2, 
    type: 'seed',
    quantity: 0, 
    growthTime: 45,
    maxGrowthStage: 6,
    imageKey: 'shopItems',
    frame: 1 
  },
  {
    id: 4,
    cropId: 3,
    name: 'Robusta Bean',
    value: 15,
    quantity: 0,
    type: 'bean',
    imageKey: 'coffeeBeans',
    frame: 2
  },
  {
    id: 5, 
    name: 'Geisha Seed', 
    isAvailableInShop: true,  
    shopPrice: 10,	
    value: 2, 
    type: 'seed',
    quantity: 0, 
    growthTime: 90,
    maxGrowthStage: 6,
    imageKey: 'shopItems',
    frame: 2
  },
  {
    id: 6,
    cropId: 5,
    name: 'Geisha Bean',
    value: 100,
    quantity: 0,
    type: 'bean',
    imageKey: 'coffeeBeans',
    frame: 3
  },
  {
    id: 7, 
    name: 'Plant Pot (Small)',
    size: 'small',
    growthTime: 0,  
    value: 5,
    isAvailableInShop: true,
    shopPrice: 10,
    quantity: 0,
    type: 'pot',
    imageKey: 'potItems',
    frame: 0 
  },
  {
    id: 8, 
    name: 'Plant Pot (Medium)',
    size: 'medium',
    growthTime: 0,  
    value: 15,
    isAvailableInShop: true,
    shopPrice: 30,
    quantity: 0,
    type: 'pot',
    imageKey: 'potItems',
    frame: 1 
  },
  {
    id: 9, 
    name: 'Plant Pot (Large)',
    size: 'large',
    growthTime: 0,  
    value: 25,
    isAvailableInShop: true,
    shopPrice: 50,
    quantity: 0,
    type: 'pot',
    imageKey: 'potItems',
    frame: 2 
  },
  {
    id: 10, 
    name: 'Compost', 
    shopPrice: 5,
    isAvailableInShop: true,
    value: 5, 
    quantity: 0,
    type: 'soil',
    imageKey: 'compostItems',
    frame: 0
  },
  {
    id: 11, 
    name: 'Coffee Cup (empty)',
    shopPrice: 10,
    isAvailableInShop: true,
    value: 1,
    quantity: 0,
    contains: null,
    type: 'equipment',
    imageKey: 'coffeecups',
    frame: 0
  },
  {
    id: 12, 
    name: 'Coffee Cup (water)',
    shopPrice: 10,
    isAvailableInShop: false,
    value: 1,
    quantity: 0,
    contains: 'water',
    type: 'equipment',
    imageKey: 'coffeecups',
    frame: 1
  }
];

// CORS for Phaser game
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Route to get all items
app.get('/items', (req, res) => {
  res.json(items);
});

// Route to get items by type
app.get('/items/:type', (req, res) => {
  const { type } = req.params;
  const validTypes = ['seed', 'bean', 'soil', 'pot', 'equipment'];

  if (!validTypes.includes(type)) {
    return res.status(400).json({ error: 'Invalid item type' });
  }

  const filteredItems = items.filter(item => item.type === type);
  res.json(filteredItems);
});



// Route to get all beans (excluding shop visibility)
app.get('/beans', (req, res) => {
  const beans = items.filter(item => item.type === 'bean');
  res.json(beans);
});



// Grouped item structure (if you want to use this later)
const grouped = {
  seeds: [],
  beans: [],
  soil: [],
  pots: [],
  equipment: []
};

items.forEach(item => {
  switch (item.type) {
    case 'seed':
      grouped.seeds.push(item);
      break;
    case 'bean':
      grouped.beans.push(item);
      break;
    case 'soil':
      grouped.soil.push(item);
      break;
    case 'pot':
      grouped.pots.push(item);
      break;
    case 'equipment':
      grouped.equipment.push(item);
      break;
    default:
      break;
  }
});

items.forEach(item => {
	if(item.type === 'bean'){
	    item.isAvailableInShop = false;
}
});


app.listen(port, () => {
  console.log(`🌱 Coffee farm server running at http://localhost:${port}`);
});