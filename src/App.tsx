import {
  Crown,
  Gamepad2,
  Heart,
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
  ColorClashGame,
  DinoRunnerGame,
  MemoryGridGame,
  MeteorDodgeGame,
  PulseLockGame,
  SixtySevenGame,
  StackShiftGame,
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
  onProfile,
}: {
  player: Player;
  streak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onProfile: () => void;
}) {
  return (
    <header className="app-header">
      <Logo compact />
      <div className="header-actions">
        <span className="streak-pill" aria-label={`${streak} game streak`}>
          <Zap size={14} fill="currentColor" /> {streak}
        </span>
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
  const finishingRef = useRef(false);
  const cardRef = useRef<HTMLElement | null>(null);

  const begin = useCallback(async () => {
    finishingRef.current = false;
    setTicket(null);
    setResult(null);
    setScore(0);
    setError(null);
    if (offlinePractice) return;
    try {
      const run = await api.startRun(game.slug);
      setTicket(run.ticket);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not start this run.");
    }
  }, [game.slug, offlinePractice]);

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
        {game.slug !== "subway-surfers" && (
          <div className="game-label">
            <span>{GAME_EYEBROWS[game.slug]}</span>
            <h1>{game.title}</h1>
          </div>
        )}
        <Game
          active={gameLive}
          runKey={runKey}
          soundEnabled={soundEnabled}
          hapticsEnabled={hapticsEnabled}
          onFinish={handleFinish}
        />
        {!ticket && active && !offlinePractice && !error && !submitting && (
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
        <button onClick={() => setBoardOpen(true)} aria-label="Open leaderboard">
          <Trophy />
          <span>Ranks</span>
        </button>
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

function makeBatch(games: GameDefinition[], batch: number, preferred?: string): FeedEntry[] {
  const firstSlug =
    batch === 0
      ? preferred && games.some((game) => game.slug === preferred)
        ? preferred
        : "pulse-lock"
      : undefined;
  const firstGame = firstSlug ? games.find((game) => game.slug === firstSlug) ?? games[0] : undefined;
  const arranged = firstGame
    ? [firstGame, ...shuffle(games.filter((game) => game.slug !== firstGame.slug))]
    : shuffle(games);
  return arranged.map((game, index) => ({ id: `${batch}-${index}-${game.slug}`, game }));
}

export function App() {
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [entries, setEntries] = useState<FeedEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [offlinePractice, setOfflinePractice] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
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
    setEntries((current) => [...current, ...makeBatch(bootstrap.games, batch)]);
  }, [activeIndex, bootstrap, entries.length]);

  useEffect(() => {
    const upcomingEmbeddedGame = entries
      .slice(activeIndex + 1, activeIndex + 4)
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
        onProfile={() => setAuthOpen(true)}
      />
      <div className="feed" id="game-feed">
        {entries.map((entry, index) => (
          <GameCard
            key={entry.id}
            entry={entry}
            index={index}
            active={index === activeIndex && pageVisible}
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
