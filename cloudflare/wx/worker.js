/* kj5irq.radio live weather, served from Josh's own domain.
 *
 * Architecture, and why it is shaped this way: a static page cannot fetch fresh
 * weather without either rebuilding (which depends on a scheduler, and GitHub's
 * is best-effort, measured at roughly twice a day rather than every 30 minutes)
 * or letting the visitor's browser call a third party. This Worker is the third
 * option the rest of the industry uses: a cache with a short lifetime in front
 * of the upstream API, on the site's own origin.
 *
 *   browser -> kj5irq.radio/wx.json (this Worker, cached 5 minutes)
 *                    -> api.weather.gov (only when the cache is cold or stale)
 *
 * The visitor therefore talks to nobody but kj5irq.radio, so the site's
 * acceptance test ("zero third-party requests in the network panel on every
 * page") still passes. The site's own `<script>` reads this and updates the
 * dateline; with JavaScript off, the build-time reading stands.
 *
 * Staleness is explicit: a cached copy older than TTL is refreshed on demand,
 * and if the upstream is down the last good copy is served with `stale: true`
 * rather than an error, because a 20-minute-old temperature beats no line at
 * all. The payload always carries the time it was observed.
 */

import { toPayload } from './payload.js';

/* KMWL: the public airport weather station Josh's own weather engine already
 * resolves his home coordinates to. A station id is not an address, but it is
 * still not something the public payload carries. */
const STATION = 'KMWL';
const UPSTREAM = `https://api.weather.gov/stations/${STATION}/observations/latest`;
const USER_AGENT = '(kj5irq.radio, https://kj5irq.radio)';

/* How long a cached reading is trusted before the next request refreshes it. */
const TTL_SECONDS = 300;
/* How long the entry stays in the cache at all, so there is something to serve
 * if the upstream is having a bad day. */
const KEEP_SECONDS = 86400;

const CACHE_KEY = 'https://kj5irq.radio/wx.json';

const json = (body, status, extraHeaders = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      /* The browser may hold it for a minute; the Worker holds the real TTL. */
      'cache-control': 'public, max-age=60',
      ...extraHeaders,
    },
  });

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('method not allowed', { status: 405, headers: { allow: 'GET, HEAD' } });
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
        return json(cachedBody, 200, { 'x-wx-cache': 'hit' });
      }
    }

    try {
      const upstream = await fetch(UPSTREAM, {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' },
      });
      if (!upstream.ok) throw new Error(`upstream HTTP ${upstream.status}`);
      const payload = toPayload((await upstream.json()).properties);

      const stored = json(payload, 200, {
        // Long-lived in the edge cache; freshness is decided by fetchedAt above.
        'cache-control': `public, max-age=${KEEP_SECONDS}`,
      });
      await cache.put(key, stored.clone());
      return json(payload, 200, { 'x-wx-cache': 'miss' });
    } catch (error) {
      if (cachedBody) {
        return json(
          { ...cachedBody, stale: true },
          200,
          { 'x-wx-cache': 'stale', 'x-wx-error': String(error.message).slice(0, 120) },
        );
      }
      return json({ available: false, reason: 'upstream unavailable' }, 503, {
        'cache-control': 'no-store',
      });
    }
  },
};
