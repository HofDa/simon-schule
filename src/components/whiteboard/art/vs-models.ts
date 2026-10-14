/**
 * VS furniture for the learning scenes, modelled after the product photographs in the
 * Basiskatalog Schule 2026. Proportions (decimetres) and colours follow the catalogue.
 *
 * - PantoSwing-LuPo (p. 37): one-piece shell with a tall waisted back and grip hole,
 *   on a Z-shaped chrome cantilever (seat rail, diagonal, floor runner).
 * - Hokki (p. 46): bell-shaped body, slim neck, a seat rim with six petals and a grey seat pad.
 * - Tano (p. 74): beech tops, light grey square legs, blue trays hung under the top.
 * - Puzzle (p. 95): white free-form top with a grey edge on slim splayed anthracite legs.
 * - Shift+ Landscape (pp. 21–22): soft upholstered blocks on a dark plinth, round poufs, floor cushions, back rolls.
 * - Vancouver (p. 178): tall padded walls round a seat, on a thin black sled frame.
 */
import { render, extrude, soft, lathe, roll, tube, patch, item, tagged, screenDir, centroid, circle, rect, mix, type Item, type Pt, type Shape, type V3 } from './iso';

const STEEL = '#a3a8a5';
const GREY_LEG = '#b4b8b6';
const ANTHRACITE_LEG = '#4b4d4a';
const PLINTH = '#2f302d';

// PantoSwing-LuPo -------------------------------------------------------------------------------

/** Shell rows from the front lip to the top of the back: [u (forward), z, width]. */
const SHELL: [number, number, number][] = [
  [1.95, 4.28, 3.3],
  [1.8, 4.56, 3.9],
  [1.0, 4.62, 4.2],
  [0.0, 4.56, 4.2],
  [-1.0, 4.5, 4.05],
  [-1.6, 4.68, 3.7],
  [-1.88, 5.2, 2.95],
  [-1.98, 5.9, 2.55],
  [-2.08, 6.6, 3.3],
  [-2.2, 7.3, 3.95],
  [-2.3, 7.9, 4.2],
  [-2.38, 8.3, 3.95],
  [-2.42, 8.48, 3.1],
];
const ACROSS = [-1, -0.5, 0, 0.5, 1];

/** A PantoSwing-LuPo standing at x y, its seat facing direction a (radians). */
export function pantoSwing(x: number, y: number, a: number, colour: string): Item {
  const f: Pt = [Math.cos(a), Math.sin(a)];
  const r: Pt = [-f[1], f[0]];
  const at = (u: number, v: number, z: number): V3 => [x + f[0] * u + r[0] * v, y + f[1] * u + r[1] * v, z];

  // the shell: a curved sheet, dished in the seat and wrapped round the back
  const grid = SHELL.map(([u, z, w]) =>
    ACROSS.map((v) => {
      const back = u < -1.7;
      return at(u + (back ? 0.38 * v * v : 0), (v * w) / 2, z + (back ? 0 : 0.12 * v * v));
    }),
  );
  const faces: V3[][] = [];
  for (let i = 0; i + 1 < grid.length; i++) {
    for (let j = 0; j + 1 < ACROSS.length; j++) faces.push([grid[i][j], grid[i][j + 1], grid[i + 1][j + 1], grid[i + 1][j]]);
  }
  const shell = render(faces, colour, { both: true });

  // the grip hole in the back, between the 10th and 11th rows
  const [u0, z0] = SHELL[9];
  const [u1, z1] = SHELL[10];
  const l = Math.hypot(u1 - u0, z1 - z0);
  const tangent: V3 = [(f[0] * (u1 - u0)) / l, (f[1] * (u1 - u0)) / l, (z1 - z0) / l];
  const hole = patch(at((u0 + u1) / 2 - 0.02, 0, (z0 + z1) / 2), [r[0], r[1], 0], tangent, 0.42, 0.3, '#ffffff');

  // the Z-shaped cantilever on each side, joined on the floor and under the seat
  const frame: Shape[] = [];
  for (const s of [-1, 1]) {
    const v = s * 1.7;
    frame.push(...tube([at(-0.9, v, 4.2), at(1.15, v, 4.2), at(-1.45, v, 0.28), at(1.85, v, 0.28)], STEEL));
    frame.push(...tube([at(-1.55, v, 0.12), at(-1.2, v, 0.12)], '#3a3b38', 0.5));
    frame.push(...tube([at(1.55, v, 0.12), at(1.9, v, 0.12)], '#3a3b38', 0.5));
  }
  frame.push(...tube([at(-1.45, -1.7, 0.28), at(-1.45, 1.7, 0.28)], STEEL));
  frame.push(...tube([at(-0.6, -1.7, 4.2), at(-0.6, 1.7, 4.2)], STEEL));

  // it slides in towards where it faces, as if pushed up to its table
  const [sx, sy] = screenDir(-f[0] * 1.4, -f[1] * 1.4);
  return tagged(item([x, y], 0, frame, shell, [hole]), 'chair', { '--dx': `${sx.toFixed(2)}px`, '--dy': `${sy.toFixed(2)}px` });
}

// Hokki -----------------------------------------------------------------------------------------

/** A Hokki wobble stool; tall for standing tables. */
export function hokki(x: number, y: number, colour: string, tall = false): Item {
  const k = tall ? 1.55 : 1;
  const body = lathe(x, y, 0, [
    [1.5, 0],
    [1.62, 0.22],
    [1.5, 0.6],
    [1.12, 1.6 * k],
    [0.82, 2.8 * k],
    [0.72, 3.5 * k],
    [0.8, 3.85 * k],
    [1.25, 4.12 * k, 0.07],
    [1.62, 4.38 * k, 0.1],
    [1.5, 4.5 * k, 0.1],
  ]);
  const pad = lathe(x, y, 4.5 * k, [[1.05, 0], [1.05, 0.08]], 20);
  // a phase from the position, so the stools do not rock in step
  const phase = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1 + 1) % 1;
  return tagged(item([x, y], 0, render(body, colour), render(pad, '#6b6e6b')), 'hokki', { '--phase': phase.toFixed(2) });
}

// tables ----------------------------------------------------------------------------------------

const square = (x: number, y: number, s = 0.36): Pt[] => rect(x - s / 2, y - s / 2, s, s);
const towards = ([x, y]: Pt, [cx, cy]: Pt, t: number): Pt => [x + (cx - x) * t, y + (cy - y) * t];

/** Tano: tops forming an island (each top starting at the island's centre), square legs, blue trays. */
export function tanoIsland(tops: Pt[][], trays: Pt[] = []): Item {
  const c = centroid(tops.flat());
  const height = 7.3;
  const legs = tops.flatMap((top) => {
    const tc = centroid(top);
    // a leg under every outer corner; the corner at the island's centre has none
    return top.slice(1).map((v) => render(extrude(square(...towards(v, tc, 0.1)), 0, height - 0.3), GREY_LEG));
  });
  const trayShapes = trays.map(([tx, ty]) => render(extrude(rect(tx - 1.4, ty - 1.2, 2.8, 2.4), height - 1.25, 0.9), '#9cc6dc'));
  const top = tops.map((t) => render(extrude(t, height - 0.3, 0.3), (n) => (n[2] > 0.9 ? '#dec196' : '#c4a273'), { edge: '#b8976a' }));
  return item(c, 0, ...legs, ...trayShapes, ...top);
}

/** Puzzle: a free-form top with a grey edge on splayed anthracite legs. */
export function puzzle(top: Pt[], feet: Pt[]): Item {
  const c = centroid(top);
  const height = 7.3;
  const legs = feet.flatMap((foot) => {
    const under = towards(foot, c, 0.18);
    return tube([[under[0], under[1], height - 0.3], [foot[0] + (foot[0] - c[0]) * 0.06, foot[1] + (foot[1] - c[1]) * 0.06, 0]], ANTHRACITE_LEG, 0.4);
  });
  const slab = render(extrude(top, height - 0.3, 0.3), (n) => (n[2] > 0.9 ? '#f6f5f1' : '#8e918d'), { edge: '#c9c6bd' });
  return item(c, 0, legs, slab);
}

/** A plain pupil's desk: white top, grey edge, square legs. */
export function desk(x: number, y: number, w = 7, d = 5): Item {
  const top = rect(x, y, w, d);
  const legs = top.map((v) => render(extrude(square(...towards(v, centroid(top), 0.08)), 0, 7.0), GREY_LEG));
  return item(centroid(top), 0, ...legs, render(extrude(top, 7.0, 0.3), (n) => (n[2] > 0.9 ? '#f6f5f1' : '#9a9d99'), { edge: '#c9c6bd' }));
}

/** A round table on a single column. */
export function roundTable(x: number, y: number, r: number, height: number): Item {
  return item(
    [x, y],
    0,
    render(lathe(x, y, 0, [[2.0, 0], [2.0, 0.25], [0.35, 0.3], [0.35, height - 0.3]], 20), '#8e918d'),
    render(lathe(x, y, height - 0.3, [[r, 0], [r, 0.3]], 24), (n) => (n[2] > 0.9 ? '#f6f5f1' : '#8e918d'), { edge: '#c9c6bd' }),
  );
}

// Shift+ Landscape ------------------------------------------------------------------------------

/** An upholstered seat element on a dark plinth. */
export function shiftSeat(pts: Pt[], colour: string, h = 4.2): Item {
  const c = centroid(pts);
  const plinth = render(extrude(pts.map((p) => towards(p, c, 0.08)), 0, 0.35), PLINTH);
  return item(c, 0, plinth, render(soft(pts, 0.35, h - 0.35, 0.7), colour));
}

/** A round Shift+ pouf, on the floor or standing on cushions at height z. */
export function pouf(x: number, y: number, colour: string, r = 2.2, h = 4.2, z = 0): Item {
  return tagged(item(
    [x, y],
    z,
    render(lathe(x, y, z, [[r * 0.8, 0], [r * 0.8, 0.3]], 20), PLINTH),
    render(lathe(x, y, z + 0.3, [[r * 0.94, 0], [r, 0.4], [r, h - 1], [r * 0.93, h - 0.45], [r * 0.78, h - 0.3]], 20), colour),
  ), 'pouf');
}

/** A Shift+ back roll lying on the floor or on cushions. */
export function backRoll(x: number, y: number, z: number, length: number, a: number, colour: string): Item {
  return item([x, y], z, render(roll(x, y, z, length, 1.1, a), colour));
}

/** A flat floor cushion. */
export function cushion(pts: Pt[], colour: string, h = 0.9): Item {
  const flat = item(centroid(pts), 0, render(soft(pts, 0, h, 0.35), colour));
  // lying on the floor, under whatever stands or lies on it: drawn before everything else
  flat.depth -= 1000;
  return flat;
}

// Vancouver -------------------------------------------------------------------------------------

/**
 * A Vancouver booth on a sled frame, open towards +y: back wall along y, side walls, a seat
 * and a back cushion inside, all padded. w across, d deep.
 */
export function vancouver(x: number, y: number, w: number, d: number, colour: string, wall = 12): Item {
  const lift = 0.8;
  const inner = mix(colour, '#ffffff', 0.28);
  const sled: Shape[] = [];
  for (const sx of [x + 0.4, x + w - 0.4]) {
    sled.push(...tube([[sx, y + 0.4, 0.12], [sx, y + d - 0.3, 0.12], [sx, y + d - 0.3, lift]], '#2f302d', 0.32));
    sled.push(...tube([[sx, y + 0.4, 0.12], [sx, y + 0.4, lift]], '#2f302d', 0.32));
  }
  return item(
    [x + w / 2, y + d / 2],
    0,
    sled,
    render(soft(rect(x, y, w, 1.1), lift, wall, 0.45), colour),
    render(soft(rect(x, y + 1.1, 1.1, d - 1.1), lift, wall, 0.45), colour),
    render(soft(rect(x + 1.1, y + 1.1, w - 2.2, 1.0), lift + 3.6, 4.6, 0.4), inner),
    render(soft(rect(x + 1.1, y + 1.1, w - 2.2, d * 0.5), lift, 3.6, 0.5), inner),
    render(soft(rect(x + w - 1.1, y + 1.1, 1.1, d - 1.1), lift, wall, 0.45), colour),
  );
}

/** One high-backed Vancouver bench of a vis-à-vis, back along x at y0, seat towards +y or -y. */
export function vancouverBench(x: number, y0: number, w: number, towardsY: 1 | -1, colour: string, back = 11): Item {
  const lift = 0.8;
  const inner = mix(colour, '#ffffff', 0.28);
  const backY = towardsY === 1 ? y0 : y0 - 1.1;
  const seatY = towardsY === 1 ? y0 + 1.1 : y0 - 1.1 - 4.4;
  return item(
    [x + w / 2, y0 + towardsY * 2],
    0,
    tube([[x + 0.4, seatY, 0.12], [x + 0.4, seatY + 4.4, 0.12]], '#2f302d', 0.32),
    tube([[x + w - 0.4, seatY, 0.12], [x + w - 0.4, seatY + 4.4, 0.12]], '#2f302d', 0.32),
    towardsY === 1 ? render(soft(rect(x, backY, w, 1.1), lift, back, 0.45), colour) : [],
    render(soft(rect(x, seatY, w, 4.4), lift, 3.6, 0.5), inner),
    towardsY === -1 ? render(soft(rect(x, backY, w, 1.1), lift, back, 0.45), colour) : [],
  );
}

// storage ---------------------------------------------------------------------------------------

/** A mobile tray shelf on castors, its trays facing +y. */
export function trayShelf(x: number, y: number, w: number, d: number, h: number, trays: string[][]): Item {
  const castors = [[x + 0.8, y + 0.8], [x + w - 0.8, y + 0.8], [x + 0.8, y + d - 0.8], [x + w - 0.8, y + d - 0.8]].map(([cx, cy]) =>
    render(lathe(cx, cy, 0, [[0.4, 0], [0.4, 0.6]], 12), '#3a3b38'),
  );
  const carcass = render(extrude(rect(x, y, w, d), 0.6, h), (n) => (n[1] > 0.9 ? '#e9e7e1' : '#f6f5f1'), { edge: '#c9c6bd' });
  const cols = trays[0].length;
  const tw = (w - 0.6) / cols;
  const fronts = trays.flatMap((row, i) =>
    row.map((colour, j) => render(extrude(rect(x + 0.3 + j * tw + 0.15, y + d - 0.2, tw - 0.3, 0.5), 0.6 + 0.6 + i * ((h - 1) / trays.length), (h - 1) / trays.length - 0.5), colour)),
  );
  return item([x + w / 2, y + d / 2], 0, ...castors, carcass, ...fronts);
}

/** A white drum seat. */
export function drum(x: number, y: number, z = 0): Item {
  return item([x, y], z, render(lathe(x, y, z, [[2.4, 0], [2.6, 0.3], [2.6, 3.2], [2.4, 3.6]], 20), '#f6f5f1', { edge: '#c9c6bd' }));
}

export { circle };
