const express = require('express');
const app = express();

// Set cache-control header for all responses
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  next();
});

const port = 3000;

// Simulated crop data
const crops = [
  { 
    id: 1, 
    name: 'Arabica Bean', 
    growthTime: 60,  
    sellPrice: 10, 
    quality: 'B',
    seeds: [
      {
        id: 1, 
        name: 'Arabica Seed',
        shopPrice: 2,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
        type: 'seed',
	growthTime: 60,
	maxGrowthStage: 6,
        cropId: 1,
	imageKey: 'shopItems',
	frame: 0
      }
    ] 
  },
  { 
    id: 2, 
    name: 'Robusta Bean', 
    growthTime: 45,
    sellPrice: 15, 
    quality: 'C',
    seeds: [
      {
        id: 2, 
        name: 'Robusta Seed',
        shopPrice: 5,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
        type: 'seed',
	growthTime: 45,
	maxGrowthStage: 6,
        cropId: 2,
	imageKey: 'shopItems',
	frame: 1
      }
    ]
  },
  { 
    id: 3, 
    name: 'Geisha Bean', 
    growthTime: 90,
    sellPrice: 100,
    quality: 'A',
    seeds: [
      {
        id: 3, 
        name: 'Geisha Seed',
        shopPrice: 10,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
        type: 'seed',
	growthTime: 90,
	maxGrowthStage: 6,
        cropId: 3,
	imageKey: 'shopItems',
	frame: 2
      }
    ]
  },
{ 
    id: 4, 
    name: 'plantpots', 
    growthTime: 0,  
    sellPrice: 10, 
    quality: 'C',
    seeds: [
      {
        id: 4, 
        name: 'Basic Pot',
        shopPrice: 10,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
        type: 'pot',
	imageKey: 'potItems',
	frame: 0
      }
    ] 
  },
{ 
    id: 5, 
    name: 'plantpots', 
    growthTime: 0,  
    sellPrice: 10, 
    quality: 'C',
    seeds: [
      {
        id: 5, 
        name: 'Compost',
        shopPrice: 10,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
        type: 'soil',
	imageKey: 'compostItems',
	frame: 0
      }
    ] 
  },
{ 
    id: 6, 
    name: 'utensils', 
    growthTime: 0,  
    sellPrice: 10, 
    quality: 'C',
    seeds: [
      {
        id: 6, 
        name: 'Coffee Cup (empty)',
        shopPrice: 10,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
	contains: null,
        type: 'equipment',
	imageKey: 'coffeecups',
	frame: 0
      },
	{
        id: 7, 
        name: 'Coffee Cup (water)',
        shopPrice: 10,  // Changed to number
	isAvailableInShop: true,
	value: 1,
        quantity: 0,
	contains: 'water',
        type: 'equipment',
	imageKey: 'coffeecups',
	frame: 1
      }
    ] 
  },
];

// Allow requests from your Phaser game
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Route to send shop data (just seeds for now)
app.get('/shop', (req, res) => {
  // Extract seeds from each crop and flatten into a single array
  const shopItems = crops.flatMap(crop => crop.seeds);

  console.log("Sending shop items:", shopItems);
  res.json(shopItems);
});

app.listen(port, () => {
  console.log(`🌱 Coffee farm server running at http://localhost:${port}`);
});