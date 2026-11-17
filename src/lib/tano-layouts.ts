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

/** One seat per Tano top on the student side; inverted tops in connected runs seat behind their outer apex facing the board. */
export function tanoSeats(desk: TanoDesk) {
  const polygon = tanoPolygon(desk);
  const [a, b] = [polygon[2], polygon[3]];
  const length = Math.hypot(b[0] - a[0], b[1] - a[1]);
  const dx = (b[0] - a[0]) / length;
  const dy = (b[1] - a[1]) / length;
  const angle = Math.atan2(dx, -dy);
  if (desk.inverted || Math.sin(angle) > 0.9) {
    return [
      {
        x: polygon[0][0] - 2.7 * dy,
        y: polygon[0][1] + 2.7 * dx,
        angle: Math.atan2(-dx, dy),
        colour: desk.colour,
      },
    ];
  }
  return [
    {
      x: (a[0] + b[0]) / 2 + 2.7 * dy,
      y: (a[1] + b[1]) / 2 - 2.7 * dx,
      angle,
      colour: desk.colour,
    },
  ];
}

export function tanoLayout(name: TanoArrangement): TanoDesk[] {
  if (name === 'frontal') {
    const tilt = -0.08;
    return [15, 33.5, 52].flatMap((y, colour) => {
      const first: TanoDesk = { x: 30.785, y, turn: -Math.PI / 6 + tilt, colour };
      const second = joinTano(first, 1, 1);
      const row = [first, second, joinTano(second, 3, 3)];
      const xs = row.flatMap(tanoPolygon).map(([x]) => x);
      const shift = 40 - (Math.min(...xs) + Math.max(...xs)) / 2;
      return row.map((desk) => ({ ...desk, x: desk.x + shift }));
    });
  }
  if (name === 'uform') {
    const desks: TanoDesk[] = [{ x: 14, y: 22, turn: (7 * Math.PI) / 6, colour: 0, inverted: true }];
    // Three 3-desk arms ([3, 3], [1, 1]) joined by [3, 1] corners form a symmetric horseshoe open to the board.
    const seams = [[3, 3], [1, 1], [3, 1], [3, 3], [1, 1], [3, 1], [3, 3], [1, 1]];
    seams.forEach(([edge, nextEdge], i) => desks.push(joinTano(desks[desks.length - 1], edge, nextEdge, Math.floor((i + 1) / 3))));
    const xs = desks.flatMap(tanoPolygon).map(([x]) => x);
    const shift = 40 - (Math.min(...xs) + Math.max(...xs)) / 2;
    return desks.map((desk) => ({ ...desk, x: desk.x + shift }));
  }
  return [[20, 22], [54, 20], [38, 48]].flatMap(([x, y], colour) =>
    [0, 1, 2].map((k) => {
      const turn = k * 2 * Math.PI / 3;
      const [dx, dy] = rotate(tanoOffset, turn);
      return { x: x + dx, y: y + dy, turn, colour };
    }),
  );
}
