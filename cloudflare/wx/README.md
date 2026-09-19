# kj5irq.radio live weather

The front page shows the conditions at Josh's QTH. This Worker is what makes that
reading current instead of whatever the last build happened to catch.

## Why it exists

A static page cannot show fresh weather by itself. The three options were:

1. **Rebuild often.** What the site did first: a GitHub Actions schedule every 30
   minutes. GitHub documents scheduled workflows as best-effort, and the measured
   result was **two runs in thirteen hours**, so the weather could sit hours old
   next to a live clock.
2. **Let the visitor's browser call the weather service.** Always current, but
   every visit makes a cross-origin request, which breaks the site's own
   acceptance test (P8: "zero third-party requests in the network panel on every
   page").
3. **A cache on our own domain in front of the weather service.** This. The
   pattern the rest of the industry uses:

```
browser -> kj5irq.radio/wx.json   (this Worker, 5 minute cache)
              -> api.weather.gov  (only when the cache is cold or stale)
```

The visitor still talks to nobody but kj5irq.radio, so P8 keeps passing.

## Behaviour

- Cache hit inside the 5 minute TTL: served from the edge, upstream untouched.
- Cache stale: one upstream fetch, then served fresh.
- Upstream down, cached copy present: the last reading is served with
  `"stale": true`. A twenty-minute-old temperature beats no line at all.
- Upstream down, nothing cached: `503` with `{"available": false}`. It never
  invents numbers.
- The payload carries the time the weather was **observed**, and the page prints
  it (`as of 8:45 AM CDT`), so staleness is visible rather than implied.

Nothing about where Josh lives is in the response: the station id lives in this
Worker's source, and what ships is only what the weather is doing. There is a
test that asserts exactly that.

## Test

```bash
node cloudflare/wx/test.mjs      # 12 cases; the cold-cache cases hit NWS for real
```

Runs the Worker's actual `fetch` handler in Node with a stubbed edge cache. This
caught a real bug: the stale-fallback path read the cached `Response` body twice,
which throws — in production that would have 500'd during exactly the outage it
was written to survive.

## Deploy

Needs a Cloudflare API token with, on the `kj5irq.radio` zone:

- **Workers Scripts: Edit**
- **Workers Routes: Edit**

Plus the account id. Neither belongs in this repo; keep the token in the vault
and pass it in the environment.

```bash
cd cloudflare/wx
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npx wrangler deploy
```

Then confirm it is real, rather than trusting the deploy output:

```bash
curl -s https://kj5irq.radio/wx.json | python3 -m json.tool
# expect available: true, a plausible temperatureF, and an observedAt near now
curl -sI https://kj5irq.radio/wx.json | grep -i x-wx-cache   # miss, then hit
```

## Rollback

Delete the route (Cloudflare dashboard → Workers → the route, or
`npx wrangler delete`). The site needs no change: its fetch fails and the
build-time reading stands, which is the same code path as a visitor with
JavaScript off.
