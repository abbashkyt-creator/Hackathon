/**
 * lib/fetch.mjs — resilient HTTP fetch with Poki CDN headers.
 */
export const POKI_HEADERS = { Referer: "https://poki.com/", Origin: "https://poki.com" };

export async function fetchBytes(url, { headers = POKI_HEADERS, retries = 3, timeout = 30000 } = {}) {
  let last;
  for (let i = 0; i <= retries; i++) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), timeout);
      const res = await fetch(url, { headers, signal: ac.signal, redirect: "follow" });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (e) { last = e; if (i < retries) await new Promise(r => setTimeout(r, 400 * (i + 1))); }
  }
  throw last;
}

export async function fetchText(url, opts = {}) { return (await fetchBytes(url, opts)).toString("utf8"); }