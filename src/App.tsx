import {
  Bookmark,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Crown,
  Flame,
  Gamepad2,
  Heart,
  LayoutGrid,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Moon,
  Search,
  Share2,
  Sparkles,
  Sun,
  Trophy,
  Users,
  UserRound,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react";
import { api } from "./api";
import { OwnedAdPipeline } from "./OwnedAdPipeline";
import { AdControlPanel } from "./AdControlPanel";
import { getGameCatalogMetadata } from "../shared/catalog";
import {
  isEmbeddedGame,
  shouldPrepareByMount,
  warmAheadDelayMs,
  warmGame,
} from "./game-runtime";
import { formatScore, shuffle } from "./game-utils";
import { OFFLINE_BOOTSTRAP } from "./offline-catalog";
import {
  ArithmeticaGame,
  ArcheryKingGame,
  ColorClashGame,
  CityCabRushGame,
  CountControlLegendsGame,
  JohnnyTriggerSniperGame,
  RocketSoccerDerbyGame,
  DigOutOfPrisonGame,
  DinoRunnerGame,
  MemoryGridGame,
  MeteorDodgeGame,
  PingPongBugsGame,
  PingPongGoGame,
  PlonkyGame,
  FruitNinjaGame,
  KittyLovesBirds2Game,
  TheftCityGame,
  PulseLockGame,
  SixtySevenGame,
  StackShiftGame,
  SmashRoomGame,
  SupercarLegendsGame,
  TempleRun2FrozenShadowsGame,
  StickmanFuryGame,
  SubwaySurfersGame,
  Game2048RealGame,
  LevelDevilGame,
  SliceMasterGame,
  DriveMadGame,
  HappyGlassGame,
  StickmanHookGame,
  BasketballStarsGame,
  MasterChessGame,
  SoccerRealGame,
  PenaltyShooters2Game,
} from "./games";
import type {
  BootstrapData,
  Challenge,
  GameDefinition,
  GameEngagement,
  GameProps,
  GameSlug,
  GlobalLeaderboardResult,
  LeaderboardResult,
  LikeState,
  Player,
} from "./types";

const GAME_COMPONENTS: Record<GameSlug, ComponentType<GameProps>> = {
  "pulse-lock": PulseLockGame,
  "color-clash": ColorClashGame,
  "stack-shift": StackShiftGame,
  "memory-grid": MemoryGridGame,
  "meteor-dodge": MeteorDodgeGame,
  "subway-surfers": SubwaySurfersGame,
  "dino-runner": DinoRunnerGame,
  "arithmetica": ArithmeticaGame,
  "67-game": SixtySevenGame,
  "archery-king": ArcheryKingGame,
  "smash-room": SmashRoomGame,
  "temple-run-2-frozen-shadows": TempleRun2FrozenShadowsGame,
  "stickman-fury": StickmanFuryGame,
  "plonky": PlonkyGame,
  "fruit-ninja": FruitNinjaGame,
  "count-control-legends": CountControlLegendsGame,
  "johnny-trigger-sniper": JohnnyTriggerSniperGame,
  "rocket-soccer-derby": RocketSoccerDerbyGame,
  "dig-out-of-prison": DigOutOfPrisonGame,
  "kitty-loves-birds-2": KittyLovesBirds2Game,
  "theft-city": TheftCityGame,
  "city-cab-rush": CityCabRushGame,
  "supercar-legends": SupercarLegendsGame,
  "ping-pong-go": PingPongGoGame,
  "ping-pong-bugs": PingPongBugsGame,
  "game-2048": Game2048RealGame,
  "level-devil": LevelDevilGame,
  "slice-master": SliceMasterGame,
  "drive-mad": DriveMadGame,
  "happy-glass": HappyGlassGame,
  "stickman-hook": StickmanHookGame,
  "basketball-stars": BasketballStarsGame,
  "master-chess": MasterChessGame,
  "soccer-real": SoccerRealGame,
  "penalty-shooters-2": PenaltyShooters2Game,
};

// Smooth feed-button navigation can make an auto-focusing iframe blur the
// parent window while the next card is settling. Ignore that synthetic focus
// handoff briefly; direct game pointer listeners still expand immediately when
// the player actually taps the newly visible game.
const IFRAME_FOCUS_NAVIGATION_GUARD_MS = 800;
let suppressIframeFocusExpansionUntil = 0;

const GAME_EYEBROWS: Record<GameSlug, string> = {
  "pulse-lock": "PERFECT TIMING",
  "color-clash": "TRUST THE WORD",
  "stack-shift": "BUILD THE SKY",
  "memory-grid": "FOLLOW THE SIGNAL",
  "meteor-dodge": "STAY IN THE VOID",
  "subway-surfers": "THE ORIGINAL ENDLESS RUNNER",
  "dino-runner": "OUTRUN THE CACTI",
  "arithmetica": "MATH UNDER PRESSURE",
  "67-game": "67 LEVELS. ONE CLOCK.",
  "archery-king": "AIM. DRAW. HIT THE BULLSEYE.",
  "smash-room": "PICK A TOOL. BREAK EVERYTHING.",
  "temple-run-2-frozen-shadows": "RUN THE ICE. OUTPACE THE MONKEY.",
  "stickman-fury": "MOVE. FIGHT. SURVIVE THE ARENA.",
  "plonky": "RUN. JUMP. OUTSMART THE TRAPS.",
  "fruit-ninja": "SLICE FRUIT. AVOID BOMBS.",
  "count-control-legends": "COUNT. MULTIPLY. CONQUER.",
  "johnny-trigger-sniper": "AIM CAREFULLY. SAVE THE CITY.",
  "rocket-soccer-derby": "BOOST. HIT. SCORE.",
  "dig-out-of-prison": "DIG. GATHER. ESCAPE.",
  "kitty-loves-birds-2": "RUN. LEAP. BOUNCE ON BIRDS.",
  "theft-city": "STEAL. ESCAPE. RULE THE CITY.",
  "city-cab-rush": "DRIVE FAST. DODGE TRAFFIC. PICK UP FARES.",
  "supercar-legends": "MATH-GATE SUPERCAR RUNNER",
  "ping-pong-go": "RALLY vs THE CPU",
  "ping-pong-bugs": "SMASH THE BUG WAVE",
  "game-2048": "SLIDE TO MERGE",
  "level-devil": "NOTHING IS SAFE",
  "slice-master": "SLICE EVERYTHING",
  "drive-mad": "NO BRAKES",
  "happy-glass": "FILL IT UP",
  "stickman-hook": "SWING IT",
  "basketball-stars": "SINK IT",
  "master-chess": "THINK AHEAD",
  "soccer-real": "ON THE PITCH",
  "penalty-shooters-2": "SPOT KICK",
};

interface FeedEntry {
  id: string;
  game: GameDefinition;
}

type ColorTheme = "light" | "dark";
const THEME_STORAGE_KEY = "ttg_theme";

function initialColorTheme(): ColorTheme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

function useDialogClose(open: boolean, onClose: () => void) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open]);

  return closeButtonRef;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "is-compact" : ""}`}>
      <img
        className="brand-logo-image"
        src="/brand/tip-tap-games-logo.png"
        alt="Tip Tap Games"
        width={290}
        height={100}
        draggable={false}
      />
    </div>
  );
}

function Avatar({ player, size = "md" }: { player: Player; size?: "sm" | "md" }) {
  return (
    <span className={`avatar avatar-${size}`}>
      {player.avatarUrl ? (
        <img src={player.avatarUrl} alt="" referrerPolicy="no-referrer" />
      ) : (
        <UserRound aria-hidden="true" />
      )}
    </span>
  );
}

function AppHeader({
  player,
  soundEnabled,
  colorTheme,
  onToggleSound,
  onToggleTheme,
  onOpenGames,
  onProfile,
}: {
  player: Player;
  soundEnabled: boolean;
  colorTheme: ColorTheme;
  onToggleSound: () => void;
  onToggleTheme: () => void;
  onOpenGames: () => void;
  onProfile: () => void;
}) {
  return (
    <header className="app-header">
      <Logo compact />
      <div className="header-actions">
        <a
          className="donate-pill"
          href="https://www.paypal.com/donate/?business=9B627UZJWV9SC&no_recurring=0&currency_code=USD"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Donate to the creator via PayPal"
        >
          <Heart size={14} fill="currentColor" /> <span>Donate</span>
        </a>
        <button type="button" className="icon-button" onClick={onOpenGames} aria-label="Jump to a game">
          <LayoutGrid size={19} />
        </button>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? "Mute game sound" : "Turn on game sound"}
          aria-pressed={soundEnabled}
        >
          {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        <button
          type="button"
          className="icon-button theme-toggle"
          onClick={onToggleTheme}
          aria-label={colorTheme === "dark" ? "Switch to daylight mode" : "Switch to darklight mode"}
          aria-pressed={colorTheme === "dark"}
          title={colorTheme === "dark" ? "Daylight mode" : "Darklight mode"}
        >
          {colorTheme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
        <button
          type="button"
          className="avatar-button"
          onClick={onProfile}
          aria-label={`Open ${player.handle} profile`}
        >
          <span className="player-label">{player.handle}</span>
          <Avatar player={player} size="sm" />
        </button>
      </div>
    </header>
  );
}

// Feed-native quick-jump: a compact sheet listing every game so the player (or
// a judge) can snap straight to one instead of swiping the whole feed. It's an
// overlay over the feed, not a replacement home screen, so the feed stays the
// product.
function GameJumpSheet({
  open,
  games,
  currentSlug,
  engagement,
  followedCreatorIds,
  onJump,
  onToggleSave,
  onToggleFollow,
  onOpenGlobal,
  onClose,
}: {
  open: boolean;
  games: GameDefinition[];
  currentSlug: string | undefined;
  engagement: BootstrapData["engagement"];
  followedCreatorIds: string[];
  onJump: (slug: string) => void;
  onToggleSave: (game: GameDefinition) => void;
  onToggleFollow: (creatorId: string) => void;
  onOpenGlobal: () => void;
  onClose: () => void;
}) {
  const closeButtonRef = useDialogClose(open, onClose);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"all" | "saved" | "following">("all");
  const [category, setCategory] = useState<"All" | NonNullable<GameDefinition["category"]>>("All");
  const safeEngagement = engagement ?? {};
  const followed = useMemo(() => new Set(followedCreatorIds ?? []), [followedCreatorIds]);
  const visibleGames = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return games
      .filter((game) => {
        const metadata = getGameCatalogMetadata(game.slug);
        const creatorId = game.creatorId ?? metadata.creatorId;
        const creatorName = game.creatorName ?? metadata.creatorName;
        const gameCategory = game.category ?? metadata.category;
        return (
          (category === "All" || gameCategory === category) &&
          (view !== "saved" || safeEngagement[game.slug]?.saved) &&
          (view !== "following" || followed.has(creatorId)) &&
          (!needle ||
            `${game.title} ${creatorName} ${gameCategory}`
              .toLocaleLowerCase()
              .includes(needle))
        );
      })
      .sort(
        (a, b) =>
          (safeEngagement[b.slug]?.plays ?? 0) - (safeEngagement[a.slug]?.plays ?? 0) ||
          (safeEngagement[b.slug]?.saves ?? 0) - (safeEngagement[a.slug]?.saves ?? 0) ||
          a.title.localeCompare(b.title),
      );
  }, [category, engagement, followed, games, query, view]);

  if (!open) return null;
  return (
    <div className="sheet-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        className="bottom-sheet games-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Discover games"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <button
          ref={closeButtonRef}
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close game discovery"
        >
          <X size={20} />
        </button>
        <div className="games-sheet-heading">
          <span>YOUR ARCADE · {games.length} INSTANT GAMES</span>
          <h2>Find your next obsession</h2>
          <p>Search, save favorites, follow creators, or jump straight back into the feed.</p>
        </div>
        <button type="button" className="global-ranks-banner" onClick={onOpenGlobal}>
          <span className="global-ranks-icon"><Crown fill="currentColor" /></span>
          <span>
            <small>THE TIP TAP CHAMPIONSHIP</small>
            <strong>Global player leaderboard</strong>
            <em>Earn points by ranking across every game.</em>
          </span>
          <ChevronUp className="global-ranks-arrow" />
        </button>
        <label className="game-search">
          <Search aria-hidden="true" />
          <span className="sr-only">Search games or creators</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search games, creators, or categories"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              <X />
            </button>
          )}
        </label>
        <div className="discovery-tabs" role="tablist" aria-label="Game library view">
          {(["all", "saved", "following"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={view === option}
              className={view === option ? "is-active" : ""}
              onClick={() => setView(option)}
            >
              {option === "all" ? <Compass /> : option === "saved" ? <Bookmark /> : <Users />}
              {option === "all" ? "Discover" : option === "saved" ? "Saved" : "Following"}
            </button>
          ))}
        </div>
        <div className="category-strip" aria-label="Filter by category">
          {(["All", "Action", "Arcade", "Puzzle", "Runner", "Sports"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={category === option ? "is-active" : ""}
              onClick={() => setCategory(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="games-grid discovery-grid">
          {visibleGames.map((game) => {
            const metadata = getGameCatalogMetadata(game.slug);
            const creatorId = game.creatorId ?? metadata.creatorId;
            const creatorName = game.creatorName ?? metadata.creatorName;
            const gameCategory = game.category ?? metadata.category;
            const metrics = safeEngagement[game.slug] ?? { saved: false, saves: 0, plays: 0 };
            const isFollowing = followed.has(creatorId);
            return (
              <article
                key={game.slug}
                className={`discovery-card theme-${game.slug}${game.slug === currentSlug ? " is-current" : ""}`}
              >
                <button
                  type="button"
                  className="discovery-play"
                  onClick={() => onJump(game.slug)}
                  aria-label={`Play ${game.title}`}
                >
                  <span className="game-chip-icon" aria-hidden="true">
                    {gameMonogram(game.title)}
                    <img
                      className="game-chip-thumb"
                      src={`/thumbs/${game.slug}.jpg`}
                      alt=""
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                    <span className="discovery-play-badge"><Zap fill="currentColor" /></span>
                  </span>
                  <span className="game-chip-copy">
                    <span className="game-chip-label">{game.title}</span>
                    <small>{creatorName} · {gameCategory}</small>
                    <span className="discovery-metrics">
                      <span><Flame /> {metrics.plays}</span>
                      <span><Bookmark /> {metrics.saves}</span>
                      <span>{game.ranked === false ? "INSTANT" : "RANKED"}</span>
                    </span>
                  </span>
                </button>
                <div className="discovery-actions">
                  <button
                    type="button"
                    className={metrics.saved ? "is-active" : ""}
                    onClick={() => onToggleSave(game)}
                    aria-label={metrics.saved ? `Remove ${game.title} from saved games` : `Save ${game.title}`}
                    aria-pressed={metrics.saved}
                  >
                    <Bookmark fill={metrics.saved ? "currentColor" : "none"} />
                    {metrics.saved ? "Saved" : "Save"}
                  </button>
                  <button
                    type="button"
                    className={isFollowing ? "is-active" : ""}
                    onClick={() => onToggleFollow(creatorId)}
                    aria-label={isFollowing ? `Unfollow ${creatorName}` : `Follow ${creatorName}`}
                    aria-pressed={isFollowing}
                  >
                    {isFollowing ? <Check /> : <Users />}
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              </article>
            );
          })}
          {visibleGames.length === 0 && (
            <div className="discovery-empty">
              <Compass />
              <strong>Nothing here yet</strong>
              <span>
                {view === "saved"
                  ? "Save games from the feed to build your personal arcade."
                  : view === "following"
                    ? "Follow a creator to see their games here."
                    : "Try a different search or category."}
              </span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function LeaderboardSheet({
  open,
  game,
  player,
  initial,
  onClose,
}: {
  open: boolean;
  game: GameDefinition;
  player: Player;
  initial?: LeaderboardResult | null;
  onClose: () => void;
}) {
  const closeButtonRef = useDialogClose(open, onClose);
  const [period, setPeriod] = useState<"all" | "daily">("all");
  const [data, setData] = useState<LeaderboardResult | null>(initial ?? null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setData(await api.leaderboard(game.slug, period));
    } finally {
      setLoading(false);
    }
  }, [game.slug, period]);

  useEffect(() => {
    if (!open) return;
    void refresh();
    const events = new EventSource(`/api/events?game=${encodeURIComponent(game.slug)}`);
    events.addEventListener("leaderboard", () => void refresh());
    const poll = window.setInterval(() => void refresh(), 15_000);
    return () => {
      events.close();
      window.clearInterval(poll);
    };
  }, [open, refresh, game.slug]);

  if (!open) return null;
  return (
    <div className="sheet-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        className="bottom-sheet leaderboard-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={`${game.title} leaderboard`}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <button
          ref={closeButtonRef}
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close leaderboard"
        >
          <X size={20} />
        </button>
        <div className="sheet-title">
          <span className="live-chip">
            <i /> LIVE
          </span>
          <Crown aria-hidden="true" />
          <h2>{game.title}</h2>
          <p>Real runs. Server-validated scores.</p>
        </div>
        <div className="period-tabs" role="tablist" aria-label="Leaderboard period">
          <button
            type="button"
            role="tab"
            aria-selected={period === "all"}
            className={period === "all" ? "is-active" : ""}
            onClick={() => setPeriod("all")}
          >
            All time
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={period === "daily"}
            className={period === "daily" ? "is-active" : ""}
            onClick={() => setPeriod("daily")}
          >
            Today
          </button>
        </div>
        <div className="leaderboard-list" aria-live="polite">
          {loading && !data ? (
            <LoaderCircle className="spin" />
          ) : data?.entries.length ? (
            data.entries.map((entry) => (
              <div className={`rank-row ${entry.isYou ? "is-you" : ""}`} key={entry.playerId}>
                <strong>{entry.rank}</strong>
                <span className="rank-avatar">
                  {entry.avatarUrl ? <img src={entry.avatarUrl} alt="" /> : entry.handle.slice(0, 1)}
                </span>
                <span>{entry.isYou ? `${entry.handle} · YOU` : entry.handle}</span>
                <b>{formatScore(entry.score)}</b>
              </div>
            ))
          ) : (
            <div className="empty-board">
              <Trophy />
              <strong>THE BOARD IS YOURS</strong>
              <span>Finish the first run and take the crown.</span>
            </div>
          )}
        </div>
        {data?.yourRank ? (
          <p className="your-rank">
            You are <strong>#{data.yourRank}</strong> of {data.totalPlayers} · best{" "}
            <strong>{formatScore(data.yourBest)}</strong>
          </p>
        ) : (
          <p className="your-rank">{player.isGuest ? "Play first. Sign in when it is worth keeping." : "Set your first score."}</p>
        )}
      </section>
    </div>
  );
}

function GlobalLeaderboardSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeButtonRef = useDialogClose(open, onClose);
  const [data, setData] = useState<GlobalLeaderboardResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await api.globalLeaderboard());
    } catch {
      setError("The championship board could not refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void refresh();
  }, [open, refresh]);

  if (!open) return null;
  return (
    <div className="sheet-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        className="bottom-sheet global-leaderboard-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Tip Tap global player leaderboard"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <button
          ref={closeButtonRef}
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close global leaderboard"
        >
          <X size={20} />
        </button>
        <div className="global-board-hero">
          <span className="global-crown"><Crown fill="currentColor" /></span>
          <span>
            <small>THE TIP TAP CHAMPIONSHIP</small>
            <h2>Rule more than one world</h2>
            <p>Each game awards up to 100 championship points. Your best rank in every game counts.</p>
          </span>
        </div>
        <div className="global-board-head" aria-hidden="true">
          <span>PLAYER</span><span>GAMES</span><span>CROWNS</span><span>PTS</span>
        </div>
        <div className="global-board-list" aria-live="polite">
          {loading && !data ? (
            <LoaderCircle className="spin" />
          ) : error ? (
            <div className="discovery-empty">
              <Trophy />
              <strong>BOARD OFFLINE</strong>
              <span>{error}</span>
              <button type="button" onClick={() => void refresh()}>Try again</button>
            </div>
          ) : data?.entries.length ? (
            data.entries.map((entry) => (
              <div
                className={`global-rank-row${entry.isYou ? " is-you" : ""}`}
                key={entry.playerId}
              >
                <strong>{entry.rank}</strong>
                <span className="rank-avatar">
                  {entry.avatarUrl ? <img src={entry.avatarUrl} alt="" /> : entry.handle.slice(0, 1)}
                </span>
                <span className="global-player-name">
                  {entry.handle}{entry.isYou ? " · YOU" : ""}
                </span>
                <span>{entry.rankedGames}</span>
                <span>{entry.crowns}</span>
                <b>{formatScore(entry.points)}</b>
              </div>
            ))
          ) : (
            <div className="discovery-empty">
              <Crown />
              <strong>THE CROWN IS WAITING</strong>
              <span>Complete a ranked game to become the first global champion.</span>
            </div>
          )}
        </div>
        <p className="your-rank">
          {data?.yourRank
            ? <>You are <strong>#{data.yourRank}</strong> globally with <strong>{formatScore(data.yourPoints)}</strong> points.</>
            : "Your first ranked finish puts you on the global board."}
        </p>
      </section>
    </div>
  );
}

function AuthSheet({
  open,
  player,
  auth,
  stats,
  onOpenGlobal,
  onClose,
  onLogout,
}: {
  open: boolean;
  player: Player;
  auth: BootstrapData["auth"];
  stats: BootstrapData["stats"];
  onOpenGlobal: () => void;
  onClose: () => void;
  onLogout: () => void;
}) {
  const closeButtonRef = useDialogClose(open, onClose);
  if (!open) return null;
  const anyProvider = auth.google || auth.discord;
  return (
    <div className="sheet-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        className="bottom-sheet auth-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Player profile"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <button
          ref={closeButtonRef}
          type="button"
          className="sheet-close"
          onClick={onClose}
          aria-label="Close profile"
        >
          <X size={20} />
        </button>
        <Avatar player={player} />
        <h2>{player.isGuest ? "CLAIM YOUR RUN" : player.handle}</h2>
        <p>
          {player.isGuest
            ? "Your guest scores already count. Sign in only when you want them on every device."
            : `Connected with ${player.provider}. Your best scores follow you.`}
        </p>
        <div className="profile-stats" aria-label="Player statistics">
          <span><b>{stats.rankedRuns}</b><small>ranked runs</small></span>
          <span><b>{stats.rankedGames}</b><small>ranked games</small></span>
          <span><b>{stats.savedGames}</b><small>saved</small></span>
          <span><b>{stats.followingCreators}</b><small>following</small></span>
        </div>
        <button type="button" className="profile-global-button" onClick={onOpenGlobal}>
          <Crown fill="currentColor" />
          <span><strong>Global championship</strong><small>See your rank across every game</small></span>
          <ChevronUp />
        </button>
        {player.isGuest ? (
          <>
            <div className="auth-actions">
              {auth.discord && (
                <a className="auth-button discord" href="/auth/discord">
                  <span>◖◗</span> Continue with Discord
                </a>
              )}
              {auth.google && (
                <a className="auth-button google" href="/auth/google">
                  <span>G</span> Continue with Google
                </a>
              )}
            </div>
            {!anyProvider && (
              <div className="auth-unavailable">
                <LockKeyhole />
                <span>Guest play is live. Add OAuth keys on Replit to enable account claiming.</span>
              </div>
            )}
            <small>No email forms. No passwords. Your current runs merge automatically.</small>
          </>
        ) : (
          <button type="button" className="logout-button" onClick={onLogout}>
            <LogOut size={18} /> Sign out
          </button>
        )}
      </section>
    </div>
  );
}

function ResultSheet({
  result,
  score,
  game,
  player,
  submitting,
  error,
  onReplay,
  onLeaderboard,
  onClaim,
  onShare,
  onSwipeNext,
}: {
  result: LeaderboardResult | null;
  score: number;
  game: GameDefinition;
  player: Player;
  submitting: boolean;
  error: string | null;
  onReplay: () => void;
  onLeaderboard: () => void;
  onClaim: () => void;
  onShare: () => void;
  onSwipeNext: () => void;
}) {
  const swipeStart = useRef<number | null>(null);
  const replayButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (result && !submitting) {
      replayButtonRef.current?.focus();
    }
  }, [result, submitting]);

  return (
    <div
      className="result-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Run result"
      onWheel={(event) => {
        if (event.deltaY > 36) onSwipeNext();
      }}
      onPointerDown={(event) => {
        if (!(event.target as HTMLElement).closest("button")) swipeStart.current = event.clientY;
      }}
      onPointerUp={(event) => {
        if (swipeStart.current !== null && swipeStart.current - event.clientY > 48) onSwipeNext();
        swipeStart.current = null;
      }}
      onPointerCancel={() => {
        swipeStart.current = null;
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowRight") onSwipeNext();
      }}
    >
      <div className="result-glow" style={{ "--game-accent": game.accent } as React.CSSProperties} />
      <span className="result-kicker">{result?.yourBest === score ? "NEW PERSONAL BEST" : "RUN COMPLETE"}</span>
      <strong className="result-score" aria-live="polite">{formatScore(score)}</strong>
      {submitting ? (
        <span className="saving-score">
          <LoaderCircle className="spin" /> Sending score live…
        </span>
      ) : error ? (
        <span className="score-error">{error}</span>
      ) : (
        <div className="result-stats" aria-label="Run statistics">
          <span>
            <b>{result?.yourRank ? `#${result.yourRank}` : "—"} </b>rank
          </span>
          <span>
            <b>{result?.percentile ?? 0}% </b>beaten
          </span>
          <span>
            <b>{result?.ghostScore ? formatScore(result.ghostScore) : "CROWN"} </b>rival
          </span>
        </div>
      )}
      {player.isGuest && result && (
        <button type="button" className="claim-button" onClick={onClaim}>
          <Sparkles size={17} /> You're #{result.yourRank ?? "—"} — sign in to claim it
        </button>
      )}
      <div className="result-actions">
        <button type="button" ref={replayButtonRef} onClick={onReplay}>PLAY AGAIN</button>
        <button type="button" onClick={onLeaderboard}>
          <Trophy size={17} /> BOARD
        </button>
        <button type="button" onClick={onShare}>
          <Share2 size={17} /> SHARE
        </button>
      </div>
      <span className="swipe-next">or swipe for the next game</span>
    </div>
  );
}

function GameCard({
  entry,
  index,
  active,
  preparing,
  player,
  like,
  engagement,
  soundEnabled,
  hapticsEnabled,
  offlinePractice,
  challenge,
  onVisible,
  onLikeChange,
  onEngagementChange,
  onOpenAuth,
  onScored,
  onToast,
}: {
  entry: FeedEntry;
  index: number;
  active: boolean;
  preparing: boolean;
  player: Player;
  like: LikeState;
  engagement: GameEngagement;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  offlinePractice: boolean;
  challenge: Challenge | null;
  onVisible: (index: number, node: HTMLElement | null) => void;
  onLikeChange: (gameSlug: GameSlug, state: LikeState) => void;
  onEngagementChange: (gameSlug: GameSlug, state: GameEngagement) => void;
  onOpenAuth: () => void;
  onScored: () => void;
  onToast: (message: string) => void;
}) {
  const { game } = entry;
  const Game = GAME_COMPONENTS[game.slug];
  const ranked = game.ranked !== false;
  const [ticket, setTicket] = useState<string | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState<LeaderboardResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [boardOpen, setBoardOpen] = useState(false);
  // The game-label ("PERFECT TIMING / PULSE LOCK") stays up until the player
  // actually starts playing, then fades out 3s later so it never covers the
  // game. Hidden only after the first interaction with the game area.
  const [labelHidden, setLabelHidden] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [controlsDimmed, setControlsDimmed] = useState(false);
  const finishingRef = useRef(false);
  const playRecordedRef = useRef(false);
  const cardRef = useRef<HTMLElement | null>(null);

  const begin = useCallback(async () => {
    finishingRef.current = false;
    setTicket(null);
    setResult(null);
    setScore(0);
    setError(null);
    if (offlinePractice || !ranked) return;
    try {
      const run = await api.startRun(game.slug);
      setTicket(run.ticket);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not start this run.");
    }
  }, [game.slug, offlinePractice, ranked]);

  useEffect(() => {
    if (active) {
      cardRef.current?.focus({ preventScroll: true });
      void begin();
    } else {
      setExpanded(false);
      setControlsDimmed(false);
      setTicket(null);
      setBoardOpen(false);
      setResult(null);
      setError(null);
      setSubmitting(false);
      finishingRef.current = false;
    }
  }, [active, begin, runKey]);

  useEffect(() => {
    if (!active || offlinePractice || playRecordedRef.current) return;
    playRecordedRef.current = true;
    void api
      .recordPlay(game.slug)
      .then(({ plays }) => onEngagementChange(game.slug, { ...engagement, plays }))
      .catch(() => {
        playRecordedRef.current = false;
      });
  }, [active, engagement, game.slug, offlinePractice, onEngagementChange]);

  const expandGame = useCallback(() => {
    if (active) setExpanded(true);
  }, [active]);

  const markGameInteraction = useCallback(() => {
    if (!active) return;
    setControlsDimmed(true);
    expandGame();
  }, [active, expandGame]);

  const restoreControls = useCallback(() => {
    setControlsDimmed(false);
  }, []);

  // Pointer events that happen inside an iframe never bubble into the React
  // tree. Subscribe to each active local game window directly so the player's
  // first real touch/click both reaches the game and expands the card.
  useEffect(() => {
    if (!active || !isEmbeddedGame(game.slug)) return;

    const cleanups: Array<() => void> = [];
    const boundFrames = new WeakSet<HTMLIFrameElement>();
    const boundWindows = new WeakSet<Window>();
    const labelTimers = new Set<number>();
    const onGameInteraction = () => {
      markGameInteraction();
      const timer = window.setTimeout(() => {
        setLabelHidden(true);
        labelTimers.delete(timer);
      }, 3000);
      labelTimers.add(timer);
    };
    const bindFrame = (frame: HTMLIFrameElement) => {
      if (boundFrames.has(frame)) return;
      boundFrames.add(frame);
      const bindWindow = () => {
        const gameWindow = frame.contentWindow;
        if (!gameWindow || boundWindows.has(gameWindow)) return;
        try {
          gameWindow.addEventListener("pointerdown", onGameInteraction, true);
          gameWindow.addEventListener("touchstart", onGameInteraction, true);
          gameWindow.addEventListener("keydown", onGameInteraction, true);
          boundWindows.add(gameWindow);
          cleanups.push(() => {
            gameWindow.removeEventListener("pointerdown", onGameInteraction, true);
            gameWindow.removeEventListener("touchstart", onGameInteraction, true);
            gameWindow.removeEventListener("keydown", onGameInteraction, true);
          });
        } catch {
          // The window-blur fallback below still covers a future cross-origin
          // integration where direct frame listeners are unavailable.
        }
      };
      frame.addEventListener("load", bindWindow);
      cleanups.push(() => frame.removeEventListener("load", bindWindow));
      bindWindow();
    };
    const bindFrames = () => {
      const card = cardRef.current;
      if (!card) return;
      const frames = [...card.querySelectorAll<HTMLIFrameElement>("iframe")];
      // Fruit Ninja keeps its prepared iframe in a body-level portal.
      if (game.slug === "fruit-ninja") {
        frames.push(...document.querySelectorAll<HTMLIFrameElement>("iframe.fruit-ninja-game"));
      }
      frames.forEach(bindFrame);
    };

    bindFrames();
    const observer = new MutationObserver(bindFrames);
    if (cardRef.current) observer.observe(cardRef.current, { childList: true, subtree: true });
    if (game.slug === "fruit-ninja") observer.observe(document.body, { childList: true });

    return () => {
      observer.disconnect();
      cleanups.forEach((cleanup) => cleanup());
      labelTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [active, game.slug, markGameInteraction, runKey]);

  // Keep the game label visible until the player starts. Native game clicks
  // expand through the game-frame capture handler below. Embedded games use
  // the direct frame listeners above, with iframe focus as a fallback. The
  // active card takes focus first, so a mount alone never counts as a tap.
  useEffect(() => {
    setLabelHidden(false);
    if (!active) return;
    let hideTimer: number | undefined;
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      hideTimer = window.setTimeout(() => setLabelHidden(true), 3000);
    };
    const inGameArea = (node: EventTarget | null) => {
      const frame = cardRef.current?.querySelector(".game-frame");
      return frame instanceof Node && node instanceof Node && frame.contains(node);
    };
    const onPointer = (event: Event) => {
      if (inGameArea(event.target)) {
        start();
        markGameInteraction();
      }
    };
    const onKey = () => {
      if (inGameArea(document.activeElement)) {
        start();
        markGameInteraction();
      }
    };
    const onBlur = () => {
      if (Date.now() < suppressIframeFocusExpansionUntil) return;
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName === "IFRAME" && cardRef.current?.contains(activeEl)) {
        start();
        markGameInteraction();
      }
    };
    window.addEventListener("pointerdown", onPointer, { capture: true });
    window.addEventListener("touchstart", onPointer, { capture: true, passive: true });
    window.addEventListener("keydown", onKey, { capture: true });
    window.addEventListener("blur", onBlur);
    return () => {
      if (hideTimer) window.clearTimeout(hideTimer);
      window.removeEventListener("pointerdown", onPointer, { capture: true });
      window.removeEventListener("touchstart", onPointer, { capture: true });
      window.removeEventListener("keydown", onKey, { capture: true });
      window.removeEventListener("blur", onBlur);
    };
  }, [active, markGameInteraction, runKey]);

  const finish = useCallback(
    async (finalScore: number) => {
      if (finishingRef.current) return;
      finishingRef.current = true;
      setScore(finalScore);
      setSubmitting(true);
      setError(null);
      if (!ticket) {
        setSubmitting(false);
        finishingRef.current = false;
        setError(
          offlinePractice
            ? "Practice complete. Reconnect to save and rank the next run."
            : "Run ticket was not ready. Tap play again.",
        );
        return;
      }
      try {
        const saved = await api.finishRun(ticket, game.slug, finalScore);
        setResult(saved);
        onScored();
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Score could not be saved.");
      } finally {
        setSubmitting(false);
      }
    },
    [game.slug, offlinePractice, onScored, ticket],
  );

  const toggleLike = async () => {
    try {
      onLikeChange(game.slug, await api.toggleLike(game.slug));
    } catch {
      onToast("Could not update the hype. Try again.");
    }
  };

  const toggleSave = async () => {
    try {
      onEngagementChange(game.slug, await api.toggleSave(game.slug));
      onToast(engagement.saved ? "Removed from your arcade." : "Saved to your arcade.");
    } catch {
      onToast("Could not update your saved games.");
    }
  };

  const share = async () => {
    const url = new URL(window.location.origin);
    url.searchParams.set("game", game.slug);
    if (result?.runId) url.searchParams.set("challenge", result.runId);
    const shareData = {
      title: `Beat my ${game.title} score`,
      text: result
        ? `I scored ${formatScore(score)} in ${game.title}. Can you beat it?`
        : `Try ${game.title} on Tip Tap Games.`,
      url: url.toString(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url.toString());
        onToast("Challenge link copied.");
      }
    } catch (shareError) {
      if ((shareError as DOMException).name !== "AbortError") onToast("Sharing was cancelled.");
    }
  };

  const retry = () => {
    setResult(null);
    setError(null);
    setRunKey((value) => value + 1);
  };

  const gameLive =
    active &&
    !submitting &&
    !result &&
    !error;
  const challengeHere = challenge?.gameSlug === game.slug;
  const swipeNext = () => {
    const next = cardRef.current?.nextElementSibling;
    if (next instanceof HTMLElement) {
      next.focus({ preventScroll: true });
      next.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const swipePrevious = () => {
    const previous = cardRef.current?.previousElementSibling;
    if (previous instanceof HTMLElement) {
      previous.focus({ preventScroll: true });
      previous.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const goNext = () => {
    suppressIframeFocusExpansionUntil = Date.now() + IFRAME_FOCUS_NAVIGATION_GUARD_MS;
    setExpanded(false);
    setControlsDimmed(false);
    window.requestAnimationFrame(swipeNext);
  };
  const goPrevious = () => {
    if (index === 0) return;
    suppressIframeFocusExpansionUntil = Date.now() + IFRAME_FOCUS_NAVIGATION_GUARD_MS;
    setExpanded(false);
    setControlsDimmed(false);
    window.requestAnimationFrame(swipePrevious);
  };

  const handleFinish = useCallback(
    (finalScore: number) => {
      finish(finalScore);
    },
    [finish],
  );

  return (
    <section
      className={`feed-card theme-${game.slug}${expanded ? " is-expanded" : ""}`}
      data-game={game.slug}
      data-active={active}
      data-expanded={expanded}
      tabIndex={-1}
      ref={(node) => {
        cardRef.current = node;
        onVisible(index, node);
      }}
      aria-label={`${game.title}. ${game.rule_text}`}
    >
      <div className="card-atmosphere" />
      <div
        className="game-frame"
        onClickCapture={markGameInteraction}
      >
        {game.slug !== "subway-surfers" && game.slug !== "stickman-fury" && game.slug !== "supercar-legends" && game.slug !== "dig-out-of-prison" && (
          <div className={`game-label${labelHidden ? " is-hidden" : ""}`}>
            <span>{GAME_EYEBROWS[game.slug]}</span>
            <h1>{game.title}</h1>
          </div>
        )}
        <Game
          active={gameLive}
          preparing={preparing}
          runKey={runKey}
          soundEnabled={soundEnabled}
          hapticsEnabled={hapticsEnabled}
          onFinish={handleFinish}
        />
        {ranked && !ticket && active && !offlinePractice && !error && !submitting && (
          <div className="run-syncing-badge">
            <LoaderCircle className="spin" size={12} />
            <span>syncing</span>
          </div>
        )}
        {error && !result && !submitting && (
          <div className="run-error">
            <strong>RUN INTERRUPTED</strong>
            <span>{error}</span>
            <button type="button" onClick={retry}>TRY AGAIN</button>
          </div>
        )}
        {challengeHere && !result && (
          <div className="challenge-chip">
            <Zap size={14} fill="currentColor" />
            Beat {challenge.handle}: <strong>{formatScore(challenge.score)}</strong>
          </div>
        )}
      </div>

      <aside
        className={`social-rail${expanded && controlsDimmed ? " is-controls-dimmed" : ""}`}
        data-controls-dimmed={expanded && controlsDimmed}
        onClickCapture={restoreControls}
        onKeyDownCapture={restoreControls}
        onPointerDownCapture={() => {
          restoreControls();
          cardRef.current?.focus({ preventScroll: true });
        }}
        onWheelCapture={() => cardRef.current?.focus({ preventScroll: true })}
        aria-label="Game and feed controls"
      >
        {expanded && (
          <button
            type="button"
            className="feed-nav feed-nav-up"
            onClick={goPrevious}
            aria-label="Scroll to the previous game"
            aria-controls="game-feed"
            disabled={index === 0}
          >
            <ChevronUp />
            <span>Up</span>
          </button>
        )}
        <button
          type="button"
          onClick={toggleLike}
          className={like.liked ? "is-liked" : ""}
          aria-label="Hype this game"
          aria-pressed={like.liked}
        >
          <Heart fill={like.liked ? "currentColor" : "none"} />
          <span>{like.count || "Hype"}</span>
        </button>
        <button
          type="button"
          onClick={toggleSave}
          className={engagement.saved ? "is-saved" : ""}
          aria-label={engagement.saved ? "Remove from saved games" : "Save this game"}
          aria-pressed={engagement.saved}
        >
          <Bookmark fill={engagement.saved ? "currentColor" : "none"} />
          <span>{engagement.saved ? "Saved" : "Save"}</span>
        </button>
        {ranked && (
          <button type="button" onClick={() => setBoardOpen(true)} aria-label="Open leaderboard">
            <Trophy />
            <span>Ranks</span>
          </button>
        )}
        <button type="button" onClick={share} aria-label="Share game or challenge">
          <Share2 />
          <span>Share</span>
        </button>
        {expanded && (
          <button
            type="button"
            className="feed-nav feed-nav-down"
            onClick={goNext}
            aria-label="Scroll to the next game"
            aria-controls="game-feed"
          >
            <ChevronDown />
            <span>Down</span>
          </button>
        )}
      </aside>

      <footer className="game-caption">
        <div className="caption-meta">
          <span className="creator-line">
            <Gamepad2 size={15} />{" "}
            {game.creatorLabel ?? getGameCatalogMetadata(game.slug).creatorLabel}
          </span>
          <span className={`play-mode ${ranked ? "is-ranked" : "is-instant"}`}>
            {ranked ? <Crown size={12} /> : <Zap size={12} />}
            {ranked ? "GLOBAL RANKS" : "INSTANT PLAY"}
          </span>
        </div>
        <h2>{game.title}</h2>
        <p>
          <strong>HOW TO PLAY:</strong> {game.rule_text}
        </p>
        <span className="swipe-hint">
          <ChevronUp size={13} aria-hidden="true" /> SWIPE FOR THE NEXT GAME
        </span>
      </footer>

      {(result || submitting) && (
        <ResultSheet
          result={result}
          score={score}
          game={game}
          player={player}
          submitting={submitting}
          error={error}
          onReplay={retry}
          onLeaderboard={() => setBoardOpen(true)}
          onClaim={onOpenAuth}
          onShare={share}
          onSwipeNext={goNext}
        />
      )}
      <LeaderboardSheet
        open={boardOpen}
        game={game}
        player={player}
        initial={result}
        onClose={() => setBoardOpen(false)}
      />
    </section>
  );
}

// Pulse Lock is the instant-play lead card: it begins moving as soon as the feed
// opens without an iframe loader, Flash poster, audio gate, or user gesture. A
// challenge deep-link still wins the first slot so shared links land correctly.
const PINNED_FIRST_SLUG = "pulse-lock";

// Keep the remaining native mini-games at the end of the feed. Pulse Lock is
// intentionally excluded because it is now the instant-play lead card.
const NATIVE_LAST_SLUGS = new Set([
  "memory-grid",
  "meteor-dodge",
  "color-clash",
  "stack-shift",
]);

// Short 1-2 char badge for a game, shown on its accent tile in the jump sheet
// so each game is recognizable at a glance. Pure numeric names (e.g. "67 Game")
// keep the number; otherwise use the initials of the first two words.
function gameMonogram(title: string): string {
  const words = title.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (/^\d+$/.test(words[0])) return words[0].slice(0, 2);
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

// Endless feed with a fixed priority order: Pulse Lock always leads, then every
// showcase game (freshly shuffled each batch), then the remaining native
// mini-games at the end. A batch-0 deep link (?game=)
// still wins the very first card so challenge/share links land correctly.
function makeBatch(
  games: GameDefinition[],
  batch: number,
  preferred?: string,
  recent?: readonly string[],
): FeedEntry[] {
  const has = (slug: string) => games.some((game) => game.slug === slug);
  // Lead cards: a batch-0 deep link wins the first slot, then Pulse Lock leads.
  const leadSlugs: string[] = [];
  if (batch === 0 && preferred && has(preferred)) leadSlugs.push(preferred);
  if (has(PINNED_FIRST_SLUG) && !leadSlugs.includes(PINNED_FIRST_SLUG)) {
    leadSlugs.push(PINNED_FIRST_SLUG);
  }
  const leadSet = new Set(leadSlugs);
  const leads = leadSlugs.map((slug) => games.find((game) => game.slug === slug)!);
  const rest = games.filter((game) => !leadSet.has(game.slug));
  const natives = shuffle(rest.filter((game) => NATIVE_LAST_SLUGS.has(game.slug)));
  let others = shuffle(rest.filter((game) => !NATIVE_LAST_SLUGS.has(game.slug)));
  // Seam guard: keep games shown at the end of the previous batch from
  // reappearing near the top of this batch's middle. Push any recently-seen
  // game to the back so the same game is spaced as far apart as possible.
  if (recent && recent.length) {
    const recentSet = new Set(recent);
    const fresh = others.filter((game) => !recentSet.has(game.slug));
    const stale = others.filter((game) => recentSet.has(game.slug));
    if (fresh.length) others = [...fresh, ...stale];
  }
  const arranged = [...leads, ...others, ...natives];
  return arranged.map((game, index) => ({ id: `${batch}-${index}-${game.slug}`, game }));
}

export function App() {
  const preferredGame = useMemo(
    () => new URLSearchParams(window.location.search).get("game") || undefined,
    [],
  );
  // Render the bundled catalog immediately. The live bootstrap request then
  // refreshes player/like/auth metadata without holding the first game behind a
  // database round trip or reshuffling already-mounted cards.
  const [bootstrap, setBootstrap] = useState<BootstrapData>(OFFLINE_BOOTSTRAP);
  const [entries, setEntries] = useState<FeedEntry[]>(() =>
    makeBatch(OFFLINE_BOOTSTRAP.games, 0, preferredGame),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [offlinePractice, setOfflinePractice] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [globalBoardOpen, setGlobalBoardOpen] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  // Sound is ON by default so the live game plays without the player hunting for
  // an unmute button; it only stays off if they explicitly used the Tip Tap mute
  // toggle (which persists "off"). The central audio effect keeps sound to the
  // one active card. (Browsers still gate real playback until the first tap,
  // which the natural act of playing provides.)
  const [soundEnabled, setSoundEnabled] = useState(
    () => window.localStorage.getItem("ttg_sound") !== "off",
  );
  const [colorTheme, setColorTheme] = useState<ColorTheme>(initialColorTheme);
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === "visible");
  const [warmAheadEnabled, setWarmAheadEnabled] = useState(false);
  const [hapticsEnabled] = useState(
    () => window.localStorage.getItem("ttg_haptics") !== "off",
  );
  // Pre-mount at most one compatible next game, and only after the visible game
  // has had an exclusive startup window. Starting multiple WebGL/Unity engines
  // together made first play slower on Replit and memory-heavy on mobile.
  const preparingIndices = useMemo(() => {
    const indices = new Set<number>();
    if (!warmAheadEnabled) return indices;
    for (let i = activeIndex + 1; i < entries.length && i <= activeIndex + 6; i++) {
      if (
        isEmbeddedGame(entries[i].game.slug) &&
        shouldPrepareByMount(entries[i].game.slug)
      ) {
        indices.add(i);
        break;
      }
      if (isEmbeddedGame(entries[i].game.slug)) {
        break;
      }
    }
    return indices;
  }, [activeIndex, entries, warmAheadEnabled]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodesRef = useRef(new Map<number, HTMLElement>());

  const load = useCallback(async () => {
    try {
      const response = await api.bootstrap();
      const data: BootstrapData = {
        ...response,
        engagement: response.engagement ?? {},
        followedCreatorIds: response.followedCreatorIds ?? [],
        stats: response.stats ?? {
          rankedRuns: 0,
          rankedGames: 0,
          savedGames: 0,
          followingCreators: 0,
        },
      };
      setOfflinePractice(false);
      setBootstrap(data);
      const gamesBySlug = new Map(data.games.map((game) => [game.slug, game]));
      setEntries((current) => {
        const refreshed = current.map((entry) => ({
          ...entry,
          game: gamesBySlug.get(entry.game.slug) ?? entry.game,
        }));
        const present = new Set(refreshed.map((entry) => entry.game.slug));
        const missing = data.games.filter((game) => !present.has(game.slug));
        return missing.length
          ? [...refreshed, ...makeBatch(missing, 0, preferredGame)]
          : refreshed;
      });
      const params = new URLSearchParams(window.location.search);
      const challengeId = params.get("challenge");
      if (challengeId) {
        try {
          setChallenge(await api.challenge(challengeId));
        } catch {
          setToast("That challenge is no longer available.");
        }
      }
      if (params.get("signedIn")) {
        setToast("Scores claimed. Welcome to the board.");
        params.delete("signedIn");
        history.replaceState(null, "", `${location.pathname}${params.size ? `?${params}` : ""}`);
      }
    } catch (error) {
      setOfflinePractice(true);
      setBootstrap(OFFLINE_BOOTSTRAP);
      setToast("Offline practice — reconnect to save scores.");
    }
  }, [preferredGame]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const onVisibility = () => setPageVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = colorTheme;
    document.documentElement.style.colorScheme = colorTheme;
    document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.setAttribute("content", colorTheme === "dark" ? "#171a30" : "#fbfaff");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, colorTheme);
    } catch {
      // Theme still works for the current visit when storage is unavailable.
    }
  }, [colorTheme]);

  useEffect(() => {
    setWarmAheadEnabled(false);
    if (!pageVisible) return;
    const delay = warmAheadDelayMs();
    if (delay === null) return;
    const timer = window.setTimeout(() => setWarmAheadEnabled(true), delay);
    return () => window.clearTimeout(timer);
  }, [activeIndex, pageVisible]);

  useEffect(() => {
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (items) => {
        const visible = items
          .filter((item) => item.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isFinite(index)) setActiveIndex(index);
      },
      { threshold: [0.55, 0.72, 0.9] },
    );
    nodesRef.current.forEach((node) => observerRef.current?.observe(node));
    return () => observerRef.current?.disconnect();
  }, [entries.length]);

  useEffect(() => {
    if (!bootstrap || activeIndex < entries.length - 3) return;
    const batch = Math.ceil(entries.length / bootstrap.games.length);
    setEntries((current) => {
      const recent = current.slice(-14).map((entry) => entry.game.slug);
      return [...current, ...makeBatch(bootstrap.games, batch, undefined, recent)];
    });
  }, [activeIndex, bootstrap, entries.length]);

  // Only the active card may make sound. Embedded games that stay mounted to
  // warm up (or that don't self-mute when scrolled past) would otherwise stack
  // their audio as the player scrolls. Centrally mute every game iframe except
  // the active one on every scroll / sound-toggle. Re-run on short delays so a
  // freshly-mounted iframe that wasn't listening yet still gets muted.
  useEffect(() => {
    const syncAudio = () => {
      const frames = document.querySelectorAll<HTMLIFrameElement>(".feed .game-frame iframe");
      frames.forEach((frame) => {
        const card = frame.closest<HTMLElement>(".feed-card");
        const isActive = card?.dataset.active === "true";
        frame.contentWindow?.postMessage(
          { source: "tiptap-parent", type: "set-muted", muted: !(soundEnabled && isActive) },
          window.location.origin,
        );
      });
    };
    syncAudio();
    // Re-run on short delays so a just-mounted warm-ahead iframe (whose message
    // listener wasn't ready on the first pass) still gets muted promptly.
    const timers = [150, 600, 1500].map((delay) => window.setTimeout(syncAudio, delay));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [activeIndex, soundEnabled, entries.length]);

  useEffect(() => {
    if (!warmAheadEnabled) return;
    const nextEmbeddedGame = entries
      .slice(activeIndex + 1, activeIndex + 7)
      .map((entry) => entry.game)
      .find((game) => isEmbeddedGame(game.slug));
    if (!nextEmbeddedGame || shouldPrepareByMount(nextEmbeddedGame.slug)) return;
    // Games that cannot stay mounted off-card get only their bounded critical
    // set cached. Never warm the active game (its iframe already owns that
    // request graph) or multiple future games at the same time.
    const warm = () => void warmGame(nextEmbeddedGame.slug);
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (browserWindow.requestIdleCallback) {
      const handle = browserWindow.requestIdleCallback(warm, { timeout: 1_000 });
      return () => browserWindow.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(warm, 200);
    return () => window.clearTimeout(handle);
  }, [activeIndex, entries, warmAheadEnabled]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const onVisible = useCallback((index: number, node: HTMLElement | null) => {
    const previous = nodesRef.current.get(index);
    if (previous) observerRef.current?.unobserve(previous);
    if (node) {
      node.dataset.index = String(index);
      nodesRef.current.set(index, node);
      observerRef.current?.observe(node);
    } else {
      nodesRef.current.delete(index);
    }
  }, []);

  const toggleSound = () => {
    setSoundEnabled((current) => {
      const next = !current;
      window.localStorage.setItem("ttg_sound", next ? "on" : "off");
      return next;
    });
  };

  const toggleColorTheme = () => {
    setColorTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const updateEngagement = useCallback((slug: GameSlug, state: GameEngagement) => {
    setBootstrap((current) => {
      const currentEngagement = current.engagement ?? {};
      const currentStats = current.stats ?? {
        rankedRuns: 0,
        rankedGames: 0,
        savedGames: 0,
        followingCreators: 0,
      };
      const previous = currentEngagement[slug] ?? { saved: false, saves: 0, plays: 0 };
      const savedDelta = Number(state.saved) - Number(previous.saved);
      return {
        ...current,
        engagement: { ...currentEngagement, [slug]: state },
        stats: {
          ...currentStats,
          savedGames: Math.max(0, currentStats.savedGames + savedDelta),
        },
      };
    });
  }, []);

  const toggleSavedGame = useCallback(
    async (game: GameDefinition) => {
      try {
        const state = await api.toggleSave(game.slug);
        updateEngagement(game.slug, state);
        setToast(state.saved ? `${game.title} saved to your arcade.` : `${game.title} removed from saved games.`);
      } catch {
        setToast("Could not update your saved games.");
      }
    },
    [updateEngagement],
  );

  const toggleCreatorFollow = useCallback(async (creatorId: string) => {
    try {
      const state = await api.toggleCreatorFollow(creatorId);
      setBootstrap((current) => {
        const followed = new Set(current.followedCreatorIds ?? []);
        const currentStats = current.stats ?? {
          rankedRuns: 0,
          rankedGames: 0,
          savedGames: 0,
          followingCreators: 0,
        };
        if (state.following) followed.add(creatorId);
        else followed.delete(creatorId);
        return {
          ...current,
          followedCreatorIds: [...followed],
          stats: { ...currentStats, followingCreators: followed.size },
        };
      });
      setToast(state.following ? "Creator added to Following." : "Creator unfollowed.");
    } catch {
      setToast("Could not update creator following.");
    }
  }, []);

  const openGlobalBoard = useCallback(() => {
    setGamesOpen(false);
    setAuthOpen(false);
    setGlobalBoardOpen(true);
  }, []);

  const jumpToGame = useCallback(
    (slug: string) => {
      setGamesOpen(false);
      setEntries((current) => {
        // Prefer the next occurrence at/after the current card so the jump moves
        // forward; fall back to the first (batch 0 always holds every game).
        let target = current.findIndex((entry, i) => i >= activeIndex && entry.game.slug === slug);
        if (target < 0) target = current.findIndex((entry) => entry.game.slug === slug);
        if (target >= 0) {
          const node = nodesRef.current.get(target);
          node?.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveIndex(target);
        }
        return current;
      });
    },
    [activeIndex],
  );

  const logout = async () => {
    await api.logout();
    setAuthOpen(false);
    setToast("Signed out. Guest play stays open.");
    await load();
  };

  return (
    <main className="app-shell">
      <AppHeader
        player={bootstrap.player}
        soundEnabled={soundEnabled}
        colorTheme={colorTheme}
        onToggleSound={toggleSound}
        onToggleTheme={toggleColorTheme}
        onOpenGames={() => setGamesOpen(true)}
        onProfile={() => setAuthOpen(true)}
      />
      <div className="feed" id="game-feed">
        {entries.map((entry, index) => (
          <GameCard
            key={entry.id}
            entry={entry}
            index={index}
            // Keep the selected game mounted even when an embedded browser reports
            // `document.visibilityState === "hidden"`. Some mobile/webview hosts
            // make that report while the user can still see and touch the feed;
            // unmounting here replaced the game with a non-interactive placeholder.
            active={index === activeIndex}
            preparing={pageVisible && preparingIndices.has(index)}
            player={bootstrap.player}
            like={bootstrap.likes[entry.game.slug] ?? { liked: false, count: 0 }}
            engagement={bootstrap.engagement?.[entry.game.slug] ?? { saved: false, saves: 0, plays: 0 }}
            soundEnabled={soundEnabled}
            hapticsEnabled={hapticsEnabled}
            offlinePractice={offlinePractice}
            challenge={challenge}
            onVisible={onVisible}
            onLikeChange={(slug, state) =>
              setBootstrap((current) =>
                current
                  ? { ...current, likes: { ...current.likes, [slug]: state } }
                  : current,
              )
            }
            onEngagementChange={updateEngagement}
            onOpenAuth={() => setAuthOpen(true)}
            onScored={() => void load()}
            onToast={setToast}
          />
        ))}
      </div>
      <GameJumpSheet
        open={gamesOpen}
        games={bootstrap.games}
        currentSlug={entries[activeIndex]?.game.slug}
        engagement={bootstrap.engagement ?? {}}
        followedCreatorIds={bootstrap.followedCreatorIds ?? []}
        onJump={jumpToGame}
        onToggleSave={(game) => void toggleSavedGame(game)}
        onToggleFollow={(creatorId) => void toggleCreatorFollow(creatorId)}
        onOpenGlobal={openGlobalBoard}
        onClose={() => setGamesOpen(false)}
      />
      <GlobalLeaderboardSheet
        open={globalBoardOpen}
        onClose={() => setGlobalBoardOpen(false)}
      />
      <AuthSheet
        open={authOpen}
        player={bootstrap.player}
        auth={bootstrap.auth}
        stats={bootstrap.stats ?? { rankedRuns: 0, rankedGames: 0, savedGames: 0, followingCreators: 0 }}
        onOpenGlobal={openGlobalBoard}
        onClose={() => setAuthOpen(false)}
        onLogout={() => void logout()}
      />
      <OwnedAdPipeline soundEnabled={soundEnabled} />
      <AdControlPanel />
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
