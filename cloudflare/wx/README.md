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
   every visit makes a cross-origin request to a third party, which breaks the
   site's own acceptance test (P8: "zero third-party requests in the network
   panel on every page").
3. **A cache on our own domain in front of the weather service.** This.

```
browser -> wx.kj5irq.radio/weather.json  (this Worker, 5 minute cache)
              -> api.weather.gov         (only on a cold or stale cache)
```

The subdomain is the same registrable domain, so the request is still
first-party and P8 keeps passing.

## Why a Custom Domain and not a route on the apex

A Worker **route** only fires on a hostname that is **proxied by Cloudflare**
(orange cloud). `kj5irq.radio` is a **DNS-only** CNAME to `kj5irq.github.io` —
checked with `dig`, and confirmed by the absence of any `cf-ray` header — so a
route on `kj5irq.radio/weather.json` would never see a request. Turning the apex
proxy on instead would put Cloudflare in front of the whole live site and change
how GitHub Pages issues and renews its certificate: a bigger change than this
feature is worth.

A **Custom Domain** leaves the apex alone. Cloudflare creates the subdomain's DNS
record and certificate, and the Worker is the origin for it. Both requirements
are met: the zone is on Cloudflare (`elijah`/`hadlee.ns.cloudflare.com`), and
`wx.kj5irq.radio` has no existing record — a Custom Domain cannot be created on a
hostname that already has a CNAME.

## Behaviour

- Cache hit inside the 5 minute TTL: served from the edge, upstream untouched.
- Cache stale: one upstream fetch, then served fresh.
- Upstream down, cached copy present: the last reading is served with
  `"stale": true`. A twenty-minute-old temperature beats no line at all.
- Upstream down, nothing cached: `503` with `{"available": false}`. It never
  invents numbers.
- Every path other than `/weather.json` is a `404`, because a Custom Domain sends
  the whole subdomain here.
- `Access-Control-Allow-Origin` is echoed only for `https://kj5irq.radio` and
  localhost, and it is applied per request rather than being stored in the cache,
  so a cached copy cannot hand one caller another caller's header.
- The payload carries the time the weather was **observed**, and the page prints
  it (`as of 8:45 AM CDT`), so staleness is visible rather than implied.

Nothing about where Josh lives is in the response: the station id lives in this
Worker's source, and what ships is only what the weather is doing. A test asserts
exactly that.

## Test

```bash
npm run test:wx        # 19 cases; the cold-cache cases hit NWS for real
```

Runs the Worker's actual `fetch` handler in Node with a stubbed edge cache. It
caught two real bugs before deploy: the stale-fallback path read the cached
`Response` body twice (it would have 500'd during exactly the outage it exists to
survive), and the CORS header was being written into the cache, so one caller's
origin would have been served to the next.

## Deploy

Wrangler is not a dependency of this repo; `npx wrangler` fetches it.

**What the token needs.** Cloudflare's own deployment guide says to create the
token from the **Account API tokens** page using the **Edit Cloudflare Workers**
template, then scope it to the account and the `kj5irq.radio` zone. That covers
publishing the script. Creating the Custom Domain also registers a DNS record, so
if `wrangler deploy` reports a permission error on that step, add
**Zone → DNS → Edit** for `kj5irq.radio` too. (Verified against the docs; that
one step is the residual uncertainty, and the deploy command says so plainly if
the permission is missing.)

Also needed: the **account ID** (dashboard → Workers & Pages → Account ID, or
`npx wrangler whoami`).

```bash
cd cloudflare/wx
CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... npx wrangler deploy
```

Both are documented Wrangler system environment variables. Neither belongs in the
repo: keep the token in the vault and pass it in the environment.

## Verify

Not the deploy output — the endpoint:

```bash
# 1. real weather, plausible values, a fresh observation time
curl -s https://wx.kj5irq.radio/weather.json | python3 -m json.tool

# 2. CORS is for the site and nobody else
curl -s -D - -o /dev/null -H 'Origin: https://kj5irq.radio' \
  https://wx.kj5irq.radio/weather.json | grep -i access-control    # expect the header
curl -s -D - -o /dev/null -H 'Origin: https://evil.example' \
  https://wx.kj5irq.radio/weather.json | grep -i access-control    # expect nothing

# 3. the cache is real: first miss, then hit
curl -s -D - -o /dev/null https://wx.kj5irq.radio/weather.json | grep -i x-wx-cache
curl -s -D - -o /dev/null https://wx.kj5irq.radio/weather.json | grep -i x-wx-cache

# 4. anything else on the subdomain is 404
curl -s -o /dev/null -w '%{http_code}\n' https://wx.kj5irq.radio/anything
```

Then look at the live page and confirm the dateline shows the current weather.

## Rollback

Remove the Custom Domain (dashboard → Workers & Pages → the Worker → Settings →
Domains & Routes), or `npx wrangler delete`. The site needs no change: its fetch
fails and the build-time reading stands, which is the same code path a visitor
with JavaScript off takes.
