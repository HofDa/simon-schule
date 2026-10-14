/**
 * The five ways the classroom of the learning scenes is set up, after arrangements in the
 * VS catalogue (Basiskatalog Schule 2026), with the VS furniture from vs-models.ts:
 * Tano group islands, Puzzle tables with Hokki stools, the Shift+ Landscape seating,
 * Vancouver booths and a Shift+ floor island. No walls, no floor: the furniture alone.
 * Units are decimetres on an 8 × 6.4 m footprint; the board side is y = 0.
 */
import { circle, rect, sector, type Item, type Pt, type Shape } from './iso';
import { pantoSwing, hokki, tanoIsland, puzzle, desk, roundTable, shiftSeat, pouf, cushion, backRoll, vancouver, vancouverBench, trayShelf, drum } from './vs-models';

export type SceneName = 'gruppen' | 'bewegung' | 'landschaft' | 'rueckzug' | 'boden';

// colours sampled from the catalogue photographs
const GINSTER = '#e2a300';
const SKY = '#8cc3e6';
const ROYAL = '#3b5bd6';
const RED = '#c8283b';
const LIME = '#9bd317';
const PINK = '#e9b7bd';
const ORANGE = '#ef8a1f';
const ANTHRACITE = '#3d3e3b';
const toBoard = -Math.PI / 2;

/**
 * Tano: three five-sided tops to an island (cut from the centre to every other edge midpoint,
 * so the island does not read as an isometric cube), a tray under each, six PantoSwings round it.
 */
function island(cx: number, cy: number, chairs: string, items: Item[]) {
  const R = 7.6;
  const at = (deg: number, r: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
  const vertex = (k: number) => at(60 * k + 30, R);
  const middle = (k: number) => at(60 * k + 60, R * 0.866);
  const gap = (pts: Pt[]) => {
    const [mx, my] = pts.reduce(([sx, sy], [x, y]) => [sx + x / pts.length, sy + y / pts.length], [0, 0]);
    return pts.map(([x, y]) => [x + (mx - x) * 0.03, y + (my - y) * 0.03] as Pt);
  };
  const tops = [0, 1, 2].map((k) => gap([[cx, cy], middle(2 * k), vertex(2 * k + 1), vertex(2 * k + 2), middle(2 * k + 2)]));
  const trays = [0, 1, 2].map((k) => at(120 * k + 120, R * 0.55));
  items.push(tanoIsland(tops, trays));
  for (let k = 0; k < 6; k++) {
    const t = (60 * k * Math.PI) / 180;
    const dist = R * 0.866 + 2.4;
    items.push(pantoSwing(cx + Math.cos(t) * dist, cy + Math.sin(t) * dist, t + Math.PI, chairs));
  }
}

function gruppen(): Item[] {
  const items: Item[] = [];
  island(20, 22, SKY, items);
  island(54, 20, RED, items);
  island(38, 48, GINSTER, items);
  return items;
}

/** Puzzle: a free-form outline, turned. */
const blob = (cx: number, cy: number, rx: number, ry: number, turn: number): Pt[] =>
  Array.from({ length: 40 }, (_, i) => {
    const t = (i / 40) * Math.PI * 2;
    const r = 1 + 0.17 * Math.sin(3 * t + 0.6) + 0.08 * Math.cos(2 * t);
    const x = Math.cos(t) * rx * r;
    const y = Math.sin(t) * ry * r;
    return [cx + x * Math.cos(turn) - y * Math.sin(turn), cy + x * Math.sin(turn) + y * Math.cos(turn)];
  });

const turnAround = (cx: number, cy: number, turn: number, pts: Pt[]): Pt[] =>
  pts.map(([x, y]) => [cx + x * Math.cos(turn) - y * Math.sin(turn), cy + x * Math.sin(turn) + y * Math.cos(turn)]);

function bewegung(): Item[] {
  const items: Item[] = [];
  const colours = [ROYAL, RED, SKY, LIME, RED, ROYAL];
  const table = (cx: number, cy: number, turn: number, seats: Pt[]) => {
    items.push(puzzle(blob(cx, cy, 11, 5.4, turn), turnAround(cx, cy, turn, [[-8, -2.6], [7.5, -2.8], [-7, 3], [8, 2.6]])));
    seats.forEach(([x, y], i) => items.push(hokki(x, y, colours[i % colours.length])));
  };
  table(24, 24, 0.25, [[13, 16.5], [24, 14.5], [34, 19], [36.5, 28.5], [24, 33.5], [13.5, 30]]);
  table(50, 44, -0.35, [[39.5, 40], [46, 33.5], [56.5, 33.5], [61.5, 42], [55, 52.5], [43.5, 52]]);
  // a standing table with two tall Hokkis
  items.push(roundTable(64, 16, 4, 10.6));
  items.push(hokki(58, 19.5, LIME, true));
  items.push(hokki(68.5, 20.5, ROYAL, true));
  return items;
}

function landschaft(): Item[] {
  const items: Item[] = [];
  const cx = 36;
  const cy = 26;
  // an outer arc of seat elements and an inner arc, as in the catalogue
  for (let k = 0; k < 6; k++) {
    const a0 = 22 + k * 23;
    items.push(shiftSeat(sector(cx, cy, 14.5, 19.5, a0, a0 + 22.4), LIME));
  }
  for (let k = 0; k < 4; k++) {
    const a0 = 46 + k * 23;
    items.push(shiftSeat(sector(cx, cy, 9.2, 14.2, a0, a0 + 22.4), ANTHRACITE, 3.6));
  }
  items.push(pouf(cx, cy + 4, LIME));
  items.push(pouf(cx - 6.5, cy + 1, ANTHRACITE, 2, 3.8));
  // a straight row of blocks further back
  items.push(shiftSeat(rect(50, 4, 6, 6), ROYAL));
  items.push(shiftSeat(rect(56.4, 4, 6, 6), ROYAL));
  items.push(shiftSeat(rect(62.8, 4, 6, 6), ANTHRACITE));
  items.push(pouf(70, 13, LIME, 2, 3.8));
  return items;
}

function rueckzug(): Item[] {
  const items: Item[] = [];
  items.push(vancouver(58, 2, 14, 10, ROYAL));
  // a vis-à-vis: two high-backed benches and a table between
  items.push(vancouverBench(4, 27, 14, 1, PINK));
  items.push(desk(5.5, 34, 11, 6));
  items.push(vancouverBench(4, 48, 14, -1, PINK));
  // the rest of the class at their desks, facing the board
  for (const [x, y] of [[26, 12], [37, 12], [48, 12], [31, 27], [42, 27], [53, 27]]) {
    items.push(desk(x, y));
    items.push(pantoSwing(x + 3.5, y + 6.3, toBoard, GINSTER));
  }
  return items;
}

/**
 * Shift+ floor island as in the catalogue: the round island in the middle, back rolls along its
 * back rim, a drum seat and two poufs on it, the tray shelf right behind it facing the island,
 * two mats side by side next to it.
 */
function boden(): Item[] {
  const items: Item[] = [];
  const cx = 40;
  const cy = 34;
  const on = 0.9;
  const rim = (deg: number, r: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
  const ring = [GINSTER, ROYAL, LIME, RED, ORANGE, SKY, LIME, ROYAL];
  ring.forEach((colour, k) => items.push(cushion(sector(cx, cy, 5.4, 14, k * 45 + 1.5, k * 45 + 43.5), colour)));
  items.push(cushion(circle(cx, cy, 5, 28), LIME));
  items.push(drum(cx, cy, on));
  // back rolls lie along the back of the rim, where one leans against them
  for (const [deg, colour] of [[195, GINSTER], [255, ROYAL]] as const) {
    const [x, y] = rim(deg, 12.2);
    items.push(backRoll(x, y, on, 7.5, ((deg + 90) * Math.PI) / 180, colour));
  }
  const [p1x, p1y] = rim(105, 9.4);
  const [p2x, p2y] = rim(345, 9.4);
  items.push(pouf(p1x, p1y, RED, 1.9, 3.6, on));
  items.push(pouf(p2x, p2y, SKY, 1.9, 3.6, on));
  items.push(
    trayShelf(33, 11.5, 14, 5, 10, [
      [RED, ROYAL, LIME],
      [LIME, RED, ROYAL],
      [ROYAL, LIME, RED],
    ]),
  );
  items.push(cushion(rect(57, 27, 10, 7.6), ROYAL, 0.7));
  items.push(cushion(rect(57, 34.8, 10, 7.6), RED, 0.7));
  return items;
}

const builders: Record<SceneName, () => Item[]> = { gruppen, bewegung, landschaft, rueckzug, boden };

/** The furniture of a scene, back to front. */
export const furniture = (name: SceneName) => builders[name]().sort((a, b) => a.depth - b.depth);

export const sceneNames = Object.keys(builders) as SceneName[];

let frame: { x: number; y: number; w: number; h: number } | undefined;

/** One frame for all scenes: the bounds of every scene's furniture, so they share a scale. */
export function viewBox() {
  if (frame) return frame;
  const nums = sceneNames
    .flatMap((name) => builders[name]())
    .flatMap((it) => it.shapes)
    .flatMap((shape) => (shape.d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number));
  const xs = nums.filter((_, i) => i % 2 === 0);
  const ys = nums.filter((_, i) => i % 2 === 1);
  const m = 2;
  const x0 = Math.min(...xs) - m;
  const y0 = Math.min(...ys) - m;
  frame = { x: x0, y: y0, w: Math.max(...xs) + m - x0, h: Math.max(...ys) + m - y0 };
  return frame;
}

/** Pixels per decimetre for the files' intrinsic size. */
const SCALE = 6;
export const sceneSize = () => ({ width: Math.round(viewBox().w * SCALE), height: Math.round(viewBox().h * SCALE) });

const pathTag = (s: Shape) =>
  `<path d="${s.d}" fill="${s.fill ?? 'none'}"${s.stroke ? ` stroke="${s.stroke}"` : ''}${s.sw ? ` stroke-width="${s.sw}"` : ''}/>`;

/**
 * A scene as a standalone SVG file. Each piece of furniture is a group numbered with --k,
 * so a page that inlines the file can bring the pieces in one after another.
 */
export function sceneSvg(name: SceneName): string {
  const vb = viewBox();
  const { width, height } = sceneSize();
  const pieces = furniture(name)
    .map((it, k) => {
      const style = [`--k:${k}`, ...Object.entries(it.vars ?? {}).map(([name, value]) => `${name}:${value}`)].join(';');
      const kind = it.kind ? ` data-kind="${it.kind}"` : '';
      return `<g class="iso-piece"${kind} style="${style}">${it.shapes.map(pathTag).join('')}</g>`;
    })
    .join('');
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}" ` +
    `width="${width}" height="${height}" stroke-width="0.1" stroke-linecap="round" stroke-linejoin="round">${pieces}</svg>`
  );
}
