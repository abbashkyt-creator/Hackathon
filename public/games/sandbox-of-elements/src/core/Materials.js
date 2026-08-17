export const MAT = {
  EMPTY: 0,
  // Basic
  SAND: 1, WATER: 2, STONE: 3, WOOD: 4, SOIL: 5, GLASS: 6,
  // Fire
  FIRE: 7, LAVA: 8, EMBER: 9, SMOKE: 10, STEAM: 11, ASH: 12, MAGIC_FIRE: 13,
  // Cold
  ICE: 14, SNOW: 15, ICE_CREAM: 16, FROST: 17,
  // Sweets
  CANDY: 18, CHOCOLATE: 19, CARAMEL: 20, COTTON_CANDY: 21,
  JELLY: 22, MARSHMALLOW: 23, HONEY: 24, MILK: 25,
  // Magic
  STARDUST: 26, FAIRY_DUST: 27, RAINBOW: 28, GLITTER: 29,
  POTION: 30, CRACKER: 31, RAINBOW_CORE: 32,
  // Plants
  SEED: 33, FLOWER: 34, GRASS: 35, MUSHROOM: 36, VINE: 37,
  // Creatures
  BUTTERFLY: 38, BEE: 39, LADYBUG: 40, FISH: 41,
  BUNNY: 42, FIREFLY: 43, UNICORN: 44,
  // Electric
  WIRE: 45, SPARK: 46, BATTERY: 47, MAGNET: 48, LAMP: 49,
  // Gems
  GOLD: 50, DIAMOND: 51, RUBY: 52, EMERALD: 53, METAL: 54,
  // Bubbles
  BUBBLE: 55, FOAM: 56, SOAP: 57, BALLOON: 58,
  // Special
  CLONE: 59, PORTAL: 60, CLOUD: 61, OBSIDIAN: 62, MUD: 63,
  // Hidden — for gold-wire-like spark chain (not visible in UI)
  SPARK_CU: 64,
  // Explosives
  GUNPOWDER: 65, DYNAMITE: 66, C4: 67, NITRO: 68, THERMITE: 69,
  NAPALM: 70, FUSE: 71, FIREWORK: 72, ROCKET: 73, GAS: 74, DUST: 75,
  // Chemistry
  ACID: 76, ALKALI: 77, SALT: 78, OIL: 79, MERCURY: 80,
  // Atomic & extreme
  URANIUM: 81, RADIATION: 82, ANTIMATTER: 83, PLASMA: 84, TORCH: 85,
  // Rust (acid + metal)
  RUST: 86,
  // Machines (active blocks)
  GLUE: 87, BOUNCY: 88, CONVEYOR_L: 89, CONVEYOR_R: 90, HEATER: 91, COOLER: 92,
  // Cosmic & exotic
  STORM_CLOUD: 93, METEOR: 94, BLACK_HOLE: 95, SLIME: 96
};

// Behaviors
export const BH = {
  NONE: 0, POWDER: 1, LIQUID: 2, GAS: 3, SOLID: 4, FIRE: 5
};

// b=behavior, d=density, fl=flammable, disp=dispersion, life=lifetime(-1=permanent), death=death product id
export const PROPS = [
  /* 0  EMPTY */         { b: 0, d: 0,   fl: false, disp: 0, life: -1, death: 0 },
  /* 1  SAND */          { b: 1, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 2  WATER */         { b: 2, d: 3,   fl: false, disp: 5, life: -1, death: 0 },
  /* 3  STONE */         { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 4  WOOD */          { b: 4, d: 8,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 5  SOIL */          { b: 1, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 6  GLASS */         { b: 4, d: 8,   fl: false, disp: 0, life: -1, death: 0 },
  /* 7  FIRE */          { b: 5, d: 0,   fl: false, disp: 0, life: 50, death: 10 }, // -> smoke
  /* 8  LAVA */          { b: 2, d: 7,   fl: false, disp: 2, life: -1, death: 0 },
  /* 9  EMBER */         { b: 1, d: 5,   fl: false, disp: 0, life: 80, death: 12 }, // -> ash
  /* 10 SMOKE */         { b: 3, d: 0,   fl: false, disp: 2, life: 100, death: 0 },
  /* 11 STEAM */         { b: 3, d: 0,   fl: false, disp: 3, life: 180, death: 2 }, // -> water
  /* 12 ASH */           { b: 1, d: 2,   fl: false, disp: 0, life: -1, death: 0 },
  /* 13 MAGIC_FIRE */    { b: 5, d: 0,   fl: false, disp: 0, life: 90, death: 0 }, // cold flame
  /* 14 ICE */           { b: 4, d: 4,   fl: false, disp: 0, life: -1, death: 0 },
  /* 15 SNOW */          { b: 1, d: 2,   fl: false, disp: 0, life: -1, death: 0 },
  /* 16 ICE_CREAM */     { b: 1, d: 3,   fl: false, disp: 0, life: -1, death: 0 },
  /* 17 FROST */         { b: 2, d: 3,   fl: false, disp: 5, life: -1, death: 0 }, // liquid nitrogen-like
  /* 18 CANDY */         { b: 1, d: 4,   fl: false, disp: 0, life: -1, death: 0 }, // sugar crystal
  /* 19 CHOCOLATE */     { b: 4, d: 7,   fl: true,  disp: 0, life: -1, death: 0 }, // solid, melts
  /* 20 CARAMEL */       { b: 2, d: 4,   fl: true,  disp: 2, life: -1, death: 0 }, // sticky liquid
  /* 21 COTTON_CANDY */  { b: 1, d: 1,   fl: true,  disp: 0, life: -1, death: 0 }, // fluffy dust
  /* 22 JELLY */         { b: 4, d: 5,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 23 MARSHMALLOW */   { b: 4, d: 3,   fl: true,  disp: 0, life: -1, death: 0 }, // soft
  /* 24 HONEY */         { b: 2, d: 5,   fl: true,  disp: 1, life: -1, death: 0 }, // thick
  /* 25 MILK */          { b: 2, d: 3,   fl: false, disp: 5, life: -1, death: 0 },
  /* 26 STARDUST */      { b: 1, d: 3,   fl: true,  disp: 0, life: -1, death: 0 }, // sparkle powder
  /* 27 FAIRY_DUST */    { b: 1, d: 2,   fl: false, disp: 0, life: -1, death: 0 }, // grows plants
  /* 28 RAINBOW */       { b: 3, d: 0,   fl: false, disp: 2, life: 60, death: 0 },
  /* 29 GLITTER */       { b: 1, d: 1,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 30 POTION */        { b: 2, d: 4,   fl: false, disp: 4, life: -1, death: 0 }, // transforms
  /* 31 CRACKER */       { b: 1, d: 5,   fl: false, disp: 0, life: -1, death: 0 }, // firecracker
  /* 32 RAINBOW_CORE */  { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 33 SEED */          { b: 1, d: 3,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 34 FLOWER */        { b: 4, d: 4,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 35 GRASS */         { b: 4, d: 4,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 36 MUSHROOM */      { b: 4, d: 5,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 37 VINE */          { b: 4, d: 5,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 38 BUTTERFLY */     { b: 4, d: 0,   fl: false, disp: 0, life: -1, death: 0 },
  /* 39 BEE */           { b: 4, d: 0,   fl: false, disp: 0, life: -1, death: 0 },
  /* 40 LADYBUG */       { b: 4, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 41 FISH */          { b: 4, d: 3,   fl: false, disp: 0, life: -1, death: 0 },
  /* 42 BUNNY */         { b: 4, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 43 FIREFLY */       { b: 4, d: 0,   fl: false, disp: 0, life: -1, death: 0 },
  /* 44 UNICORN */       { b: 4, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 45 WIRE */          { b: 4, d: 8,   fl: false, disp: 0, life: -1, death: 0 },
  /* 46 SPARK */         { b: 4, d: 0,   fl: false, disp: 0, life: 4,  death: 45 },
  /* 47 BATTERY */       { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 48 MAGNET */        { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 49 LAMP */          { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 50 GOLD */          { b: 4, d: 11,  fl: false, disp: 0, life: -1, death: 0 },
  /* 51 DIAMOND */       { b: 4, d: 12,  fl: false, disp: 0, life: -1, death: 0 },
  /* 52 RUBY */          { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 53 EMERALD */       { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 54 METAL */         { b: 4, d: 9,   fl: false, disp: 0, life: -1, death: 0 },
  /* 55 BUBBLE */        { b: 3, d: 0,   fl: false, disp: 2, life: 200, death: 0 },
  /* 56 FOAM */          { b: 3, d: 0,   fl: false, disp: 3, life: 150, death: 0 },
  /* 57 SOAP */          { b: 1, d: 3,   fl: false, disp: 0, life: -1, death: 0 },
  /* 58 BALLOON */       { b: 3, d: 0,   fl: true,  disp: 4, life: 500, death: 0 },
  /* 59 CLONE */         { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  /* 60 PORTAL */        { b: 4, d: 100, fl: false, disp: 0, life: -1, death: 0 }, // eats particles
  /* 61 CLOUD */         { b: 4, d: 3,   fl: false, disp: 0, life: -1, death: 0 },
  /* 62 OBSIDIAN */      { b: 4, d: 12,  fl: false, disp: 0, life: -1, death: 0 },
  /* 63 MUD */           { b: 2, d: 4,   fl: false, disp: 2, life: -1, death: 0 },
  /* 64 SPARK_CU */      { b: 4, d: 0,   fl: false, disp: 0, life: 4,  death: 50 }, // gold wire conduct
  // --- Explosives ---
  /* 65 GUNPOWDER */     { b: 1, d: 4,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 66 DYNAMITE */      { b: 1, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 67 C4 */            { b: 4, d: 8,   fl: false, disp: 0, life: -1, death: 0 },
  /* 68 NITRO */         { b: 2, d: 4,   fl: false, disp: 3, life: -1, death: 0 },
  /* 69 THERMITE */      { b: 1, d: 6,   fl: false, disp: 0, life: -1, death: 0 },
  /* 70 NAPALM */        { b: 2, d: 3,   fl: true,  disp: 3, life: -1, death: 0 },
  /* 71 FUSE */          { b: 4, d: 8,   fl: true,  disp: 0, life: -1, death: 0 },
  /* 72 FIREWORK */      { b: 1, d: 3,   fl: false, disp: 0, life: -1, death: 0 },
  /* 73 ROCKET */        { b: 3, d: 0,   fl: false, disp: 0, life: 40, death: 0 },
  /* 74 GAS */           { b: 3, d: 0,   fl: true,  disp: 4, life: 400, death: 0 },
  /* 75 DUST */          { b: 1, d: 1,   fl: true,  disp: 0, life: -1, death: 0 },
  // --- Chemistry ---
  /* 76 ACID */          { b: 2, d: 4,   fl: false, disp: 4, life: -1, death: 0 },
  /* 77 ALKALI */        { b: 2, d: 4,   fl: false, disp: 4, life: -1, death: 0 },
  /* 78 SALT */          { b: 1, d: 4,   fl: false, disp: 0, life: -1, death: 0 },
  /* 79 OIL */           { b: 2, d: 2,   fl: true,  disp: 4, life: -1, death: 0 },
  /* 80 MERCURY */       { b: 2, d: 12,  fl: false, disp: 3, life: -1, death: 0 },
  // --- Atomic ---
  /* 81 URANIUM */       { b: 4, d: 11,  fl: false, disp: 0, life: -1, death: 0 },
  /* 82 RADIATION */     { b: 3, d: 0,   fl: false, disp: 3, life: 400, death: 0 },
  /* 83 ANTIMATTER */    { b: 4, d: 5,   fl: false, disp: 0, life: -1, death: 0 },
  /* 84 PLASMA */        { b: 3, d: 0,   fl: false, disp: 2, life: 28, death: 10 }, // -> smoke
  /* 85 TORCH */         { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 },
  // --- Rust (acid + metal result) ---
  /* 86 RUST */          { b: 1, d: 6,   fl: false, disp: 0, life: -1, death: 0 },
  // --- Machines ---
  /* 87 GLUE */          { b: 4, d: 4,   fl: false, disp: 0, life: -1, death: 0 }, // sticky solid
  /* 88 BOUNCY */        { b: 4, d: 5,   fl: false, disp: 0, life: -1, death: 0 }, // springy solid
  /* 89 CONVEYOR_L */    { b: 4, d: 9,   fl: false, disp: 0, life: -1, death: 0 },
  /* 90 CONVEYOR_R */    { b: 4, d: 9,   fl: false, disp: 0, life: -1, death: 0 },
  /* 91 HEATER */        { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 }, // permanent heat
  /* 92 COOLER */        { b: 4, d: 10,  fl: false, disp: 0, life: -1, death: 0 }, // permanent cold
  // --- Cosmic & exotic ---
  /* 93 STORM_CLOUD */   { b: 4, d: 0,   fl: false, disp: 0, life: -1, death: 0 }, // static, emits rain+lightning
  /* 94 METEOR */        { b: 1, d: 11,  fl: false, disp: 0, life: -1, death: 0 }, // heavy powder, detonates on impact
  /* 95 BLACK_HOLE */    { b: 4, d: 100, fl: false, disp: 0, life: -1, death: 0 }, // static, attracts in radius
  /* 96 SLIME */         { b: 2, d: 4,   fl: false, disp: 1, life: -1, death: 0 }  // viscous liquid (reacts to heat via own branch, not fire's ignite loop)
];

// Each material has 4 color variants [r,g,b]
export const COLORS = [
  /* 0  EMPTY */         [[24, 17, 42], [28, 20, 48], [20, 14, 36], [32, 22, 52]],
  /* 1  SAND */          [[255, 220, 150], [250, 210, 140], [255, 230, 160], [245, 205, 135]],
  /* 2  WATER */         [[80, 170, 255], [70, 160, 250], [90, 180, 255], [60, 150, 240]],
  /* 3  STONE */         [[170, 155, 180], [160, 146, 172], [180, 164, 188], [155, 140, 165]],
  /* 4  WOOD */          [[180, 120, 80], [170, 110, 75], [190, 128, 88], [165, 105, 70]],
  /* 5  SOIL */          [[140, 90, 60], [130, 85, 55], [148, 95, 65], [120, 78, 48]],
  /* 6  GLASS */         [[200, 230, 250], [195, 225, 245], [205, 235, 252], [210, 238, 255]],
  /* 7  FIRE */          [[255, 130, 60], [255, 180, 70], [255, 210, 90], [255, 100, 40]],
  /* 8  LAVA */          [[255, 90, 30], [255, 120, 50], [240, 80, 20], [255, 140, 60]],
  /* 9  EMBER */         [[220, 90, 40], [200, 80, 35], [240, 100, 50], [210, 85, 38]],
  /* 10 SMOKE */         [[120, 110, 130], [115, 105, 125], [130, 120, 140], [108, 100, 120]],
  /* 11 STEAM */         [[220, 215, 240], [228, 220, 245], [215, 210, 235], [232, 225, 248]],
  /* 12 ASH */           [[180, 170, 190], [175, 165, 185], [185, 175, 195], [170, 160, 180]],
  /* 13 MAGIC_FIRE */    [[150, 100, 255], [180, 120, 255], [120, 150, 255], [200, 140, 255]],
  /* 14 ICE */           [[180, 230, 255], [170, 220, 250], [190, 238, 255], [200, 245, 255]],
  /* 15 SNOW */          [[250, 250, 255], [245, 248, 255], [252, 252, 255], [240, 245, 252]],
  /* 16 ICE_CREAM */     [[255, 225, 240], [255, 235, 248], [250, 220, 235], [255, 230, 245]],
  /* 17 FROST */         [[180, 240, 255], [165, 230, 255], [200, 245, 255], [150, 220, 250]],
  /* 18 CANDY */         [[255, 130, 200], [255, 180, 220], [180, 140, 255], [255, 220, 120]],
  /* 19 CHOCOLATE */     [[110, 60, 35], [100, 55, 30], [120, 70, 42], [95, 50, 28]],
  /* 20 CARAMEL */       [[210, 140, 60], [200, 130, 55], [220, 150, 70], [195, 125, 50]],
  /* 21 COTTON_CANDY */  [[255, 180, 220], [255, 200, 235], [255, 160, 210], [255, 210, 240]],
  /* 22 JELLY */         [[255, 100, 150], [255, 130, 170], [255, 80, 130], [230, 90, 140]],
  /* 23 MARSHMALLOW */   [[255, 240, 245], [250, 235, 240], [255, 245, 250], [252, 230, 238]],
  /* 24 HONEY */         [[255, 190, 70], [250, 180, 60], [255, 200, 85], [240, 170, 55]],
  /* 25 MILK */          [[250, 245, 240], [245, 240, 235], [252, 248, 245], [248, 243, 238]],
  /* 26 STARDUST */      [[255, 230, 140], [255, 245, 180], [255, 210, 100], [255, 235, 160]],
  /* 27 FAIRY_DUST */    [[220, 180, 255], [200, 160, 245], [235, 195, 255], [210, 170, 250]],
  /* 28 RAINBOW */       [[255, 120, 180], [150, 200, 255], [180, 255, 150], [255, 220, 120]],
  /* 29 GLITTER */       [[255, 215, 240], [220, 240, 255], [240, 220, 255], [255, 245, 220]],
  /* 30 POTION */        [[200, 100, 255], [180, 90, 245], [220, 120, 255], [170, 80, 235]],
  /* 31 CRACKER */       [[255, 80, 110], [240, 70, 100], [255, 100, 130], [230, 65, 95]],
  /* 32 RAINBOW_CORE */  [[255, 120, 180], [150, 200, 255], [180, 255, 150], [255, 230, 120]],
  /* 33 SEED */          [[140, 100, 50], [130, 95, 45], [150, 110, 58], [125, 90, 42]],
  /* 34 FLOWER */        [[255, 150, 200], [255, 200, 120], [180, 150, 255], [150, 255, 180]],
  /* 35 GRASS */         [[90, 190, 80], [80, 180, 75], [100, 200, 90], [75, 170, 70]],
  /* 36 MUSHROOM */      [[255, 120, 120], [255, 140, 140], [240, 110, 110], [255, 160, 160]],
  /* 37 VINE */          [[80, 180, 90], [70, 170, 80], [90, 195, 100], [65, 160, 75]],
  /* 38 BUTTERFLY */     [[255, 140, 220], [180, 150, 255], [255, 200, 140], [150, 220, 255]],
  /* 39 BEE */           [[255, 220, 80], [255, 200, 60], [250, 225, 90], [240, 195, 55]],
  /* 40 LADYBUG */       [[240, 70, 80], [230, 65, 75], [250, 80, 90], [220, 60, 70]],
  /* 41 FISH */          [[255, 170, 80], [255, 190, 110], [255, 150, 70], [250, 160, 75]],
  /* 42 BUNNY */         [[255, 230, 240], [250, 225, 235], [255, 235, 245], [248, 220, 232]],
  /* 43 FIREFLY */       [[255, 255, 160], [255, 250, 140], [255, 255, 200], [240, 240, 120]],
  /* 44 UNICORN */       [[255, 220, 240], [220, 200, 255], [200, 240, 255], [240, 255, 200]],
  /* 45 WIRE */          [[200, 140, 70], [190, 130, 65], [210, 150, 80], [180, 125, 60]],
  /* 46 SPARK */         [[255, 255, 190], [255, 250, 150], [255, 255, 230], [250, 240, 130]],
  /* 47 BATTERY */       [[120, 200, 120], [110, 190, 110], [130, 210, 130], [100, 180, 105]],
  /* 48 MAGNET */        [[220, 80, 100], [210, 75, 95], [230, 90, 110], [200, 70, 90]],
  /* 49 LAMP */          [[255, 240, 180], [250, 235, 175], [255, 245, 190], [248, 230, 170]],
  /* 50 GOLD */          [[255, 215, 80], [250, 205, 70], [255, 225, 100], [245, 200, 65]],
  /* 51 DIAMOND */       [[200, 240, 255], [220, 245, 255], [180, 230, 250], [240, 250, 255]],
  /* 52 RUBY */          [[240, 60, 90], [230, 50, 85], [250, 70, 100], [220, 45, 80]],
  /* 53 EMERALD */       [[80, 230, 140], [75, 220, 130], [90, 240, 150], [70, 210, 125]],
  /* 54 METAL */         [[200, 210, 220], [195, 205, 215], [205, 215, 225], [190, 200, 212]],
  /* 55 BUBBLE */        [[210, 245, 255], [220, 250, 255], [200, 240, 252], [230, 250, 255]],
  /* 56 FOAM */          [[250, 252, 255], [245, 248, 252], [252, 252, 255], [248, 250, 254]],
  /* 57 SOAP */          [[220, 230, 245], [215, 225, 240], [225, 235, 250], [210, 220, 238]],
  /* 58 BALLOON */       [[255, 180, 220], [180, 220, 255], [220, 255, 180], [255, 220, 180]],
  /* 59 CLONE */         [[255, 120, 200], [120, 200, 255], [200, 255, 120], [255, 200, 120]],
  /* 60 PORTAL */        [[60, 20, 100], [80, 30, 130], [40, 10, 80], [100, 40, 160]],
  /* 61 CLOUD */         [[240, 240, 250], [245, 245, 255], [235, 235, 248], [248, 248, 255]],
  /* 62 OBSIDIAN */      [[60, 40, 80], [55, 38, 75], [65, 45, 85], [50, 34, 70]],
  /* 63 MUD */           [[100, 70, 50], [90, 65, 45], [110, 80, 58], [85, 60, 42]],
  /* 64 SPARK_CU */      [[255, 255, 190], [255, 250, 150], [255, 255, 230], [250, 240, 130]],
  // --- Explosives ---
  /* 65 GUNPOWDER */     [[60, 58, 65], [55, 53, 60], [65, 63, 70], [50, 48, 55]],
  /* 66 DYNAMITE */      [[200, 60, 50], [190, 55, 45], [210, 65, 55], [185, 50, 40]],
  /* 67 C4 */            [[210, 200, 160], [205, 195, 155], [215, 205, 165], [200, 190, 150]],
  /* 68 NITRO */         [[220, 240, 140], [210, 230, 130], [225, 245, 150], [200, 220, 120]],
  /* 69 THERMITE */      [[120, 65, 55], [110, 58, 50], [130, 72, 60], [105, 54, 46]],
  /* 70 NAPALM */        [[240, 150, 50], [235, 140, 45], [245, 160, 60], [230, 135, 40]],
  /* 71 FUSE */          [[170, 140, 90], [160, 130, 85], [180, 150, 95], [155, 125, 80]],
  /* 72 FIREWORK */      [[255, 80, 140], [80, 140, 255], [140, 255, 80], [255, 220, 80]],
  /* 73 ROCKET */        [[255, 210, 120], [255, 225, 140], [255, 195, 100], [255, 235, 160]],
  /* 74 GAS */           [[180, 220, 140], [170, 210, 130], [190, 230, 150], [175, 215, 135]],
  /* 75 DUST */          [[200, 190, 170], [195, 185, 165], [205, 195, 175], [210, 200, 180]],
  // --- Chemistry ---
  /* 76 ACID */          [[120, 255, 60], [100, 240, 50], [140, 255, 80], [110, 250, 40]],
  /* 77 ALKALI */        [[70, 150, 220], [60, 140, 210], [80, 160, 230], [55, 130, 200]],
  /* 78 SALT */          [[240, 240, 245], [235, 235, 240], [245, 245, 250], [232, 232, 237]],
  /* 79 OIL */           [[80, 60, 40], [75, 55, 35], [85, 65, 45], [70, 50, 32]],
  /* 80 MERCURY */       [[190, 200, 215], [185, 195, 210], [195, 205, 220], [200, 210, 225]],
  // --- Atomic ---
  /* 81 URANIUM */       [[80, 220, 80], [70, 210, 70], [90, 230, 90], [65, 200, 65]],
  /* 82 RADIATION */     [[120, 220, 100], [110, 210, 90], [130, 230, 110], [100, 200, 85]],
  /* 83 ANTIMATTER */    [[200, 60, 240], [190, 50, 230], [210, 70, 250], [220, 80, 255]],
  /* 84 PLASMA */        [[170, 210, 255], [190, 225, 255], [150, 195, 255], [210, 235, 255]],
  /* 85 TORCH */         [[255, 190, 60], [255, 170, 50], [255, 210, 80], [255, 160, 40]],
  /* 86 RUST */          [[180, 90, 30], [170, 80, 25], [190, 95, 35], [165, 75, 20]],
  // --- Machines ---
  /* 87 GLUE */          [[255, 240, 200], [250, 235, 195], [255, 245, 210], [248, 232, 190]],
  /* 88 BOUNCY */        [[80, 220, 220], [70, 210, 210], [90, 230, 230], [100, 240, 240]],
  /* 89 CONVEYOR_L */    [[100, 100, 140], [90, 90, 130], [110, 110, 150], [85, 85, 125]],
  /* 90 CONVEYOR_R */    [[100, 140, 100], [90, 130, 90], [110, 150, 110], [85, 125, 85]],
  /* 91 HEATER */        [[220, 70, 40], [230, 80, 50], [210, 60, 35], [240, 90, 55]],
  /* 92 COOLER */        [[70, 140, 220], [80, 150, 230], [60, 130, 210], [90, 160, 240]],
  /* 93 STORM_CLOUD */   [[80, 80, 105], [95, 95, 120], [65, 65, 90], [110, 110, 135]],
  /* 94 METEOR */        [[255, 140, 60], [255, 180, 80], [220, 100, 40], [255, 200, 120]],
  /* 95 BLACK_HOLE */    [[20, 5, 35], [10, 0, 25], [35, 15, 55], [5, 0, 15]],
  /* 96 SLIME */         [[100, 210, 130], [90, 200, 120], [115, 220, 145], [80, 190, 110]]
];

// UI categories
export const CATEGORIES = [
  { id: 'basic',
    materials: [MAT.SAND, MAT.WATER, MAT.STONE, MAT.WOOD, MAT.SOIL, MAT.GLASS, MAT.CLOUD, MAT.MUD] },
  { id: 'sweets',
    materials: [MAT.CANDY, MAT.CHOCOLATE, MAT.CARAMEL, MAT.COTTON_CANDY, MAT.JELLY, MAT.MARSHMALLOW, MAT.HONEY, MAT.MILK, MAT.ICE_CREAM] },
  { id: 'fire',
    materials: [MAT.FIRE, MAT.LAVA, MAT.EMBER, MAT.PLASMA, MAT.TORCH, MAT.SMOKE, MAT.STEAM, MAT.ASH] },
  { id: 'cold',
    materials: [MAT.ICE, MAT.SNOW, MAT.FROST] },
  { id: 'explosives',
    materials: [MAT.GUNPOWDER, MAT.DYNAMITE, MAT.C4, MAT.NITRO, MAT.THERMITE, MAT.NAPALM, MAT.FUSE, MAT.FIREWORK, MAT.ROCKET, MAT.DUST, MAT.GAS] },
  { id: 'chemistry',
    materials: [MAT.ACID, MAT.ALKALI, MAT.SALT, MAT.OIL, MAT.MERCURY] },
  { id: 'magic',
    materials: [MAT.STARDUST, MAT.FAIRY_DUST, MAT.GLITTER, MAT.POTION, MAT.RAINBOW, MAT.MAGIC_FIRE, MAT.CRACKER, MAT.RAINBOW_CORE] },
  { id: 'plants',
    materials: [MAT.SEED, MAT.FLOWER, MAT.GRASS, MAT.MUSHROOM, MAT.VINE] },
  { id: 'creatures',
    materials: [MAT.BUTTERFLY, MAT.BEE, MAT.LADYBUG, MAT.FISH, MAT.BUNNY, MAT.FIREFLY, MAT.UNICORN] },
  { id: 'electric',
    materials: [MAT.WIRE, MAT.SPARK, MAT.BATTERY, MAT.MAGNET, MAT.LAMP] },
  { id: 'atomic',
    materials: [MAT.URANIUM, MAT.RADIATION, MAT.ANTIMATTER, MAT.METEOR, MAT.BLACK_HOLE] },
  { id: 'gems',
    materials: [MAT.GOLD, MAT.DIAMOND, MAT.RUBY, MAT.EMERALD, MAT.METAL, MAT.RUST] },
  { id: 'special',
    materials: [MAT.BUBBLE, MAT.FOAM, MAT.SOAP, MAT.BALLOON, MAT.SLIME, MAT.CLONE, MAT.PORTAL, MAT.STORM_CLOUD, MAT.OBSIDIAN] },
  { id: 'machines',
    materials: [MAT.GLUE, MAT.BOUNCY, MAT.CONVEYOR_L, MAT.CONVEYOR_R, MAT.HEATER, MAT.COOLER] }
];

export const MAT_NAMES = {
  ru: [
    '', 'Песок', 'Вода', 'Камень', 'Дерево', 'Земля', 'Стекло',
    'Огонь', 'Лава', 'Уголёк', 'Дымок', 'Пар', 'Пепел', 'Магический огонь',
    'Лёд', 'Снег', 'Мороженое', 'Иней',
    'Конфетка', 'Шоколад', 'Карамель', 'Сах. вата', 'Желе', 'Зефир', 'Мёд', 'Молоко',
    'Звёздная пыль', 'Пыльца феи', 'Радуга', 'Блёстки', 'Зелье', 'Хлопушка', 'Радужное ядро',
    'Семечко', 'Цветок', 'Травка', 'Грибочек', 'Лиана',
    'Бабочка', 'Пчёлка', 'Божья коровка', 'Рыбка', 'Зайчик', 'Светлячок', 'Единорог',
    'Провод', 'Искра', 'Батарейка', 'Магнит', 'Лампа',
    'Золото', 'Алмаз', 'Рубин', 'Изумруд', 'Металл',
    'Пузырь', 'Пенка', 'Мыло', 'Шарик',
    'Клонер', 'Портал', 'Облако', 'Обсидиан', 'Грязь',
    'Искра',
    // 65+
    'Порох', 'Динамит', 'С4', 'Нитро', 'Термит',
    'Напалм', 'Фитиль', 'Фейерверк', 'Ракета', 'Газ', 'Пыль',
    'Кислота', 'Щёлочь', 'Соль', 'Масло', 'Ртуть',
    'Уран', 'Радиация', 'Антиматерия', 'Плазма', 'Факел',
    'Ржавчина',
    'Клей', 'Пружина', 'Конвейер ←', 'Конвейер →', 'Печка', 'Морозилка',
    'Гроза', 'Метеорит', 'Чёрная дыра', 'Слайм'
  ],
  en: [
    '', 'Sand', 'Water', 'Stone', 'Wood', 'Soil', 'Glass',
    'Fire', 'Lava', 'Ember', 'Smoke', 'Steam', 'Ash', 'Magic Fire',
    'Ice', 'Snow', 'Ice Cream', 'Frost',
    'Candy', 'Chocolate', 'Caramel', 'Cotton Candy', 'Jelly', 'Marshmallow', 'Honey', 'Milk',
    'Stardust', 'Fairy Dust', 'Rainbow', 'Glitter', 'Potion', 'Cracker', 'Rainbow Core',
    'Seed', 'Flower', 'Grass', 'Mushroom', 'Vine',
    'Butterfly', 'Bee', 'Ladybug', 'Fish', 'Bunny', 'Firefly', 'Unicorn',
    'Wire', 'Spark', 'Battery', 'Magnet', 'Lamp',
    'Gold', 'Diamond', 'Ruby', 'Emerald', 'Metal',
    'Bubble', 'Foam', 'Soap', 'Balloon',
    'Cloner', 'Portal', 'Cloud', 'Obsidian', 'Mud',
    'Spark',
    // 65+
    'Gunpowder', 'Dynamite', 'C4', 'Nitro', 'Thermite',
    'Napalm', 'Fuse', 'Firework', 'Rocket', 'Gas', 'Dust',
    'Acid', 'Alkali', 'Salt', 'Oil', 'Mercury',
    'Uranium', 'Radiation', 'Antimatter', 'Plasma', 'Torch',
    'Rust',
    'Glue', 'Bouncy', 'Conveyor ←', 'Conveyor →', 'Heater', 'Cooler',
    'Storm Cloud', 'Meteor', 'Black Hole', 'Slime'
  ]
};

export const CAT_NAMES = {
  ru: {
    basic: 'Основные', sweets: 'Сладости', fire: 'Огонь', cold: 'Холод',
    explosives: 'Взрывчатка', chemistry: 'Химия', magic: 'Магия',
    plants: 'Растения', creatures: 'Существа', electric: 'Электро',
    atomic: 'Атомное', gems: 'Самоцветы', special: 'Особые', machines: 'Машины'
  },
  en: {
    basic: 'Basic', sweets: 'Sweets', fire: 'Fire', cold: 'Cold',
    explosives: 'Explosives', chemistry: 'Chemistry', magic: 'Magic',
    plants: 'Plants', creatures: 'Creatures', electric: 'Electric',
    atomic: 'Atomic', gems: 'Gems', special: 'Special', machines: 'Machines'
  }
};

// Locked materials — rewarded video required
export const LOCKED_MATS = new Set([
  MAT.UNICORN, MAT.RAINBOW_CORE, MAT.MAGIC_FIRE, MAT.DIAMOND,
  MAT.CLONE, MAT.PORTAL, MAT.FIREFLY, MAT.FROST,
  MAT.BALLOON, MAT.LAMP, MAT.MAGNET,
  // New locks for heavy-hitters
  MAT.C4, MAT.NITRO, MAT.THERMITE, MAT.NAPALM,
  MAT.URANIUM, MAT.ANTIMATTER, MAT.PLASMA,
  MAT.MERCURY,
  // Cosmic & exotic
  MAT.STORM_CLOUD, MAT.METEOR, MAT.BLACK_HOLE, MAT.SLIME
]);
