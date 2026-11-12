/**
 * The room arrangements of the learning scenes as 3D furniture lists. Positions follow
 * src/components/whiteboard/art/learning-scenes.ts (decimetres on an 8 × 6.4 m footprint, the
 * board side at y = 0); here they are metres round the room's centre, x across and z away from
 * the board. Pieces with the same `key` are the same piece of furniture in two arrangements:
 * the room moves them instead of swapping them (see learning-room.ts).
 */
import type * as THREE_NS from 'three';
import { COLOURS, Workshop } from './showroom-models';
import { circle, rect, sector, type Pt } from '../components/whiteboard/art/iso';
import { tanoLayout, tanoSeats, type TanoArrangement } from '../lib/tano-layouts';

export type SceneName = 'frontal' | 'uform' | 'gruppen' | 'bewegung' | 'landschaft' | 'rueckzug' | 'boden';

export interface Piece {
  key: string;
  x: number;
  z: number;
  /** height above the floor, for what stands on the floor island */
  y: number;
  /** rotation round the vertical axis */
  turn: number;
  make: (workshop: Workshop) => THREE_NS.Object3D;
}

const PINK = 0xe9b7bd;
const ORANGE = 0xef8a1f;
const ANTHRACITE = 0x3d3e3b;
const { ginster: GINSTER, sky: SKY, royal: ROYAL, red: RED, lime: LIME } = COLOURS;

const dm = 0.1;
const X = (x: number) => (x - 40) * dm;
const Z = (y: number) => (y - 32) * dm;
const piece = (key: string, x: number, y: number, make: Piece['make'], turn = 0, lift = 0): Piece => ({ key, x: X(x), z: Z(y), y: lift * dm, turn, make });

/** A plan outline as a piece: placed at its centroid, with the outline round it in metres. */
const shaped = (key: string, pts: Pt[], make: (outline: [number, number][], workshop: Workshop) => THREE_NS.Object3D): Piece => {
  const cx = pts.reduce((sum, p) => sum + p[0], 0) / pts.length;
  const cy = pts.reduce((sum, p) => sum + p[1], 0) / pts.length;
  const outline = pts.map(([x, y]) => [(x - cx) * dm, (y - cy) * dm] as [number, number]);
  return piece(key, cx, cy, (w) => make(outline, w));
};

/** A chair standing at x y and looking along the plan angle a. */
const chair = (x: number, y: number, a: number, colour: number) =>
  piece(`chair:${colour}`, x, y, (w) => w.pantoSwing(colour), Math.atan2(Math.cos(a), Math.sin(a)));

/** A Tano top whose centroid lies at x y, turned by a plan angle (0 = as the first top of an island). */
const tanoTop = (x: number, y: number, planTurn: number) => piece('tano-top', x, y, (w) => w.tanoTop(), -planTurn);
/** The same nine Tano tops and eighteen chairs move between these three arrangements. */
function tanoArrangement(name: TanoArrangement): Piece[] {
  const colours = [SKY, RED, GINSTER];
  return tanoLayout(name).flatMap((desk) => [
    tanoTop(desk.x, desk.y, desk.turn),
    ...tanoSeats(desk).map((seat) => chair(seat.x, seat.y, seat.angle, colours[seat.colour])),
  ]);
}

function bewegung(): Piece[] {
  const pieces: Piece[] = [];
  const colours = [ROYAL, RED, SKY, LIME, RED, ROYAL];
  const table = (cx: number, cy: number, turn: number, seats: Pt[]) => {
    pieces.push(piece('puzzle', cx, cy, (w) => w.puzzleTable(false), -turn));
    seats.forEach(([x, y], i) => pieces.push(piece(`hokki:${colours[i]}`, x, y, (w) => w.hokki(colours[i]))));
  };
  table(24, 24, 0.25, [[13, 16.5], [24, 14.5], [34, 19], [36.5, 28.5], [24, 33.5], [13.5, 30]]);
  table(50, 44, -0.35, [[39.5, 40], [46, 33.5], [56.5, 33.5], [61.5, 42], [55, 52.5], [43.5, 52]]);
  // a standing table with two tall Hokkis
  pieces.push(piece('standing-table', 64, 16, (w) => w.roundTable(0.4, 1.06)));
  pieces.push(piece('hokki-tall:lime', 58, 19.5, (w) => w.hokki(LIME, true)));
  pieces.push(piece('hokki-tall:royal', 68.5, 20.5, (w) => w.hokki(ROYAL, true)));
  return pieces;
}

function landschaft(): Piece[] {
  const pieces: Piece[] = [];
  const cx = 36;
  const cy = 26;
  // an outer arc of seat elements and an inner arc, as in the catalogue
  for (let k = 0; k < 6; k++) {
    const a0 = 22 + k * 23;
    pieces.push(shaped(`arc-outer:${k}`, sector(cx, cy, 14.5, 19.5, a0, a0 + 22.4), (o, w) => w.softBlock(o, LIME, 0.42)));
  }
  for (let k = 0; k < 4; k++) {
    const a0 = 46 + k * 23;
    pieces.push(shaped(`arc-inner:${k}`, sector(cx, cy, 9.2, 14.2, a0, a0 + 22.4), (o, w) => w.softBlock(o, ANTHRACITE, 0.36)));
  }
  pieces.push(piece('pouf:lime', cx, cy + 4, (w) => w.pouf(LIME)));
  pieces.push(piece('pouf:anthracite', cx - 6.5, cy + 1, (w) => w.pouf(ANTHRACITE, 0.2, 0.38)));
  // a straight row of blocks further back
  [ROYAL, ROYAL, ANTHRACITE].forEach((colour, i) =>
    pieces.push(shaped(`block:${i}`, rect(50 + i * 6.4, 4, 6, 6), (o, w) => w.softBlock(o, colour, 0.42))),
  );
  pieces.push(piece('pouf:lime', 70, 13, (w) => w.pouf(LIME, 0.2, 0.38)));
  return pieces;
}

function rueckzug(): Piece[] {
  const pieces: Piece[] = [];
  pieces.push(piece('booth', 58 + 7, 2 + 5, (w) => w.booth(1.4, 1.0, ROYAL)));
  // a vis-à-vis: two high-backed benches and a table between
  pieces.push(piece('bench:0', 4 + 7, 27, (w) => w.bench(1.4, PINK)));
  pieces.push(piece('desk-wide', 5.5 + 5.5, 34 + 3, (w) => w.desk(1.1, 0.6)));
  pieces.push(piece('bench:1', 4 + 7, 48, (w) => w.bench(1.4, PINK), Math.PI));
  // the rest of the class at their desks, facing the board
  for (const [x, y] of [[26, 12], [37, 12], [48, 12], [31, 27], [42, 27], [53, 27]]) {
    pieces.push(piece('desk', x + 3.5, y + 2.5, (w) => w.desk()));
    pieces.push(chair(x + 3.5, y + 6.3, -Math.PI / 2, GINSTER));
  }
  return pieces;
}

function boden(): Piece[] {
  const pieces: Piece[] = [];
  const cx = 40;
  const cy = 34;
  const on = 0.9;
  const rim = (deg: number, r: number): Pt => [cx + Math.cos((deg * Math.PI) / 180) * r, cy + Math.sin((deg * Math.PI) / 180) * r];
  [GINSTER, ROYAL, LIME, RED, ORANGE, SKY, LIME, ROYAL].forEach((colour, k) =>
    pieces.push(shaped(`ring:${k}`, sector(cx, cy, 5.4, 14, k * 45 + 1.5, k * 45 + 43.5), (o, w) => w.softBlock(o, colour, 0.09, false))),
  );
  pieces.push(shaped('ring-centre', circle(cx, cy, 5, 28), (o, w) => w.softBlock(o, LIME, 0.09, false)));
  pieces.push(piece('drum', cx, cy, (w) => w.drum(), 0, on));
  // back rolls lie along the back of the rim, where one leans against them
  for (const [deg, colour] of [[195, GINSTER], [255, ROYAL]] as const) {
    const [x, y] = rim(deg, 12.2);
    pieces.push(piece(`roll:${colour}`, x, y, (w) => w.backRoll(colour, 0.75), -((deg + 90) * Math.PI) / 180, on));
  }
  const [p1x, p1y] = rim(105, 9.4);
  const [p2x, p2y] = rim(345, 9.4);
  pieces.push(piece('pouf:red', p1x, p1y, (w) => w.pouf(RED, 0.19, 0.36), 0, on));
  pieces.push(piece('pouf:sky', p2x, p2y, (w) => w.pouf(SKY, 0.19, 0.36), 0, on));
  pieces.push(
    piece('tray-shelf', 33 + 7, 11.5 + 2.5, (w) =>
      w.trayShelf(1.4, 0.5, 1.0, [
        [ROYAL, LIME, RED],
        [LIME, RED, ROYAL],
        [RED, ROYAL, LIME],
      ]),
    ),
  );
  pieces.push(shaped('mat:0', rect(57, 27, 10, 7.6), (o, w) => w.softBlock(o, ROYAL, 0.07, false)));
  pieces.push(shaped('mat:1', rect(57, 34.8, 10, 7.6), (o, w) => w.softBlock(o, RED, 0.07, false)));
  return pieces;
}

const builders: Record<SceneName, () => Piece[]> = { frontal: () => tanoArrangement('frontal'), uform: () => tanoArrangement('uform'), gruppen: () => tanoArrangement('gruppen'), bewegung, landschaft, rueckzug, boden };

export const roomScene = (name: SceneName): Piece[] => builders[name]();
