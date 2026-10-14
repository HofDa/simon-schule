/**
 * A small isometric drawing kit for the learning scenes, run at build time.
 * World units are decimetres: x runs along the board side, y into the room, z up.
 * The viewer looks along (1, 1, 1): faces whose normal points that way show.
 * Shapes are meshes of flat faces, lit from above and the left; each piece of furniture
 * becomes one Item, and items are drawn back to front by depth.
 */
export type Pt = [number, number];
export type V3 = [number, number, number];

export interface Shape {
  d: string;
  fill?: string;
  stroke?: string;
  sw?: number;
}

export interface Item {
  depth: number;
  shapes: Shape[];
  /** What the piece is, so a page can move chairs, stools and poufs each in their own way. */
  kind?: string;
  /** CSS custom properties for that motion (e.g. the direction a chair slides in). */
  vars?: Record<string, string>;
}

const C = Math.cos(Math.PI / 6);

/** Project a world point onto the drawing. */
export const P = (x: number, y: number, z: number): Pt => [(x - y) * C, (x + y) * 0.5 - z];
const PV = (v: V3) => P(v[0], v[1], v[2]);

/** One decimal: a centimetre, well under a pixel at the sizes the scenes are shown. */
const r2 = (n: number) => Math.round(n * 10) / 10;
export const poly = (pts: Pt[]) => `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}Z`;
const polyline = (pts: Pt[]) => `M${pts.map(([x, y]) => `${r2(x)} ${r2(y)}`).join('L')}`;

// vectors -----------------------------------------------------------------------------------------

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
/** Newell's normal of a planar polygon, from its winding. */
const normal = (f: V3[]): V3 => {
  const n: V3 = [0, 0, 0];
  f.forEach((a, i) => {
    const b = f[(i + 1) % f.length];
    n[0] += (a[1] - b[1]) * (a[2] + b[2]);
    n[1] += (a[2] - b[2]) * (a[0] + b[0]);
    n[2] += (a[0] - b[0]) * (a[1] + b[1]);
  });
  return unit(n);
};
const VIEW: V3 = [1, 1, 1];
const LIGHT = unit([-0.35, 0.25, 1]);

// colour ------------------------------------------------------------------------------------------

const rgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export const mix = (a: string, b: string, t: number) =>
  `#${rgb(a)
    .map((v, i) => Math.round(v + (rgb(b)[i] - v) * t).toString(16).padStart(2, '0'))
    .join('')}`;

/** Tops come out lightest, faces turned to +x darkest. */
const lit = (hex: string, n: V3) => {
  const f = 0.8 + 0.35 * Math.max(0, dot(n, LIGHT));
  return f >= 1 ? mix(hex, '#ffffff', Math.min(0.4, f - 1)) : mix(hex, '#000000', 1 - f);
};

export type Paint = string | ((n: V3) => string);

export interface Look {
  /** Draw faces turned away too (thin shells). */
  both?: boolean;
  /** Hairline round upward faces, for light surfaces. */
  edge?: string;
}

/** Faces to shapes: cull the hidden ones, shade the rest, back to front. */
export function render(faces: V3[][], paint: Paint, look: Look = {}): Shape[] {
  const out: { depth: number; shape: Shape }[] = [];
  for (const f of faces) {
    let n = normal(f);
    if (dot(n, VIEW) <= 1e-6) {
      if (!look.both) continue;
      n = [-n[0], -n[1], -n[2]];
    }
    const base = typeof paint === 'string' ? paint : paint(n);
    const fill = lit(base, n);
    const edge = look.edge && n[2] > 0.9;
    out.push({
      depth: f.reduce((s, v) => s + v[0] + v[1] + v[2], 0) / f.length,
      // the stroke in the fill colour closes the hairline seams between faces (width set in CSS)
      shape: { d: poly(f.map(PV)), fill, stroke: edge ? look.edge : fill, sw: edge ? 0.2 : undefined },
    });
  }
  return out.sort((a, b) => a.depth - b.depth).map((o) => o.shape);
}

// footprints --------------------------------------------------------------------------------------

export const rect = (x: number, y: number, w: number, d: number): Pt[] => [[x, y], [x + w, y], [x + w, y + d], [x, y + d]];

/** A rectangle w (across) by d (along the facing direction) centred on cx cy, turned by a. */
export const turned = (cx: number, cy: number, w: number, d: number, a: number): Pt[] => {
  const f: Pt = [Math.cos(a), Math.sin(a)];
  const r: Pt = [-f[1], f[0]];
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([u, v]) => [cx + (r[0] * u * w + f[0] * v * d) / 2, cy + (r[1] * u * w + f[1] * v * d) / 2]);
};

export const circle = (cx: number, cy: number, r: number, n = 28): Pt[] =>
  Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return [cx + Math.cos(t) * r, cy + Math.sin(t) * r];
  });

/** An annular sector, for curved benches and floor islands. Angles in degrees. */
export const sector = (cx: number, cy: number, r0: number, r1: number, a0: number, a1: number, n = 6): Pt[] => {
  const arc = (r: number, from: number, to: number) =>
    Array.from({ length: n + 1 }, (_, i) => {
      const t = ((from + ((to - from) * i) / n) * Math.PI) / 180;
      return [cx + Math.cos(t) * r, cy + Math.sin(t) * r] as Pt;
    });
  return [...arc(r1, a0, a1), ...arc(r0, a1, a0)];
};

export const centroid = (pts: Pt[]): Pt => [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];

const ccw = (pts: Pt[]) => {
  let area = 0;
  pts.forEach(([x, y], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    area += x * y2 - x2 * y;
  });
  return area >= 0 ? pts : [...pts].reverse();
};

/** The outline moved inwards by d (mitred corners). */
const inset = (pts: Pt[], d: number): Pt[] => {
  const p = ccw(pts);
  const n = p.length;
  const inward = (a: Pt, b: Pt): Pt => {
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
    return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l];
  };
  return p.map((v, i) => {
    const n1 = inward(p[(i - 1 + n) % n], v);
    const n2 = inward(v, p[(i + 1) % n]);
    const k = d / Math.max(0.3, 1 + n1[0] * n2[0] + n1[1] * n2[1]);
    return [v[0] + (n1[0] + n2[0]) * k, v[1] + (n1[1] + n2[1]) * k];
  });
};

// solids ------------------------------------------------------------------------------------------

/** A vertical prism over a footprint. */
export function extrude(pts: Pt[], z: number, h: number): V3[][] {
  const p = ccw(pts);
  const sides = p.map((a, i) => {
    const b = p[(i + 1) % p.length];
    return [[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], z + h], [a[0], a[1], z + h]] as V3[];
  });
  return [...sides, p.map(([x, y]) => [x, y, z + h] as V3)];
}

/** An upholstered prism: straight sides, a rounded-off top edge. */
export function soft(pts: Pt[], z: number, h: number, bevel = 0.6): V3[][] {
  const p = ccw(pts);
  const q = inset(p, bevel);
  const zb = z + h - bevel * 0.8;
  const zt = z + h;
  const faces: V3[][] = [];
  p.forEach((a, i) => {
    const j = (i + 1) % p.length;
    const b = p[j];
    faces.push([[a[0], a[1], z], [b[0], b[1], z], [b[0], b[1], zb], [a[0], a[1], zb]]);
    faces.push([[a[0], a[1], zb], [b[0], b[1], zb], [q[j][0], q[j][1], zt], [q[i][0], q[i][1], zt]]);
  });
  faces.push(q.map(([x, y]) => [x, y, zt] as V3));
  return faces;
}

/** A turned shape: profile rings [radius, height, petal depth] from the bottom up, capped on top. */
export function lathe(cx: number, cy: number, z: number, profile: [number, number, number?][], n = 18): V3[][] {
  const ring = ([r, h, wave = 0]: [number, number, number?]) =>
    Array.from({ length: n }, (_, k) => {
      const t = (k / n) * Math.PI * 2;
      const rr = r * (1 + wave * Math.cos(6 * t));
      return [cx + Math.cos(t) * rr, cy + Math.sin(t) * rr, z + h] as V3;
    });
  const rings = profile.map(ring);
  const faces: V3[][] = [];
  for (let i = 0; i + 1 < rings.length; i++) {
    for (let k = 0; k < n; k++) {
      const k2 = (k + 1) % n;
      faces.push([rings[i][k], rings[i][k2], rings[i + 1][k2], rings[i + 1][k]]);
    }
  }
  faces.push(rings[rings.length - 1]);
  return faces;
}

/** A cylinder lying on its side, centred on cx cy, resting at height z, its axis turned by a. */
export function roll(cx: number, cy: number, z: number, length: number, r: number, a: number, n = 16): V3[][] {
  const ax: V3 = [Math.cos(a), Math.sin(a), 0];
  const side: V3 = [-ax[1], ax[0], 0];
  const ring = (t: number) =>
    Array.from({ length: n }, (_, k) => {
      const th = (k / n) * Math.PI * 2;
      const c = Math.cos(th) * r;
      return [cx + ax[0] * t + side[0] * c, cy + ax[1] * t + side[1] * c, z + r + Math.sin(th) * r] as V3;
    });
  const a0 = ring(-length / 2);
  const a1 = ring(length / 2);
  const faces: V3[][] = a0.map((_, k) => {
    const k2 = (k + 1) % n;
    return [a0[k], a0[k2], a1[k2], a1[k]];
  });
  return [...faces, a1, [...a0].reverse()];
}

/** A chrome tube along a path of world points. */
export const tube = (pts: V3[], colour = '#a3a8a5', w = 0.42): Shape[] => [
  { d: polyline(pts.map(PV)), stroke: colour, sw: w },
  { d: polyline(pts.map(PV)), stroke: mix(colour, '#ffffff', 0.55), sw: w * 0.3 },
];

/** A flat shape lying in the plane through o spanned by a and b, e.g. a grip hole. */
export const patch = (o: V3, a: V3, b: V3, ra: number, rb: number, fill: string, n = 18): Shape => ({
  d: poly(
    Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2;
      const c = Math.cos(t) * ra;
      const s = Math.sin(t) * rb;
      return PV([o[0] + a[0] * c + b[0] * s, o[1] + a[1] * c + b[1] * s, o[2] + a[2] * c + b[2] * s]);
    }),
  ),
  fill,
});

export const item = (at: Pt, z: number, ...shapes: Shape[][]): Item => ({ depth: at[0] + at[1] + z * 0.02, shapes: shapes.flat() });

/** Tag an item with its kind and motion variables. */
export const tagged = (it: Item, kind: string, vars?: Record<string, string>): Item => ({ ...it, kind, vars });

/** A direction on the floor as a vector on the drawing. */
export const screenDir = (dx: number, dy: number): Pt => [(dx - dy) * C, (dx + dy) * 0.5];
