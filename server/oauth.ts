import { timingSafeEqual } from "node:crypto";
import type { Request } from "express";
import type { Config } from "./config.js";

export type OAuthProvider = "google" | "discord";

export interface OAuthProfile {
  provider: OAuthProvider;
  providerUserId: string;
  handle: string;
  avatarUrl: string | null;
}

export function providerAvailable(provider: OAuthProvider, config: Config): boolean {
  if (provider === "google") return Boolean(config.GOOGLE_CLIENT_ID && config.GOOGLE_CLIENT_SECRET);
  return Boolean(config.DISCORD_CLIENT_ID && config.DISCORD_CLIENT_SECRET);
}

export function requestBaseUrl(req: Request, config: Config): string {
  if (config.PUBLIC_BASE_URL) return config.PUBLIC_BASE_URL.replace(/\/$/, "");
  return `${req.protocol}://${req.get("host")}`;
}

export function authorizationUrl(
  provider: OAuthProvider,
  state: string,
  redirectUri: string,
  config: Config,
): string {
  if (!providerAvailable(provider, config)) throw new Error(`${provider} OAuth is not configured.`);

  if (provider === "google") {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({
      client_id: config.GOOGLE_CLIENT_ID!,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid profile email",
      state,
      prompt: "select_account",
    }).toString();
    return url.toString();
  }

  const url = new URL("https://discord.com/oauth2/authorize");
  url.search = new URLSearchParams({
    client_id: config.DISCORD_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify",
    state,
    prompt: "consent",
  }).toString();
  return url.toString();
}

async function expectJson(response: Response): Promise<Record<string, unknown>> {
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`OAuth provider returned ${response.status}: ${detail}`);
  }
  return response.json() as Promise<Record<string, unknown>>;
}

export async function exchangeCode(
  provider: OAuthProvider,
  code: string,
  redirectUri: string,
  config: Config,
): Promise<OAuthProfile> {
  if (provider === "google") {
    const token = await expectJson(
      await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: config.GOOGLE_CLIENT_ID!,
          client_secret: config.GOOGLE_CLIENT_SECRET!,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      }),
    );
    const profile = await expectJson(
      await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { authorization: `Bearer ${String(token.access_token)}` },
      }),
    );
    return {
      provider,
      providerUserId: String(profile.sub),
      handle: String(profile.name || profile.email || "Google Player").slice(0, 40),
      avatarUrl: typeof profile.picture === "string" ? profile.picture : null,
    };
  }

  const token = await expectJson(
    await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: config.DISCORD_CLIENT_ID!,
        client_secret: config.DISCORD_CLIENT_SECRET!,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    }),
  );
  const profile = await expectJson(
    await fetch("https://discord.com/api/v10/users/@me", {
      headers: { authorization: `Bearer ${String(token.access_token)}` },
    }),
  );
  const userId = String(profile.id);
  const avatarHash = typeof profile.avatar === "string" ? profile.avatar : null;
  return {
    provider,
    providerUserId: userId,
    handle: String(profile.global_name || profile.username || "Discord Player").slice(0, 40),
    avatarUrl: avatarHash
      ? `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=128`
      : null,
  };
}

export function safeStateEqual(expected: string | undefined, actual: string): boolean {
  if (!expected) return false;
  const left = Buffer.from(expected);
  const right = Buffer.from(actual);
  return left.length === right.length && timingSafeEqual(left, right);
}
