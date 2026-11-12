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

function sharesEdge(a, b) {
  return a.some((p, i) => b.some((q, j) =>
    distance(p, b[(j + 1) % b.length]) < 1e-8 && distance(a[(i + 1) % a.length], q) < 1e-8,
  ));
}

for (const name of ['frontal', 'uform', 'gruppen']) {
  test(`${name} keeps nine desks, eighteen usable seats and the same chair colours`, () => {
    const desks = tanoLayout(name), seats = desks.flatMap(tanoSeats), polygons = desks.map(tanoPolygon);
    assert.equal(desks.length, 9);
    assert.equal(seats.length, 18);
    for (const colour of [0, 1, 2]) assert.equal(seats.filter((seat) => seat.colour === colour).length, 6);
    for (let i = 0; i < polygons.length; i++) {
      for (let j = i + 1; j < polygons.length; j++) assert.ok(!overlaps(polygons[i], polygons[j]), `desks ${i} and ${j} overlap`);
    }
    seats.forEach((seat, i) => {
      assert.ok(seat.x > -1 && seat.x < 81 && seat.y > -1 && seat.y < 65, 'seat remains on the room floor');
      const footprint = [[-1.8, -1.8], [1.8, -1.8], [1.8, 1.8], [-1.8, 1.8]].map(([x, y]) => [seat.x + x, seat.y + y]);
      polygons.forEach((polygon) => assert.ok(!overlaps(footprint, polygon), `seat ${i} intersects a desk`));
      seats.slice(i + 1).forEach((other) => assert.ok(distance([seat.x, seat.y], [other.x, other.y]) > 4.1, 'seats need space'));
    });
  });
}

test('rows have two complete flush seams each and clear space between rows', () => {
  const polygons = tanoLayout('frontal').map(tanoPolygon);
  for (let row = 0; row < 3; row++) {
    const offset = row * 3;
    assert.ok(sharesEdge(polygons[offset], polygons[offset + 1]));
    assert.ok(sharesEdge(polygons[offset + 1], polygons[offset + 2]));
    if (row < 2) {
      const back = Math.max(...polygons.slice(offset, offset + 3).flat().map(([, y]) => y));
      const front = Math.min(...polygons.slice(offset + 3, offset + 6).flat().map(([, y]) => y));
      assert.ok(front - back > 7, 'table rows retain an aisle');
    }
  }
});

test('U forms one continuous run with an opening and free centre towards the board', () => {
  const desks = tanoLayout('uform'), polygons = desks.map(tanoPolygon);
  for (let i = 1; i < polygons.length; i++) assert.ok(sharesEdge(polygons[i - 1], polygons[i]), `seam ${i} must be flush`);
  assert.ok(desks[0].x < 40 && desks.at(-1).x > 40);
  assert.ok(desks[0].y < 25 && desks.at(-1).y < 25);
  assert.ok(Math.max(...desks.map(({ y }) => y)) > 38, 'back of the U closes behind its opening');
  const centre = [[35, 10], [45, 10], [45, 29], [35, 29]];
  polygons.forEach((polygon) => assert.ok(!overlaps(centre, polygon), 'central path to the board stays open'));
});

test('unequal edges cannot silently create a gap or overlap', () => {
  assert.throws(() => joinTano(tanoLayout('frontal')[0], 0, 1), /equal length/);
});
