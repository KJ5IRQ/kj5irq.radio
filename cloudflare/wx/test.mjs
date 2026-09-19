/* Exercises the Worker's real fetch handler in Node, with a stubbed edge cache.
 *
 * The point is to test the thing that ships rather than a description of it:
 * the same worker.js and payload.js are imported here, and the only stand-in is
 * `caches.default`, which Cloudflare provides in production and Node does not.
 *
 * Two of these cases hit api.weather.gov for real. The failure cases stub
 * fetch, so they are deterministic and do not depend on the weather service
 * having a bad day.
 *
 *   node cloudflare/wx/test.mjs
 */

import assert from 'node:assert/strict';
import worker from './worker.js';
import { toPayload } from './payload.js';

let passed = 0;
let failed = 0;
const test = async (name, fn) => {
  try {
    await fn();
    passed++;
    console.log(`  ok    ${name}`);
  } catch (error) {
    failed++;
    console.error(`  FAIL  ${name}\n        ${error.message}`);
  }
};

/* --- a Map-backed stand-in for caches.default ------------------------------ */

function stubCaches() {
  const store = new Map();
  globalThis.caches = {
    default: {
      async match(key) {
        const hit = store.get(key.url ?? key);
        return hit ? new Response(hit.body, { headers: hit.headers }) : undefined;
      },
      async put(key, response) {
        store.set(key.url ?? key, {
          body: await response.text(),
          headers: new Headers(response.headers),
        });
      },
    },
  };
  return store;
}

const realFetch = globalThis.fetch;

/* Swap in a failing upstream, counting calls so a cache hit can be proven to
 * have avoided the network entirely. */
function failingUpstream(message = 'simulated outage') {
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    throw new Error(message);
  };
  return () => calls;
}

function countingUpstream() {
  let calls = 0;
  globalThis.fetch = async (...args) => {
    calls++;
    return realFetch(...args);
  };
  return () => calls;
}

/* The Worker now answers on its own subdomain (a Custom Domain), so the tests
 * build requests the same way the site does: cross-origin, with an Origin. */
const BASE = 'https://wx.kj5irq.radio/weather.json';
const call = (path = '/weather.json', origin = null) =>
  worker.fetch(
    new Request(`https://wx.kj5irq.radio${path}`, { headers: origin ? { Origin: origin } : undefined }),
  );

/* --- the cases ------------------------------------------------------------- */

console.log('worker: cold cache, real upstream');
stubCaches();
{
  const upstreamCalls = countingUpstream();
  const response = await call();
  const body = await response.json();

  await test('responds 200 and marks the cache as a miss', () => {
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-wx-cache'), 'miss');
  });

  await test('upstream was actually called once', () => {
    assert.equal(upstreamCalls(), 1);
  });

  await test('payload carries usable weather', () => {
    assert.equal(body.available, true);
    assert.equal(typeof body.temperatureF, 'number');
    assert.ok(body.temperatureF > -40 && body.temperatureF < 140, `implausible temp ${body.temperatureF}`);
    assert.ok(!Number.isNaN(Date.parse(body.observedAt)), 'observedAt is not a date');
    assert.ok(!Number.isNaN(Date.parse(body.fetchedAt)), 'fetchedAt is not a date');
  });

  await test('payload discloses nothing about where Josh lives', async () => {
    const keys = Object.keys(body).sort();
    assert.deepEqual(keys, [
      'available',
      'description',
      'fetchedAt',
      'humidityPct',
      'observedAt',
      'temperatureF',
      'windDirection',
      'windMph',
    ]);
    const text = JSON.stringify(body);
    for (const leak of ['KMWL', 'station', 'lat', 'lon', '32.8', '98.1']) {
      assert.ok(!text.includes(leak), `payload mentions "${leak}"`);
    }
  });
}

console.log('worker: warm cache');
stubCaches();
{
  const first = countingUpstream();
  await call();
  const cachedAt = first();

  const second = countingUpstream();
  const response = await call();
  const body = await response.json();

  await test('second call is served from cache without touching upstream', () => {
    assert.equal(response.headers.get('x-wx-cache'), 'hit');
    assert.equal(second(), 0, 'upstream was called again inside the TTL');
  });

  await test('cached payload is the same weather', () => {
    assert.equal(typeof body.temperatureF, 'number');
    assert.ok(cachedAt >= 1);
  });
}

console.log('worker: cross-origin (the site reads this subdomain from the apex)');
stubCaches();
{
  await countingUpstream()();
  const first = await call('/weather.json', 'https://kj5irq.radio');
  const second = await call('/weather.json', 'http://localhost:8908');
  const foreign = await call('/weather.json', 'https://not-josh.example');

  await test('the site origin is allowed', () => {
    assert.equal(first.headers.get('access-control-allow-origin'), 'https://kj5irq.radio');
  });

  /* The edge cache is shared between callers, so a CORS header baked in at store
     time would be handed to whoever asked next. This is the regression test for
     that: the hit must answer the second caller, not repeat the first. */
  await test('a cache hit carries the CURRENT callers origin, not the stored one', () => {
    assert.equal(first.headers.get('x-wx-cache'), 'miss');
    assert.equal(second.headers.get('x-wx-cache'), 'hit');
    assert.equal(second.headers.get('access-control-allow-origin'), 'http://localhost:8908');
  });

  await test('an origin that is not the site gets no allow header', () => {
    assert.equal(foreign.headers.get('access-control-allow-origin'), null);
  });

  await test('a preflight is answered', async () => {
    const response = await worker.fetch(
      new Request(BASE, { method: 'OPTIONS', headers: { Origin: 'https://kj5irq.radio' } }),
    );
    assert.equal(response.status, 204);
    assert.equal(response.headers.get('access-control-allow-methods'), 'GET, HEAD, OPTIONS');
  });
}

console.log('worker: routing');
stubCaches();
{
  await countingUpstream();
  const wrong = await call('/anything-else');
  const body = await wrong.json();

  await test('a Custom Domain sends every path here, so the others 404', () => {
    assert.equal(wrong.status, 404);
    assert.equal(body.error, 'not found');
    assert.equal(body.path, '/weather.json');
  });

  await test('a 404 does not poison the cache', async () => {
    const cached = await globalThis.caches.default.match(new Request(BASE));
    assert.equal(cached, undefined);
  });
}

console.log('worker: stale cache, upstream down');
stubCaches();
{
  await countingUpstream()();
  const age = await call().then((r) => r.json());
  // Age the stored copy past the TTL by rewriting fetchedAt in the cache.
  // The key has to be the one the Worker uses, or this ages a different entry
  // and the test passes for the wrong reason.
  const cache = globalThis.caches.default;
  const key = new Request('https://wx.kj5irq.radio/weather.json');
  const aged = { ...age, fetchedAt: new Date(Date.now() - 3600_000).toISOString() };
  await cache.put(
    key,
    new Response(JSON.stringify(aged), { headers: { 'content-type': 'application/json' } }),
  );

  failingUpstream();
  const response = await call('/weather.json', 'https://kj5irq.radio');
  const body = await response.json();

  await test('serves the last good reading rather than an error', () => {
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-wx-cache'), 'stale');
    assert.equal(body.stale, true);
    assert.equal(body.temperatureF, age.temperatureF);
    assert.equal(body.observedAt, age.observedAt);
  });

  await test('the stale reading still carries its observation time', () => {
    assert.ok(!Number.isNaN(Date.parse(body.observedAt)));
  });

  await test('a stale response still carries CORS', () => {
    assert.equal(response.headers.get('access-control-allow-origin'), 'https://kj5irq.radio');
  });
}

console.log('worker: no cache, upstream down');
stubCaches();
{
  failingUpstream();
  const response = await call();
  const body = await response.json();

  await test('fails closed with 503 and no invented numbers', () => {
    assert.equal(response.status, 503);
    assert.equal(body.available, false);
    assert.equal(body.temperatureF, undefined);
  });
}

console.log('worker: method and payload edge cases');
stubCaches();
{
  await test('a POST is refused', async () => {
    const response = await worker.fetch(
      new Request('https://kj5irq.radio/wx.json', { method: 'POST' }),
    );
    assert.equal(response.status, 405);
  });

  await test('an observation with no temperature is rejected, not guessed', () => {
    assert.throws(() => toPayload({ timestamp: new Date().toISOString() }), /no temperature/);
  });

  await test('wind direction nulls survive instead of becoming "N"', () => {
    const payload = toPayload({
      timestamp: new Date().toISOString(),
      temperature: { value: 20 },
      windSpeed: { value: null },
      windDirection: { value: null },
    });
    assert.equal(payload.windDirection, null);
    assert.equal(payload.windMph, null);
  });
}

globalThis.fetch = realFetch;
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
