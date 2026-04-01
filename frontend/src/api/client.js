export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function simulateLatency() {
  const enabled =
    import.meta.env.VITE_SIMULATE_LATENCY === 'true' ||
    (import.meta.env.DEV && import.meta.env.VITE_SIMULATE_LATENCY !== 'false');
  if (!enabled) return;
  const ms = 500 + Math.floor(Math.random() * 301); // 500–800ms
  await sleep(ms);
}

export async function getJSON(url) {
  const r = await fetch(url);
  const text = !r.ok ? await r.text().catch(() => '') : null;
  await simulateLatency();
  if (!r.ok) {
    // Backend returns JSON for errors; fall back to status/text.
    try {
      const maybeJson = JSON.parse(text || '');
      throw new Error(maybeJson?.message || maybeJson?.error || `Request failed (${r.status})`);
    } catch {
      throw new Error(text || `Request failed (${r.status})`);
    }
  }
  return r.json();
}

export function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.set(k, String(v));
  });
  return url;
}

