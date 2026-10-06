"""Pen strokes for the handwritten hero claim of the previous design (/old/).

The claim is drawn as Kalam glyph outlines, revealed through a mask of thick pen strokes that
follow each letter's centreline, so the page can write it like a marker on a whiteboard.

For every glyph the outline is rasterised, thinned to a one-pixel skeleton, split into edges
between junctions and end points, and walked into strokes the way a hand would: from the top
left, continuing straight through junctions, lifting the pen when a branch ends. Umlaut dots
and the i dot are set after their word, as people do.

    python3 tools/handwriting/claim.py

writes src/components/old/art/claim-strokes.json (read by WhiteboardHero.astro).
"""

import json
import math
from pathlib import Path

import cv2
import numpy as np
from fontTools.pens.basePen import BasePen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[2]
FONT = ROOT / 'src/assets/fonts/old/kalam-700-latin.woff2'
OUT = ROOT / 'src/components/old/art/claim-strokes.json'

# the claim and its line breaks, as it is set in the hero
CLAIMS = {'Lernräume für Südtirol.': ['Lernräume', 'für Südtirol.']}

SCALE = 0.4  # raster pixels per font unit
PAD = 24  # raster padding in pixels
LINE = 1000  # line height in font units (CSS line-height: 1)

# timing, in seconds: the pen is on the board for WRITE seconds, plus the short lifts below
WRITE = 1.4
LIFT = 0.028  # pen lifted between strokes of one letter
NEXT_LETTER = 0.012
NEXT_WORD = 0.1
NEXT_LINE = 0.15


class FlattenPen(BasePen):
    """Collects each contour as a polyline in font units."""

    def __init__(self, glyphset):
        super().__init__(glyphset)
        self.contours, self.cur = [], []

    def _moveTo(self, pt):
        self.cur = [pt]

    def _lineTo(self, pt):
        self.cur.append(pt)

    def _curveToOne(self, p1, p2, p3):
        p0 = self.cur[-1]
        for i in range(1, 13):
            t = i / 12
            mt = 1 - t
            self.cur.append((
                mt**3 * p0[0] + 3 * mt**2 * t * p1[0] + 3 * mt * t**2 * p2[0] + t**3 * p3[0],
                mt**3 * p0[1] + 3 * mt**2 * t * p1[1] + 3 * mt * t**2 * p2[1] + t**3 * p3[1],
            ))

    def _qCurveToOne(self, p1, p2):
        p0 = self.cur[-1]
        for i in range(1, 9):
            t = i / 8
            mt = 1 - t
            self.cur.append((mt**2 * p0[0] + 2 * mt * t * p1[0] + t**2 * p2[0], mt**2 * p0[1] + 2 * mt * t * p1[1] + t**2 * p2[1]))

    def _closePath(self):
        if len(self.cur) > 2:
            self.contours.append(self.cur)
        self.cur = []

    _endPath = _closePath


def rasterise(contours, bounds):
    """Nonzero fill: every contour adds its winding direction to the pixels it covers."""
    x0, y0, x1, y1 = bounds
    w = int(math.ceil((x1 - x0) * SCALE)) + 2 * PAD
    h = int(math.ceil((y1 - y0) * SCALE)) + 2 * PAD
    winding = np.zeros((h, w), np.int32)
    for c in contours:
        pts = np.array([[(x - x0) * SCALE + PAD, (y1 - y) * SCALE + PAD] for x, y in c])
        area = 0.5 * np.sum(pts[:, 0] * np.roll(pts[:, 1], -1) - np.roll(pts[:, 0], -1) * pts[:, 1])
        layer = np.zeros((h, w), np.uint8)
        cv2.fillPoly(layer, [np.round(pts * 8).astype(np.int32)], 1, lineType=cv2.LINE_8, shift=3)
        winding += layer.astype(np.int32) * (1 if area > 0 else -1)
    return (winding != 0).astype(np.uint8)


def thin(img):
    """Zhang-Suen thinning to a one-pixel skeleton."""
    img = img.copy().astype(np.uint8)
    while True:
        changed = False
        for step in (0, 1):
            p = np.pad(img, 1)
            n = [p[:-2, 1:-1], p[:-2, 2:], p[1:-1, 2:], p[2:, 2:], p[2:, 1:-1], p[2:, :-2], p[1:-1, :-2], p[:-2, :-2]]
            b = sum(n)
            a = sum(((n[i] == 0) & (n[(i + 1) % 8] == 1)).astype(np.uint8) for i in range(8))
            if step == 0:
                c = (n[0] * n[2] * n[4] == 0) & (n[2] * n[4] * n[6] == 0)
            else:
                c = (n[0] * n[2] * n[6] == 0) & (n[0] * n[4] * n[6] == 0)
            kill = (img == 1) & (b >= 2) & (b <= 6) & (a == 1) & c
            if kill.any():
                img[kill] = 0
                changed = True
        if not changed:
            return img


NB = [(-1, -1), (-1, 0), (-1, 1), (0, -1), (0, 1), (1, -1), (1, 0), (1, 1)]


def skeleton_graph(skel):
    """Nodes are clusters of end and junction pixels; edges are the pixel runs between them."""
    pix = set(zip(*np.nonzero(skel)))
    nbrs = {q: [(q[0] + dy, q[1] + dx) for dy, dx in NB if (q[0] + dy, q[1] + dx) in pix] for q in pix}
    special = {q for q in pix if len(nbrs[q]) != 2}
    node_of, nodes = {}, []
    for q in special:
        if q in node_of:
            continue
        stack, members = [q], []
        node_of[q] = len(nodes)
        while stack:
            r = stack.pop()
            members.append(r)
            for s in nbrs[r]:
                if s in special and s not in node_of:
                    node_of[s] = len(nodes)
                    stack.append(s)
        nodes.append(members)
    # closed loops without any end or junction (o, the bowl of a): cut at the top
    seen_loop = set()
    for q in sorted(pix):
        if q in node_of or q in seen_loop:
            continue
        comp, stack = set(), [q]
        while stack:
            r = stack.pop()
            if r in comp:
                continue
            comp.add(r)
            stack.extend(nbrs[r])
        seen_loop |= comp
        if any(r in node_of for r in comp):
            continue
        top = min(comp)
        node_of[top] = len(nodes)
        nodes.append([top])

    edges, used = [], set()
    for ni, members in enumerate(nodes):
        for m in members:
            for s in nbrs[m]:
                if node_of.get(s) == ni or (m, s) in used:
                    continue
                path, prev, cur = [m, s], m, s
                used.add((m, s))
                while cur not in node_of:
                    nxt = [t for t in nbrs[cur] if t != prev and t not in path[-3:]]
                    if not nxt:
                        break
                    prev, cur = cur, nxt[0]
                    path.append(cur)
                if cur in node_of:
                    used.add((cur, path[-2]))
                    edges.append({'a': ni, 'b': node_of[cur], 'pts': path})
    return nodes, edges


def prune(nodes, edges, min_len):
    """Removes short spurs that thinning leaves at stroke ends and corners."""
    for _ in range(2):
        degree = {}
        for e in edges:
            degree[e['a']] = degree.get(e['a'], 0) + 1
            degree[e['b']] = degree.get(e['b'], 0) + 1
        keep = []
        for e in edges:
            spur = (degree[e['a']] == 1) != (degree[e['b']] == 1)
            if spur and len(e['pts']) < min_len:
                continue
            keep.append(e)
        edges = keep
    return edges


def direction(pts, at_start, span=8):
    seg = pts[:span] if at_start else pts[-span:][::-1]
    (y0, x0), (y1, x1) = seg[0], seg[-1]
    d = math.hypot(x1 - x0, y1 - y0) or 1
    return ((x1 - x0) / d, (y1 - y0) / d)


def walk(nodes, edges):
    """Orders the edges into pen strokes: start top left, go straight on, lift at dead ends."""
    centre = [(np.mean([m[1] for m in mem]), np.mean([m[0] for m in mem])) for mem in nodes]
    todo = set(range(len(edges)))
    strokes = []
    while todo:
        degree = {}
        for i in todo:
            for n in (edges[i]['a'], edges[i]['b']):
                degree[n] = degree.get(n, 0) + 1
        ends = [n for n, d in degree.items() if d % 2 == 1] or list(degree)
        start = min(ends, key=lambda n: centre[n][0] * 0.7 + centre[n][1])
        node, heading, stroke = start, None, []
        while True:
            options = []
            for i in todo:
                e = edges[i]
                if e['a'] == node:
                    pts = e['pts']
                elif e['b'] == node:
                    pts = e['pts'][::-1]
                else:
                    continue
                d = direction(pts, True)
                if heading is None:
                    score = -d[1] * 0.6 - d[0] * 0.2  # first move: prefer down, then right
                else:
                    score = -(d[0] * heading[0] + d[1] * heading[1])
                options.append((score, i, pts))
            if not options:
                break
            if heading is not None and options and min(options)[0] > 0.35:
                break  # a sharp turn back into another branch: lift the pen instead
            _, i, pts = min(options)
            todo.discard(i)
            stroke.extend(pts if not stroke else pts[1:])
            heading = direction(pts, False)
            heading = (-heading[0], -heading[1])
            e = edges[i]
            node = e['b'] if pts[0] == e['pts'][0] else e['a']
        if stroke:
            strokes.append(stroke)
    return strokes


def simplify(stroke):
    arr = np.array([[x, y] for y, x in stroke], np.float32).reshape(-1, 1, 2)
    approx = cv2.approxPolyDP(arr, 0.9, False).reshape(-1, 2)
    return approx if len(approx) > 1 else np.array([arr[0, 0], arr[-1, 0]])


def extend(pts, skel, dist):
    """Thinning stops short of a stroke's free end by about its half width: lengthen free ends to the tip."""
    pts = [np.array(p, float) for p in pts]
    h, w = skel.shape

    def free(p):
        x, y = int(round(p[0])), int(round(p[1]))
        win = skel[max(0, y - 1):y + 2, max(0, x - 1):x + 2]
        return win.sum() <= 2

    for at_start in (True, False):
        end, inner = (pts[0], pts[min(2, len(pts) - 1)]) if at_start else (pts[-1], pts[max(-3, -len(pts))])
        if not free(end):
            continue
        v = end - inner
        n = np.linalg.norm(v)
        if n < 1e-6:
            continue
        reach = dist[int(round(end[1])), int(round(end[0]))] * 0.9
        tip = end + v / n * reach
        tip = np.clip(tip, 0, [w - 1, h - 1])
        if at_start:
            pts.insert(0, tip)
        else:
            pts.append(tip)
    return np.array(pts)


def to_units(pts, bounds, ox, baseline):
    x0, y0, x1, y1 = bounds
    return [(float((px - PAD) / SCALE + x0 + ox), float(baseline - (y1 - (py - PAD) / SCALE))) for px, py in pts]


def path_d(points):
    return 'M' + ' L'.join(f'{x:.1f} {y:.1f}' for x, y in points)


def length(points):
    return sum(math.dist(points[i], points[i + 1]) for i in range(len(points) - 1))


def build(text, lines):
    font = TTFont(FONT)
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    hmtx = font['hmtx']
    asc, desc = font['hhea'].ascent, font['hhea'].descent
    # CSS line-height 1: the content area is centred in the 1000-unit line box
    first_baseline = (LINE - (asc - desc)) / 2 + asc

    out_glyphs, thickness = [], 0
    words = []  # per word: list of glyph indices
    for li, line in enumerate(lines):
        baseline = first_baseline + li * LINE
        x = 0.0
        for wi, word in enumerate(line.split(' ')):
            if wi:
                x += hmtx[cmap[ord(' ')]][0]
            idx = []
            for ch in word:
                name = cmap[ord(ch)]
                pen = FlattenPen(glyphs)
                glyphs[name].draw(pen)
                svg = SVGPathPen(glyphs)
                glyphs[name].draw(svg)
                g = {'char': ch, 'x': x, 'baseline': baseline, 'outline': svg.getCommands(), 'strokes': [], 'dots': []}
                if pen.contours:
                    allpts = [p for c in pen.contours for p in c]
                    bounds = (min(p[0] for p in allpts), min(p[1] for p in allpts), max(p[0] for p in allpts), max(p[1] for p in allpts))
                    img = rasterise(pen.contours, bounds)
                    dist = cv2.distanceTransform(img, cv2.DIST_L2, 5)
                    thickness = max(thickness, float(dist.max()) / SCALE)
                    count, labels, stats, _ = cv2.connectedComponentsWithStats(img, connectivity=8)
                    main = 1 + int(np.argmax(stats[1:, cv2.CC_STAT_AREA]))
                    big = stats[main, cv2.CC_STAT_AREA]
                    for c in range(1, count):
                        part = (labels == c).astype(np.uint8)
                        area = stats[c, cv2.CC_STAT_AREA]
                        bottom = stats[c, cv2.CC_STAT_TOP] + stats[c, cv2.CC_STAT_HEIGHT]
                        # a dot: small, and entirely above the letter's body (umlauts, the i dot)
                        if c != main and area < big * 0.5 and bottom < stats[main, cv2.CC_STAT_TOP] + 4:
                            # a dot: one short tap across it, set after the word
                            cx = stats[c, cv2.CC_STAT_LEFT] + stats[c, cv2.CC_STAT_WIDTH] / 2
                            cy = stats[c, cv2.CC_STAT_TOP] + stats[c, cv2.CC_STAT_HEIGHT] / 2
                            half = stats[c, cv2.CC_STAT_WIDTH] * 0.18
                            g['dots'].append(to_units([(cx - half, cy - half * 0.3), (cx + half, cy + half * 0.3)], bounds, x, baseline))
                            continue
                        skel = thin(part)
                        nodes, edges = skeleton_graph(skel)
                        edges = prune(nodes, edges, min_len=dist.max() * 1.6)
                        for s in walk(nodes, edges):
                            if len(s) < 3:
                                continue
                            g['strokes'].append(to_units(extend(simplify(s), skel, dist), bounds, x, baseline))
                    # strokes of separate parts: top left first
                    g['strokes'].sort(key=lambda s: min(p[0] for p in s) * 0.7 + min(p[1] for p in s))
                x += hmtx[name][0]
                idx.append(len(out_glyphs))
                out_glyphs.append(g)
            words.append({'line': li, 'glyphs': idx, 'x0': out_glyphs[idx[0]]['x'], 'x1': x})

    # timing: constant pen speed for WRITE seconds of pen-down time. A fragment shorter than the pen
    # is part of the stroke before it (thinning splits strokes at corners): no lift between them.
    pen = thickness * 2.5
    plan = []  # [glyph, points, lift] for strokes, a number for a pause
    for wi, word in enumerate(words):
        if wi:
            plan.append(NEXT_LINE if word['line'] != words[wi - 1]['line'] else NEXT_WORD)
        for li, gi in enumerate(word['glyphs']):
            if li:
                plan.append(NEXT_LETTER)
            for si, st in enumerate(out_glyphs[gi]['strokes']):
                plan.append([gi, st, LIFT if si and length(st) > pen * 0.8 else 0])
        # dots and the i dot: tapped on after the word, as a hand does
        for gi in word['glyphs']:
            for d in out_glyphs[gi]['dots']:
                plan.append([gi, d, LIFT * 1.5])
    total_len = sum(length(p[1]) for p in plan if isinstance(p, list))
    speed = total_len / WRITE

    clock = 0.0
    for p in plan:
        if not isinstance(p, list):
            clock += p
            continue
        gi, pts, lift = p
        clock += lift
        dur = max(0.03, length(pts) / speed)
        out_glyphs[gi].setdefault('pen', []).append({'d': path_d(pts), 'delay': round(clock, 3), 'dur': round(dur, 3)})
        clock += dur
    duration = round(clock, 3)

    allx = [pt[0] for g in out_glyphs for s in g['strokes'] for pt in s]
    width = max(w['x1'] for w in words)
    last = words[-1]
    return {
        'text': text,
        'lines': lines,
        'width': round(width, 1),
        'height': LINE * len(lines),
        'minX': round(min(allx), 1),
        'pen': round(thickness * 2.5, 1),
        'duration': duration,
        'underline': {'x0': round(last['x0'], 1), 'x1': round(last['x1'], 1), 'line': last['line']},
        'glyphs': [{'outline': g['outline'], 'x': round(g['x'], 1), 'baseline': round(g['baseline'], 1), 'pen': g.get('pen', [])} for g in out_glyphs],
    }


if __name__ == '__main__':
    data = {text: build(text, lines) for text, lines in CLAIMS.items()}
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')) + '\n')
    for text, d in data.items():
        strokes = sum(len(g['pen']) for g in d['glyphs'])
        print(f'{text}: {strokes} strokes, {d["duration"]}s, pen {d["pen"]} units, width {d["width"]}')
