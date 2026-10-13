// A simplified map of Spain for the quiz. The outlines are traced by hand from coastal and border points
// (latitude, longitude) and projected once at build time, so no map service or external file is involved.

import { MAP_HEIGHT, MAP_WIDTH, project } from './projection';

export { MAP_HEIGHT, MAP_WIDTH };

type LatLon = readonly [number, number];

const round = (n: number) => Math.round(n * 10) / 10;

function line(points: readonly LatLon[], closed: boolean): string {
  const d = points
    .map((p, i) => {
      const { x, y } = project(p[0], p[1]);
      return `${i === 0 ? 'M' : 'L'}${round(x)} ${round(y)}`;
    })
    .join('');
  return closed ? `${d}Z` : d;
}

// Bay of Biscay and Galicia, from the French border (Irun) west and south to the mouth of the Miño.
const NORTH_COAST: LatLon[] = [
  [43.38, -1.79],
  [43.32, -1.98],
  [43.3, -2.25],
  [43.41, -2.7],
  [43.35, -3.01],
  [43.43, -3.43],
  [43.47, -3.79],
  [43.4, -4.25],
  [43.43, -4.75],
  [43.54, -5.66],
  [43.66, -5.85],
  [43.57, -6.2],
  [43.56, -6.95],
  [43.54, -7.04],
  [43.7, -7.4],
  [43.79, -7.69],
  [43.7, -7.95],
  [43.48, -8.24],
  [43.37, -8.4],
  [43.32, -8.75],
  [43.18, -9.05],
  [43.05, -9.29],
  [42.88, -9.27],
  [42.78, -9.07],
  [42.6, -9.03],
  [42.48, -8.88],
  [42.35, -8.86],
  [42.22, -8.86],
  [42.12, -8.85],
  [41.87, -8.87],
];

// The border with Portugal, from the Miño south to the Guadiana at Ayamonte. Shared by both countries.
const PORTUGAL_BORDER: LatLon[] = [
  [42.02, -8.65],
  [42.12, -8.25],
  [41.93, -8.1],
  [41.87, -7.6],
  [41.95, -7.2],
  [41.98, -6.6],
  [41.9, -6.2],
  [41.5, -6.25],
  [41.25, -6.6],
  [41.03, -6.92],
  [40.8, -6.85],
  [40.5, -6.8],
  [40.25, -6.95],
  [40.02, -6.88],
  [39.67, -7.53],
  [39.47, -7.33],
  [39.2, -7.25],
  [38.95, -7.05],
  [38.75, -7.2],
  [38.45, -7.3],
  [38.2, -6.95],
  [37.95, -7.25],
  [37.55, -7.45],
  [37.2, -7.42],
];

// From Ayamonte along the Atlantic and the Mediterranean to the French border at Portbou.
const SOUTH_AND_EAST_COAST: LatLon[] = [
  [37.21, -7.13],
  [37.21, -6.94],
  [37.03, -6.6],
  [36.78, -6.38],
  [36.6, -6.25],
  [36.53, -6.3],
  [36.3, -6.15],
  [36.18, -6.03],
  [36.01, -5.61],
  [36.13, -5.43],
  [36.15, -5.35],
  [36.42, -5.15],
  [36.51, -4.88],
  [36.6, -4.53],
  [36.72, -4.42],
  [36.75, -3.88],
  [36.72, -3.52],
  [36.74, -2.95],
  [36.7, -2.8],
  [36.83, -2.46],
  [36.72, -2.19],
  [36.98, -1.9],
  [37.24, -1.79],
  [37.4, -1.58],
  [37.56, -1.25],
  [37.58, -0.98],
  [37.63, -0.69],
  [37.84, -0.75],
  [38.08, -0.65],
  [38.34, -0.48],
  [38.53, -0.12],
  [38.65, 0.05],
  [38.73, 0.23],
  [38.84, 0.11],
  [39.0, -0.15],
  [39.47, -0.32],
  [39.68, -0.2],
  [39.98, 0.02],
  [40.36, 0.4],
  [40.58, 0.62],
  [40.72, 0.87],
  [40.87, 0.8],
  [41.07, 1.06],
  [41.12, 1.25],
  [41.22, 1.73],
  [41.38, 2.18],
  [41.54, 2.44],
  [41.67, 2.79],
  [41.85, 3.1],
  [42.05, 3.2],
  [42.2, 3.1],
  [42.32, 3.32],
  [42.43, 3.16],
];

// The Pyrenees, from Portbou back west to Irun.
const FRANCE_BORDER: LatLon[] = [
  [42.47, 2.9],
  [42.42, 2.55],
  [42.38, 2.2],
  [42.43, 1.95],
  [42.48, 1.73],
  [42.43, 1.45],
  [42.6, 1.4],
  [42.72, 1.05],
  [42.83, 0.85],
  [42.7, 0.65],
  [42.69, 0.2],
  [42.79, -0.15],
  [42.8, -0.55],
  [42.95, -0.8],
  [43.0, -1.1],
  [43.1, -1.4],
  [43.25, -1.48],
  [43.3, -1.6],
];

// Portuguese coast, from the Algarve north to the Miño.
const PORTUGAL_COAST: LatLon[] = [
  [37.01, -7.93],
  [37.08, -8.67],
  [37.02, -8.99],
  [37.4, -8.83],
  [37.95, -8.87],
  [38.41, -9.22],
  [38.69, -9.42],
  [38.78, -9.5],
  [39.36, -9.4],
  [39.6, -9.07],
  [40.15, -8.87],
  [40.64, -8.75],
  [41.15, -8.68],
  [41.7, -8.85],
  [41.87, -8.87],
];

const MALLORCA: LatLon[] = [
  [39.96, 3.2],
  [39.84, 3.22],
  [39.73, 3.45],
  [39.55, 3.38],
  [39.27, 3.05],
  [39.37, 2.87],
  [39.52, 2.73],
  [39.56, 2.62],
  [39.46, 2.52],
  [39.53, 2.37],
  [39.7, 2.5],
  [39.8, 2.69],
  [39.88, 2.85],
];

const MENORCA: LatLon[] = [
  [39.99, 3.8],
  [40.05, 3.95],
  [40.09, 4.09],
  [39.97, 4.27],
  [39.86, 4.3],
  [39.88, 4.05],
  [39.93, 3.86],
];

const IBIZA: LatLon[] = [
  [39.11, 1.48],
  [39.03, 1.61],
  [38.91, 1.45],
  [38.83, 1.39],
  [38.88, 1.22],
  [39.01, 1.28],
];

export const SPAIN_PATH = [
  line([...NORTH_COAST, ...PORTUGAL_BORDER, ...SOUTH_AND_EAST_COAST, ...FRANCE_BORDER], true),
  line(MALLORCA, true),
  line(MENORCA, true),
  line(IBIZA, true),
].join('');

export const PORTUGAL_PATH = line([...PORTUGAL_BORDER, ...PORTUGAL_COAST], true);
