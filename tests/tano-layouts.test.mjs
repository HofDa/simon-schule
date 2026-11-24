import assert from 'node:assert/strict';
import test from 'node:test';
import { joinTano, tanoLayout, tanoPolygon, tanoSeats, TANO_LONG, TANO_SHORT, TANO_SLANT, TANO_WIDTH } from '../src/lib/tano-layouts.ts';

const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// Separating-axis check: touching edges are allowed, overlapping table interiors are not.
function overlaps(a, b) {
  for (const polygon of [a, b]) {
    for (let i = 0; i < polygon.length; i++) {
      const p = polygon[i], q = polygon[(i + 1) % polygon.length];
      const axis = [p[1] - q[1], q[0] - p[0]];
      const project = (points) => points.map(([x, y]) => x * axis[0] + y * axis[1]);
      const pa = project(a), pb = project(b);
      if (Math.min(...pa) >= Math.max(...pb) - 1e-7 || Math.min(...pb) >= Math.max(...pa) - 1e-7) return false;
    }
  }
  return true;
}

// Oriented PantoSwing-LuPo plan footprint in dm: front lip +1.95, backrest -2.42, width +-2.1.
function chairFootprint(seat) {
  const c = Math.cos(seat.angle), s = Math.sin(seat.angle);
  return [
    [1.95, -2.1],
    [1.95, 2.1],
    [-2.42, 2.1],
    [-2.42, -2.1],
  ].map(([u, v]) => [seat.x + u * c - v * s, seat.y + u * s + v * c]);
}

test('Tano 01492 tabletop matches the real 70 × 66/43 cm 18° right-trapezoid geometry', () => {
  const [desk] = tanoLayout('frontal');
  const poly = tanoPolygon(desk);
  assert.equal(poly.length, 4);
  const lens = [0, 1, 2, 3].map((i) => distance(poly[i], poly[(i + 1) % 4]));
  assert.ok(Math.abs(lens[0] - TANO_WIDTH * 0.985) < 1e-6, 'front edge is 70 cm');
  assert.ok(Math.abs(lens[1] - TANO_SHORT * 0.985) < 1e-6, 'short side is 43 cm');
  assert.ok(Math.abs(lens[2] - TANO_SLANT * 0.985) < 1e-6, 'slanted edge follows 18°');
  assert.ok(Math.abs(lens[3] - TANO_LONG * 0.985) < 1e-6, 'long side is ~65.7 cm');
});

const ALL_LAYOUTS = ['frontal', 'uform', 'gruppen', 'projekt'];

for (const name of ALL_LAYOUTS) {
  test(`${name} keeps twelve desks, twelve usable seats and the same chair colours`, () => {
    const desks = tanoLayout(name), seats = desks.flatMap(tanoSeats), polygons = desks.map(tanoPolygon);
    assert.equal(desks.length, 12);
    assert.equal(seats.length, 12);
    for (const colour of [0, 1, 2]) assert.equal(seats.filter((seat) => seat.colour === colour).length, 4);
    for (let i = 0; i < polygons.length; i++) {
      for (let j = i + 1; j < polygons.length; j++) assert.ok(!overlaps(polygons[i], polygons[j]), `desks ${i} and ${j} overlap`);
    }
    const footprints = seats.map(chairFootprint);
    seats.forEach((seat, i) => {
      assert.ok(seat.x > 2 && seat.x < 78 && seat.y > 2 && seat.y < 63, 'seat remains well inside the room floor');
      polygons.forEach((polygon) => assert.ok(!overlaps(footprints[i], polygon), `seat ${i} intersects a desk`));
      seats.slice(i + 1).forEach((other, j) => {
        assert.ok(!overlaps(footprints[i], footprints[i + 1 + j]), `seats ${i} and ${i + 1 + j} intersect`);
        assert.ok(distance([seat.x, seat.y], [other.x, other.y]) > 5, 'seats need comfortable elbow room');
      });
    });
  });
}

for (const name of ALL_LAYOUTS) {
  test(`${name} seats every child centred at a full-width straight table edge`, () => {
    for (const desk of tanoLayout(name)) {
      const polygon = tanoPolygon(desk);
      const [seat] = tanoSeats(desk);
      const a = polygon[desk.seatEdge];
      const b = polygon[(desk.seatEdge + 1) % 4];
      const edgeLength = distance(a, b);
      const edgeMiddle = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      assert.ok(edgeLength > 6.4, `seating edge ${desk.seatEdge} is full-width (>= 64 cm)`);
      assert.ok(distance([seat.x, seat.y], edgeMiddle) < 2.7, 'chair stands neatly at the seating edge');
      const towardsDesk = Math.atan2(desk.y - seat.y, desk.x - seat.x);
      assert.ok(Math.cos(seat.angle - towardsDesk) > 0.94, 'chair faces across the desk');
    }
  });
}

test('rows pair Tano desks cleanly side by side, face the board and keep central and row aisles', () => {
  const desks = tanoLayout('frontal');
  const polygons = desks.map(tanoPolygon);
  const seats = desks.flatMap(tanoSeats);
  seats.forEach((seat) => assert.ok(Math.sin(seat.angle) < -0.99, 'all row chairs face the whiteboard'));
  for (let row = 0; row < 3; row++) {
    const base = row * 4;
    // paired desks meet flush (v1 of left desk beside v0 of right desk) with a wide central walkway
    assert.ok(distance(polygons[base][1], polygons[base + 1][0]) < 0.3, 'left twin pair meets cleanly');
    assert.ok(distance(polygons[base + 2][1], polygons[base + 3][0]) < 0.3, 'right twin pair meets cleanly');
    const leftEdge = Math.max(...polygons[base + 1].map(([x]) => x));
    const rightEdge = Math.min(...polygons[base + 2].map(([x]) => x));
    assert.ok(rightEdge - leftEdge > 12, 'central aisle remains wide');
  }
  for (let row = 0; row < 2; row++) {
    const backChairs = Math.max(...seats.slice(row * 4, row * 4 + 4).map(({ y }) => y)) + 2.42;
    const nextFront = Math.min(...polygons.slice(row * 4 + 4, row * 4 + 8).flat().map(([, y]) => y));
    assert.ok(nextFront - backChairs > 6, 'table rows retain a clear aisle behind the chairs');
  }
});

test('U-form chains twelve Tano desks at exact 18° increments into an open curved horseshoe', () => {
  const desks = tanoLayout('uform'), polygons = desks.map(tanoPolygon), seats = desks.flatMap(tanoSeats);
  assert.ok(desks[0].x < 40 && desks.at(-1).x > 40);
  assert.ok(desks[0].y < 24 && desks.at(-1).y < 24);
  assert.ok(Math.max(...desks.map(({ y }) => y)) > 36, 'back of the U closes behind its opening');
  for (let i = 0; i < desks.length - 1; i++) {
    const dTurn = Math.abs(desks[i].turn - desks[i + 1].turn);
    assert.ok(Math.abs(dTurn - (18 * Math.PI) / 180) < 1e-6, `seam ${i}→${i + 1} turns by exact 18°`);
  }
  const centre = [[31, 5], [49, 5], [49, 31], [31, 31]];
  polygons.forEach((polygon) => assert.ok(!overlaps(centre, polygon), 'central space and path to the board stay open'));
  seats.forEach((seat) => {
    const inward = Math.atan2(22.5 - seat.y, 40 - seat.x);
    assert.ok(Math.cos(seat.angle - inward) > 0.9, 'U-form chairs face clearly into the open U');
  });
});

test('gruppen forms three 4-desk VS Tano pinwheel islands', () => {
  const desks = tanoLayout('gruppen');
  const polygons = desks.map(tanoPolygon);
  for (let island = 0; island < 3; island++) {
    const base = island * 4;
    for (let k = 0; k < 4; k++) {
      // Each desk's 90° inner corner (v0) meets right around the pinwheel centre
      const a = polygons[base + k][0];
      const b = polygons[base + ((k + 1) % 4)][0];
      assert.ok(distance(a, b) < 0.8, `island ${island} inner pinwheel joint ${k} stays tight`);
    }
  }
});

test('projekt forms two 6-desk rectangular project blocks joined along the 18° slanted seam', () => {
  const desks = tanoLayout('projekt');
  const polygons = desks.map(tanoPolygon);
  for (let block = 0; block < 2; block++) {
    const base = block * 6;
    for (let pair = 0; pair < 3; pair++) {
      const a = polygons[base + pair * 2];
      const b = polygons[base + pair * 2 + 1];
      // Slanted edge v2->v3 of desk a matches v3->v2 of desk b
      assert.ok(distance(a[2], b[3]) < 0.3, `block ${block} pair ${pair} slanted seam matches`);
      assert.ok(distance(a[3], b[2]) < 0.3, `block ${block} pair ${pair} opposite slanted corner matches`);
    }
  }
});

test('joinTano joins equal slanted edges cleanly and rejects unequal edges', () => {
  const first = tanoLayout('frontal')[0];
  const paired = joinTano(first, 2, 2);
  assert.ok(!overlaps(tanoPolygon(first), tanoPolygon(paired)), 'joined rectangle pair does not overlap');
  assert.throws(() => joinTano(first, 0, 1), /equal length/);
});
