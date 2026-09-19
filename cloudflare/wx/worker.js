/* kj5irq.radio live weather, served from Josh's own domain.
 *
 * Architecture, and why it is shaped this way: a static page cannot fetch fresh
 * weather without either rebuilding (which depends on a scheduler, and GitHub's
 * is best-effort, measured at roughly twice a day rather than every 30 minutes)
 * or letting the visitor's browser call a third party. This Worker is the third
 * option the rest of the industry uses: a cache with a short lifetime in front
 * of the upstream API, on the site's own domain.
 *
 *   browser -> wx.kj5irq.radio/weather.json (this Worker, 5 minute cache)
 *                    -> api.weather.gov      (only when the cache is cold or stale)
 *
 * It answers on its own subdomain rather than as a route on kj5irq.radio itself,
 * because a route only fires on a hostname that is proxied by Cloudflare and the
 * apex is a DNS-only CNAME to GitHub Pages. See wrangler.toml.
 *
 * The subdomain is the same registrable domain, so the request is first-party
 * even though it is cross-origin; the allowlist below is what makes the JSON
 * readable by the site and nothing else.
 *
 * Staleness is explicit: a cached copy older than TTL is refreshed on demand,
 * and if the upstream is down the last good copy is served with `stale: true`
 * rather than an error, because a 20-minute-old temperature beats no line at
 * all. The payload always carries the time it was observed.
 */

import { toPayload } from './payload.js';

/* KMWL: the public airport weather station Josh's own weather engine already
   resolves his home coordinates to. A station id is not an address, but it is
   still not something the public payload carries. */
const STATION = 'KMWL';
const UPSTREAM = `https://api.weather.gov/stations/${STATION}/observations/latest`;
const USER_AGENT = '(kj5irq.radio, https://kj5irq.radio)';

const PATH = '/weather.json';

/* How long a cached reading is trusted before the next request refreshes it. */
const TTL_SECONDS = 300;
/* How long the entry stays in the cache at all, so there is something to serve
   if the upstream is having a bad day. */
const KEEP_SECONDS = 86400;

const CACHE_KEY = 'https://wx.kj5irq.radio/weather.json';

/* The site is the only intended caller. Localhost is allowed so the page can be
   tested end to end against a local build; the payload is public weather, so the
   only thing an allowlist protects here is tidiness, not secrets. */
const ALLOWED_ORIGINS = [/^https:\/\/kj5irq\.radio$/, /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/];

const corsHeaders = (request) => {
  const origin = request.headers.get('Origin');
  if (!origin || !ALLOWED_ORIGINS.some((re) => re.test(origin))) return {};
  return { 'access-control-allow-origin': origin, vary: 'Origin' };
};

const json = (body, status, request, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      /* The browser may hold it for a minute; the Worker holds the real TTL. */
      'cache-control': 'public, max-age=60',
      ...corsHeaders(request),
      ...extraHeaders,
    },
  });

export default {
  async fetch(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: { ...corsHeaders(request), 'access-control-allow-methods': 'GET, HEAD, OPTIONS' },
      });
    }
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
    }

    /* A Custom Domain sends every path here, so the path is checked rather than
       assumed. */
    if (new URL(request.url).pathname !== PATH) {
      return json({ error: 'not found', path: PATH }, 404, request, { 'cache-control': 'no-store' });
    }

    const cache = caches.default;
    const key = new Request(CACHE_KEY, { method: 'GET' });
    /* Read the cached copy once. A Response body can only be consumed a single
       time, so re-reading it in the failure path below would throw exactly when
       the upstream is already having a bad day. */
    const cachedResponse = await cache.match(key);
    let cachedBody = null;
    if (cachedResponse) {
      try {
        cachedBody = await cachedResponse.json();
      } catch {
        cachedBody = null; // A corrupt entry should refresh, not 500.
      }
      const ageSeconds = cachedBody ? (Date.now() - Date.parse(cachedBody.fetchedAt)) / 1000 : Infinity;
      if (cachedBody && ageSeconds < TTL_SECONDS) {
        return json(cachedBody, 200, request, { 'x-wx-cache': 'hit' });
      }
    }

    try {
      const upstream = await fetch(UPSTREAM, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' },
      });
      if (!upstream.ok) throw new Error(`upstream HTTP ${upstream.status}`);
      const payload = toPayload((await upstream.json()).properties);

      /* Stored WITHOUT the CORS header on purpose. The cache is shared between
         callers, so a header baked in at store time would be handed to the next
         caller whatever origin it came from. CORS is applied on the way out, per
         request, in json(). */
      const stored = new Response(JSON.stringify(payload), {
        headers: {
          'content-type': 'application/json; charset=utf-8',
          // Long-lived in the edge cache; freshness is decided by fetchedAt above.
          'cache-control': `public, max-age=${KEEP_SECONDS}`,
        },
      });
      await cache.put(key, stored.clone());
      return json(payload, 200, request, { 'x-wx-cache': 'miss' });
    } catch (error) {
      if (cachedBody) {
        return json({ ...cachedBody, stale: true }, 200, request, {
          'x-wx-cache': 'stale',
          'x-wx-error': String(error.message).slice(0, 120),
        });
      }
      return json({ available: false, reason: 'upstream unavailable' }, 503, request, {
        'cache-control': 'no-store',
      });
    }
  },
};
