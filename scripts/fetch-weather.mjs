// Latest observation for the station Josh's own weather engine already tracks,
// so the front page can print real conditions in its dateline.
//
// Why this runs at build time instead of in the reader's browser: the site's
// rule is that a visit makes no requests to anyone but this site. A reader gets
// a finished page with the weather already in it. Nothing about where Josh
// lives is published: the station is a public airport weather station, no
// coordinates appear anywhere, and the only thing that ships is what the
// weather is doing.
//
// The station id comes from Josh's own weather-engine state (its `locations`
// table resolves his home coordinates to KMWL). Override with QTH_STATION if
// that ever changes.
//
// The build must never fail because of the weather. On any error this script
// keeps a recent existing reading, or writes `available: false`, and exits 0.

import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const STATION = process.env.QTH_STATION ?? 'KMWL';
const OUT = new URL('../src/data/qth-weather.json', import.meta.url).pathname;
const KEEP_EXISTING_MINUTES = 180;

const USER_AGENT = '(kj5irq.radio, https://kj5irq.radio)';
const ENDPOINT = `https://api.weather.gov/stations/${STATION}/observations/latest`;

const COMPASS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

const round = (n) => Math.round(n);
const cToF = (c) => round((c * 9) / 5 + 32);
const kmhToMph = (kmh) => round(kmh * 0.621371);
const compass = (deg) =>
  deg === null || deg === undefined ? null : COMPASS[Math.round(deg / 22.5) % 16];

function keepExistingReading(reason) {
  if (existsSync(OUT)) {
    try {
      const existing = JSON.parse(readFileSync(OUT, 'utf8'));
      const ageMinutes = (Date.now() - Date.parse(existing.fetchedAt)) / 60000;
      if (existing.available && ageMinutes < KEEP_EXISTING_MINUTES) {
        console.log(
          `fetch-weather: ${reason}; keeping the reading from ${existing.fetchedAt} ` +
            `(${round(ageMinutes)} min old).`,
        );
        return;
      }
    } catch {
      // Corrupt file: fall through and write a fresh unavailable marker.
    }
  }
  write({ available: false, reason, fetchedAt: new Date().toISOString() });
  console.log(`fetch-weather: ${reason}; no weather line this build.`);
}

function write(payload) {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, `${JSON.stringify(payload, null, 2)}\n`);
}

let observation;
try {
  const response = await fetch(ENDPOINT, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/geo+json' },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  observation = (await response.json()).properties;
  if (!observation || observation.temperature?.value == null) {
    throw new Error('no temperature in the response');
  }
} catch (error) {
  keepExistingReading(`NWS request failed (${error.message})`);
  process.exit(0);
}

const reading = {
  available: true,
  station: STATION,
  observedAt: observation.timestamp,
  description: observation.textDescription ?? null,
  temperatureF: cToF(observation.temperature.value),
  windMph: observation.windSpeed?.value == null ? null : kmhToMph(observation.windSpeed.value),
  windDirection: compass(observation.windDirection?.value),
  humidityPct: observation.relativeHumidity?.value == null ? null : round(observation.relativeHumidity.value),
  fetchedAt: new Date().toISOString(),
};

write(reading);
console.log(
  `fetch-weather: ${reading.temperatureF}°F ${reading.description ?? ''} ` +
    `at ${reading.observedAt} from ${reading.station}.`,
);
