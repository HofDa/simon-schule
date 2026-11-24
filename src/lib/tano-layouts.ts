/**
 * Real VS Tano (model 01492, 70 × 66/43 cm, 18° slant) plan geometry in decimetres,
 * shared by the isometric SVG drawings, the interactive 3D room and the showroom turntable.
 *
 * Tabletop outline (four-sided right trapezoid, y = 0 at the whiteboard, y+ away from it):
 *   v0 (0, 0)       bottom-left  (90°)  ─┐ edge 0: straight front edge, W = 7.0 dm (70 cm)
 *   v1 (W, 0)       bottom-right (90°)  ─┘ edge 1: short side, D_short = 4.3 dm (43 cm)
 *   v2 (W, -Ds)     top-right   (108°)  ─┐ edge 2: slanted edge, S = W / cos(18°) ≈ 7.36 dm
 *   v3 (0, -Dl)     top-left     (72°)  ─┘ edge 3: long side, D_long = Ds + W·tan(18°) ≈ 6.57 dm
 */
export type PlanPoint = [number, number];
export type TanoArrangement = 'frontal' | 'uform' | 'gruppen' | 'projekt';
/** Which full-width straight edge the student sits at: 0 (front, 70 cm), 2 (slanted, 73.6 cm) or 3 (long side, 65.7 cm). */
export type TanoSeatEdge = 0 | 2 | 3;

export interface TanoDesk {
  x: number;
  y: number;
  turn: number;
  colour: number;
  seatEdge: TanoSeatEdge;
  inverted?: boolean;
}

export const TANO_WIDTH = 7.0;
export const TANO_SHORT = 4.3;
export const TANO_ANGLE = (18 * Math.PI) / 180;
export const TANO_LONG = TANO_SHORT + TANO_WIDTH * Math.tan(TANO_ANGLE); // 6.5744 dm (~66 cm)
export const TANO_SLANT = TANO_WIDTH / Math.cos(TANO_ANGLE); // 7.3602 dm

const raw: PlanPoint[] = [
  [0, 0],
  [TANO_WIDTH, 0],
  [TANO_WIDTH, -TANO_SHORT],
  [0, -TANO_LONG],
];

export const tanoOffset: PlanPoint = raw.reduce<PlanPoint>(
  (c, p) => [c[0] + p[0] / raw.length, c[1] + p[1] / raw.length],
  [0, 0],
);

/** Unshrunk local vertices around centroid, used for exact seam placement. */
const fullOutline: PlanPoint[] = raw.map(([x, y]) => [x - tanoOffset[0], y - tanoOffset[1]]);

/** Slightly inset finished top outline (retains a crisp ~1 cm seam between touching desks). */
export const tanoOutline: PlanPoint[] = fullOutline.map(([x, y]) => [x * 0.985, y * 0.985]);

const rotate = ([x, y]: PlanPoint, a: number): PlanPoint => [
  x * Math.cos(a) - y * Math.sin(a),
  x * Math.sin(a) + y * Math.cos(a),
];

export const tanoPoint = (desk: TanoDesk, point: PlanPoint): PlanPoint => {
  const [x, y] = rotate(point, desk.turn);
  return [desk.x + x, desk.y + y];
};

export const tanoPolygon = (desk: TanoDesk): PlanPoint[] => tanoOutline.map((p) => tanoPoint(desk, p));

const tanoFullPolygon = (desk: TanoDesk): PlanPoint[] => fullOutline.map((p) => tanoPoint(desk, p));

/** Place a Tano desk so its exact unshrunk vertex `vertex` lands on `target` at rotation `turn`. */
function placeByVertex(
  vertex: 0 | 1 | 2 | 3,
  target: PlanPoint,
  turn: number,
  colour: number,
  seatEdge: TanoSeatEdge,
): TanoDesk {
  const [rx, ry] = rotate(fullOutline[vertex], turn);
  return { x: target[0] - rx, y: target[1] - ry, turn, colour, seatEdge };
}

/** Match complete edges in reverse order, so two tops lie on opposite sides of a flush seam. */
export function joinTano(
  previous: TanoDesk,
  edge: number,
  nextEdge: number,
  colour = previous.colour,
  seatEdge: TanoSeatEdge = previous.seatEdge,
): TanoDesk {
  const polygon = tanoPolygon(previous);
  const a = polygon[edge];
  const b = polygon[(edge + 1) % polygon.length];
  const c = tanoOutline[nextEdge];
  const d = tanoOutline[(nextEdge + 1) % tanoOutline.length];
  if (Math.abs(Math.hypot(b[0] - a[0], b[1] - a[1]) - Math.hypot(d[0] - c[0], d[1] - c[1])) > 1e-8) {
    throw new Error('Tano joins require edges of equal length');
  }
  const turn = Math.atan2(a[1] - b[1], a[0] - b[0]) - Math.atan2(d[1] - c[1], d[0] - c[0]);
  const [dx, dy] = rotate(c, turn);
  const inverted = edge === nextEdge ? !previous.inverted : Boolean(previous.inverted);
  return { x: b[0] - dx, y: b[1] - dy, turn, colour, seatEdge, inverted };
}

/**
 * One PantoSwing chair per Tano top, centred along its chosen full-width straight seating edge
 * (never at a corner point), facing straight across the desk.
 */
export function tanoSeats(desk: TanoDesk) {
  const polygon = tanoFullPolygon(desk);
  const e = desk.seatEdge;
  const a = polygon[e];
  const b = polygon[(e + 1) % polygon.length];
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const ux = (b[0] - a[0]) / length;
  const uy = (b[1] - a[1]) / length;
  // Outward normal for the (v0 -> v1 -> v2 -> v3) winding order in plan coordinates: (-uy, ux).
  const nx = -uy;
  const ny = ux;
  return [
    {
      x: (a[0] + b[0]) / 2 + 2.55 * nx,
      y: (a[1] + b[1]) / 2 + 2.55 * ny,
      angle: Math.atan2(-ny, -nx),
      colour: desk.colour,
    },
  ];
}

/**
 * Official VS Tano 4-desk pinwheel island (Configuration B, ~140 × 140 cm):
 * four desks rotated by 0°, 90°, 180°, 270° around a tiny 4.3 cm central aperture,
 * leaving all four 73.6 cm straight slanted edges on the outside for four students.
 */
export function tanoPinwheel(cx: number, cy: number, turnOffset: number, colours: [number, number, number, number]): TanoDesk[] {
  const h = (TANO_WIDTH - TANO_LONG) / 2;
  return [0, 1, 2, 3].map((k) => {
    const turn = k * (Math.PI / 2) + turnOffset;
    const [rx, ry] = rotate([-h, -h], turn);
    return placeByVertex(0, [cx + rx, cy + ry], turn, colours[k], 2);
  });
}

/**
 * Six-desk rectangular Tano project/conference block (reference row 4, col 1):
 * three slanted-seam pairs (row 1, col 5) placed side by side into one 210 × 109 cm table
 * seating six students (three across from three).
 */
export function tanoProjectBlock(cx: number, cy: number, turnOffset: number): TanoDesk[] {
  const halfDepth = (TANO_LONG + TANO_SHORT) / 2;
  const local: TanoDesk[] = [-1.5 * TANO_WIDTH, -0.5 * TANO_WIDTH, 0.5 * TANO_WIDTH].flatMap((ox, col) => [
    placeByVertex(0, [ox, halfDepth], 0, col, 0),
    placeByVertex(0, [ox + TANO_WIDTH, -halfDepth], Math.PI, col, 0),
  ]);
  return local.map((d) => {
    const [rx, ry] = rotate([d.x, d.y], turnOffset);
    return { ...d, x: cx + rx, y: cy + ry, turn: d.turn + turnOffset };
  });
}

const deg = (degrees: number) => (degrees * Math.PI) / 180;

export function tanoLayout(name: TanoArrangement): TanoDesk[] {
  if (name === 'frontal') {
    // Three rows of two side-by-side Tano twin pairs (sawtooth back, dead-straight 140 cm front line),
    // keeping a generous central aisle and clear walkways behind every row of chairs.
    return [14.5, 32.5, 50.5].flatMap((rowY, colour) => [
      placeByVertex(0, [18.5, rowY], 0, colour, 0),
      placeByVertex(0, [18.5 + TANO_WIDTH, rowY], 0, colour, 0),
      placeByVertex(0, [47.5, rowY], 0, colour, 0),
      placeByVertex(0, [47.5 + TANO_WIDTH, rowY], 0, colour, 0),
    ]);
  }

  if (name === 'uform') {
    // Twelve Tano tops locked along their exact 18° seams (12/20 of the signature 20-desk ring),
    // forming one continuous curved horseshoe open towards the whiteboard; every student sits on
    // the straight 65.7 cm outer edge looking into the open centre.
    const rIn = TANO_SHORT / Math.tan(TANO_ANGLE);
    const rOut = rIn + TANO_WIDTH;
    const cx = 40;
    const cy = 22.5;
    // Order left-to-right from the front-left opening (+180°) round the back (+90°) to front-right (-18°).
    return Array.from({ length: 12 }, (_, idx) => {
      const k = 11 - idx;
      const ang = deg(-18 + k * 18);
      const colour = idx < 4 ? 0 : idx < 8 ? 2 : 1;
      return placeByVertex(
        0,
        [cx + rOut * Math.cos(ang), cy + rOut * Math.sin(ang)],
        ang + Math.PI,
        colour,
        3,
      );
    });
  }

  if (name === 'projekt') {
    // Two large 6-desk workshop/project tables (reference row 4, col 1), gently angled towards
    // the whiteboard so both six-student teams have clear sightlines and a generous shared surface.
    return [
      ...tanoProjectBlock(23.5, 31.5, deg(-14)),
      ...tanoProjectBlock(56.5, 31.5, deg(14)),
    ];
  }

  // Gruppen: three 4-desk VS Tano pinwheel islands (Configuration B), seating 4 children per island
  // and keeping the same 4 sky + 4 red + 4 ginster chairs across the room.
  return [
    ...tanoPinwheel(21, 19.5, deg(10), [0, 0, 0, 0]),
    ...tanoPinwheel(59, 19.5, deg(-10), [1, 1, 1, 1]),
    ...tanoPinwheel(40, 46.5, 0, [2, 2, 2, 2]),
  ];
}
