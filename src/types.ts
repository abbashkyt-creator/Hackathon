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
  | "dig-out-of-prison"
  | "kitty-loves-birds-2"
  | "theft-city"
  | "city-cab-rush"
  | "supercar-legends"
  | "ping-pong-go"
  | "ping-pong-bugs"
  | "game-2048"
  | "level-devil"
  | "slice-master"
  | "drive-mad"
  | "happy-glass"
  | "stickman-hook"
  | "basketball-stars"
  | "master-chess"
  | "soccer-real"
  | "penalty-shooters-2"
  | "tic-tac-toe";

export interface GameDefinition {
  slug: GameSlug;
  title: string;
  rule_text: string;
  accent: string;
  ranked?: boolean;
  creatorId?: string;
  creatorName?: string;
  creatorLabel?: string;
  category?: "Action" | "Arcade" | "Puzzle" | "Runner" | "Sports";
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

export interface GameEngagement {
  saved: boolean;
  saves: number;
  plays: number;
}

export interface FollowState {
  following: boolean;
  followers: number;
}

export interface PlayerStats {
  rankedRuns: number;
  rankedGames: number;
  savedGames: number;
  followingCreators: number;
}

export interface BootstrapData {
  player: Player;
  games: GameDefinition[];
  likes: Record<string, LikeState>;
  engagement: Record<string, GameEngagement>;
  followedCreatorIds: string[];
  stats: PlayerStats;
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

export interface GlobalLeaderboardEntry {
  playerId: string;
  handle: string;
  avatarUrl: string | null;
  points: number;
  crowns: number;
  rankedGames: number;
  rank: number;
  isYou: boolean;
}

export interface GlobalLeaderboardResult {
  entries: GlobalLeaderboardEntry[];
  yourRank: number | null;
  yourPoints: number;
  totalPlayers: number;
}

export type OwnedAdKind = "interstitial" | "rewarded";

export interface OwnedAdCampaign {
  id: string;
  enabled: boolean;
  kinds: OwnedAdKind[];
  placements: string[];
  title: string;
  body: string;
  media: { type: "image" | "video"; src: string; alt: string };
  cta?: { label: string; href: string };
  skipAfterMs: number;
  rewardAfterMs: number;
  frequency: { maxPerSession: number; minIntervalMs: number };
}

export interface OwnedAdConfig {
  version: 1;
  enabled: boolean;
  campaigns: OwnedAdCampaign[];
  baseOrigin?: string;
}

export interface AdStatSummary {
  campaignId: string;
  kind: string;
  impressions: number;
  completions: number;
  clicks: number;
  lastAt: number;
}

export interface GameProps {
  active: boolean;
  preparing?: boolean;
  runKey: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  onFinish: (score: number) => void;
}
