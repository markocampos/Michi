const fs = require('fs');

const emojis = [
  { char: '🌱', name: 'Seed' },
  { char: '🌿', name: 'Herb' },
  { char: '☘️', name: 'Shamrock' },
  { char: '🍀', name: 'Clover' },
  { char: '🪴', name: 'Plant' },
  { char: '🎋', name: 'Bamboo' },
  { char: '🍃', name: 'Leaf' },
  { char: '🍂', name: 'Autumn Leaf' },
  { char: '🍁', name: 'Maple' },
  { char: '🍄', name: 'Mushroom' },
  { char: '🌾', name: 'Rice' },
  { char: '💐', name: 'Bouquet' },
  { char: '🌷', name: 'Tulip' },
  { char: '🌹', name: 'Rose' },
  { char: '🥀', name: 'Wilted Rose' },
  { char: '🌺', name: 'Hibiscus' },
  { char: '🌸', name: 'Cherry Blossom' },
  { char: '🌼', name: 'Blossom' },
  { char: '🌻', name: 'Sunflower' },
  { char: '🪷', name: 'Lotus' },
  { char: '🪵', name: 'Log' },
  { char: '🪨', name: 'Stone' },
  { char: '🐚', name: 'Shell' },
  { char: '🐌', name: 'Snail' },
  { char: '🦋', name: 'Butterfly' },
  { char: '🐛', name: 'Caterpillar' },
  { char: '🐜', name: 'Ant' },
  { char: '🐝', name: 'Bee' },
  { char: '🪲', name: 'Beetle' },
  { char: '🐞', name: 'Ladybug' },
  { char: '🐢', name: 'Turtle' },
  { char: '🐍', name: 'Snake' },
  { char: '🦎', name: 'Lizard' },
  { char: '🐙', name: 'Octopus' },
  { char: '🦑', name: 'Squid' },
  { char: '🦐', name: 'Shrimp' },
  { char: '🐠', name: 'Tropical Fish' },
  { char: '🐟', name: 'Fish' },
  { char: '🐬', name: 'Dolphin' },
  { char: '🐳', name: 'Whale' },
  { char: '🐋', name: 'Blue Whale' },
  { char: '🦈', name: 'Shark' },
  { char: '🦭', name: 'Seal' },
  { char: '🐅', name: 'Tiger' },
  { char: '🐆', name: 'Leopard' },
  { char: '🦓', name: 'Zebra' },
  { char: '🐘', name: 'Elephant' },
  { char: '🦏', name: 'Rhino' },
  { char: '🦒', name: 'Giraffe' },
  { char: '🦘', name: 'Kangaroo' }
];

const adjectives = [
  'Awakening',
  'Sprouting',
  'Growing',
  'Flourishing',
  'Blooming',
  'Radiant',
  'Tranquil',
  'Ancient',
  'Celestial',
  'Infinite'
];

// The user wants it to change often (less wide). 
// Let's do a base of 20 XP, scaling slightly but gently.
// E.g. Lv1: 20 XP, Lv2: 22 XP, Lv3: 24 XP ...
// Formula: requiredXP = 20 + (level * 2)
// For 500 levels:
// Level 1: 22
// Level 100: 220
// Level 500: 1020

const levels = [];

for (let i = 0; i < 500; i++) {
  const adj = adjectives[Math.floor(i / 50)];
  const emj = emojis[i % 50];
  
  levels.push({
    level: i + 1,
    name: `${adj} ${emj.name}`,
    icon: emj.char,
    requiredXP: 20 + (i * 2) // XP to reach NEXT level
  });
}

// Add a 501th level as the infinite cap just in case they max out 500
levels.push({
  level: 501,
  name: 'Nirvana',
  icon: '🌌',
  requiredXP: 5000
});

fs.writeFileSync('../src/utils/levels.json', JSON.stringify(levels, null, 2));
console.log('Created levels.json');
