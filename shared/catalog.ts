export type GameCategory = "Action" | "Arcade" | "Puzzle" | "Runner" | "Sports";

export interface GameCatalogMetadata {
  creatorId: string;
  creatorName: string;
  creatorLabel: string;
  category: GameCategory;
}

export const GAME_CATALOG_METADATA: Record<string, GameCatalogMetadata> = {
  "pulse-lock": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Originals",
    creatorLabel: "@tiptap · ORIGINAL",
    category: "Arcade",
  },
  "color-clash": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Originals",
    creatorLabel: "@tiptap · ORIGINAL",
    category: "Puzzle",
  },
  "stack-shift": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Originals",
    creatorLabel: "@tiptap · ORIGINAL",
    category: "Arcade",
  },
  "memory-grid": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Originals",
    creatorLabel: "@tiptap · ORIGINAL",
    category: "Puzzle",
  },
  "meteor-dodge": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Originals",
    creatorLabel: "@tiptap · ORIGINAL",
    category: "Arcade",
  },
  "subway-surfers": {
    creatorId: "sybo",
    creatorName: "SYBO",
    creatorLabel: "BY SYBO · TIP TAP INTEGRATION",
    category: "Runner",
  },
  "dino-runner": {
    creatorId: "chrome-ux",
    creatorName: "Chrome UX",
    creatorLabel: "BY CHROME UX · TIP TAP INTEGRATION",
    category: "Runner",
  },
  arithmetica: {
    creatorId: "tiptap",
    creatorName: "Tip Tap Integrations",
    creatorLabel: "@tiptap · INTEGRATION",
    category: "Puzzle",
  },
  "67-game": {
    creatorId: "stupidella",
    creatorName: "Stupidella",
    creatorLabel: "BY STUPIDELLA · LOCAL SOURCE MIRROR",
    category: "Puzzle",
  },
  "archery-king": {
    creatorId: "code-this-lab",
    creatorName: "Code This Lab",
    creatorLabel: "BY CODE THIS LAB · LOCAL SOURCE MIRROR",
    category: "Sports",
  },
  "smash-room": {
    creatorId: "happylander",
    creatorName: "Happylander",
    creatorLabel: "BY HAPPYLANDER LTD · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  "temple-run-2-frozen-shadows": {
    creatorId: "imangi",
    creatorName: "Imangi Studios",
    creatorLabel: "BY IMANGI STUDIOS · LOCAL SOURCE MIRROR",
    category: "Runner",
  },
  "stickman-fury": {
    creatorId: "happylander",
    creatorName: "Happylander",
    creatorLabel: "BY HAPPYLANDER LTD · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  plonky: {
    creatorId: "gametornado",
    creatorName: "GameTornado",
    creatorLabel: "BY GAMETORNADO · LOCAL SOURCE MIRROR",
    category: "Arcade",
  },
  "fruit-ninja": {
    creatorId: "storms",
    creatorName: "Storms",
    creatorLabel: "BY STORMS · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  "count-control-legends": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Integrations",
    creatorLabel: "@tiptap · INTEGRATION",
    category: "Runner",
  },
  "johnny-trigger-sniper": {
    creatorId: "saygames",
    creatorName: "SayGames",
    creatorLabel: "BY SAYGAMES · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  "rocket-soccer-derby": {
    creatorId: "destruction-crew",
    creatorName: "Destruction Crew",
    creatorLabel: "BY DESTRUCTION CREW · LOCAL SOURCE MIRROR",
    category: "Sports",
  },
  "dig-out-of-prison": {
    creatorId: "incredi-games",
    creatorName: "Incredi.Games",
    creatorLabel: "BY INCREDI.GAMES · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  "kitty-loves-birds-2": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Integrations",
    creatorLabel: "@tiptap · INTEGRATION",
    category: "Runner",
  },
  "theft-city": {
    creatorId: "tiptap",
    creatorName: "Tip Tap Integrations",
    creatorLabel: "@tiptap · INTEGRATION",
    category: "Action",
  },
  "city-cab-rush": {
    creatorId: "storerider",
    creatorName: "StoreRider",
    creatorLabel: "BY STORERIDER · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  "supercar-legends": {
    creatorId: "jungle-tavern",
    creatorName: "Jungle Tavern",
    creatorLabel: "BY JUNGLE TAVERN · TIP TAP INTEGRATION",
    category: "Runner",
  },
  "ping-pong-go": {
    creatorId: "happylander",
    creatorName: "Happylander",
    creatorLabel: "BY HAPPYLANDER · TIP TAP INTEGRATION",
    category: "Sports",
  },
  "slice-master": {
    creatorId: "kwalee",
    creatorName: "Kwalee",
    creatorLabel: "BY KWALEE · LOCAL SOURCE MIRROR",
    category: "Action",
  },
  "level-devil": {
    creatorId: "unept",
    creatorName: "Unept",
    creatorLabel: "BY UNEPT · LOCAL SOURCE MIRROR",
    category: "Puzzle",
  },
  "game-2048": {
    creatorId: "gabrielecirulli",
    creatorName: "Gabriele Cirulli",
    creatorLabel: "BY GABRIELE CIRULLI · LOCAL SOURCE MIRROR",
    category: "Puzzle",
  },
  "ping-pong-bugs": {
    creatorId: "happylander",
    creatorName: "Happylander",
    creatorLabel: "BY HAPPYLANDER · TIP TAP INTEGRATION",
    category: "Sports",
  },
};

const FALLBACK_METADATA: GameCatalogMetadata = {
  creatorId: "tiptap",
  creatorName: "Tip Tap",
  creatorLabel: "@tiptap",
  category: "Arcade",
};

export function getGameCatalogMetadata(slug: string): GameCatalogMetadata {
  return GAME_CATALOG_METADATA[slug] ?? FALLBACK_METADATA;
}

export const CREATOR_IDS = new Set(
  Object.values(GAME_CATALOG_METADATA).map((game) => game.creatorId),
);
