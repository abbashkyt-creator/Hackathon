// Recipe definitions. Each recipe tracks a single triggered event
// from the simulation. When first triggered, it's marked as "discovered"
// and shown in the encyclopedia.
import { MAT, COLORS } from './Materials.js';

const rgb = (m) => {
  const c = COLORS[m][0];
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};

export const RECIPES = [
  // ==== Fire + Cold + Water base ====
  { id: 'obsidian', event: 'obsidian', icon: rgb(MAT.OBSIDIAN),
    name: { ru: 'Обсидиан', en: 'Obsidian' },
    desc: { ru: 'Лава + Вода', en: 'Lava + Water' }, xp: 30 },
  { id: 'steam', event: 'steamCreated', icon: rgb(MAT.STEAM),
    name: { ru: 'Пар', en: 'Steam' },
    desc: { ru: 'Огонь + Вода', en: 'Fire + Water' }, xp: 20 },
  { id: 'glass', event: 'glassMade', icon: rgb(MAT.GLASS),
    name: { ru: 'Стекло', en: 'Glass' },
    desc: { ru: 'Лава плавит песок', en: 'Lava melts sand' }, xp: 40 },
  { id: 'stoneLava', event: 'stoneFromLava', icon: rgb(MAT.STONE),
    name: { ru: 'Застывший камень', en: 'Cooled Stone' },
    desc: { ru: 'Лава + Лёд/Снег/Иней', en: 'Lava + Ice/Snow/Frost' }, xp: 30 },
  { id: 'iceFreeze', event: 'iceCreated', icon: rgb(MAT.ICE),
    name: { ru: 'Лёд', en: 'Ice' },
    desc: { ru: 'Иней замораживает воду', en: 'Frost freezes water' }, xp: 20 },
  { id: 'saltMelt', event: 'saltMelt', icon: rgb(MAT.SALT),
    name: { ru: 'Соль плавит лёд', en: 'Salt melts ice' },
    desc: { ru: 'Соль + Лёд = Вода', en: 'Salt + Ice = Water' }, xp: 30 },
  { id: 'fireWood', event: 'fireWood', icon: rgb(MAT.FIRE),
    name: { ru: 'Костёр', en: 'Campfire' },
    desc: { ru: 'Огонь поджигает дерево', en: 'Fire ignites wood' }, xp: 20 },
  { id: 'plantGrow', event: 'plantGrow', icon: rgb(MAT.FLOWER),
    name: { ru: 'Вырос цветочек', en: 'Flower bloomed' },
    desc: { ru: 'Семя + Земля + Вода', en: 'Seed + Soil + Water' }, xp: 30 },

  // ==== Sweets ====
  { id: 'chocoFromLava', event: 'chocoFromLava', icon: rgb(MAT.CHOCOLATE),
    name: { ru: 'Шоколад из молока', en: 'Chocolate from milk' },
    desc: { ru: 'Лава + Молоко!', en: 'Lava + Milk!' }, xp: 50 },
  { id: 'iceCream', event: 'iceCreamMade', icon: rgb(MAT.ICE_CREAM),
    name: { ru: 'Мороженое', en: 'Ice Cream' },
    desc: { ru: 'Мёд+Снег или Молоко+Конфета', en: 'Honey+Snow or Milk+Candy' }, xp: 40 },
  { id: 'caramel', event: 'caramelMade', icon: rgb(MAT.CARAMEL),
    name: { ru: 'Карамель', en: 'Caramel' },
    desc: { ru: 'Шоколад + Огонь', en: 'Chocolate + Fire' }, xp: 30 },
  { id: 'candy', event: 'candyMade', icon: rgb(MAT.CANDY),
    name: { ru: 'Конфета', en: 'Candy' },
    desc: { ru: 'Карамель + Холод', en: 'Caramel + Cold' }, xp: 30 },
  { id: 'honey', event: 'honeyMade', icon: rgb(MAT.HONEY),
    name: { ru: 'Мёд', en: 'Honey' },
    desc: { ru: 'Пчёлка + Цветок', en: 'Bee + Flower' }, xp: 40 },

  // ==== Chemistry ====
  { id: 'acidNeut', event: 'acidNeutralized', icon: rgb(MAT.SALT),
    name: { ru: 'Нейтрализация', en: 'Neutralization' },
    desc: { ru: 'Кислота + Щёлочь = Соль', en: 'Acid + Alkali = Salt' }, xp: 60 },
  { id: 'rust', event: 'rustMade', icon: rgb(MAT.RUST),
    name: { ru: 'Ржавчина', en: 'Rust' },
    desc: { ru: 'Кислота + Металл', en: 'Acid + Metal' }, xp: 40 },
  { id: 'soap', event: 'soapMade', icon: rgb(MAT.SOAP),
    name: { ru: 'Мыло', en: 'Soap' },
    desc: { ru: 'Щёлочь + Масло', en: 'Alkali + Oil' }, xp: 50 },

  // ==== Explosives ====
  { id: 'smallBoom', event: 'explosions', icon: rgb(MAT.FIRE),
    name: { ru: 'Бабах!', en: 'Boom!' },
    desc: { ru: 'Устрой любой взрыв', en: 'Make any explosion' }, xp: 40 },
  { id: 'nuclearBoom', event: 'nuclearBoom', icon: rgb(MAT.URANIUM),
    name: { ru: 'Ядерный взрыв', en: 'Nuclear Blast' },
    desc: { ru: 'Собери 4 урана рядом и подожги', en: 'Gather 4 uranium and ignite' }, xp: 200 },
  { id: 'thermite', event: 'thermiteBurn', icon: rgb(MAT.THERMITE),
    name: { ru: 'Термит плавит металл', en: 'Thermite melts metal' },
    desc: { ru: 'Термит + Огонь + Металл', en: 'Thermite + Fire + Metal' }, xp: 70 },

  // ==== Atomic / Special ====
  { id: 'antimatter', event: 'antimatterAnni', icon: rgb(MAT.ANTIMATTER),
    name: { ru: 'Аннигиляция', en: 'Annihilation' },
    desc: { ru: 'Антиматерия встретила материю', en: 'Antimatter meets matter' }, xp: 120 },
  { id: 'plasmaMelt', event: 'plasmaBurn', icon: rgb(MAT.PLASMA),
    name: { ru: 'Плазма плавит', en: 'Plasma melts' },
    desc: { ru: 'Плазма превращает металл в лаву', en: 'Plasma melts metal to lava' }, xp: 80 },
  { id: 'portalEat', event: 'portalEat', icon: rgb(MAT.PORTAL),
    name: { ru: 'Портал пожирает', en: 'Portal devours' },
    desc: { ru: 'Поставь портал возле частиц', en: 'Place portal near particles' }, xp: 40 },
  { id: 'cloneUse', event: 'cloneUsed', icon: rgb(MAT.CLONE),
    name: { ru: 'Клонирование', en: 'Cloning' },
    desc: { ru: 'Клонер копирует соседа', en: 'Cloner copies neighbor' }, xp: 50 },

  // ==== Magic ====
  { id: 'rainbowPotion', event: 'rainbowFromPotion', icon: rgb(MAT.RAINBOW),
    name: { ru: 'Радужная вода', en: 'Rainbow Water' },
    desc: { ru: 'Зелье превращает воду в радугу', en: 'Potion turns water into rainbow' }, xp: 40 },
  { id: 'rainbowCore', event: 'rainbowCreated', icon: rgb(MAT.RAINBOW_CORE),
    name: { ru: 'Радужная вспышка', en: 'Rainbow Burst' },
    desc: { ru: 'Подорви радужное ядро', en: 'Detonate rainbow core' }, xp: 100 },
  { id: 'unicornTrail', event: 'unicornTrail', icon: rgb(MAT.UNICORN),
    name: { ru: 'След Единорога', en: 'Unicorn Trail' },
    desc: { ru: 'Единорог оставляет радугу', en: 'Unicorn leaves rainbow' }, xp: 60 },
  { id: 'potionTransform', event: 'potionTransform', icon: rgb(MAT.POTION),
    name: { ru: 'Магия зелья', en: 'Potion Magic' },
    desc: { ru: 'Зелье превращает что угодно', en: 'Potion transforms anything' }, xp: 30 },
  { id: 'sparkle', event: 'sparkle', icon: rgb(MAT.STARDUST),
    name: { ru: 'Искра!', en: 'Sparkle!' },
    desc: { ru: 'Устрой волшебную вспышку', en: 'Make a magical sparkle' }, xp: 20 },

  // ==== Weather / Lightning ====
  { id: 'thunder', event: 'zap', icon: rgb(MAT.SPARK),
    name: { ru: 'Молния', en: 'Lightning' },
    desc: { ru: 'Вызови молнию', en: 'Call lightning' }, xp: 30 },
  { id: 'fireSpread', event: 'fireSpread', icon: rgb(MAT.EMBER),
    name: { ru: 'Пожар', en: 'Wildfire' },
    desc: { ru: 'Подожги 10+ предметов подряд', en: 'Ignite 10+ things in a row' }, xp: 30 },

  // ==== Cosmic ====
  { id: 'stormBolt', event: 'stormLightning', icon: rgb(MAT.SPARK),
    name: { ru: 'Гром и молния', en: 'Thunder & Lightning' },
    desc: { ru: 'Гроза выстрелила молнией сама', en: 'Storm cloud struck lightning' }, xp: 80 },
  { id: 'meteorCrash', event: 'meteorHit', icon: rgb(MAT.METEOR),
    name: { ru: 'Удар метеорита', en: 'Meteor Strike' },
    desc: { ru: 'Метеорит взорвался при ударе', en: 'Meteor crashed and exploded' }, xp: 120 },
  { id: 'blackHoleSwallow', event: 'blackHolePull', icon: rgb(MAT.BLACK_HOLE),
    name: { ru: 'Поглощение', en: 'Swallowed' },
    desc: { ru: 'Чёрная дыра затянула частицу', en: 'Black hole devoured matter' }, xp: 100 },
  { id: 'slimeFreeze', event: 'slimeFreeze', icon: rgb(MAT.JELLY),
    name: { ru: 'Слайм-желе', en: 'Slime Jelly' },
    desc: { ru: 'Замёрзший слайм стал желе', en: 'Frozen slime turned to jelly' }, xp: 40 },
  { id: 'slimeBurn', event: 'slimeBurn', icon: rgb(MAT.FOAM),
    name: { ru: 'Горящий слайм', en: 'Burning Slime' },
    desc: { ru: 'Слайм сгорел в пену', en: 'Slime burned into foam' }, xp: 40 }
];

export const RECIPE_COUNT = RECIPES.length;
