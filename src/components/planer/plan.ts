/**
 * The Raumplaner's one room: an 8,40 × 7,20 m classroom (75 drawing units per metre)
 * and the four arrangements its furniture can take. Every arrangement places the same
 * 13 tables (12 double tables + the teacher's desk), 25 chairs and one reading podium,
 * so switching arrangements moves objects instead of swapping drawings.
 * Positions are item centres in drawing units; r is the rotation in degrees.
 */

export type LayoutId = 'frontal' | 'gruppen' | 'inseln' | 'kreis';

export interface Place { x: number; y: number; r: number }

export interface Layout {
  id: LayoutId;
  name: string;
  hint: string;
  tables: Place[];
  desk: Place;
  chairs: Place[];
  podium: Place;
}

/** interior of the room */
export const room = { x0: 100, y0: 70, x1: 730, y1: 610, width: '8,40', depth: '7,20', area: '60,48' };
export const table = { w: 98, h: 49 };
export const deskSize = { w: 105, h: 52 };
export const podiumSize = { w: 120, h: 84 };
export const seats = 24;

const p = (x: number, y: number, r = 0): Place => ({ x, y, r });

/** two chairs on one long side of a table; side 1 = below/right, -1 = above/left */
const pairAt = (t: Place, side: 1 | -1): Place[] => {
  const off = table.h / 2 + 16;
  return t.r === 90
    ? [p(t.x + side * off, t.y - 24), p(t.x + side * off, t.y + 24)]
    : [p(t.x - 24, t.y + side * off), p(t.x + 24, t.y + side * off)];
};

/* ---- Frontal: four rows of double tables facing the board on the right wall ---- */
const frontalTables = [190, 310, 430, 550].flatMap((x) => [175, 340, 505].map((y) => p(x, y, 90)));
const frontal: Layout = {
  id: 'frontal',
  name: 'Frontal',
  hint: 'Alle Plätze mit Blick zur Tafel.',
  tables: frontalTables,
  desk: p(650, 340, 90),
  chairs: [...frontalTables.flatMap((t) => pairAt(t, -1)), p(692, 340)],
  podium: p(660, 530),
};

/* ---- Gruppentische: six tables of four ---- */
const groupCentres = [200, 380, 560].flatMap((x) => [200, 450].map((y) => p(x, y)));
const gruppenTables = groupCentres.flatMap((c) => [p(c.x, c.y - table.h / 2), p(c.x, c.y + table.h / 2)]);
const gruppen: Layout = {
  id: 'gruppen',
  name: 'Gruppentische',
  hint: 'Sechs Tische für je vier Kinder.',
  tables: gruppenTables,
  desk: p(660, 325, 90),
  chairs: [
    ...groupCentres.flatMap((c) => [...pairAt(p(c.x, c.y - table.h / 2), -1), ...pairAt(p(c.x, c.y + table.h / 2), 1)]),
    p(703, 325),
  ],
  podium: p(660, 515),
};

/* ---- Lerninseln: a window bench, two islands and one project table ---- */
const bench = [190, 288, 386, 484].map((x) => p(x, 99));
const islands = [250, 420].flatMap((x) => [p(x, 300 - table.h / 2), p(x, 300 + table.h / 2)]);
const project = [511, 609].flatMap((x) => [455.5, 504.5].map((y) => p(x, y)));
const inseln: Layout = {
  id: 'inseln',
  name: 'Lerninseln',
  hint: 'Zonen für Gruppen, Einzelarbeit und Projekte.',
  tables: [...bench, ...islands, ...project],
  desk: p(683, 150, 90),
  chairs: [
    ...bench.flatMap((t) => pairAt(t, 1)),
    ...[250, 420].flatMap((x) => [...pairAt(p(x, 300 - table.h / 2), -1), ...pairAt(p(x, 300 + table.h / 2), 1)]),
    ...[487, 535, 585, 633].flatMap((x) => [p(x, 415), p(x, 545)]),
    p(640, 150),
  ],
  podium: p(640, 300),
};

/* ---- Sitzkreis: 25 chairs in a circle, the tables along the walls ---- */
const circle = Array.from({ length: seats + 1 }, (_, i) => {
  const a = (i / (seats + 1)) * Math.PI * 2 - Math.PI / 2;
  return p(+(400 + Math.cos(a) * 168).toFixed(1), +(340 + Math.sin(a) * 168).toFixed(1));
});
const kreis: Layout = {
  id: 'kreis',
  name: 'Sitzkreis',
  hint: 'Alle auf einer Höhe, die Mitte bleibt frei.',
  tables: [
    ...[150, 248, 346, 444, 542, 640].map((x) => p(x, 99)),
    ...[240, 338, 436, 534, 632].map((x) => p(x, 581.5)),
    p(706, 505, 90),
  ],
  desk: p(690, 330, 90),
  chairs: circle,
  podium: p(400, 340),
};

export const layouts: Layout[] = [frontal, gruppen, inseln, kreis];
export const layoutById = Object.fromEntries(layouts.map((l) => [l.id, l])) as Record<LayoutId, Layout>;
export const defaultLayout: LayoutId = 'gruppen';

export const place = (pl: Place) => `translate(${pl.x}px, ${pl.y}px) rotate(${pl.r}deg)`;
