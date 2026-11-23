/** Tano plan geometry in decimetres, shared by the SVG drawings and the 3D room. */
export type PlanPoint = [number, number];
export type TanoArrangement = 'frontal' | 'uform' | 'gruppen';
export interface TanoDesk {
  x: number;
  y: number;
  turn: number;
  colour: number;
  inverted?: boolean;
}

const R = 7.6;
const at = (angle: number, radius: number): PlanPoint => [Math.cos(angle) * radius, Math.sin(angle) * radius];
const raw: PlanPoint[] = [[0, 0], at(Math.PI / 3, R * Math.sqrt(3) / 2), at(Math.PI / 2, R), at(5 * Math.PI / 6, R), at(Math.PI, R * Math.sqrt(3) / 2)];
export const tanoOffset = raw.reduce<PlanPoint>((c, p) => [c[0] + p[0] / raw.length, c[1] + p[1] / raw.length], [0, 0]);
// Retain the catalogue island's small seam. Connected layouts join these finished edges.
export const tanoOutline: PlanPoint[] = raw.map(([x, y]) => [(x - tanoOffset[0]) * 0.97, (y - tanoOffset[1]) * 0.97]);
const rotate = ([x, y]: PlanPoint, a: number): PlanPoint => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
export const tanoPoint = (desk: TanoDesk, point: PlanPoint): PlanPoint => {
  const [x, y] = rotate(point, desk.turn);
  return [desk.x + x, desk.y + y];
};
export const tanoPolygon = (desk: TanoDesk): PlanPoint[] => tanoOutline.map((p) => tanoPoint(desk, p));

/** Match complete edges in reverse order, so the two tops lie on opposite sides of the seam. */
export function joinTano(previous: TanoDesk, edge: number, nextEdge: number, colour = previous.colour): TanoDesk {
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
  return { x: b[0] - dx, y: b[1] - dy, turn, colour, inverted };
}

/**
 * One seat per Tano top, always at its long outer edge (2–3), the student facing the top's apex.
 * Never at the apex itself: a child sitting there would have the point of the table in their stomach.
 */
export function tanoSeats(desk: TanoDesk) {
  const polygon = tanoPolygon(desk);
  const [a, b] = [polygon[2], polygon[3]];
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const dx = (b[0] - a[0]) / length;
  const dy = (b[1] - a[1]) / length;
  return [
    {
      x: (a[0] + b[0]) / 2 + 2.45 * dy,
      y: (a[1] + b[1]) / 2 - 2.45 * dx,
      angle: Math.atan2(dx, -dy),
      colour: desk.colour,
    },
  ];
}

/** A top turned so that the student at its long edge looks along the plan angle `facing`. */
const facingTop = (x: number, y: number, facing: number, colour: number): TanoDesk => ({ x, y, turn: facing + Math.PI / 3, colour });
const toBoard = -Math.PI / 2;
const deg = (degrees: number) => (degrees * Math.PI) / 180;

/**
 * Chain Tano tops side by side along their outer corner seam (vertex 1 of each top to vertex 4
 * of the next) so a U-form reads as one continuous horseshoe while every student stays on a long edge.
 */
function chainTano(facings: number[], colours: number[], gap: number, topY: number): TanoDesk[] {
  const desks: TanoDesk[] = [facingTop(0, 0, facings[0], colours[0])];
  for (let i = 1; i < facings.length; i++) {
    const previous = desks[i - 1];
    const previousPolygon = tanoPolygon(previous);
    const nextTurn = facings[i] + Math.PI / 3;
    const nextCorner = rotate(tanoOutline[4], nextTurn);
    const prevTangent = previous.turn - Math.PI / 3 + Math.PI / 2;
    const nextTangent = facings[i] + Math.PI / 2;
    const tx = Math.cos(prevTangent) + Math.cos(nextTangent);
    const ty = Math.sin(prevTangent) + Math.sin(nextTangent);
    const tLength = Math.hypot(tx, ty) || 1;
    desks.push({
      x: previousPolygon[1][0] - nextCorner[0] + (tx / tLength) * gap,
      y: previousPolygon[1][1] - nextCorner[1] + (ty / tLength) * gap,
      turn: nextTurn,
      colour: colours[i],
    });
  }
  const points = desks.flatMap(tanoPolygon);
  const centreX = (Math.min(...points.map(([x]) => x)) + Math.max(...points.map(([x]) => x))) / 2;
  const minY = Math.min(...points.map(([, y]) => y));
  return desks.map((desk) => ({ ...desk, x: desk.x - centreX + 40, y: desk.y - minY + topY }));
}

export function tanoLayout(name: TanoArrangement): TanoDesk[] {
  if (name === 'frontal') {
    // Three rows of two closely paired double desks, a clear central aisle and row aisles between.
    return [13.5, 31.5, 49.5].flatMap((y, colour) => [17.3, 28.65, 51.35, 62.7].map((x) => facingTop(x, y, toBoard, colour)));
  }
  if (name === 'uform') {
    // Twelve Tano tops chained into one continuous horseshoe with gently turned corners;
    // every student sits at the outer long edge looking into the open centre towards the board.
    return chainTano(
      [0, 0, 0, -30, -60, -90, -90, -120, -150, -180, -180, -180].map(deg),
      [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2],
      0.22,
      4.6,
    );
  }
  // Four three-desk Tano islands, mirror-symmetric across the room, keeping the same 4+4+4 chair colours.
  return ([
    [21, 18, 0],
    [59, 18, Math.PI / 3],
    [21, 46, 0],
    [59, 46, Math.PI / 3],
  ] as const).flatMap(([x, y, offsetTurn], island) =>
    [0, 1, 2].map((k) => {
      const turn = k * (2 * Math.PI / 3) + offsetTurn;
      const [dx, dy] = rotate(tanoOffset, turn);
      return { x: x + dx, y: y + dy, turn, colour: (k + island) % 3 };
    }),
  );
}
