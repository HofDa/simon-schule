/**
 * 3D VS furniture for the showroom, built procedurally with three.js. Proportions and colours
 * follow src/components/whiteboard/art/vs-models.ts (Basiskatalog Schule 2026), which works in
 * decimetres with u forward, v across and z up; here 1 unit = 1 m, x = v, y = z, z = u.
 */
import type * as THREE_NS from 'three';
import { tanoOutline, tanoOffset } from '../lib/tano-layouts';

type Three = typeof THREE_NS;
type V3 = [number, number, number];

export type PieceId = 'pantoswing' | 'hokki' | 'tano' | 'puzzle';

export const COLOURS = {
  ginster: 0xe2a300,
  sky: 0x8cc3e6,
  royal: 0x3b5bd6,
  red: 0xc8283b,
  lime: 0x9bd317,
  steel: 0xa3a8a5,
  glide: 0x3a3b38,
  greyLeg: 0xb4b8b6,
  anthraciteLeg: 0x4b4d4a,
  pad: 0x6b6e6b,
  beech: 0xdec196,
  beechEdge: 0xc4a273,
  tray: 0x9cc6dc,
  white: 0xf6f5f1,
  whiteEdge: 0x8e918d,
};

const dm = 0.1;

/** Shared materials and geometries, so islands with six chairs stay cheap. */
export class Workshop {
  private materials = new Map<string, THREE_NS.Material>();
  private shellGeometry?: THREE_NS.BufferGeometry;

  constructor(private THREE: Three) {}

  material(colour: number, kind: 'plastic' | 'metal' | 'wood' | 'soft' = 'plastic'): THREE_NS.Material {
    const key = `${colour}-${kind}`;
    let m = this.materials.get(key);
    if (!m) {
      const { THREE } = this;
      const props = {
        plastic: { roughness: 0.42, metalness: 0 },
        metal: { roughness: 0.3, metalness: 0.75 },
        wood: { roughness: 0.7, metalness: 0 },
        soft: { roughness: 0.9, metalness: 0 },
      }[kind];
      m = new THREE.MeshStandardMaterial({ color: colour, side: THREE.DoubleSide, ...props });
      this.materials.set(key, m);
    }
    return m;
  }

  mesh(geometry: THREE_NS.BufferGeometry, material: THREE_NS.Material): THREE_NS.Mesh {
    const mesh = new this.THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  /** A tube along straight segments with rounded bends. */
  bentTube(points: V3[], radius: number, bend = 0.035): THREE_NS.BufferGeometry {
    const { THREE } = this;
    const v = points.map((p) => new THREE.Vector3(...p));
    const path = new THREE.CurvePath<THREE_NS.Vector3>();
    let from = v[0];
    for (let i = 1; i < v.length - 1; i++) {
      const inDir = v[i].clone().sub(v[i - 1]);
      const outDir = v[i + 1].clone().sub(v[i]);
      const r = Math.min(bend, inDir.length() / 2, outDir.length() / 2);
      const a = v[i].clone().sub(inDir.normalize().multiplyScalar(r));
      const b = v[i].clone().add(outDir.normalize().multiplyScalar(r));
      path.add(new THREE.LineCurve3(from, a));
      path.add(new THREE.QuadraticBezierCurve3(a, v[i], b));
      from = b;
    }
    path.add(new THREE.LineCurve3(from, v[v.length - 1]));
    return new THREE.TubeGeometry(path as unknown as THREE_NS.Curve<THREE_NS.Vector3>, Math.max(16, v.length * 24), radius, 12, false);
  }

  /** A plan outline (x, z in metres, mapped straight to three's x and z) extruded upwards from y0 by height. */
  slab(outline: [number, number][], y0: number, height: number, bevel = 0): THREE_NS.BufferGeometry {
    const { THREE } = this;
    const shape = new THREE.Shape(outline.map(([x, z]) => new THREE.Vector2(x, -z)));
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth: height - bevel * 2,
      bevelEnabled: bevel > 0,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 3,
      curveSegments: 4,
    });
    geometry.rotateX(-Math.PI / 2);
    geometry.translate(0, y0 + bevel, 0);
    return geometry;
  }

  // PantoSwing-LuPo -----------------------------------------------------------------------------

  /** Shell rows from the front lip to the top of the back: [u (forward), z, width] in dm. */
  private static SHELL: V3[] = [
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

  private pantoSwingShell(): THREE_NS.BufferGeometry {
    if (this.shellGeometry) return this.shellGeometry;
    const { THREE } = this;
    const rows = Workshop.SHELL;
    const curve = new THREE.CatmullRomCurve3(rows.map(([u, z]) => new THREE.Vector3(0, z * dm, u * dm)), false, 'centripetal');
    // half widths on a spline with the same parameter as the profile, so the waist is one smooth curve
    const widths = new THREE.CatmullRomCurve3(rows.map(([, , w]) => new THREE.Vector3((w / 2) * dm, 0, 0)), false, 'centripetal');
    const widthAt = (t: number) => widths.getPoint(Math.min(1, Math.max(0, t))).x;
    // the grip hole between the 10th and 11th rows
    const holeT = 9.5 / (rows.length - 1);
    const holeHalfT = 0.42 / (rows.length - 1);
    const holeHalfX = 0.055;

    const U = 160;
    const V = 48;
    const thickness = 0.011;
    const positions: number[] = [];
    const index: number[] = [];
    const row = V + 1;

    /** Faces whose centre lies inside the grip hole are left out. */
    const inHole = (i: number, j: number) => {
      const t = (i + 0.5) / U;
      const x = (((j + 0.5) / V) * 2 - 1) * widthAt(t);
      return ((t - holeT) / holeHalfT) ** 2 + (x / holeHalfX) ** 2 < 1;
    };
    /** A vertex on the hole's edge: among its four faces some are cut out and some kept. */
    const onHoleEdge = (i: number, j: number) => {
      const around = [inHole(i - 1, j - 1), inHole(i - 1, j), inHole(i, j - 1), inHole(i, j)];
      return around.some(Boolean) && !around.every(Boolean);
    };

    const layer = (offset: number) => {
      const start = positions.length / 3;
      for (let i = 0; i <= U; i++) {
        const ti = i / U;
        for (let j = 0; j <= V; j++) {
          let t = ti;
          let s = (j / V) * 2 - 1;
          // the hole's edge vertices are moved onto the ellipse, so the hole reads round, not stepped
          if (onHoleEdge(i, j)) {
            const ht = (t - holeT) / holeHalfT;
            const hx = (s * widthAt(t)) / holeHalfX;
            const e = Math.hypot(ht, hx) || 1;
            t = holeT + (ht / e) * holeHalfT;
            s = ((hx / e) * holeHalfX) / widthAt(t);
          }
          const p = curve.getPoint(t);
          const tan = curve.getTangent(t);
          const n = new THREE.Vector3(0, tan.z, -tan.y).normalize();
          const hw = widthAt(t);
          // the seat is dished a little, the back wrapped round the sitter
          const back = Math.min(1, Math.max(0, (t - 0.38) / 0.12));
          const wrap = 0.012 + back * 0.026;
          // no dish on the rolled front lip, where it would push the corners out as ears
          const lip = Math.min(1, Math.max(0, (t - 0.06) / 0.08));
          const cup = wrap * s * s * lip;
          positions.push(s * hw, p.y + n.y * (cup + offset), p.z + n.z * (cup + offset));
        }
      }
      return start;
    };
    const top = layer(0);
    const bottom = layer(-thickness);
    const quad = (a: number, b: number, c: number, d: number, flip: boolean) =>
      flip ? index.push(a, c, b, b, c, d) : index.push(a, b, c, b, d, c);

    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const a = i * row + j;
        if (inHole(i, j)) {
          // close the hole's wall where a face borders a kept face
          const walls: [number, number, boolean][] = [];
          if (j > 0 && !inHole(i, j - 1)) walls.push([a, a + row, false]);
          if (j < V - 1 && !inHole(i, j + 1)) walls.push([a + 1, a + 1 + row, true]);
          if (!inHole(i - 1, j)) walls.push([a, a + 1, true]);
          if (!inHole(i + 1, j)) walls.push([a + row, a + row + 1, false]);
          for (const [p, q, flip] of walls) quad(top + p, top + q, bottom + p, bottom + q, flip);
          continue;
        }
        quad(top + a, top + a + 1, top + a + row, top + a + row + 1, false);
        quad(bottom + a, bottom + a + 1, bottom + a + row, bottom + a + row + 1, true);
      }
    }
    for (let i = 0; i < U; i++) {
      for (const j of [0, V]) {
        const a = i * row + j;
        quad(top + a, top + a + row, bottom + a, bottom + a + row, j === V);
      }
    }
    for (const i of [0, U]) {
      for (let j = 0; j < V; j++) {
        const a = i * row + j;
        quad(top + a, top + a + 1, bottom + a, bottom + a + 1, i === 0);
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setIndex(index);
    geometry.computeVertexNormals();
    this.shellGeometry = geometry;
    return geometry;
  }

  /** A PantoSwing-LuPo: one-piece shell on a Z-shaped chrome cantilever, facing +z. */
  pantoSwing(colour: number): THREE_NS.Group {
    const { THREE } = this;
    const chair = new THREE.Group();
    chair.add(this.mesh(this.pantoSwingShell(), this.material(colour)));
    const steel = this.material(COLOURS.steel, 'metal');
    const glide = this.material(COLOURS.glide, 'soft');
    const r = 0.011;
    const at = (u: number, v: number, z: number): V3 => [v * dm, z * dm, u * dm];
    for (const s of [-1, 1]) {
      const v = s * 1.7;
      // seat rail forward, the diagonal back down to the floor, the runner forward again
      chair.add(this.mesh(this.bentTube([at(-0.9, v, 4.2), at(1.15, v, 4.2), at(-1.45, v, 0.28), at(1.85, v, 0.28)], r, 0.05), steel));
      for (const [u0, u1] of [[-1.55, -1.2], [1.55, 1.9]]) {
        chair.add(this.mesh(this.bentTube([at(u0, v, 0.12), at(u1, v, 0.12)], 0.012), glide));
      }
    }
    chair.add(this.mesh(this.bentTube([at(-1.45, -1.7, 0.28), at(-1.45, 1.7, 0.28)], r), steel));
    chair.add(this.mesh(this.bentTube([at(-0.6, -1.7, 4.2), at(-0.6, 1.7, 4.2)], r), steel));
    return chair;
  }

  // Hokki ---------------------------------------------------------------------------------------

  /** A Hokki wobble stool: bell-shaped body, slim neck, petalled seat rim, grey pad. */
  hokki(colour: number, tall = false): THREE_NS.Group {
    const { THREE } = this;
    const k = tall ? 1.55 : 1;
    const profile: [number, number][] = [
      [0.01, 0],
      [1.5, 0],
      [1.62, 0.22],
      [1.5, 0.6],
      [1.12, 1.6 * k],
      [0.82, 2.8 * k],
      [0.72, 3.5 * k],
      [0.8, 3.85 * k],
      [1.25, 4.12 * k],
      [1.62, 4.38 * k],
      [1.5, 4.5 * k],
      [0.01, 4.5 * k],
    ];
    const smooth = new THREE.SplineCurve(profile.map(([r, h]) => new THREE.Vector2(r * dm, h * dm))).getPoints(80);
    const body = new THREE.LatheGeometry(smooth, 72);
    // six soft petals round the seat rim
    const pos = body.attributes.position;
    const seatFrom = 3.9 * k * dm;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      if (y < seatFrom) continue;
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const a = Math.atan2(z, x);
      const blend = Math.min(1, (y - seatFrom) / (0.3 * dm));
      const f = 1 + 0.06 * blend * Math.cos(6 * a);
      pos.setXYZ(i, x * f, y, z * f);
    }
    body.computeVertexNormals();
    const stool = new THREE.Group();
    stool.add(this.mesh(body, this.material(colour)));
    const pad = this.mesh(new THREE.CylinderGeometry(1.05 * dm, 1.05 * dm, 0.012, 48), this.material(COLOURS.pad, 'soft'));
    pad.position.y = 4.5 * k * dm + 0.004;
    stool.add(pad);
    return stool;
  }

  // tables --------------------------------------------------------------------------------------

  /** Tano: three five-sided beech tops forming an island, square grey legs, blue trays; six PantoSwings round it. */
  tanoIsland(chairColour: number, chairs = true): THREE_NS.Group {
    const { THREE } = this;
    const island = new THREE.Group();
    const R = 7.6 * dm;
    const height = 7.3 * dm;
    const at = (deg: number, r: number): [number, number] => [Math.cos((deg * Math.PI) / 180) * r, Math.sin((deg * Math.PI) / 180) * r];
    const vertex = (k: number) => at(60 * k + 30, R);
    const middle = (k: number) => at(60 * k + 60, R * 0.866);
    const centroid = (pts: [number, number][]) =>
      pts.reduce(([sx, sy], [x, y]) => [sx + x / pts.length, sy + y / pts.length], [0, 0]) as [number, number];
    const towards = ([x, y]: [number, number], [cx, cy]: [number, number], t: number): [number, number] => [x + (cx - x) * t, y + (cy - y) * t];

    const beech = this.material(COLOURS.beech, 'wood');
    const legMat = this.material(COLOURS.greyLeg, 'metal');
    const trayMat = this.material(COLOURS.tray);
    for (let k = 0; k < 3; k++) {
      const raw: [number, number][] = [[0, 0], middle(2 * k), vertex(2 * k + 1), vertex(2 * k + 2), middle(2 * k + 2)];
      const c = centroid(raw);
      const top = raw.map((p) => towards(p, c, 0.03));
      island.add(this.mesh(this.slab(top, height - 0.03, 0.03, 0.004), beech));
      for (const corner of top.slice(1)) {
        const [lx, lz] = towards(corner, c, 0.1);
        const leg = this.mesh(new THREE.BoxGeometry(0.036, height - 0.03, 0.036), legMat);
        leg.position.set(lx, (height - 0.03) / 2, lz);
        island.add(leg);
      }
      const [tx, tz] = at(120 * k + 120, R * 0.55);
      const tray = this.mesh(new THREE.BoxGeometry(0.28, 0.09, 0.24), trayMat);
      tray.position.set(tx, height - 0.125 + 0.045, tz);
      tray.rotation.y = -((120 * k + 120) * Math.PI) / 180;
      island.add(tray);
    }
    if (chairs) for (let k = 0; k < 6; k++) {
      const t = (60 * k * Math.PI) / 180;
      const dist = R * 0.866 + 0.24;
      const chair = this.pantoSwing(chairColour);
      chair.position.set(Math.cos(t) * dist, 0, Math.sin(t) * dist);
      // seat faces the island's centre
      chair.rotation.y = Math.atan2(-Math.cos(t), -Math.sin(t));
      island.add(chair);
    }
    return island;
  }

  /** Puzzle: a white free-form top with a grey edge on splayed anthracite legs, six Hokkis round it. */
  puzzleTable(stools = true): THREE_NS.Group {
    const { THREE } = this;
    const group = new THREE.Group();
    const height = 7.3 * dm;
    const rx = 11 * dm;
    const ry = 5.4 * dm;
    const outline: [number, number][] = Array.from({ length: 64 }, (_, i) => {
      const t = (i / 64) * Math.PI * 2;
      const r = 1 + 0.17 * Math.sin(3 * t + 0.6) + 0.08 * Math.cos(2 * t);
      return [Math.cos(t) * rx * r, Math.sin(t) * ry * r];
    });
    const top = new THREE.Mesh(this.slab(outline, height - 0.03, 0.03, 0.004), [
      this.material(COLOURS.white, 'wood'),
      this.material(COLOURS.whiteEdge, 'wood'),
    ]);
    top.castShadow = true;
    top.receiveShadow = true;
    group.add(top);

    const legMat = this.material(COLOURS.anthraciteLeg, 'metal');
    for (const [fx, fz] of [[-8, -2.6], [7.5, -2.8], [-7, 3], [8, 2.6]] as [number, number][]) {
      const foot: V3 = [fx * dm * 1.06, 0, fz * dm * 1.06];
      const under: V3 = [fx * dm * 0.82, height - 0.03, fz * dm * 0.82];
      group.add(this.mesh(this.bentTube([under, foot], 0.018), legMat));
    }

    // seats from the catalogue scene, relative to the table's centre and turn
    const turn = 0.25;
    const seats: [number, number][] = [[13, 16.5], [24, 14.5], [34, 19], [36.5, 28.5], [24, 33.5], [13.5, 30]];
    const colours = [COLOURS.royal, COLOURS.red, COLOURS.sky, COLOURS.lime, COLOURS.red, COLOURS.royal];
    if (stools) seats.forEach(([sx, sy], i) => {
      const x = sx - 24;
      const y = sy - 24;
      const px = x * Math.cos(-turn) - y * Math.sin(-turn);
      const py = x * Math.sin(-turn) + y * Math.cos(-turn);
      const stool = this.hokki(colours[i]);
      stool.position.set(px * dm, 0, py * dm);
      group.add(stool);
    });
    return group;
  }

  /**
   * One five-sided Tano top with its legs and tray, round its own centroid. Three of them, turned
   * by 0°, 120° and 240° round the island's centre, form an island; `tanoTopOffset` is where the
   * centroid lies from that centre.
   */
  static tanoTopOutline(): { outline: [number, number][]; offset: [number, number] } {
    return {
      outline: tanoOutline.map(([x, y]) => [x * dm, y * dm]),
      offset: [tanoOffset[0] * dm, tanoOffset[1] * dm],
    };
  }

  tanoTop(): THREE_NS.Group {
    const { THREE } = this;
    const group = new THREE.Group();
    const height = 7.2 * dm;
    const { outline, offset } = Workshop.tanoTopOutline();
    group.add(this.mesh(this.slab(outline, height - 0.03, 0.03), this.material(COLOURS.beech, 'wood')));
    const legMat = this.material(COLOURS.greyLeg, 'metal');
    for (const [x, z] of outline.slice(1)) {
      const leg = this.mesh(new THREE.BoxGeometry(0.036, height - 0.03, 0.036), legMat);
      leg.position.set(x * 0.9, (height - 0.03) / 2, z * 0.9);
      group.add(leg);
    }
    const R = 7.6 * dm;
    const tray = this.mesh(new THREE.BoxGeometry(0.28, 0.09, 0.24), this.material(COLOURS.tray));
    tray.position.set(Math.cos((2 * Math.PI) / 3) * R * 0.55 - offset[0], height - 0.125 + 0.045, Math.sin((2 * Math.PI) / 3) * R * 0.55 - offset[1]);
    tray.rotation.y = -(2 * Math.PI) / 3;
    group.add(tray);
    return group;
  }

  // room furniture (learning-room.ts) ----------------------------------------------------------
  // Simple upholstered and storage pieces for the room scenes, each centred on its own origin.

  private tint(colour: number, amount: number): number {
    const { THREE } = this;
    return new THREE.Color(colour).lerp(new THREE.Color(0xffffff), amount).getHex();
  }

  private box(w: number, h: number, d: number, x: number, y: number, z: number, material: THREE_NS.Material): THREE_NS.Mesh {
    const mesh = this.mesh(new this.THREE.BoxGeometry(w, h, d), material);
    mesh.position.set(x, y + h / 2, z);
    return mesh;
  }

  /** An upholstered element over a plan outline (metres, round its own centre), on a dark plinth if it is a seat. */
  softBlock(outline: [number, number][], colour: number, height: number, plinth = true): THREE_NS.Group {
    const group = new this.THREE.Group();
    const base = plinth ? 0.035 : 0;
    if (plinth) group.add(this.mesh(this.slab(outline.map(([x, z]) => [x * 0.9, z * 0.9]), 0, base), this.material(0x2f302d)));
    group.add(this.mesh(this.slab(outline, base, height - base, Math.min(0.025, height / 3)), this.material(colour, 'soft')));
    return group;
  }

  private turnedProfile(profile: [number, number][], material: THREE_NS.Material): THREE_NS.Mesh {
    const { THREE } = this;
    return this.mesh(new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), 40), material);
  }

  /** A round Shift+ pouf. */
  pouf(colour: number, r = 0.22, h = 0.42): THREE_NS.Group {
    const group = new this.THREE.Group();
    group.add(this.turnedProfile([[0, 0], [r * 0.8, 0], [r * 0.8, 0.03]], this.material(0x2f302d)));
    group.add(this.turnedProfile([[r * 0.8, 0.03], [r * 0.94, 0.03], [r, 0.07], [r, h - 0.1], [r * 0.93, h - 0.02], [r * 0.78, h], [0, h]], this.material(colour, 'soft')));
    return group;
  }

  /** A back roll lying along x. */
  backRoll(colour: number, length: number): THREE_NS.Group {
    const group = new this.THREE.Group();
    const roll = this.mesh(new this.THREE.CylinderGeometry(0.11, 0.11, length, 28), this.material(colour, 'soft'));
    roll.rotation.z = Math.PI / 2;
    roll.position.y = 0.11;
    group.add(roll);
    return group;
  }

  /** A white drum seat. */
  drum(): THREE_NS.Group {
    const group = new this.THREE.Group();
    group.add(this.turnedProfile([[0, 0], [0.24, 0], [0.26, 0.03], [0.26, 0.32], [0.24, 0.36], [0, 0.36]], this.material(COLOURS.white)));
    return group;
  }

  /** A single pupil's desk: white top on four grey legs. */
  desk(w = 0.7, d = 0.5): THREE_NS.Group {
    const group = new this.THREE.Group();
    group.add(this.box(w, 0.03, d, 0, 0.7, 0, this.material(COLOURS.white, 'wood')));
    const leg = this.material(COLOURS.greyLeg, 'metal');
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) group.add(this.box(0.03, 0.7, 0.03, sx * (w / 2 - 0.05), 0, sz * (d / 2 - 0.05), leg));
    return group;
  }

  /** A round table on a single column. */
  roundTable(r: number, height: number): THREE_NS.Group {
    const group = new this.THREE.Group();
    const grey = this.material(COLOURS.whiteEdge, 'metal');
    group.add(this.turnedProfile([[0, 0], [0.2, 0], [0.2, 0.025], [0.035, 0.03], [0.035, height - 0.03], [0, height - 0.03]], grey));
    group.add(this.turnedProfile([[0, height - 0.03], [r, height - 0.03], [r, height], [0, height]], this.material(COLOURS.white, 'wood')));
    return group;
  }

  /** A Vancouver booth on a sled frame, open towards +z: padded back and side walls, a seat inside. */
  booth(w: number, d: number, colour: number, wall = 1.2): THREE_NS.Group {
    const group = new this.THREE.Group();
    const lift = 0.08;
    const outer = this.material(colour, 'soft');
    const inner = this.material(this.tint(colour, 0.28), 'soft');
    const sled = this.material(0x2f302d, 'metal');
    group.add(this.box(w, wall, 0.11, 0, lift, -d / 2 + 0.055, outer));
    for (const side of [-1, 1]) {
      group.add(this.box(0.11, wall, d - 0.11, side * (w / 2 - 0.055), lift, 0.055, outer));
      group.add(this.box(0.03, 0.03, d - 0.06, side * (w / 2 - 0.04), 0, 0, sled));
    }
    group.add(this.box(w - 0.22, 0.36, d * 0.5, 0, lift, -d / 2 + 0.11 + d * 0.25, inner));
    group.add(this.box(w - 0.22, 0.46, 0.1, 0, lift + 0.36, -d / 2 + 0.16, inner));
    return group;
  }

  /** A high-backed Vancouver bench: the back along x at the origin, the seat towards +z. */
  bench(w: number, colour: number, back = 1.1): THREE_NS.Group {
    const group = new this.THREE.Group();
    const lift = 0.08;
    group.add(this.box(w, back, 0.11, 0, lift, 0.055, this.material(colour, 'soft')));
    group.add(this.box(w, 0.36, 0.44, 0, lift, 0.33, this.material(this.tint(colour, 0.28), 'soft')));
    const sled = this.material(0x2f302d, 'metal');
    for (const side of [-1, 1]) group.add(this.box(0.03, 0.03, 0.5, side * (w / 2 - 0.04), 0, 0.3, sled));
    return group;
  }

  /** A mobile tray shelf on castors, its coloured trays facing +z. */
  trayShelf(w: number, d: number, h: number, trays: number[][]): THREE_NS.Group {
    const group = new this.THREE.Group();
    group.add(this.box(w, h, d, 0, 0.06, 0, this.material(COLOURS.white, 'wood')));
    const castor = this.material(COLOURS.glide);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const wheel = this.mesh(new this.THREE.CylinderGeometry(0.04, 0.04, 0.06, 12), castor);
      wheel.position.set(sx * (w / 2 - 0.08), 0.03, sz * (d / 2 - 0.08));
      group.add(wheel);
    }
    const rowH = (h - 0.1) / trays.length;
    trays.forEach((row, i) => {
      const colW = (w - 0.06) / row.length;
      row.forEach((colour, j) => {
        group.add(this.box(colW - 0.03, rowH - 0.05, 0.03, -w / 2 + 0.03 + colW * (j + 0.5), 0.06 + 0.06 + i * rowH, d / 2 + 0.005, this.material(colour)));
      });
    });
    return group;
  }

  build(id: PieceId): THREE_NS.Group {
    switch (id) {
      case 'pantoswing':
        return this.pantoSwing(COLOURS.ginster);
      case 'hokki':
        return this.hokki(COLOURS.royal);
      case 'tano':
        return this.tanoIsland(COLOURS.sky);
      case 'puzzle':
        return this.puzzleTable();
    }
  }
}
