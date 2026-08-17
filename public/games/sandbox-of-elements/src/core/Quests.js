import { MAT } from './Materials.js';

// Kid-friendly quests with cute names and gentle goals
export const QUESTS = [
  {
    id: 'candy_100',
    icon: '#ff88c8',
    name: { ru: 'Сладкоежка', en: 'Sweet Tooth' },
    desc: { ru: 'Насыпь 100 конфеток', en: 'Place 100 candies' },
    type: 'place', mat: MAT.CANDY, target: 100, xp: 50
  },
  {
    id: 'water_200',
    icon: '#64aaff',
    name: { ru: 'Водопадик', en: 'Little Waterfall' },
    desc: { ru: 'Налей 200 капель воды', en: 'Place 200 water drops' },
    type: 'place', mat: MAT.WATER, target: 200, xp: 50
  },
  {
    id: 'flower_20',
    icon: '#ff96c8',
    name: { ru: 'Садовник', en: 'Gardener' },
    desc: { ru: 'Вырасти 20 цветочков', en: 'Grow 20 flowers' },
    type: 'event', event: 'plantGrow', target: 20, xp: 120
  },
  {
    id: 'steam_10',
    icon: '#dcd2f0',
    name: { ru: 'Пар идёт!', en: 'Steamy!' },
    desc: { ru: 'Сделай пар 10 раз', en: 'Make steam 10 times' },
    type: 'event', event: 'steamCreated', target: 10, xp: 80
  },
  {
    id: 'sparkle_15',
    icon: '#ffe496',
    name: { ru: 'Фейерверк', en: 'Fireworks!' },
    desc: { ru: 'Устрой 15 волшебных вспышек', en: 'Make 15 magical sparkles' },
    type: 'event', event: 'sparkle', target: 15, xp: 100
  },
  {
    id: 'obsidian_5',
    icon: '#3c285a',
    name: { ru: 'Кузнец', en: 'Blacksmith' },
    desc: { ru: 'Создай обсидиан 5 раз (лава + вода)', en: 'Make obsidian 5 times (lava + water)' },
    type: 'event', event: 'obsidian', target: 5, xp: 100
  },
  {
    id: 'potion_20',
    icon: '#c878ff',
    name: { ru: 'Юный волшебник', en: 'Young Wizard' },
    desc: { ru: 'Преврати зельем 20 предметов', en: 'Transform 20 things with potion' },
    type: 'event', event: 'potionTransform', target: 20, xp: 100
  },
  {
    id: 'rain_1',
    icon: '#64b4ff',
    name: { ru: 'Дождик', en: 'Rainy Day' },
    desc: { ru: 'Включи дождик', en: 'Turn on rain' },
    type: 'action', action: 'rain', target: 1, xp: 40
  },
  {
    id: 'snow_1',
    icon: '#e0f0ff',
    name: { ru: 'Зимушка', en: 'Winter' },
    desc: { ru: 'Включи снег', en: 'Turn on snow' },
    type: 'action', action: 'snow', target: 1, xp: 40
  },
  {
    id: 'lightning_3',
    icon: '#ffdc64',
    name: { ru: 'Волшебные молнии', en: 'Magic Lightning' },
    desc: { ru: 'Вызови молнию 3 раза', en: 'Call lightning 3 times' },
    type: 'action', action: 'lightning', target: 3, xp: 80
  },
  {
    id: 'ice_10',
    icon: '#96d2f0',
    name: { ru: 'Заморозка', en: 'Freeze' },
    desc: { ru: 'Заморозь воду 10 раз', en: 'Freeze water 10 times' },
    type: 'event', event: 'iceCreated', target: 10, xp: 80
  },
  {
    id: 'wood_100',
    icon: '#b47850',
    name: { ru: 'Лесовик', en: 'Woodsman' },
    desc: { ru: 'Размести 100 брёвнышек', en: 'Place 100 wood blocks' },
    type: 'place', mat: MAT.WOOD, target: 100, xp: 60
  },
  {
    id: 'chocolate_50',
    icon: '#70422d',
    name: { ru: 'Шокоман', en: 'Choco Master' },
    desc: { ru: 'Размести 50 шоколадок', en: 'Place 50 chocolates' },
    type: 'place', mat: MAT.CHOCOLATE, target: 50, xp: 70
  },
  {
    id: 'rainbow_5',
    icon: '#ff78b4',
    name: { ru: 'Радуга!', en: 'Rainbow!' },
    desc: { ru: 'Создай радужную вспышку 5 раз', en: 'Make a rainbow burst 5 times' },
    type: 'event', event: 'rainbowCreated', target: 5, xp: 150
  },
  {
    id: 'explode_10',
    icon: '#ff5070',
    name: { ru: 'Праздник', en: 'Party Time!' },
    desc: { ru: 'Устрой 10 весёлых взрывов', en: 'Set off 10 fun explosions' },
    type: 'event', event: 'explosions', target: 10, xp: 100
  },
  {
    id: 'fire_spread_20',
    icon: '#ff8a40',
    name: { ru: 'Костровой', en: 'Campfire' },
    desc: { ru: 'Подожги 20 предметов', en: 'Set 20 things on fire' },
    type: 'event', event: 'fireSpread', target: 20, xp: 70
  },
  {
    id: 'flower_big_50',
    icon: '#3cb428',
    name: { ru: 'Садовод', en: 'Master Gardener' },
    desc: { ru: 'Вырасти 50 растений', en: 'Grow 50 plants' },
    type: 'event', event: 'plantGrow', target: 50, xp: 200
  },
  {
    id: 'lava_100',
    icon: '#ff5a1e',
    name: { ru: 'Вулкан', en: 'Volcano' },
    desc: { ru: 'Налей 100 капель лавы', en: 'Place 100 lava drops' },
    type: 'place', mat: MAT.LAVA, target: 100, xp: 70
  },
  {
    id: 'gunpowder_50',
    icon: '#3c3a41',
    name: { ru: 'Пиротехник', en: 'Pyrotechnician' },
    desc: { ru: 'Размести 50 частиц пороха', en: 'Place 50 gunpowder particles' },
    type: 'place', mat: MAT.GUNPOWDER, target: 50, xp: 60
  },
  {
    id: 'explode_big_20',
    icon: '#ff2000',
    name: { ru: 'Подрывник', en: 'Demolisher' },
    desc: { ru: 'Устрой 20 взрывов', en: 'Cause 20 explosions' },
    type: 'event', event: 'explosions', target: 20, xp: 150
  },
  {
    id: 'acid_15',
    icon: '#64ff3c',
    name: { ru: 'Химик', en: 'Chemist' },
    desc: { ru: 'Растворяй 15 предметов (кислота / зелье)', en: 'Dissolve 15 objects (acid / potion)' },
    type: 'event', event: 'potionTransform', target: 15, xp: 100
  },
  {
    id: 'salt_30',
    icon: '#f0f0f5',
    name: { ru: 'Солевар', en: 'Salt Maker' },
    desc: { ru: 'Размести 30 частиц соли', en: 'Place 30 salt particles' },
    type: 'place', mat: MAT.SALT, target: 30, xp: 50
  },
  {
    id: 'thermite_stack',
    icon: '#78403c',
    name: { ru: 'Термит', en: 'Thermite' },
    desc: { ru: 'Размести 20 частиц термита', en: 'Place 20 thermite particles' },
    type: 'place', mat: MAT.THERMITE, target: 20, xp: 80
  }
];

export const VISIBLE_QUESTS = 3;

// Daily challenges — rotated by date hash, +200 XP bonus
export const DAILY_QUESTS = [
  {
    id: 'd_candy_50', icon: '#ff88c8', xp: 200,
    name: { ru: 'Сладкий день', en: 'Sweet Day' },
    desc: { ru: 'Насыпь 50 конфеток', en: 'Place 50 candies' },
    type: 'place', mat: MAT.CANDY, target: 50
  },
  {
    id: 'd_plants_30', icon: '#96ffbe', xp: 200,
    name: { ru: 'Весенний день', en: 'Spring Day' },
    desc: { ru: 'Вырасти 30 растений', en: 'Grow 30 plants' },
    type: 'event', event: 'plantGrow', target: 30
  },
  {
    id: 'd_boom_10', icon: '#ff6464', xp: 200,
    name: { ru: 'День грохота', en: 'Boom Day' },
    desc: { ru: 'Устрой 10 взрывов', en: 'Trigger 10 explosions' },
    type: 'event', event: 'explosions', target: 10
  },
  {
    id: 'd_ice_20', icon: '#b4ebff', xp: 200,
    name: { ru: 'Ледяной день', en: 'Icy Day' },
    desc: { ru: 'Создай 20 кубиков льда', en: 'Create 20 ice cubes' },
    type: 'event', event: 'iceCreated', target: 20
  },
  {
    id: 'd_sparkle_25', icon: '#ffe496', xp: 200,
    name: { ru: 'Искристый день', en: 'Sparkly Day' },
    desc: { ru: 'Сделай 25 волшебных искр', en: 'Trigger 25 magic sparkles' },
    type: 'event', event: 'sparkle', target: 25
  },
  {
    id: 'd_water_300', icon: '#64aaff', xp: 200,
    name: { ru: 'Водный день', en: 'Water Day' },
    desc: { ru: 'Налей 300 капель воды', en: 'Place 300 water drops' },
    type: 'place', mat: MAT.WATER, target: 300
  },
  {
    id: 'd_potion_30', icon: '#c878ff', xp: 200,
    name: { ru: 'Алхимия дня', en: 'Alchemy Day' },
    desc: { ru: 'Преврати 30 предметов зельем', en: 'Transform 30 things with potion' },
    type: 'event', event: 'potionTransform', target: 30
  },
  {
    id: 'd_acid_25', icon: '#78ff46', xp: 200,
    name: { ru: 'Кислотный день', en: 'Acidic Day' },
    desc: { ru: 'Создай 25 частиц ржавчины или соли', en: 'Create 25 rust or salt particles' },
    type: 'event', event: 'rustMade', target: 25
  }
];

export function getTodaysDailyIndex() {
  const now = new Date();
  const day = Math.floor((now.getTime() + now.getTimezoneOffset() * 60000) / 86400000);
  return day % DAILY_QUESTS.length;
}

export function getTodaysDateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2,'0')}-${now.getDate().toString().padStart(2,'0')}`;
}
