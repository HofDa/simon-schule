/**
 * The project path on the whiteboard: hand-drawn marker arrows from object to object in the order
 * the eye should travel (call to action → projects → VS catalog → feedback → contact card), each
 * labelled with a phase. The objects carry data-path-node="1".."5"; the arrows are computed from
 * where the objects actually are, so they follow when a magnet is dragged.
 *
 * Hand-drawn: each line wobbles a little (fixed per arrow, so it never jitters on a redraw), gets a
 * faint second marker pass, and an arrowhead of two uneven strokes.
 * Step by step, once on the first view: the line is drawn, then its head, the number pops, the
 * phase is written out, and the object it points to nods, before the next step begins.
 */
export {};

const board = document.querySelector<HTMLElement>('[data-board-home]');
const canvas = board?.querySelector<HTMLElement>('.board-canvas');
const svg = board?.querySelector<SVGSVGElement>('[data-board-path]');
const labels = board?.querySelector<HTMLElement>('[data-board-path-labels]');

if (board && canvas && svg && labels) {
  const STEPS: string[] = JSON.parse(svg.dataset.steps ?? '[]');
  const NS = 'http://www.w3.org/2000/svg';
  const desktop = window.matchMedia('(min-width: 1024px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  type P = { x: number; y: number };
  type Box = { x: number; y: number; w: number; h: number };

  // timing of the intro (ms from the first drawing)
  const START = 1600;
  const STEP = 1150; // one step after the other
  const LINE = 700; // drawing the line
  const HEAD = 260; // drawing the arrowhead
  const INTRO_MS = START + 3 * STEP + LINE + HEAD + 900;

  const nodes = [1, 2, 3, 4, 5]
    .map((n) => canvas.querySelector<HTMLElement>(`[data-path-node="${n}"]`))
    .filter((el): el is HTMLElement => Boolean(el));

  const boxOf = (el: HTMLElement): Box => {
    const r = el.getBoundingClientRect();
    const c = canvas.getBoundingClientRect();
    return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
  };
  const centre = (b: Box): P => ({ x: b.x + b.w / 2, y: b.y + b.h / 2 });
  /** Where the line from a box's centre towards a point leaves the box (with some air). */
  const edge = (b: Box, to: P, pad: number): P => {
    const c = centre(b);
    const dx = to.x - c.x;
    const dy = to.y - c.y;
    const t = Math.min(dx ? (b.w / 2 + pad) / Math.abs(dx) : Infinity, dy ? (b.h / 2 + pad) / Math.abs(dy) : Infinity);
    return { x: c.x + dx * t, y: c.y + dy * t };
  };
  const f = (n: number) => n.toFixed(1);
  /** A fixed pseudo-random wobble for arrow i at position k: the same on every redraw. */
  const noise = (i: number, k: number) => {
    const s = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
  const bezier = (p0: P, c1: P, c2: P, p3: P, t: number): P => {
    const u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y,
    };
  };
  /** A smooth path through wobbled points along the curve (quadratic midpoints). */
  const wobbly = (pts: P[]) => {
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let k = 1; k < pts.length - 1; k++) {
      const m = { x: (pts[k].x + pts[k + 1].x) / 2, y: (pts[k].y + pts[k + 1].y) / 2 };
      d += `Q${f(pts[k].x)} ${f(pts[k].y)} ${f(m.x)} ${f(m.y)}`;
    }
    const last = pts[pts.length - 1];
    return `${d}L${f(last.x)} ${f(last.y)}`;
  };
  const draw = (el: SVGPathElement, delay: number, duration: number, easing = 'cubic-bezier(.45, .05, .55, .95)') => {
    const total = el.getTotalLength();
    el.style.strokeDasharray = `${total + 1}`;
    el.animate([{ strokeDashoffset: total + 1 }, { strokeDashoffset: 0 }], { duration, delay, easing, fill: 'backwards' })
      .finished.then(() => (el.style.strokeDasharray = ''));
  };

  let introStart = -1;
  let ready = false;
  const nodded = new Set<number>();

  const render = () => {
    if (!ready || !desktop.matches || nodes.length < 2) return;
    svg.replaceChildren();
    labels.replaceChildren();
    if (introStart < 0) introStart = reduceMotion.matches || document.documentElement.classList.contains('hero-skip') ? -Infinity : performance.now();
    const elapsed = performance.now() - introStart;
    const animate = elapsed < INTRO_MS;

    for (let i = 0; i < nodes.length - 1; i++) {
      const a = boxOf(nodes[i]);
      const b = boxOf(nodes[i + 1]);
      const p0 = edge(a, centre(b), 8);
      const p3 = edge(b, centre(a), 12);
      const dx = p3.x - p0.x;
      const dy = p3.y - p0.y;
      const len = Math.hypot(dx, dy);
      if (len < 28) continue;
      // a bend, alternating sides, like quick arrows drawn by hand
      const side = i % 2 === 0 ? 1 : -1;
      const n = { x: (-dy / len) * side, y: (dx / len) * side };
      const k = Math.min(70, len * 0.22);
      const c1 = { x: p0.x + dx * 0.3 + n.x * k, y: p0.y + dy * 0.3 + n.y * k };
      const c2 = { x: p0.x + dx * 0.7 + n.x * k, y: p0.y + dy * 0.7 + n.y * k };

      // the wobble: points along the curve pushed a little to either side, calm at both ends
      const count = Math.max(6, Math.round(len / 22));
      const pts: P[] = [];
      const second: P[] = [];
      for (let s = 0; s <= count; s++) {
        const t = s / count;
        const p = bezier(p0, c1, c2, p3, t);
        const q = bezier(p0, c1, c2, p3, Math.min(1, t + 0.01));
        const tl = Math.hypot(q.x - p.x, q.y - p.y) || 1;
        const nx = -(q.y - p.y) / tl;
        const ny = (q.x - p.x) / tl;
        const calm = Math.sin(Math.PI * t);
        const w = noise(i, s) * 1.8 * calm;
        pts.push({ x: p.x + nx * w, y: p.y + ny * w });
        // the second marker pass runs slightly off the first and stops a little short
        const w2 = w + 1.1 + noise(i + 9, s) * 0.8 * calm;
        if (t > 0.04 && t < 0.93) second.push({ x: p.x + nx * w2, y: p.y + ny * w2 });
      }
      const line = document.createElementNS(NS, 'path');
      line.setAttribute('d', wobbly(pts));
      line.classList.add('path-line');
      const pass = document.createElementNS(NS, 'path');
      pass.setAttribute('d', wobbly(second));
      pass.classList.add('path-pass');

      // the arrowhead: two strokes of slightly different length and angle
      const end = pts[pts.length - 1];
      const before = bezier(p0, c1, c2, p3, 0.9);
      const tl = Math.hypot(end.x - before.x, end.y - before.y) || 1;
      const ux = (end.x - before.x) / tl;
      const uy = (end.y - before.y) / tl;
      const wing = (angle: number, size: number): P => ({
        x: end.x - size * (ux * Math.cos(angle) - uy * Math.sin(angle)),
        y: end.y - size * (uy * Math.cos(angle) + ux * Math.sin(angle)),
      });
      const l = wing(0.48 + noise(i, 40) * 0.08, 14 + noise(i, 41) * 2);
      const r = wing(-0.52 + noise(i, 42) * 0.08, 12 + noise(i, 43) * 2);
      const headL = document.createElementNS(NS, 'path');
      headL.setAttribute('d', `M${f(l.x)} ${f(l.y)}Q${f((l.x + end.x) / 2 + noise(i, 44))} ${f((l.y + end.y) / 2 + noise(i, 45))} ${f(end.x)} ${f(end.y)}`);
      const headR = document.createElementNS(NS, 'path');
      headR.setAttribute('d', `M${f(end.x)} ${f(end.y)}Q${f((r.x + end.x) / 2 + noise(i, 46))} ${f((r.y + end.y) / 2 + noise(i, 47))} ${f(r.x)} ${f(r.y)}`);
      headL.classList.add('path-line');
      headR.classList.add('path-line');
      svg.append(pass, line, headL, headR);

      // the phase, written beside the arrow's bulge on the outside of its bend, anchored so the text
      // runs away from the line (never across it)
      const mid = bezier(p0, c1, c2, p3, 0.5);
      const label = document.createElement('span');
      label.className = 'path-step';
      label.innerHTML = `<b>${i + 1}</b><span>${STEPS[i] ?? ''}</span>`;
      label.style.left = `${f(mid.x + n.x * 14)}px`;
      label.style.top = `${f(mid.y + n.y * 14)}px`;
      const ax = n.x > 0.35 ? '0%' : n.x < -0.35 ? '-100%' : '-50%';
      const ay = n.y > 0.35 ? '0%' : n.y < -0.35 ? '-100%' : '-50%';
      label.style.translate = `${ax} ${ay}`;
      labels.append(label);

      if (animate) {
        const delay = START + i * STEP - elapsed;
        draw(line, delay, LINE);
        draw(pass, delay + LINE * 0.35, LINE * 0.7);
        draw(headL, delay + LINE, HEAD * 0.55, 'ease-out');
        draw(headR, delay + LINE + HEAD * 0.45, HEAD * 0.55, 'ease-out');
        const number = label.querySelector('b')!;
        const word = label.querySelector('span')!;
        number.animate(
          [{ transform: 'scale(0)', opacity: 0 }, { transform: 'scale(1.35)', opacity: 1, offset: 0.6 }, { transform: 'scale(1)', opacity: 1 }],
          { duration: 380, delay: delay + LINE * 0.45, easing: 'ease-out', fill: 'backwards' },
        );
        word.animate(
          [{ clipPath: 'inset(-30% 100% -30% 0)' }, { clipPath: 'inset(-30% 0 -30% 0)' }],
          { duration: 520, delay: delay + LINE * 0.6, easing: 'cubic-bezier(.3, .1, .4, 1)', fill: 'backwards' },
        );
        // the object the arrow points to nods once when the arrow arrives
        if (!nodded.has(i) && delay + LINE + HEAD > 0) {
          nodded.add(i);
          nodes[i + 1].animate(
            [{ transform: 'none' }, { transform: 'translateY(-5px) rotate(-1deg)' }, { transform: 'translateY(1px) rotate(.5deg)' }, { transform: 'none' }],
            { duration: 520, delay: delay + LINE + HEAD, easing: 'ease-out' },
          );
        }
      }
    }
  };

  // redraw whenever an object moves or the board changes size; during the intro a redraw continues
  // on the same clock, so the steps keep their pace
  let queued = false;
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      render();
    });
  };
  new ResizeObserver(schedule).observe(canvas);
  const moving = new MutationObserver(schedule);
  canvas.querySelectorAll('[data-board-object]').forEach((el) => moving.observe(el, { attributes: true, attributeFilter: ['style', 'class'] }));
  board.addEventListener('whiteboard:reset', schedule);
  desktop.addEventListener('change', schedule);
  // the first drawing waits for the fonts, so the objects have their final size
  document.fonts.ready.then(() => {
    ready = true;
    render();
  });
}
