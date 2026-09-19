/* The transform that turns an NWS observation into the payload the site reads.
 *
 * Deliberately runtime-free: no Cloudflare APIs, no fetch, no globals. The
 * Worker imports it, and the test imports it, so the thing being tested is the
 * thing that ships.
 *
 * Nothing about where Josh lives appears in the output. No station id, no
 * coordinates, no town. The station is a constant in the Worker's own source,
 * and what goes over the wire is only what the weather is doing.
 */

const COMPASS = [
  'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
  'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW',
];

const round = (n) => Math.round(n);
const cToF = (c) => round((c * 9) / 5 + 32);
const kmhToMph = (kmh) => round(kmh * 0.621371);
const compass = (deg) =>
  deg === null || deg === undefined ? null : COMPASS[Math.round(deg / 22.5) % 16];

/**
 * @param {object} observation  the `properties` object from api.weather.gov
 * @param {Date}   now          injectable so tests are deterministic
 */
export function toPayload(observation, now = new Date()) {
  if (!observation || observation.temperature?.value == null) {
    throw new Error('observation has no temperature');
  }
  return {
    available: true,
    observedAt: observation.timestamp,
    description: observation.textDescription ?? null,
    temperatureF: cToF(observation.temperature.value),
    windMph: observation.windSpeed?.value == null ? null : kmhToMph(observation.windSpeed.value),
    windDirection: compass(observation.windDirection?.value),
    humidityPct:
      observation.relativeHumidity?.value == null ? null : round(observation.relativeHumidity.value),
    fetchedAt: now.toISOString(),
  };
}
