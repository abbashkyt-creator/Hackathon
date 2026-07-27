import {
  Crown,
  Gamepad2,
  Heart,
  LayoutGrid,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Share2,
  Sparkles,
  Trophy,
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
import { isEmbeddedGame, warmGame } from "./game-runtime";
import { formatScore, shuffle } from "./game-utils";
import { OFFLINE_BOOTSTRAP } from "./offline-catalog";
import {
  ArithmeticaGame,
  ArcheryKingGame,
  ColorClashGame,
  CityCabRushGame,
  CountControlLegendsGame,
  JohnnyTriggerSniperGame,
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
} from "./games";
import type {
  BootstrapData,
  Challenge,
  GameDefinition,
  GameProps,
  GameSlug,
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
  "kitty-loves-birds-2": KittyLovesBirds2Game,
  "theft-city": TheftCityGame,
  "city-cab-rush": CityCabRushGame,
  "supercar-legends": SupercarLegendsGame,
  "ping-pong-go": PingPongGoGame,
  "ping-pong-bugs": PingPongBugsGame,
};

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
  "kitty-loves-birds-2": "RUN. LEAP. BOUNCE ON BIRDS.",
  "theft-city": "STEAL. ESCAPE. RULE THE CITY.",
  "city-cab-rush": "DRIVE FAST. DODGE TRAFFIC. PICK UP FARES.",
  "supercar-legends": "MATH-GATE SUPERCAR RUNNER",
  "ping-pong-go": "RALLY vs THE CPU",
  "ping-pong-bugs": "SMASH THE BUG WAVE",
};

interface FeedEntry {
  id: string;
  game: GameDefinition;
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand ${compact ? "is-compact" : ""}`} aria-label="Tip Tap Games">
      <span className="brand-mark">
        <span />
      </span>
      <strong>
        TIP TAP <em>GAMES</em>
      </strong>
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
  streak,
  soundEnabled,
  onToggleSound,
  onOpenGames,
  onProfile,
}: {
  player: Player;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenGames: () => void;
  onProfile: () => void;
}) {
  return (
    <header className="app-header">
      <Logo compact />
      <div className="header-actions">
        <span className="streak-pill" aria-label={`${streak} game streak`}>
          <Zap size={14} fill="currentColor" /> {streak}
        </span>
        <button className="icon-button" onClick={onOpenGames} aria-label="Jump to a game">
          <LayoutGrid size={19} />
        </button>
        <button className="icon-button" onClick={onToggleSound} aria-label="Toggle sound">
          {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        <button className="avatar-button" onClick={onProfile} aria-label="Open player profile">
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
  onJump,
  onClose,
}: {
  open: boolean;
  games: GameDefinition[];
  currentSlug: string | undefined;
  onJump: (slug: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="sheet-backdrop" role="presentation" onPointerDown={onClose}>
      <section
        className="bottom-sheet games-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Jump to a game"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <div className="sheet-handle" />
        <button className="sheet-close" onClick={onClose} aria-label="Close games list">
          <X size={20} />
        </button>
        <h2>ALL GAMES</h2>
        <p>Tap any game to jump straight to it.</p>
        <div className="games-grid">
          {games.map((game) => (
            <button
              key={game.slug}
              type="button"
              className={`game-chip theme-${game.slug}${game.slug === currentSlug ? " is-current" : ""}`}
              onClick={() => onJump(game.slug)}
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
              </span>
              <span className="game-chip-label">{game.title}</span>
            </button>
          ))}
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
        <button className="sheet-close" onClick={onClose} aria-label="Close leaderboard">
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
          <button className={period === "all" ? "is-active" : ""} onClick={() => setPeriod("all")}>
            All time
          </button>
          <button
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

function AuthSheet({
  open,
  player,
  auth,
  onClose,
  onLogout,
}: {
  open: boolean;
  player: Player;
  auth: BootstrapData["auth"];
  onClose: () => void;
  onLogout: () => void;
}) {
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
        <button className="sheet-close" onClick={onClose} aria-label="Close profile">
          <X size={20} />
        </button>
        <Avatar player={player} />
        <h2>{player.isGuest ? "CLAIM YOUR RUN" : player.handle}</h2>
        <p>
          {player.isGuest
            ? "Your guest scores already count. Sign in only when you want them on every device."
            : `Connected with ${player.provider}. Your best scores follow you.`}
        </p>
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
          <button className="logout-button" onClick={onLogout}>
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
        <button className="claim-button" onClick={onClaim}>
          <Sparkles size={17} /> You're #{result.yourRank ?? "—"} — sign in to claim it
        </button>
      )}
      <div className="result-actions">
        <button ref={replayButtonRef} onClick={onReplay}>PLAY AGAIN</button>
        <button onClick={onLeaderboard}>
          <Trophy size={17} /> BOARD
        </button>
        <button onClick={onShare}>
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
  soundEnabled,
  hapticsEnabled,
  offlinePractice,
  challenge,
  onVisible,
  onLikeChange,
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
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  offlinePractice: boolean;
  challenge: Challenge | null;
  onVisible: (index: number, node: HTMLElement | null) => void;
  onLikeChange: (gameSlug: GameSlug, state: LikeState) => void;
  onOpenAuth: () => void;
  onScored: () => void;
  onToast: (message: string) => void;
}) {
  const { game } = entry;
  const Game = GAME_COMPONENTS[game.slug];
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
  const finishingRef = useRef(false);
  const cardRef = useRef<HTMLElement | null>(null);

  const begin = useCallback(async () => {
    finishingRef.current = false;
    setTicket(null);
    setResult(null);
    setScore(0);
    setError(null);
    if (offlinePractice || game.ranked === false) return;
    try {
      const run = await api.startRun(game.slug);
      setTicket(run.ticket);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not start this run.");
    }
  }, [game.ranked, game.slug, offlinePractice]);

  useEffect(() => {
    if (active) void begin();
    else {
      setTicket(null);
      setBoardOpen(false);
      setResult(null);
      setError(null);
      setSubmitting(false);
      finishingRef.current = false;
    }
  }, [active, begin, runKey]);

  // Keep the game-label visible until the player starts playing; then fade it
  // out 5s later. "Started playing" = the first interaction with the game area:
  // a pointer/touch/key input for canvas games, or focus moving into the game
  // iframe for embedded games (a click into a same-origin iframe blurs us).
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
      if (inGameArea(event.target)) start();
    };
    const onKey = () => start();
    const onBlur = () => {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.tagName === "IFRAME" && cardRef.current?.contains(activeEl)) {
        start();
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
  }, [active, runKey]);

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
    if (next instanceof HTMLElement) next.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFinish = useCallback(
    (finalScore: number) => {
      finish(finalScore);
    },
    [finish],
  );

  return (
    <section
      className={`feed-card theme-${game.slug}`}
      data-game={game.slug}
      data-active={active}
      ref={(node) => {
        cardRef.current = node;
        onVisible(index, node);
      }}
      aria-label={`${game.title}. ${game.rule_text}`}
    >
      <div className="card-atmosphere" />
      <div className="game-frame">
        {game.slug !== "subway-surfers" && game.slug !== "stickman-fury" && game.slug !== "supercar-legends" && (
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
        {game.ranked !== false && !ticket && active && !offlinePractice && !error && !submitting && (
          <div className="run-syncing-badge">
            <LoaderCircle className="spin" size={12} />
            <span>syncing</span>
          </div>
        )}
        {error && !result && !submitting && (
          <div className="run-error">
            <strong>RUN INTERRUPTED</strong>
            <span>{error}</span>
            <button onClick={retry}>TRY AGAIN</button>
          </div>
        )}
        {challengeHere && !result && (
          <div className="challenge-chip">
            <Zap size={14} fill="currentColor" />
            Beat {challenge.handle}: <strong>{formatScore(challenge.score)}</strong>
          </div>
        )}
      </div>

      <aside className="social-rail">
        <button onClick={toggleLike} className={like.liked ? "is-liked" : ""} aria-label="Hype this game">
          <Heart fill={like.liked ? "currentColor" : "none"} />
          <span>{like.count || "Hype"}</span>
        </button>
        {game.ranked !== false && (
          <button onClick={() => setBoardOpen(true)} aria-label="Open leaderboard">
            <Trophy />
            <span>Ranks</span>
          </button>
        )}
        <button onClick={share} aria-label="Share game or challenge">
          <Share2 />
          <span>Share</span>
        </button>
      </aside>

      <footer className="game-caption">
        <span className="creator-line">
          <Gamepad2 size={15} />{" "}
          {game.slug === "subway-surfers"
            ? "BY SYBO · TIP TAP INTEGRATION"
            : game.slug === "dino-runner"
              ? "BY CHROME UX · TIP TAP INTEGRATION"
              : game.slug === "67-game"
                ? "BY STUPIDELLA · LOCAL SOURCE MIRROR"
                : game.slug === "archery-king"
                  ? "BY CODE THIS LAB · LOCAL SOURCE MIRROR"
                  : game.slug === "smash-room"
                    ? "BY HAPPYLANDER LTD · LOCAL SOURCE MIRROR"
                    : game.slug === "temple-run-2-frozen-shadows"
                      ? "BY IMANGI STUDIOS · LOCAL SOURCE MIRROR"
                    : game.slug === "stickman-fury"
                      ? "BY HAPPYLANDER LTD · LOCAL SOURCE MIRROR"
                    : game.slug === "plonky"
                      ? "BY GAMETORNADO · LOCAL SOURCE MIRROR"
                    : game.slug === "fruit-ninja"
                      ? "BY STORMS · LOCAL SOURCE MIRROR"
                      : game.slug === "johnny-trigger-sniper"
                        ? "BY SAYGAMES · LOCAL SOURCE MIRROR"
                        : game.slug === "city-cab-rush"
                          ? "BY STORERIDER · LOCAL SOURCE MIRROR"
                          : game.slug === "supercar-legends"
                            ? "BY JUNGLE TAVERN · TIP TAP INTEGRATION"
                            : game.slug === "ping-pong-go" || game.slug === "ping-pong-bugs"
                              ? "BY HAPPYLANDER · TIP TAP INTEGRATION"
                  : "@tiptap"}
        </span>
        <h2>{game.title}</h2>
        <p>
          <strong>RULE:</strong> {game.rule_text}
        </p>
        <span className="swipe-hint">SWIPE UP · NEXT GAME</span>
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
          onSwipeNext={swipeNext}
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

// 67 Game is the pinned showcase: it leads every batch (so it's the first card
// on open and heads each endless-feed cycle). A challenge deep-link still wins
// the very first card so shared links land correctly; every other game is
// freshly shuffled on each display.
const PINNED_FIRST_SLUG = "67-game";

// Short 1-2 char badge for a game, shown on its accent tile in the jump sheet
// so each game is recognizable at a glance. Pure numeric names (e.g. "67 Game")
// keep the number; otherwise use the initials of the first two words.
function gameMonogram(title: string): string {
  const words = title.replace(/[^A-Za-z0-9 ]/g, " ").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (/^\d+$/.test(words[0])) return words[0].slice(0, 2);
  return (words[0][0] + (words[1]?.[0] ?? "")).toUpperCase();
}

// Endless feed as a shuffle-bag: every batch is a fresh full shuffle of ALL
// games, so the player sees each game exactly once per cycle (no game loops
// back before the others have shown). 67 Game is pinned to the very first card
// on open (batch 0); after that it shuffles in like everything else. A deep
// link (?game=) still wins the first card so challenge links land correctly.
// `avoidFirstSlug` keeps a game from repeating back-to-back across a batch seam.
function makeBatch(
  games: GameDefinition[],
  batch: number,
  preferred?: string,
  avoidFirstSlug?: string,
): FeedEntry[] {
  let arranged: GameDefinition[];
  const pinnedSlug =
    batch === 0
      ? preferred && games.some((game) => game.slug === preferred)
        ? preferred
        : games.some((game) => game.slug === PINNED_FIRST_SLUG)
          ? PINNED_FIRST_SLUG
          : undefined
      : undefined;
  if (pinnedSlug) {
    const first = games.find((game) => game.slug === pinnedSlug)!;
    arranged = [first, ...shuffle(games.filter((game) => game.slug !== pinnedSlug))];
  } else {
    arranged = shuffle(games);
    // Don't let the new batch open with the game that just closed the last one.
    if (avoidFirstSlug && arranged.length > 1 && arranged[0].slug === avoidFirstSlug) {
      const swapIndex = arranged.findIndex((game, i) => i > 0 && game.slug !== avoidFirstSlug);
      if (swapIndex > 0) {
        [arranged[0], arranged[swapIndex]] = [arranged[swapIndex], arranged[0]];
      }
    }
  }
  return arranged.map((game, index) => ({ id: `${batch}-${index}-${game.slug}`, game }));
}

export function App() {
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [offlinePractice, setOfflinePractice] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(
    () => window.localStorage.getItem("ttg_sound") === "on",
  );
  const [pageVisible, setPageVisible] = useState(() => document.visibilityState === "visible");
  const [hapticsEnabled] = useState(
    () => window.localStorage.getItem("ttg_haptics") !== "off",
  );
  const preparingIndex = useMemo(() => {
    const relative = entries
      .slice(activeIndex + 1, activeIndex + 5)
      .findIndex((entry) => isEmbeddedGame(entry.game.slug));
    return relative < 0 ? -1 : activeIndex + relative + 1;
  }, [activeIndex, entries]);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodesRef = useRef(new Map<number, HTMLElement>());

  const preferredGame = useMemo(
    () => new URLSearchParams(window.location.search).get("game") || undefined,
    [],
  );

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const data = await api.bootstrap();
      setOfflinePractice(false);
      setBootstrap(data);
      setEntries(makeBatch(data.games, 0, preferredGame));
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
      setEntries(makeBatch(OFFLINE_BOOTSTRAP.games, 0, preferredGame));
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

  const prevActiveIndexRef = useRef(0);

  useEffect(() => {
    if (bootstrap && prevActiveIndexRef.current !== activeIndex) {
      setStreak(0);
      prevActiveIndexRef.current = activeIndex;
    }
  }, [activeIndex, bootstrap]);

  useEffect(() => {
    if (!bootstrap || activeIndex < entries.length - 3) return;
    const batch = Math.ceil(entries.length / bootstrap.games.length);
    setEntries((current) => {
      const lastSlug = current[current.length - 1]?.game.slug;
      return [...current, ...makeBatch(bootstrap.games, batch, undefined, lastSlug)];
    });
  }, [activeIndex, bootstrap, entries.length]);

  useEffect(() => {
    // Warm the selected card as well as the next three. This matters for a
    // deep link or the very first feed item: a large local Unity build starts
    // downloading before its iframe is mounted, rather than after a swipe.
    const upcomingEmbeddedGame = entries
      .slice(activeIndex, activeIndex + 4)
      .map((entry) => entry.game)
      .find((game) => isEmbeddedGame(game.slug));
    if (!upcomingEmbeddedGame) return;
    const warm = () => void warmGame(upcomingEmbeddedGame.slug);
    const browserWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (handle: number) => void;
    };
    if (browserWindow.requestIdleCallback) {
      const handle = browserWindow.requestIdleCallback(warm, { timeout: 1_200 });
      return () => browserWindow.cancelIdleCallback?.(handle);
    }
    const handle = window.setTimeout(warm, 250);
    return () => window.clearTimeout(handle);
  }, [activeIndex, entries]);

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

  if (!bootstrap) {
    return (
      <main className="boot-screen">
        <Logo />
        {loadError ? (
          <>
            <p>{loadError}</p>
            <button onClick={() => void load()}>RETRY FEED</button>
          </>
        ) : (
          <>
            <div className="boot-pulse">
              <i />
            </div>
            <span>LOADING THE FEED</span>
          </>
        )}
      </main>
    );
  }

  return (
    <main className="app-shell">
      <AppHeader
        player={bootstrap.player}
        streak={streak}
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
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
            preparing={pageVisible && index === preparingIndex}
            player={bootstrap.player}
            like={bootstrap.likes[entry.game.slug] ?? { liked: false, count: 0 }}
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
            onOpenAuth={() => setAuthOpen(true)}
            onScored={() => setStreak((value) => value + 1)}
            onToast={setToast}
          />
        ))}
      </div>
      <div className="feed-progress" aria-hidden="true">
        {bootstrap.games.map((game) => (
          <i
            key={game.slug}
            className={entries[activeIndex]?.game.slug === game.slug ? "is-active" : ""}
          />
        ))}
      </div>
      <GameJumpSheet
        open={gamesOpen}
        games={bootstrap.games}
        currentSlug={entries[activeIndex]?.game.slug}
        onJump={jumpToGame}
        onClose={() => setGamesOpen(false)}
      />
      <AuthSheet
        open={authOpen}
        player={bootstrap.player}
        auth={bootstrap.auth}
        onClose={() => setAuthOpen(false)}
        onLogout={() => void logout()}
      />
      {toast && <div className="toast">{toast}</div>}
    </main>
  );
}
