import type {
  BootstrapData,
  Challenge,
  FollowState,
  GameEngagement,
  GameSlug,
  GlobalLeaderboardResult,
  LeaderboardResult,
  LikeState,
} from "./types";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error || `Request failed (${response.status})`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const api = {
  bootstrap: () => request<BootstrapData>("/api/bootstrap"),
  startRun: (gameSlug: GameSlug) =>
    request<{ ticket: string; startedAt: number }>("/api/runs/start", {
      method: "POST",
      body: JSON.stringify({ gameSlug }),
    }),
  finishRun: (ticket: string, gameSlug: GameSlug, score: number) =>
    request<LeaderboardResult>("/api/scores", {
      method: "POST",
      body: JSON.stringify({ ticket, gameSlug, score }),
    }),
  leaderboard: (gameSlug: GameSlug, period: "all" | "daily") =>
    request<LeaderboardResult>(
      `/api/leaderboard?game=${encodeURIComponent(gameSlug)}&period=${period}`,
    ),
  toggleLike: (gameSlug: GameSlug) =>
    request<LikeState>(`/api/games/${encodeURIComponent(gameSlug)}/like`, {
      method: "POST",
      body: "{}",
    }),
  toggleSave: (gameSlug: GameSlug) =>
    request<GameEngagement>(`/api/games/${encodeURIComponent(gameSlug)}/save`, {
      method: "POST",
      body: "{}",
    }),
  recordPlay: (gameSlug: GameSlug) =>
    request<{ plays: number }>(`/api/games/${encodeURIComponent(gameSlug)}/play`, {
      method: "POST",
      body: "{}",
    }),
  toggleCreatorFollow: (creatorId: string) =>
    request<FollowState>(`/api/creators/${encodeURIComponent(creatorId)}/follow`, {
      method: "POST",
      body: "{}",
    }),
  globalLeaderboard: () =>
    request<GlobalLeaderboardResult>("/api/leaderboard/global"),
  challenge: (runId: string) =>
    request<Challenge>(`/api/challenges/${encodeURIComponent(runId)}`),
  logout: () => request<void>("/auth/logout", { method: "POST", body: "{}" }),
};
