export type GameSlug =
  | "pulse-lock"
  | "color-clash"
  | "stack-shift"
  | "memory-grid"
  | "meteor-dodge"
  | "subway-surfers"
  | "dino-runner"
  | "arithmetica"
  | "67-game"
  | "archery-king"
  | "smash-room"
  | "temple-run-2-frozen-shadows"
  | "stickman-fury"
  | "plonky"
  | "fruit-ninja"
  | "count-control-legends"
  | "johnny-trigger-sniper"
  | "rocket-soccer-derby"
  | "kitty-loves-birds-2"
  | "theft-city"
  | "city-cab-rush"
  | "supercar-legends"
  | "ping-pong-go"
  | "ping-pong-bugs";

export interface GameDefinition {
  slug: GameSlug;
  title: string;
  rule_text: string;
  accent: string;
  ranked?: boolean;
}

export interface Player {
  id: string;
  handle: string;
  avatarUrl: string | null;
  provider: "guest" | "google" | "discord";
  isGuest: boolean;
}

export interface LikeState {
  liked: boolean;
  count: number;
}

export interface BootstrapData {
  player: Player;
  games: GameDefinition[];
  likes: Record<string, LikeState>;
  auth: { google: boolean; discord: boolean };
}

export interface LeaderboardEntry {
  playerId: string;
  handle: string;
  avatarUrl: string | null;
  score: number;
  rank: number;
  isYou: boolean;
}

export interface LeaderboardResult {
  entries: LeaderboardEntry[];
  yourRank: number | null;
  yourBest: number;
  percentile: number | null;
  ghostScore: number | null;
  totalPlayers: number;
  durationMs?: number;
  runId?: string;
}

export interface Challenge {
  runId: string;
  gameSlug: GameSlug;
  gameTitle: string;
  handle: string;
  score: number;
}

export interface GameProps {
  active: boolean;
  preparing?: boolean;
  runKey: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onFinish: (score: number) => void;
}
