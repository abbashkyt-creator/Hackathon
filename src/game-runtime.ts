import type { GameSlug } from "./types";

interface GameRuntime {
  embedded: boolean;
  preloadManifest?: string;
  assetManifest?: string;
  warmFullMirror?: boolean;
  prepareByMount?: boolean;
}

const RUNTIMES: Partial<Record<GameSlug, GameRuntime>> = {
  "subway-surfers": {
    embedded: true,
    preloadManifest: "/games/subway-surfers/preload-manifest.json",
    assetManifest: "/games/subway-surfers/MIRROR-MANIFEST.json",
  },
  "dino-runner": {
    embedded: true,
    preloadManifest: "/games/dino-game/preload-manifest.json",
    assetManifest: "/games/dino-game/MIRROR-MANIFEST.json",
  },
  "arithmetica": {
    embedded: true,
    preloadManifest: "/games/arithmetica/preload-manifest.json",
    assetManifest: "/games/arithmetica/MIRROR-MANIFEST.json",
  },
  "67-game": {
    embedded: true,
    preloadManifest: "/games/67-game/preload-manifest.json",
    assetManifest: "/games/67-game/MIRROR-MANIFEST.json",
  },
  "archery-king": {
    embedded: true,
    preloadManifest: "/games/archery-king/preload-manifest.json",
    assetManifest: "/games/archery-king/MIRROR-MANIFEST.json",
  },
  "smash-room": {
    embedded: true,
    preloadManifest: "/games/smash-room/preload-manifest.json",
    assetManifest: "/games/smash-room/MIRROR-MANIFEST.json",
  },
  "temple-run-2-frozen-shadows": {
    embedded: true,
    preloadManifest: "/games/temple-run-2-frozen-shadows/preload-manifest.json",
    assetManifest: "/games/temple-run-2-frozen-shadows/MIRROR-MANIFEST.json",
  },
  "stickman-fury": {
    embedded: true,
    preloadManifest: "/games/stickman-fury/preload-manifest.json",
    assetManifest: "/games/stickman-fury/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "plonky": {
    embedded: true,
    preloadManifest: "/games/plonky/preload-manifest.json",
    assetManifest: "/games/plonky/MIRROR-MANIFEST.json",
  },
  "fruit-ninja": {
    embedded: true,
    preloadManifest: "/games/fruit-ninja/preload-manifest.json",
    assetManifest: "/games/fruit-ninja/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "count-control-legends": {
    embedded: true,
    preloadManifest: "/games/count-control-legends/preload-manifest.json",
    assetManifest: "/games/count-control-legends/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "johnny-trigger-sniper": {
    embedded: true,
    preloadManifest: "/games/johnny-trigger-sniper/preload-manifest.json",
    assetManifest: "/games/johnny-trigger-sniper/MIRROR-MANIFEST.json",
    prepareByMount: true,
    // This Unity catalog contains hundreds of later-level Addressables.
    // Downloading all of them while the visible card boots delays Mission 1.
    warmFullMirror: false,
  },
  "rocket-soccer-derby": {
    embedded: true,
    preloadManifest: "/games/rocket-soccer-derby/preload-manifest.json",
    assetManifest: "/games/rocket-soccer-derby/MIRROR-MANIFEST.json",
    prepareByMount: true,
    // A complete Unity match build is ~55 MB. The active card gets first use
    // of the connection; only the immediately upcoming game can boot early.
    warmFullMirror: false,
  },
  "dig-out-of-prison": {
    embedded: true,
    preloadManifest: "/games/dig-out-of-prison/preload-manifest.json",
    assetManifest: "/games/dig-out-of-prison/MIRROR-MANIFEST.json",
    prepareByMount: true,
    warmFullMirror: false,
  },
  "kitty-loves-birds-2": { embedded: true },
  "theft-city": {
    embedded: true,
    preloadManifest: "/games/theft-city/preload-manifest.json",
    assetManifest: "/games/theft-city/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "city-cab-rush": {
    embedded: true,
    preloadManifest: "/games/city-cab-rush/preload-manifest.json",
    assetManifest: "/games/city-cab-rush/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "supercar-legends": {
    embedded: true,
    preloadManifest: "/games/supercar-legends/preload-manifest.json",
    assetManifest: "/games/supercar-legends/MIRROR-MANIFEST.json",
  },
  "ping-pong-go": {
    embedded: true,
    preloadManifest: "/games/ping-pong-go/preload-manifest.json",
    assetManifest: "/games/ping-pong-go/MIRROR-MANIFEST.json",
  },
  "tic-tac-toe": {
    embedded: true,
    preloadManifest: "/games/tic-tac-toe/preload-manifest.json",
    assetManifest: "/games/tic-tac-toe/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "go-battle-2": {
    embedded: true,
    preloadManifest: "/games/go-battle-2/preload-manifest.json",
    assetManifest: "/games/go-battle-2/MANIFEST.json",
    prepareByMount: true,
  },
  "stickman-battle": {
    embedded: true,
    preloadManifest: "/games/stickman-battle/preload-manifest.json",
    assetManifest: "/games/stickman-battle/MANIFEST.json",
    prepareByMount: true,
  },
  "retro-bowl": {
    embedded: true,
    preloadManifest: "/games/retro-bowl/preload-manifest.json",
    assetManifest: "/games/retro-bowl/MANIFEST.json",
    prepareByMount: true,
  },
  "domino": { embedded: true, preloadManifest: "/games/domino/preload-manifest.json", assetManifest: "/games/domino/MIRROR-MANIFEST.json", prepareByMount: true },
  "foosball": { embedded: true, preloadManifest: "/games/foosball/preload-manifest.json", assetManifest: "/games/foosball/MIRROR-MANIFEST.json", prepareByMount: true },
  "ludo-hero": { embedded: true, preloadManifest: "/games/ludo-hero/preload-manifest.json", assetManifest: "/games/ludo-hero/MIRROR-MANIFEST.json", prepareByMount: true },
  "moto-x3m": { embedded: true, preloadManifest: "/games/moto-x3m/preload-manifest.json", assetManifest: "/games/moto-x3m/MIRROR-MANIFEST.json", prepareByMount: true },
  "bubble-storm": { embedded: true, preloadManifest: "/games/bubble-storm/preload-manifest.json", assetManifest: "/games/bubble-storm/MIRROR-MANIFEST.json", prepareByMount: true },
  "spider-solitaire": { embedded: true, preloadManifest: "/games/spider-solitaire/preload-manifest.json", assetManifest: "/games/spider-solitaire/MIRROR-MANIFEST.json", prepareByMount: true },
  "master-checkers": { embedded: true, preloadManifest: "/games/master-checkers/preload-manifest.json", assetManifest: "/games/master-checkers/MIRROR-MANIFEST.json", prepareByMount: true },
  "four-in-a-row": { embedded: true, preloadManifest: "/games/four-in-a-row/preload-manifest.json", assetManifest: "/games/four-in-a-row/MIRROR-MANIFEST.json", prepareByMount: true },
  "monkey-mart": { embedded: true, preloadManifest: "/games/monkey-mart/preload-manifest.json", assetManifest: "/games/monkey-mart/MIRROR-MANIFEST.json", prepareByMount: true },
  "eggy-car": { embedded: true, preloadManifest: "/games/eggy-car/preload-manifest.json", assetManifest: "/games/eggy-car/MIRROR-MANIFEST.json", prepareByMount: true },
  "tiny-fishing": { embedded: true, preloadManifest: "/games/tiny-fishing/preload-manifest.json", assetManifest: "/games/tiny-fishing/MIRROR-MANIFEST.json", prepareByMount: true },
  "beauty-salon": { embedded: true, preloadManifest: "/games/beauty-salon/preload-manifest.json", assetManifest: "/games/beauty-salon/MIRROR-MANIFEST.json", prepareByMount: true },
  "fashion-fix-studio": { embedded: true, preloadManifest: "/games/fashion-fix-studio/preload-manifest.json", assetManifest: "/games/fashion-fix-studio/MIRROR-MANIFEST.json", prepareByMount: true },
  "phone-case-diy": { embedded: true, preloadManifest: "/games/phone-case-diy/preload-manifest.json", assetManifest: "/games/phone-case-diy/MIRROR-MANIFEST.json", prepareByMount: true },
  "clean-house": { embedded: true, preloadManifest: "/games/clean-house/preload-manifest.json", assetManifest: "/games/clean-house/MIRROR-MANIFEST.json", prepareByMount: true },
  "stunt-bike-extreme": { embedded: true, preloadManifest: "/games/stunt-bike-extreme/preload-manifest.json", assetManifest: "/games/stunt-bike-extreme/MIRROR-MANIFEST.json", prepareByMount: true },
  "idle-lumber-inc": { embedded: true, preloadManifest: "/games/idle-lumber-inc/preload-manifest.json", assetManifest: "/games/idle-lumber-inc/MIRROR-MANIFEST.json", prepareByMount: true },
  "my-perfect-hotel": { embedded: true, preloadManifest: "/games/my-perfect-hotel/preload-manifest.json", assetManifest: "/games/my-perfect-hotel/MIRROR-MANIFEST.json", prepareByMount: true },
  "snapstyle-dress-up": { embedded: true, preloadManifest: "/games/snapstyle-dress-up/preload-manifest.json", assetManifest: "/games/snapstyle-dress-up/MIRROR-MANIFEST.json", prepareByMount: true },
  "brain-test-tricky-puzzles": { embedded: true, preloadManifest: "/games/brain-test-tricky-puzzles/preload-manifest.json", assetManifest: "/games/brain-test-tricky-puzzles/MIRROR-MANIFEST.json", prepareByMount: true },
  "little-farm-world": { embedded: true, preloadManifest: "/games/little-farm-world/preload-manifest.json", assetManifest: "/games/little-farm-world/MIRROR-MANIFEST.json", prepareByMount: true },
  "moms-diary-cooking-games": { embedded: true, preloadManifest: "/games/moms-diary-cooking-games/preload-manifest.json", assetManifest: "/games/moms-diary-cooking-games/MIRROR-MANIFEST.json", prepareByMount: true },
  "scary-teacher-hide-seek-games": { embedded: true, preloadManifest: "/games/scary-teacher-hide-seek-games/preload-manifest.json", assetManifest: "/games/scary-teacher-hide-seek-games/MIRROR-MANIFEST.json", prepareByMount: true },
  "demolition-simulator": { embedded: true, preloadManifest: "/games/demolition-simulator/preload-manifest.json", assetManifest: "/games/demolition-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "family-sort": { embedded: true, preloadManifest: "/games/family-sort/preload-manifest.json", assetManifest: "/games/family-sort/MIRROR-MANIFEST.json", prepareByMount: true },
  "kick-the-buddy": { embedded: true, preloadManifest: "/games/kick-the-buddy/preload-manifest.json", assetManifest: "/games/kick-the-buddy/MIRROR-MANIFEST.json", prepareByMount: true },
  "slime-keyboard-escape": { embedded: true, preloadManifest: "/games/slime-keyboard-escape/preload-manifest.json", assetManifest: "/games/slime-keyboard-escape/MIRROR-MANIFEST.json", prepareByMount: true },
  "dragon-the-dragon": { embedded: true, preloadManifest: "/games/dragon-the-dragon/preload-manifest.json", assetManifest: "/games/dragon-the-dragon/MIRROR-MANIFEST.json", prepareByMount: true },
  "pet-mahjong-3d": { embedded: true, preloadManifest: "/games/pet-mahjong-3d/preload-manifest.json", assetManifest: "/games/pet-mahjong-3d/MIRROR-MANIFEST.json", prepareByMount: true },
  "petnest-io": { embedded: true, preloadManifest: "/games/petnest-io/preload-manifest.json", assetManifest: "/games/petnest-io/MIRROR-MANIFEST.json", prepareByMount: true },
  "travel-merge": { embedded: true, preloadManifest: "/games/travel-merge/preload-manifest.json", assetManifest: "/games/travel-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "build-your-island": { embedded: true, preloadManifest: "/games/build-your-island/preload-manifest.json", assetManifest: "/games/build-your-island/MIRROR-MANIFEST.json", prepareByMount: true },
  "sandbox-of-elements": { embedded: true, preloadManifest: "/games/sandbox-of-elements/preload-manifest.json", assetManifest: "/games/sandbox-of-elements/MIRROR-MANIFEST.json", prepareByMount: true },
  "crowd-rush": { embedded: true, preloadManifest: "/games/crowd-rush/preload-manifest.json", assetManifest: "/games/crowd-rush/MIRROR-MANIFEST.json", prepareByMount: true },
  "harvest-loop": { embedded: true, preloadManifest: "/games/harvest-loop/preload-manifest.json", assetManifest: "/games/harvest-loop/MIRROR-MANIFEST.json", prepareByMount: true },
  "tiny-game-shop-tycoon": { embedded: true, preloadManifest: "/games/tiny-game-shop-tycoon/preload-manifest.json", assetManifest: "/games/tiny-game-shop-tycoon/MIRROR-MANIFEST.json", prepareByMount: true },
  "undead-slayer": { embedded: true, preloadManifest: "/games/undead-slayer/preload-manifest.json", assetManifest: "/games/undead-slayer/MIRROR-MANIFEST.json", prepareByMount: true },
  "knife-merge": { embedded: true, preloadManifest: "/games/knife-merge/preload-manifest.json", assetManifest: "/games/knife-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "family-life-simulator": { embedded: true, preloadManifest: "/games/family-life-simulator/preload-manifest.json", assetManifest: "/games/family-life-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "dummies-fight": { embedded: true, preloadManifest: "/games/dummies-fight/preload-manifest.json", assetManifest: "/games/dummies-fight/MIRROR-MANIFEST.json", prepareByMount: true },
  "perfect-shape": { embedded: true, preloadManifest: "/games/perfect-shape/preload-manifest.json", assetManifest: "/games/perfect-shape/MIRROR-MANIFEST.json", prepareByMount: true },
  "flip-pounce": { embedded: true, preloadManifest: "/games/flip-pounce/preload-manifest.json", assetManifest: "/games/flip-pounce/MIRROR-MANIFEST.json", prepareByMount: true },
  "goalheads-io": { embedded: true, preloadManifest: "/games/goalheads-io/preload-manifest.json", assetManifest: "/games/goalheads-io/MIRROR-MANIFEST.json", prepareByMount: true },
  "goods-master": { embedded: true, preloadManifest: "/games/goods-master/preload-manifest.json", assetManifest: "/games/goods-master/MIRROR-MANIFEST.json", prepareByMount: true },
  "20f8": { embedded: true, preloadManifest: "/games/20f8/preload-manifest.json", assetManifest: "/games/20f8/MIRROR-MANIFEST.json", prepareByMount: true },
  "fashion-dress-up-star": { embedded: true, preloadManifest: "/games/fashion-dress-up-star/preload-manifest.json", assetManifest: "/games/fashion-dress-up-star/MIRROR-MANIFEST.json", prepareByMount: true },
  "dino-simulator": { embedded: true, preloadManifest: "/games/dino-simulator/preload-manifest.json", assetManifest: "/games/dino-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "bubbleshooter-x-basketball-3d": { embedded: true, preloadManifest: "/games/bubbleshooter-x-basketball-3d/preload-manifest.json", assetManifest: "/games/bubbleshooter-x-basketball-3d/MIRROR-MANIFEST.json", prepareByMount: true },
  "boomy-world": { embedded: true, preloadManifest: "/games/boomy-world/preload-manifest.json", assetManifest: "/games/boomy-world/MIRROR-MANIFEST.json", prepareByMount: true },
  "chick-flix": { embedded: true, preloadManifest: "/games/chick-flix/preload-manifest.json", assetManifest: "/games/chick-flix/MIRROR-MANIFEST.json", prepareByMount: true },
  "ball-guys": { embedded: true, preloadManifest: "/games/ball-guys/preload-manifest.json", assetManifest: "/games/ball-guys/MIRROR-MANIFEST.json", prepareByMount: true },
  "color-shapes": { embedded: true, preloadManifest: "/games/color-shapes/preload-manifest.json", assetManifest: "/games/color-shapes/MIRROR-MANIFEST.json", prepareByMount: true },
  "paperio-2": { embedded: true, preloadManifest: "/games/paperio-2/preload-manifest.json", assetManifest: "/games/paperio-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "snow-yeet": { embedded: true, preloadManifest: "/games/snow-yeet/preload-manifest.json", assetManifest: "/games/snow-yeet/MIRROR-MANIFEST.json", prepareByMount: true },
  "robo-cleaner-simulator": { embedded: true, preloadManifest: "/games/robo-cleaner-simulator/preload-manifest.json", assetManifest: "/games/robo-cleaner-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "noob-archer-2": { embedded: true, preloadManifest: "/games/noob-archer-2/preload-manifest.json", assetManifest: "/games/noob-archer-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "carnado-boat-racing": { embedded: true, preloadManifest: "/games/carnado-boat-racing/preload-manifest.json", assetManifest: "/games/carnado-boat-racing/MIRROR-MANIFEST.json", prepareByMount: true },
  "super-dress": { embedded: true, preloadManifest: "/games/super-dress/preload-manifest.json", assetManifest: "/games/super-dress/MIRROR-MANIFEST.json", prepareByMount: true },
  "block-for-blood": { embedded: true, preloadManifest: "/games/block-for-blood/preload-manifest.json", assetManifest: "/games/block-for-blood/MIRROR-MANIFEST.json", prepareByMount: true },
  "dress-up-party": { embedded: true, preloadManifest: "/games/dress-up-party/preload-manifest.json", assetManifest: "/games/dress-up-party/MIRROR-MANIFEST.json", prepareByMount: true },
  "cuboy-adventure": { embedded: true, preloadManifest: "/games/cuboy-adventure/preload-manifest.json", assetManifest: "/games/cuboy-adventure/MIRROR-MANIFEST.json", prepareByMount: true },
  "ragdoll-chaos": { embedded: true, preloadManifest: "/games/ragdoll-chaos/preload-manifest.json", assetManifest: "/games/ragdoll-chaos/MIRROR-MANIFEST.json", prepareByMount: true },
  "critter-chaos": { embedded: true, preloadManifest: "/games/critter-chaos/preload-manifest.json", assetManifest: "/games/critter-chaos/MIRROR-MANIFEST.json", prepareByMount: true },
  "happy-tidy-time": { embedded: true, preloadManifest: "/games/happy-tidy-time/preload-manifest.json", assetManifest: "/games/happy-tidy-time/MIRROR-MANIFEST.json", prepareByMount: true },
  "soccer-league": { embedded: true, preloadManifest: "/games/soccer-league/preload-manifest.json", assetManifest: "/games/soccer-league/MIRROR-MANIFEST.json", prepareByMount: true },
  "moto-trap": { embedded: true, preloadManifest: "/games/moto-trap/preload-manifest.json", assetManifest: "/games/moto-trap/MIRROR-MANIFEST.json", prepareByMount: true },
  "tiny-baker-ocean-jelly-cake": { embedded: true, preloadManifest: "/games/tiny-baker-ocean-jelly-cake/preload-manifest.json", assetManifest: "/games/tiny-baker-ocean-jelly-cake/MIRROR-MANIFEST.json", prepareByMount: true },
  "escape-from-scary-teacher": { embedded: true, preloadManifest: "/games/escape-from-scary-teacher/preload-manifest.json", assetManifest: "/games/escape-from-scary-teacher/MIRROR-MANIFEST.json", prepareByMount: true },
  "dogs-life": { embedded: true, preloadManifest: "/games/dogs-life/preload-manifest.json", assetManifest: "/games/dogs-life/MIRROR-MANIFEST.json", prepareByMount: true },
  "planet-merge": { embedded: true, preloadManifest: "/games/planet-merge/preload-manifest.json", assetManifest: "/games/planet-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "stickman-merge": { embedded: true, preloadManifest: "/games/stickman-merge/preload-manifest.json", assetManifest: "/games/stickman-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "jelly-well": { embedded: true, preloadManifest: "/games/jelly-well/preload-manifest.json", assetManifest: "/games/jelly-well/MIRROR-MANIFEST.json", prepareByMount: true },
  "backrooms-recovery": { embedded: true, preloadManifest: "/games/backrooms-recovery/preload-manifest.json", assetManifest: "/games/backrooms-recovery/MIRROR-MANIFEST.json", prepareByMount: true },
  "upgrade-the-cars": { embedded: true, preloadManifest: "/games/upgrade-the-cars/preload-manifest.json", assetManifest: "/games/upgrade-the-cars/MIRROR-MANIFEST.json", prepareByMount: true },
  "mad-skills-rallycross": { embedded: true, preloadManifest: "/games/mad-skills-rallycross/preload-manifest.json", assetManifest: "/games/mad-skills-rallycross/MIRROR-MANIFEST.json", prepareByMount: true },
  "pull-a-sword": { embedded: true, preloadManifest: "/games/pull-a-sword/preload-manifest.json", assetManifest: "/games/pull-a-sword/MIRROR-MANIFEST.json", prepareByMount: true },
  "trapped-in-the-dollhouse": { embedded: true, preloadManifest: "/games/trapped-in-the-dollhouse/preload-manifest.json", assetManifest: "/games/trapped-in-the-dollhouse/MIRROR-MANIFEST.json", prepareByMount: true },
  "tds-tower-destiny-survive": { embedded: true, preloadManifest: "/games/tds-tower-destiny-survive/preload-manifest.json", assetManifest: "/games/tds-tower-destiny-survive/MIRROR-MANIFEST.json", prepareByMount: true },
  "fight-and-loot": { embedded: true, preloadManifest: "/games/fight-and-loot/preload-manifest.json", assetManifest: "/games/fight-and-loot/MIRROR-MANIFEST.json", prepareByMount: true },
  "sea-of-sharks": { embedded: true, preloadManifest: "/games/sea-of-sharks/preload-manifest.json", assetManifest: "/games/sea-of-sharks/MIRROR-MANIFEST.json", prepareByMount: true },
  "clash-of-cards": { embedded: true, preloadManifest: "/games/clash-of-cards/preload-manifest.json", assetManifest: "/games/clash-of-cards/MIRROR-MANIFEST.json", prepareByMount: true },
  "oozys-lab": { embedded: true, preloadManifest: "/games/oozys-lab/preload-manifest.json", assetManifest: "/games/oozys-lab/MIRROR-MANIFEST.json", prepareByMount: true },
  "dan-the-man": { embedded: true, preloadManifest: "/games/dan-the-man/preload-manifest.json", assetManifest: "/games/dan-the-man/MIRROR-MANIFEST.json", prepareByMount: true },
  "samurai-sam": { embedded: true, preloadManifest: "/games/samurai-sam/preload-manifest.json", assetManifest: "/games/samurai-sam/MIRROR-MANIFEST.json", prepareByMount: true },
  "punch-master": { embedded: true, preloadManifest: "/games/punch-master/preload-manifest.json", assetManifest: "/games/punch-master/MIRROR-MANIFEST.json", prepareByMount: true },
  "soccer-5": { embedded: true, preloadManifest: "/games/soccer-5/preload-manifest.json", assetManifest: "/games/soccer-5/MIRROR-MANIFEST.json", prepareByMount: true },
  "hero-vs-criminal": { embedded: true, preloadManifest: "/games/hero-vs-criminal/preload-manifest.json", assetManifest: "/games/hero-vs-criminal/MIRROR-MANIFEST.json", prepareByMount: true },
  "brain-test-5": { embedded: true, preloadManifest: "/games/brain-test-5/preload-manifest.json", assetManifest: "/games/brain-test-5/MIRROR-MANIFEST.json", prepareByMount: true },
  "numbers-match": { embedded: true, preloadManifest: "/games/numbers-match/preload-manifest.json", assetManifest: "/games/numbers-match/MIRROR-MANIFEST.json", prepareByMount: true },
  "superweird": { embedded: true, preloadManifest: "/games/superweird/preload-manifest.json", assetManifest: "/games/superweird/MIRROR-MANIFEST.json", prepareByMount: true },
  "car-circle": { embedded: true, preloadManifest: "/games/car-circle/preload-manifest.json", assetManifest: "/games/car-circle/MIRROR-MANIFEST.json", prepareByMount: true },
  "ball-vs-block": { embedded: true, preloadManifest: "/games/ball-vs-block/preload-manifest.json", assetManifest: "/games/ball-vs-block/MIRROR-MANIFEST.json", prepareByMount: true },
  "home-builder-clicker": { embedded: true, preloadManifest: "/games/home-builder-clicker/preload-manifest.json", assetManifest: "/games/home-builder-clicker/MIRROR-MANIFEST.json", prepareByMount: true },
  "sea-catcher": { embedded: true, preloadManifest: "/games/sea-catcher/preload-manifest.json", assetManifest: "/games/sea-catcher/MIRROR-MANIFEST.json", prepareByMount: true },
  "kitten-out": { embedded: true, preloadManifest: "/games/kitten-out/preload-manifest.json", assetManifest: "/games/kitten-out/MIRROR-MANIFEST.json", prepareByMount: true },
  "marina-club-rush": { embedded: true, preloadManifest: "/games/marina-club-rush/preload-manifest.json", assetManifest: "/games/marina-club-rush/MIRROR-MANIFEST.json", prepareByMount: true },
  "airplane-manager": { embedded: true, preloadManifest: "/games/airplane-manager/preload-manifest.json", assetManifest: "/games/airplane-manager/MIRROR-MANIFEST.json", prepareByMount: true },
  "gunforce": { embedded: true, preloadManifest: "/games/gunforce/preload-manifest.json", assetManifest: "/games/gunforce/MIRROR-MANIFEST.json", prepareByMount: true },
  "spacebar-clicker": { embedded: true, preloadManifest: "/games/spacebar-clicker/preload-manifest.json", assetManifest: "/games/spacebar-clicker/MIRROR-MANIFEST.json", prepareByMount: true },
  "veggie-merge": { embedded: true, preloadManifest: "/games/veggie-merge/preload-manifest.json", assetManifest: "/games/veggie-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "a-small-world-cup-2": { embedded: true, preloadManifest: "/games/a-small-world-cup-2/preload-manifest.json", assetManifest: "/games/a-small-world-cup-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "tens": { embedded: true, preloadManifest: "/games/tens/preload-manifest.json", assetManifest: "/games/tens/MIRROR-MANIFEST.json", prepareByMount: true },
  "lafufu-blind-box-dress-up": { embedded: true, preloadManifest: "/games/lafufu-blind-box-dress-up/preload-manifest.json", assetManifest: "/games/lafufu-blind-box-dress-up/MIRROR-MANIFEST.json", prepareByMount: true },
  "find-it": { embedded: true, preloadManifest: "/games/find-it/preload-manifest.json", assetManifest: "/games/find-it/MIRROR-MANIFEST.json", prepareByMount: true },
  "sushi-situation": { embedded: true, preloadManifest: "/games/sushi-situation/preload-manifest.json", assetManifest: "/games/sushi-situation/MIRROR-MANIFEST.json", prepareByMount: true },
  "draft-wars": { embedded: true, preloadManifest: "/games/draft-wars/preload-manifest.json", assetManifest: "/games/draft-wars/MIRROR-MANIFEST.json", prepareByMount: true },
  "annoying-teacher-punch-game": { embedded: true, preloadManifest: "/games/annoying-teacher-punch-game/preload-manifest.json", assetManifest: "/games/annoying-teacher-punch-game/MIRROR-MANIFEST.json", prepareByMount: true },
  "battle-blast": { embedded: true, preloadManifest: "/games/battle-blast/preload-manifest.json", assetManifest: "/games/battle-blast/MIRROR-MANIFEST.json", prepareByMount: true },
  "catch-a-pet": { embedded: true, preloadManifest: "/games/catch-a-pet/preload-manifest.json", assetManifest: "/games/catch-a-pet/MIRROR-MANIFEST.json", prepareByMount: true },
  "hide-and-paint": { embedded: true, preloadManifest: "/games/hide-and-paint/preload-manifest.json", assetManifest: "/games/hide-and-paint/MIRROR-MANIFEST.json", prepareByMount: true },
  "make-brainrots-online": { embedded: true, preloadManifest: "/games/make-brainrots-online/preload-manifest.json", assetManifest: "/games/make-brainrots-online/MIRROR-MANIFEST.json", prepareByMount: true },
  "monkey-tag-io": { embedded: true, preloadManifest: "/games/monkey-tag-io/preload-manifest.json", assetManifest: "/games/monkey-tag-io/MIRROR-MANIFEST.json", prepareByMount: true },
  "stickers-merge": { embedded: true, preloadManifest: "/games/stickers-merge/preload-manifest.json", assetManifest: "/games/stickers-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "tiger-tank-2": { embedded: true, preloadManifest: "/games/tiger-tank-2/preload-manifest.json", assetManifest: "/games/tiger-tank-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "duck-merge": { embedded: true, preloadManifest: "/games/duck-merge/preload-manifest.json", assetManifest: "/games/duck-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "blumgi-splash": { embedded: true, preloadManifest: "/games/blumgi-splash/preload-manifest.json", assetManifest: "/games/blumgi-splash/MIRROR-MANIFEST.json", prepareByMount: true },
  "school-cleaning": { embedded: true, preloadManifest: "/games/school-cleaning/preload-manifest.json", assetManifest: "/games/school-cleaning/MIRROR-MANIFEST.json", prepareByMount: true },
  "talking-tom-gold-run": { embedded: true, preloadManifest: "/games/talking-tom-gold-run/preload-manifest.json", assetManifest: "/games/talking-tom-gold-run/MIRROR-MANIFEST.json", prepareByMount: true },
  "cozyville-find-hidden-objects": { embedded: true, preloadManifest: "/games/cozyville-find-hidden-objects/preload-manifest.json", assetManifest: "/games/cozyville-find-hidden-objects/MIRROR-MANIFEST.json", prepareByMount: true },
  "stunt-protocol-two-players": { embedded: true, preloadManifest: "/games/stunt-protocol-two-players/preload-manifest.json", assetManifest: "/games/stunt-protocol-two-players/MIRROR-MANIFEST.json", prepareByMount: true },
  "guns-guns-guns": { embedded: true, preloadManifest: "/games/guns-guns-guns/preload-manifest.json", assetManifest: "/games/guns-guns-guns/MIRROR-MANIFEST.json", prepareByMount: true },
  "world-of-yarn": { embedded: true, preloadManifest: "/games/world-of-yarn/preload-manifest.json", assetManifest: "/games/world-of-yarn/MIRROR-MANIFEST.json", prepareByMount: true },
  "bunny-miner": { embedded: true, preloadManifest: "/games/bunny-miner/preload-manifest.json", assetManifest: "/games/bunny-miner/MIRROR-MANIFEST.json", prepareByMount: true },
  "goal-gang": { embedded: true, preloadManifest: "/games/goal-gang/preload-manifest.json", assetManifest: "/games/goal-gang/MIRROR-MANIFEST.json", prepareByMount: true },
  "bubble-tower": { embedded: true, preloadManifest: "/games/bubble-tower/preload-manifest.json", assetManifest: "/games/bubble-tower/MIRROR-MANIFEST.json", prepareByMount: true },
  "snacky-snake": { embedded: true, preloadManifest: "/games/snacky-snake/preload-manifest.json", assetManifest: "/games/snacky-snake/MIRROR-MANIFEST.json", prepareByMount: true },
  "zombit": { embedded: true, preloadManifest: "/games/zombit/preload-manifest.json", assetManifest: "/games/zombit/MIRROR-MANIFEST.json", prepareByMount: true },
  "wheel-master": { embedded: true, preloadManifest: "/games/wheel-master/preload-manifest.json", assetManifest: "/games/wheel-master/MIRROR-MANIFEST.json", prepareByMount: true },
  "satisbox-builder": { embedded: true, preloadManifest: "/games/satisbox-builder/preload-manifest.json", assetManifest: "/games/satisbox-builder/MIRROR-MANIFEST.json", prepareByMount: true },
  "carnado-bike-stunt": { embedded: true, preloadManifest: "/games/carnado-bike-stunt/preload-manifest.json", assetManifest: "/games/carnado-bike-stunt/MIRROR-MANIFEST.json", prepareByMount: true },
  "blast-buddies": { embedded: true, preloadManifest: "/games/blast-buddies/preload-manifest.json", assetManifest: "/games/blast-buddies/MIRROR-MANIFEST.json", prepareByMount: true },
  "count-war": { embedded: true, preloadManifest: "/games/count-war/preload-manifest.json", assetManifest: "/games/count-war/MIRROR-MANIFEST.json", prepareByMount: true },
  "lips-diy-master": { embedded: true, preloadManifest: "/games/lips-diy-master/preload-manifest.json", assetManifest: "/games/lips-diy-master/MIRROR-MANIFEST.json", prepareByMount: true },
  "going-up-rooftop": { embedded: true, preloadManifest: "/games/going-up-rooftop/preload-manifest.json", assetManifest: "/games/going-up-rooftop/MIRROR-MANIFEST.json", prepareByMount: true },
  "keyboard-warrior": { embedded: true, preloadManifest: "/games/keyboard-warrior/preload-manifest.json", assetManifest: "/games/keyboard-warrior/MIRROR-MANIFEST.json", prepareByMount: true },
  "adventure-miner": { embedded: true, preloadManifest: "/games/adventure-miner/preload-manifest.json", assetManifest: "/games/adventure-miner/MIRROR-MANIFEST.json", prepareByMount: true },
  "dino-fighter": { embedded: true, preloadManifest: "/games/dino-fighter/preload-manifest.json", assetManifest: "/games/dino-fighter/MIRROR-MANIFEST.json", prepareByMount: true },
  "cleanup-crew": { embedded: true, preloadManifest: "/games/cleanup-crew/preload-manifest.json", assetManifest: "/games/cleanup-crew/MIRROR-MANIFEST.json", prepareByMount: true },
  "basketball-real": { embedded: true, preloadManifest: "/games/basketball-real/preload-manifest.json", assetManifest: "/games/basketball-real/MIRROR-MANIFEST.json", prepareByMount: true },
  "crazy-merge": { embedded: true, preloadManifest: "/games/crazy-merge/preload-manifest.json", assetManifest: "/games/crazy-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "jelly-sokoban": { embedded: true, preloadManifest: "/games/jelly-sokoban/preload-manifest.json", assetManifest: "/games/jelly-sokoban/MIRROR-MANIFEST.json", prepareByMount: true },
  "soccer-skills-2-world-cup": { embedded: true, preloadManifest: "/games/soccer-skills-2-world-cup/preload-manifest.json", assetManifest: "/games/soccer-skills-2-world-cup/MIRROR-MANIFEST.json", prepareByMount: true },
  "kpop-concert-dress-up": { embedded: true, preloadManifest: "/games/kpop-concert-dress-up/preload-manifest.json", assetManifest: "/games/kpop-concert-dress-up/MIRROR-MANIFEST.json", prepareByMount: true },
  "drift-hunters": { embedded: true, preloadManifest: "/games/drift-hunters/preload-manifest.json", assetManifest: "/games/drift-hunters/MIRROR-MANIFEST.json", prepareByMount: true },
  "knockout-penguins": { embedded: true, preloadManifest: "/games/knockout-penguins/preload-manifest.json", assetManifest: "/games/knockout-penguins/MIRROR-MANIFEST.json", prepareByMount: true },
  "decor-life": { embedded: true, preloadManifest: "/games/decor-life/preload-manifest.json", assetManifest: "/games/decor-life/MIRROR-MANIFEST.json", prepareByMount: true },
  "janes-fashion-studio": { embedded: true, preloadManifest: "/games/janes-fashion-studio/preload-manifest.json", assetManifest: "/games/janes-fashion-studio/MIRROR-MANIFEST.json", prepareByMount: true },
  "real-city-bikes": { embedded: true, preloadManifest: "/games/real-city-bikes/preload-manifest.json", assetManifest: "/games/real-city-bikes/MIRROR-MANIFEST.json", prepareByMount: true },
  "sort-the-court": { embedded: true, preloadManifest: "/games/sort-the-court/preload-manifest.json", assetManifest: "/games/sort-the-court/MIRROR-MANIFEST.json", prepareByMount: true },
  "skill-knight": { embedded: true, preloadManifest: "/games/skill-knight/preload-manifest.json", assetManifest: "/games/skill-knight/MIRROR-MANIFEST.json", prepareByMount: true },
  "jelly-fruit-merge": { embedded: true, preloadManifest: "/games/jelly-fruit-merge/preload-manifest.json", assetManifest: "/games/jelly-fruit-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "wreck-the-robot": { embedded: true, preloadManifest: "/games/wreck-the-robot/preload-manifest.json", assetManifest: "/games/wreck-the-robot/MIRROR-MANIFEST.json", prepareByMount: true },
  "freaky-clown-town-mystery": { embedded: true, preloadManifest: "/games/freaky-clown-town-mystery/preload-manifest.json", assetManifest: "/games/freaky-clown-town-mystery/MIRROR-MANIFEST.json", prepareByMount: true },
  "magic-battleground": { embedded: true, preloadManifest: "/games/magic-battleground/preload-manifest.json", assetManifest: "/games/magic-battleground/MIRROR-MANIFEST.json", prepareByMount: true },
  "free-skate": { embedded: true, preloadManifest: "/games/free-skate/preload-manifest.json", assetManifest: "/games/free-skate/MIRROR-MANIFEST.json", prepareByMount: true },
  "alien-raid-monster-evolution": { embedded: true, preloadManifest: "/games/alien-raid-monster-evolution/preload-manifest.json", assetManifest: "/games/alien-raid-monster-evolution/MIRROR-MANIFEST.json", prepareByMount: true },
  "tuning-car-racing": { embedded: true, preloadManifest: "/games/tuning-car-racing/preload-manifest.json", assetManifest: "/games/tuning-car-racing/MIRROR-MANIFEST.json", prepareByMount: true },
  "metamon": { embedded: true, preloadManifest: "/games/metamon/preload-manifest.json", assetManifest: "/games/metamon/MIRROR-MANIFEST.json", prepareByMount: true },
  "crazy-race": { embedded: true, preloadManifest: "/games/crazy-race/preload-manifest.json", assetManifest: "/games/crazy-race/MIRROR-MANIFEST.json", prepareByMount: true },
  "diva-makeup-studio": { embedded: true, preloadManifest: "/games/diva-makeup-studio/preload-manifest.json", assetManifest: "/games/diva-makeup-studio/MIRROR-MANIFEST.json", prepareByMount: true },
  "flat-baseball": { embedded: true, preloadManifest: "/games/flat-baseball/preload-manifest.json", assetManifest: "/games/flat-baseball/MIRROR-MANIFEST.json", prepareByMount: true },
  "cat-simulator": { embedded: true, preloadManifest: "/games/cat-simulator/preload-manifest.json", assetManifest: "/games/cat-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "fashion-legends": { embedded: true, preloadManifest: "/games/fashion-legends/preload-manifest.json", assetManifest: "/games/fashion-legends/MIRROR-MANIFEST.json", prepareByMount: true },
  "mine-and-dig": { embedded: true, preloadManifest: "/games/mine-and-dig/preload-manifest.json", assetManifest: "/games/mine-and-dig/MIRROR-MANIFEST.json", prepareByMount: true },
  "tank-stars": { embedded: true, preloadManifest: "/games/tank-stars/preload-manifest.json", assetManifest: "/games/tank-stars/MIRROR-MANIFEST.json", prepareByMount: true },
  "4th-and-goal-2026": { embedded: true, preloadManifest: "/games/4th-and-goal-2026/preload-manifest.json", assetManifest: "/games/4th-and-goal-2026/MIRROR-MANIFEST.json", prepareByMount: true },
  "punchy-guy": { embedded: true, preloadManifest: "/games/punchy-guy/preload-manifest.json", assetManifest: "/games/punchy-guy/MIRROR-MANIFEST.json", prepareByMount: true },
  "you-monster": { embedded: true, preloadManifest: "/games/you-monster/preload-manifest.json", assetManifest: "/games/you-monster/MIRROR-MANIFEST.json", prepareByMount: true },
  "push-titans": { embedded: true, preloadManifest: "/games/push-titans/preload-manifest.json", assetManifest: "/games/push-titans/MIRROR-MANIFEST.json", prepareByMount: true },
  "neon-challenge-legends": { embedded: true, preloadManifest: "/games/neon-challenge-legends/preload-manifest.json", assetManifest: "/games/neon-challenge-legends/MIRROR-MANIFEST.json", prepareByMount: true },
  "ludo-king": { embedded: true, preloadManifest: "/games/ludo-king/preload-manifest.json", assetManifest: "/games/ludo-king/MIRROR-MANIFEST.json", prepareByMount: true },
  "idle-spinner-factory-builder": { embedded: true, preloadManifest: "/games/idle-spinner-factory-builder/preload-manifest.json", assetManifest: "/games/idle-spinner-factory-builder/MIRROR-MANIFEST.json", prepareByMount: true },
  "gas-station": { embedded: true, preloadManifest: "/games/gas-station/preload-manifest.json", assetManifest: "/games/gas-station/MIRROR-MANIFEST.json", prepareByMount: true },
  "grass-knight": { embedded: true, preloadManifest: "/games/grass-knight/preload-manifest.json", assetManifest: "/games/grass-knight/MIRROR-MANIFEST.json", prepareByMount: true },
  "slime-dunk": { embedded: true, preloadManifest: "/games/slime-dunk/preload-manifest.json", assetManifest: "/games/slime-dunk/MIRROR-MANIFEST.json", prepareByMount: true },
  "the-superhero-league-2": { embedded: true, preloadManifest: "/games/the-superhero-league-2/preload-manifest.json", assetManifest: "/games/the-superhero-league-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "sword-road": { embedded: true, preloadManifest: "/games/sword-road/preload-manifest.json", assetManifest: "/games/sword-road/MIRROR-MANIFEST.json", prepareByMount: true },
  "carrom-multiplayer": { embedded: true, preloadManifest: "/games/carrom-multiplayer/preload-manifest.json", assetManifest: "/games/carrom-multiplayer/MIRROR-MANIFEST.json", prepareByMount: true },
  "turnament": { embedded: true, preloadManifest: "/games/turnament/preload-manifest.json", assetManifest: "/games/turnament/MIRROR-MANIFEST.json", prepareByMount: true },
  "papa-louie-3": { embedded: true, preloadManifest: "/games/papa-louie-3/preload-manifest.json", assetManifest: "/games/papa-louie-3/MIRROR-MANIFEST.json", prepareByMount: true },
  "mirror-image": { embedded: true, preloadManifest: "/games/mirror-image/preload-manifest.json", assetManifest: "/games/mirror-image/MIRROR-MANIFEST.json", prepareByMount: true },
  "bos-bedroom": { embedded: true, preloadManifest: "/games/bos-bedroom/preload-manifest.json", assetManifest: "/games/bos-bedroom/MIRROR-MANIFEST.json", prepareByMount: true },
  "bubble-heroes": { embedded: true, preloadManifest: "/games/bubble-heroes/preload-manifest.json", assetManifest: "/games/bubble-heroes/MIRROR-MANIFEST.json", prepareByMount: true },
  "racing-rampage": { embedded: true, preloadManifest: "/games/racing-rampage/preload-manifest.json", assetManifest: "/games/racing-rampage/MIRROR-MANIFEST.json", prepareByMount: true },
  "snek-left": { embedded: true, preloadManifest: "/games/snek-left/preload-manifest.json", assetManifest: "/games/snek-left/MIRROR-MANIFEST.json", prepareByMount: true },
  "snow-riders": { embedded: true, preloadManifest: "/games/snow-riders/preload-manifest.json", assetManifest: "/games/snow-riders/MIRROR-MANIFEST.json", prepareByMount: true },
  "papa-louie-2": { embedded: true, preloadManifest: "/games/papa-louie-2/preload-manifest.json", assetManifest: "/games/papa-louie-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "whip-flip": { embedded: true, preloadManifest: "/games/whip-flip/preload-manifest.json", assetManifest: "/games/whip-flip/MIRROR-MANIFEST.json", prepareByMount: true },
  "human-bullet-gun": { embedded: true, preloadManifest: "/games/human-bullet-gun/preload-manifest.json", assetManifest: "/games/human-bullet-gun/MIRROR-MANIFEST.json", prepareByMount: true },
  "graveyard-shift": { embedded: true, preloadManifest: "/games/graveyard-shift/preload-manifest.json", assetManifest: "/games/graveyard-shift/MIRROR-MANIFEST.json", prepareByMount: true },
  "speed-stars": { embedded: true, preloadManifest: "/games/speed-stars/preload-manifest.json", assetManifest: "/games/speed-stars/MIRROR-MANIFEST.json", prepareByMount: true },
  "brain-test-special": { embedded: true, preloadManifest: "/games/brain-test-special/preload-manifest.json", assetManifest: "/games/brain-test-special/MIRROR-MANIFEST.json", prepareByMount: true },
  "cat-bird": { embedded: true, preloadManifest: "/games/cat-bird/preload-manifest.json", assetManifest: "/games/cat-bird/MIRROR-MANIFEST.json", prepareByMount: true },
  "pizza-planet": { embedded: true, preloadManifest: "/games/pizza-planet/preload-manifest.json", assetManifest: "/games/pizza-planet/MIRROR-MANIFEST.json", prepareByMount: true },
  "eggsplosion": { embedded: true, preloadManifest: "/games/eggsplosion/preload-manifest.json", assetManifest: "/games/eggsplosion/MIRROR-MANIFEST.json", prepareByMount: true },
  "planet-destruction": { embedded: true, preloadManifest: "/games/planet-destruction/preload-manifest.json", assetManifest: "/games/planet-destruction/MIRROR-MANIFEST.json", prepareByMount: true },
  "tear-blocks-down": { embedded: true, preloadManifest: "/games/tear-blocks-down/preload-manifest.json", assetManifest: "/games/tear-blocks-down/MIRROR-MANIFEST.json", prepareByMount: true },
  "little-tricky-prankster": { embedded: true, preloadManifest: "/games/little-tricky-prankster/preload-manifest.json", assetManifest: "/games/little-tricky-prankster/MIRROR-MANIFEST.json", prepareByMount: true },
  "no-pain-no-gain": { embedded: true, preloadManifest: "/games/no-pain-no-gain/preload-manifest.json", assetManifest: "/games/no-pain-no-gain/MIRROR-MANIFEST.json", prepareByMount: true },
  "cube-builder": { embedded: true, preloadManifest: "/games/cube-builder/preload-manifest.json", assetManifest: "/games/cube-builder/MIRROR-MANIFEST.json", prepareByMount: true },
  "elf-backpack": { embedded: true, preloadManifest: "/games/elf-backpack/preload-manifest.json", assetManifest: "/games/elf-backpack/MIRROR-MANIFEST.json", prepareByMount: true },
  "wonder-high-dressup": { embedded: true, preloadManifest: "/games/wonder-high-dressup/preload-manifest.json", assetManifest: "/games/wonder-high-dressup/MIRROR-MANIFEST.json", prepareByMount: true },
  "pizza-day": { embedded: true, preloadManifest: "/games/pizza-day/preload-manifest.json", assetManifest: "/games/pizza-day/MIRROR-MANIFEST.json", prepareByMount: true },
  "obby-roads": { embedded: true, preloadManifest: "/games/obby-roads/preload-manifest.json", assetManifest: "/games/obby-roads/MIRROR-MANIFEST.json", prepareByMount: true },
  "bacon-survivor": { embedded: true, preloadManifest: "/games/bacon-survivor/preload-manifest.json", assetManifest: "/games/bacon-survivor/MIRROR-MANIFEST.json", prepareByMount: true },
  "hill-climb-racing-lite": { embedded: true, preloadManifest: "/games/hill-climb-racing-lite/preload-manifest.json", assetManifest: "/games/hill-climb-racing-lite/MIRROR-MANIFEST.json", prepareByMount: true },
  "ludo-online": { embedded: true, preloadManifest: "/games/ludo-online/preload-manifest.json", assetManifest: "/games/ludo-online/MIRROR-MANIFEST.json", prepareByMount: true },
  "blumgi-bounce": { embedded: true, preloadManifest: "/games/blumgi-bounce/preload-manifest.json", assetManifest: "/games/blumgi-bounce/MIRROR-MANIFEST.json", prepareByMount: true },
  "ragdoll-drop": { embedded: true, preloadManifest: "/games/ragdoll-drop/preload-manifest.json", assetManifest: "/games/ragdoll-drop/MIRROR-MANIFEST.json", prepareByMount: true },
  "kates-cooking-party": { embedded: true, preloadManifest: "/games/kates-cooking-party/preload-manifest.json", assetManifest: "/games/kates-cooking-party/MIRROR-MANIFEST.json", prepareByMount: true },
  "dino-quake": { embedded: true, preloadManifest: "/games/dino-quake/preload-manifest.json", assetManifest: "/games/dino-quake/MIRROR-MANIFEST.json", prepareByMount: true },
  "beardie-craft-survival": { embedded: true, preloadManifest: "/games/beardie-craft-survival/preload-manifest.json", assetManifest: "/games/beardie-craft-survival/MIRROR-MANIFEST.json", prepareByMount: true },
  "pro-shooter": { embedded: true, preloadManifest: "/games/pro-shooter/preload-manifest.json", assetManifest: "/games/pro-shooter/MIRROR-MANIFEST.json", prepareByMount: true },
  "my-city-horse-stable": { embedded: true, preloadManifest: "/games/my-city-horse-stable/preload-manifest.json", assetManifest: "/games/my-city-horse-stable/MIRROR-MANIFEST.json", prepareByMount: true },
  "party-time": { embedded: true, preloadManifest: "/games/party-time/preload-manifest.json", assetManifest: "/games/party-time/MIRROR-MANIFEST.json", prepareByMount: true },
  "world-of-screw": { embedded: true, preloadManifest: "/games/world-of-screw/preload-manifest.json", assetManifest: "/games/world-of-screw/MIRROR-MANIFEST.json", prepareByMount: true },
  "royal-flush-merge": { embedded: true, preloadManifest: "/games/royal-flush-merge/preload-manifest.json", assetManifest: "/games/royal-flush-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "monster-max": { embedded: true, preloadManifest: "/games/monster-max/preload-manifest.json", assetManifest: "/games/monster-max/MIRROR-MANIFEST.json", prepareByMount: true },
  "life-choices-2-life-simulator": { embedded: true, preloadManifest: "/games/life-choices-2-life-simulator/preload-manifest.json", assetManifest: "/games/life-choices-2-life-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "nail-salon": { embedded: true, preloadManifest: "/games/nail-salon/preload-manifest.json", assetManifest: "/games/nail-salon/MIRROR-MANIFEST.json", prepareByMount: true },
  "subway-surfers-blast": { embedded: true, preloadManifest: "/games/subway-surfers-blast/preload-manifest.json", assetManifest: "/games/subway-surfers-blast/MIRROR-MANIFEST.json", prepareByMount: true },
  "subway-surfers-match": { embedded: true, preloadManifest: "/games/subway-surfers-match/preload-manifest.json", assetManifest: "/games/subway-surfers-match/MIRROR-MANIFEST.json", prepareByMount: true },
  "scary-teacher-playtime-adventure": { embedded: true, preloadManifest: "/games/scary-teacher-playtime-adventure/preload-manifest.json", assetManifest: "/games/scary-teacher-playtime-adventure/MIRROR-MANIFEST.json", prepareByMount: true },
  "sky-race": { embedded: true, preloadManifest: "/games/sky-race/preload-manifest.json", assetManifest: "/games/sky-race/MIRROR-MANIFEST.json", prepareByMount: true },
  "snake-vs-human": { embedded: true, preloadManifest: "/games/snake-vs-human/preload-manifest.json", assetManifest: "/games/snake-vs-human/MIRROR-MANIFEST.json", prepareByMount: true },
  "thung-wars": { embedded: true, preloadManifest: "/games/thung-wars/preload-manifest.json", assetManifest: "/games/thung-wars/MIRROR-MANIFEST.json", prepareByMount: true },
  "grass-cutter": { embedded: true, preloadManifest: "/games/grass-cutter/preload-manifest.json", assetManifest: "/games/grass-cutter/MIRROR-MANIFEST.json", prepareByMount: true },
  "color-merge-lines": { embedded: true, preloadManifest: "/games/color-merge-lines/preload-manifest.json", assetManifest: "/games/color-merge-lines/MIRROR-MANIFEST.json", prepareByMount: true },
  "roller": { embedded: true, preloadManifest: "/games/roller/preload-manifest.json", assetManifest: "/games/roller/MIRROR-MANIFEST.json", prepareByMount: true },
  "stickman-maze-run": { embedded: true, preloadManifest: "/games/stickman-maze-run/preload-manifest.json", assetManifest: "/games/stickman-maze-run/MIRROR-MANIFEST.json", prepareByMount: true },
  "dwerg": { embedded: true, preloadManifest: "/games/dwerg/preload-manifest.json", assetManifest: "/games/dwerg/MIRROR-MANIFEST.json", prepareByMount: true },
  "hockey-taka": { embedded: true, preloadManifest: "/games/hockey-taka/preload-manifest.json", assetManifest: "/games/hockey-taka/MIRROR-MANIFEST.json", prepareByMount: true },
  "pocket-car-city": { embedded: true, preloadManifest: "/games/pocket-car-city/preload-manifest.json", assetManifest: "/games/pocket-car-city/MIRROR-MANIFEST.json", prepareByMount: true },
  "the-third-piglets-tower": { embedded: true, preloadManifest: "/games/the-third-piglets-tower/preload-manifest.json", assetManifest: "/games/the-third-piglets-tower/MIRROR-MANIFEST.json", prepareByMount: true },
  "capitalist-bus-driver": { embedded: true, preloadManifest: "/games/capitalist-bus-driver/preload-manifest.json", assetManifest: "/games/capitalist-bus-driver/MIRROR-MANIFEST.json", prepareByMount: true },
  "stupidella-horror-2": { embedded: true, preloadManifest: "/games/stupidella-horror-2/preload-manifest.json", assetManifest: "/games/stupidella-horror-2/MIRROR-MANIFEST.json", prepareByMount: true },
  "merge-monster-battles": { embedded: true, preloadManifest: "/games/merge-monster-battles/preload-manifest.json", assetManifest: "/games/merge-monster-battles/MIRROR-MANIFEST.json", prepareByMount: true },
  "brainrot-merge": { embedded: true, preloadManifest: "/games/brainrot-merge/preload-manifest.json", assetManifest: "/games/brainrot-merge/MIRROR-MANIFEST.json", prepareByMount: true },
  "critters-quest": { embedded: true, preloadManifest: "/games/critters-quest/preload-manifest.json", assetManifest: "/games/critters-quest/MIRROR-MANIFEST.json", prepareByMount: true },
  "the-real-juggle": { embedded: true, preloadManifest: "/games/the-real-juggle/preload-manifest.json", assetManifest: "/games/the-real-juggle/MIRROR-MANIFEST.json", prepareByMount: true },
  "evolution-game": { embedded: true, preloadManifest: "/games/evolution-game/preload-manifest.json", assetManifest: "/games/evolution-game/MIRROR-MANIFEST.json", prepareByMount: true },
  "porki-poke": { embedded: true, preloadManifest: "/games/porki-poke/preload-manifest.json", assetManifest: "/games/porki-poke/MIRROR-MANIFEST.json", prepareByMount: true },
  "squid-dash": { embedded: true, preloadManifest: "/games/squid-dash/preload-manifest.json", assetManifest: "/games/squid-dash/MIRROR-MANIFEST.json", prepareByMount: true },
  "blocky-out": { embedded: true, preloadManifest: "/games/blocky-out/preload-manifest.json", assetManifest: "/games/blocky-out/MIRROR-MANIFEST.json", prepareByMount: true },
  "rumble-rush": { embedded: true, preloadManifest: "/games/rumble-rush/preload-manifest.json", assetManifest: "/games/rumble-rush/MIRROR-MANIFEST.json", prepareByMount: true },
  "beach-boxing-simulator": { embedded: true, preloadManifest: "/games/beach-boxing-simulator/preload-manifest.json", assetManifest: "/games/beach-boxing-simulator/MIRROR-MANIFEST.json", prepareByMount: true },
  "drills-merge-master": { embedded: true, preloadManifest: "/games/drills-merge-master/preload-manifest.json", assetManifest: "/games/drills-merge-master/MIRROR-MANIFEST.json", prepareByMount: true },
  "right-jump": { embedded: true, preloadManifest: "/games/right-jump/preload-manifest.json", assetManifest: "/games/right-jump/MIRROR-MANIFEST.json", prepareByMount: true },
  "i-am-hall-security": { embedded: true, preloadManifest: "/games/i-am-hall-security/preload-manifest.json", assetManifest: "/games/i-am-hall-security/MIRROR-MANIFEST.json", prepareByMount: true },
  "meme-madness": { embedded: true, preloadManifest: "/games/meme-madness/preload-manifest.json", assetManifest: "/games/meme-madness/MIRROR-MANIFEST.json", prepareByMount: true },
  "buck-bounce": { embedded: true, preloadManifest: "/games/buck-bounce/preload-manifest.json", assetManifest: "/games/buck-bounce/MIRROR-MANIFEST.json", prepareByMount: true },
  "kigurumi-dress-up": { embedded: true, preloadManifest: "/games/kigurumi-dress-up/preload-manifest.json", assetManifest: "/games/kigurumi-dress-up/MIRROR-MANIFEST.json", prepareByMount: true },
  "bee-sort-by-sam": { embedded: true, preloadManifest: "/games/bee-sort-by-sam/preload-manifest.json", assetManifest: "/games/bee-sort-by-sam/MIRROR-MANIFEST.json", prepareByMount: true },
  "cafe-bara": { embedded: true, preloadManifest: "/games/cafe-bara/preload-manifest.json", assetManifest: "/games/cafe-bara/MIRROR-MANIFEST.json", prepareByMount: true },
  "a-cleaning-story": { embedded: true, preloadManifest: "/games/a-cleaning-story/preload-manifest.json", assetManifest: "/games/a-cleaning-story/MIRROR-MANIFEST.json", prepareByMount: true },
  "drift-boss": { embedded: true, preloadManifest: "/games/drift-boss/preload-manifest.json", assetManifest: "/games/drift-boss/MIRROR-MANIFEST.json", prepareByMount: true },
  "penalty-shooters-2": {
    embedded: true,
    preloadManifest: "/games/penalty-shooters-2/preload-manifest.json",
    assetManifest: "/games/penalty-shooters-2/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "soccer-real": {
    embedded: true,
    preloadManifest: "/games/soccer-real/preload-manifest.json",
    assetManifest: "/games/soccer-real/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "master-chess": {
    embedded: true,
    preloadManifest: "/games/master-chess/preload-manifest.json",
    assetManifest: "/games/master-chess/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "basketball-stars": {
    embedded: true,
    preloadManifest: "/games/basketball-stars/preload-manifest.json",
    assetManifest: "/games/basketball-stars/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "stickman-hook": {
    embedded: true,
    preloadManifest: "/games/stickman-hook/preload-manifest.json",
    assetManifest: "/games/stickman-hook/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "happy-glass": {
    embedded: true,
    preloadManifest: "/games/happy-glass/preload-manifest.json",
    assetManifest: "/games/happy-glass/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "drive-mad": {
    embedded: true,
    preloadManifest: "/games/drive-mad/preload-manifest.json",
    assetManifest: "/games/drive-mad/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "slice-master": {
    embedded: true,
    preloadManifest: "/games/slice-master/preload-manifest.json",
    assetManifest: "/games/slice-master/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "level-devil": {
    embedded: true,
    preloadManifest: "/games/level-devil/preload-manifest.json",
    assetManifest: "/games/level-devil/MIRROR-MANIFEST.json",
    prepareByMount: true,
  },
  "game-2048": {
    embedded: true,
    preloadManifest: "/games/2048-game/preload-manifest.json",
    assetManifest: "/games/2048-game/MIRROR-MANIFEST.json",
    warmFullMirror: true,
  },
  "ping-pong-bugs": {
    embedded: true,
    preloadManifest: "/games/ping-pong-go/preload-manifest.json",
    assetManifest: "/games/ping-pong-go/MIRROR-MANIFEST.json",
  },
};

const warmTasks = new Map<GameSlug, Promise<void>>();

export function isEmbeddedGame(slug: GameSlug): boolean {
  return RUNTIMES[slug]?.embedded === true;
}

interface BrowserConnection {
  saveData?: boolean;
  effectiveType?: string;
}

function browserConnection(): BrowserConnection | undefined {
  return (
    navigator as Navigator & {
      connection?: BrowserConnection;
    }
  ).connection;
}

function connectionIsConstrained(): boolean {
  const connection = browserConnection();
  return Boolean(
    connection?.saveData ||
      connection?.effectiveType === "slow-2g" ||
      connection?.effectiveType === "2g",
  );
}

/**
 * Give the visible game uncontested bandwidth first. Returning null disables
 * speculative work on data-saver/2G connections; the next game will still
 * mount normally as soon as the player scrolls to it.
 */
export function warmAheadDelayMs(): number | null {
  const connection = browserConnection();
  if (
    connection?.saveData ||
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return null;
  }
  return connection?.effectiveType === "3g" ? 7_000 : 3_500;
}

export function shouldPrepareByMount(slug: GameSlug): boolean {
  return RUNTIMES[slug]?.prepareByMount === true;
}

async function fetchForWarmCache(url: string): Promise<void> {
  const target = new URL(url, window.location.origin);
  if (target.origin !== window.location.origin || !target.pathname.startsWith("/games/")) return;
  try {
    await fetch(target, { cache: "force-cache", credentials: "same-origin" });
  } catch {
    // Warming is opportunistic; the active game still owns its normal error UI.
  }
}

function localAssetUrl(manifestUrl: string, assetPath: string): string | null {
  if (!assetPath || assetPath.includes("..") || /^[a-z]+:/i.test(assetPath)) return null;
  const base = new URL("./", new URL(manifestUrl, window.location.origin));
  const target = new URL(assetPath.replace(/^\/+/, ""), base);
  if (target.origin !== window.location.origin || !target.pathname.startsWith("/games/")) {
    return null;
  }
  return target.pathname;
}

async function collectWarmUrls(slug: GameSlug): Promise<string[]> {
  const runtime = RUNTIMES[slug];
  const manifestUrl = runtime?.preloadManifest;
  if (!manifestUrl) return [];

  const response = await fetch(manifestUrl, {
    cache: "force-cache",
    credentials: "same-origin",
  });
  if (!response.ok) return [];
  const manifest = (await response.json()) as { critical?: unknown };
  const critical = Array.isArray(manifest.critical)
    ? manifest.critical.filter((url): url is string => typeof url === "string")
    : [];

  if (connectionIsConstrained()) return critical.slice(0, 1);
  // Critical manifests are the intentionally bounded first-play set. Mirroring
  // every captured file is opt-in only: several catalogs contain later levels
  // and tens of megabytes that should never compete with the visible game.
  if (!runtime.assetManifest || runtime.warmFullMirror !== true) return critical;

  const assetResponse = await fetch(runtime.assetManifest, {
    cache: "force-cache",
    credentials: "same-origin",
  });
  if (!assetResponse.ok) return critical;
  const assetManifest = (await assetResponse.json()) as {
    files?: Array<{ assetPath?: unknown }>;
    integrationFiles?: Array<{ assetPath?: unknown }>;
  };
  const mirrored = [...(assetManifest.files ?? []), ...(assetManifest.integrationFiles ?? [])]
    .map((entry) =>
      typeof entry.assetPath === "string"
        ? localAssetUrl(runtime.assetManifest!, entry.assetPath)
        : null,
    )
    .filter((url): url is string => Boolean(url));

  return [...new Set([...critical, ...mirrored])];
}

async function warmGameOnce(slug: GameSlug): Promise<void> {
  try {
    const urls = await collectWarmUrls(slug);
    if (!urls.length) return;

    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: "WARM_GAME", urls });
      return;
    }

    for (let index = 0; index < urls.length; index += 3) {
      await Promise.all(urls.slice(index, index + 3).map(fetchForWarmCache));
    }
  } catch {
    // A failed warm-up must never prevent the feed itself from loading.
  }
}

export function warmGame(slug: GameSlug): Promise<void> {
  const existing = warmTasks.get(slug);
  if (existing) return existing;
  const task = warmGameOnce(slug);
  warmTasks.set(slug, task);
  return task;
}
