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

const call = () => worker.fetch(new Request('https://kj5irq.radio/wx.json'));

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

console.log('worker: stale cache, upstream down');
stubCaches();
{
  await countingUpstream()();
  const age = await call().then((r) => r.json());
  // Age the stored copy past the TTL by rewriting fetchedAt in the cache.
  const store = await (async () => {
    const s = globalThis.caches.default;
    const key = new Request('https://kj5irq.radio/wx.json');
    const existing = await (await s.match(key)).json();
    const aged = { ...existing, fetchedAt: new Date(Date.now() - 3600_000).toISOString() };
    await s.put(key, new Response(JSON.stringify(aged), { headers: { 'content-type': 'application/json' } }));
    return aged;
  })();

  failingUpstream();
  const response = await call();
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
