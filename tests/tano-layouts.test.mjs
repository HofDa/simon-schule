import assert from 'node:assert/strict';
import test from 'node:test';
import { joinTano, tanoLayout, tanoPolygon, tanoSeats } from '../src/lib/tano-layouts.ts';

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

for (const name of ['frontal', 'uform', 'gruppen']) {
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

for (const name of ['frontal', 'uform', 'gruppen']) {
  test(`${name} seats every child at a long table edge, never at a table point`, () => {
    for (const desk of tanoLayout(name)) {
      const polygon = tanoPolygon(desk);
      const [seat] = tanoSeats(desk);
      const edgeMiddle = [(polygon[2][0] + polygon[3][0]) / 2, (polygon[2][1] + polygon[3][1]) / 2];
      const apex = polygon[0];
      assert.ok(distance([seat.x, seat.y], edgeMiddle) < 2.6, 'chair stands neatly at the long edge');
      assert.ok(distance([seat.x, seat.y], apex) > 8, 'chair keeps clear of the table point');
      // the child looks across the table towards its point
      const towardsApex = Math.atan2(apex[1] - seat.y, apex[0] - seat.x);
      assert.ok(Math.cos(seat.angle - towardsApex) > 0.99, 'chair faces the table');
    }
  });
}

test('rows pair desks cleanly, face the board and keep central and row aisles', () => {
  const desks = tanoLayout('frontal');
  const polygons = desks.map(tanoPolygon);
  const seats = desks.flatMap(tanoSeats);
  seats.forEach((seat) => assert.ok(Math.sin(seat.angle) < -0.99, 'all row chairs face the whiteboard'));
  for (let row = 0; row < 3; row++) {
    const base = row * 4;
    // paired desks sit snugly corner-to-corner while leaving a wide central walkway
    assert.ok(distance(polygons[base][1], polygons[base + 1][4]) < 0.5, 'left twin pair meets cleanly');
    assert.ok(distance(polygons[base + 2][1], polygons[base + 3][4]) < 0.5, 'right twin pair meets cleanly');
    const leftEdge = Math.max(...polygons[base + 1].map(([x]) => x));
    const rightEdge = Math.min(...polygons[base + 2].map(([x]) => x));
    assert.ok(rightEdge - leftEdge > 10, 'central aisle remains wide');
  }
  for (let row = 0; row < 2; row++) {
    const backChairs = Math.max(...seats.slice(row * 4, row * 4 + 4).map(({ y }) => y)) + 2.42;
    const nextFront = Math.min(...polygons.slice(row * 4 + 4, row * 4 + 8).flat().map(([, y]) => y));
    assert.ok(nextFront - backChairs > 6, 'table rows retain a clear aisle behind the chairs');
  }
});

test('U forms a continuous horseshoe open towards the board with a free centre and inward chairs', () => {
  const desks = tanoLayout('uform'), polygons = desks.map(tanoPolygon), seats = desks.flatMap(tanoSeats);
  assert.ok(desks[0].x < 40 && desks.at(-1).x > 40);
  assert.ok(desks[0].y < 18 && desks.at(-1).y < 18);
  assert.ok(Math.max(...desks.map(({ y }) => y)) > 48, 'back of the U closes behind its opening');
  for (let i = 0; i < polygons.length - 1; i++) {
    assert.ok(distance(polygons[i][1], polygons[i + 1][4]) < 0.5, `U-form seam ${i}→${i + 1} stays tight`);
  }
  const centre = [[24, 5], [56, 5], [56, 44], [24, 44]];
  polygons.forEach((polygon) => assert.ok(!overlaps(centre, polygon), 'central space and path to the board stay open'));
  seats.forEach((seat) => {
    const inward = Math.atan2(28 - seat.y, 40 - seat.x);
    assert.ok(Math.cos(seat.angle - inward) > 0.8, 'U-form chairs face clearly into the U');
  });
});

test('unequal edges cannot silently create a gap or overlap', () => {
  assert.throws(() => joinTano(tanoLayout('frontal')[0], 0, 1), /equal length/);
});
