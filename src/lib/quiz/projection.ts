// The flat map of Spain used by the quiz: one projection for the build (the outline) and the browser (taps).

type LatLon = { lat: number; lon: number };

// Map frame: the Iberian Peninsula plus the Balearic Islands.
const NORTH = 44.0;
const SOUTH = 35.8;
const WEST = -9.7;
const EAST = 4.5;
// Units per degree of latitude; a degree of longitude is shorter at this latitude.
const SCALE = 40;
const LON_FACTOR = Math.cos((40 * Math.PI) / 180);

const round = (n: number) => Math.round(n * 10) / 10;

export const MAP_WIDTH = round((EAST - WEST) * LON_FACTOR * SCALE);
export const MAP_HEIGHT = round((NORTH - SOUTH) * SCALE);

/** Map units (the SVG viewBox) for a point on earth. */
export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: (lon - WEST) * LON_FACTOR * SCALE, y: (NORTH - lat) * SCALE };
}

/** The point on earth for a position on the map, in map units. */
export function unproject(x: number, y: number): LatLon {
  return { lat: NORTH - y / SCALE, lon: WEST + x / (LON_FACTOR * SCALE) };
}

/** Position of a point as a percentage of the map, for HTML elements laid over the SVG. */
export function mapPosition(lat: number, lon: number): { left: string; top: string } {
  const { x, y } = project(lat, lon);
  return { left: `${round((x / MAP_WIDTH) * 100)}%`, top: `${round((y / MAP_HEIGHT) * 100)}%` };
}

/** Distance over the earth's surface in kilometres (haversine). */
export function distanceKm(a: LatLon, b: LatLon): number {
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
