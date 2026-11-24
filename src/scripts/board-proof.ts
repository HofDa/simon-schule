/**
 * Continuous hand-drawn orange marker stroke on the desktop whiteboard: underlines the second line
 * of the heading ("für Südtirol" / "in Alto Adige"), extends smoothly out past the text into a
 * curved arrow pointing to the project collage stack, and then reveals the facility count
 * ("234 Einrichtungen" / "234 strutture") beside the arch. Follows resize and magnet drags cleanly.
 */
export {};

const board = document.querySelector<HTMLElement>('[data-board-home]');
const canvas = board?.querySelector<HTMLElement>('.board-canvas');
const layer = board?.querySelector<HTMLElement>('[data-board-proof]');
const svg = layer?.querySelector<SVGSVGElement>('[data-board-proof-svg]');
const label = layer?.querySelector<HTMLElement>('[data-board-proof-text]');
const title = canvas?.querySelector<HTMLElement>('[data-board-title]');
const line2 = canvas?.querySelector<HTMLElement>('[data-board-title-line2]');
const collage = canvas?.querySelector<HTMLElement>('[data-collage-stack]');
const projectsObj = canvas?.querySelector<HTMLElement>('.object-projects');

if (board && canvas && layer && svg && label && title && line2 && collage && projectsObj) {
  const NS = 'http://www.w3.org/2000/svg';
  const desktop = window.matchMedia('(min-width: 1024px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  type P = { x: number; y: number };
  type Box = { x: number; y: number; w: number; h: number };

  // Intro choreography (ms from first layout after fonts settle)
  const START = 380;
  const UNDERLINE_MS = 700;
  const GAP_PAUSE = 120;
  const ARROW_START = START + UNDERLINE_MS + GAP_PAUSE;
  const ARROW_MS = 850;
  const HEAD_MS = 260;
  const TEXT_DELAY = ARROW_START + ARROW_MS + HEAD_MS + 60;
  const TEXT_MS = 550;
  const INTRO_MS = TEXT_DELAY + TEXT_MS + 120;

  const f = (n: number) => n.toFixed(1);
  const noise = (k: number) => {
    const s = Math.sin(37.3 + k * 311.7) * 43758.5453;
    return (s - Math.floor(s)) * 2 - 1;
  };
  const bezier = (p0: P, c1: P, c2: P, p3: P, t: number): P => {
    const u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p3.y,
    };
  };
  const wobbly = (pts: P[]) => {
    let d = `M${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let k = 1; k < pts.length - 1; k++) {
      const m = { x: (pts[k].x + pts[k + 1].x) / 2, y: (pts[k].y + pts[k + 1].y) / 2 };
      d += `Q${f(pts[k].x)} ${f(pts[k].y)} ${f(m.x)} ${f(m.y)}`;
    }
    const last = pts[pts.length - 1];
    return `${d}L${f(last.x)} ${f(last.y)}`;
  };
  const boxInCanvas = (el: HTMLElement, cRect: DOMRect): Box => {
    const r = el.getBoundingClientRect();
    return { x: r.left - cRect.left, y: r.top - cRect.top, w: r.width, h: r.height };
  };
  const overlaps = (a: Box, b: Box, pad = 0) =>
    a.x < b.x + b.w + pad && a.x + a.w > b.x - pad && a.y < b.y + b.h + pad && a.y + a.h > b.y - pad;

  const edgePoint = (b: Box, from: P, pad: number): P => {
    const cx = b.x + b.w / 2;
    const cy = b.y + b.h / 2;
    const dx = from.x - cx;
    const dy = from.y - cy;
    const t = Math.min(dx ? (b.w / 2 + pad) / Math.abs(dx) : Infinity, dy ? (b.h / 2 + pad) / Math.abs(dy) : Infinity);
    return { x: cx + dx * t, y: cy + dy * t };
  };

  /** Measure the left and right baseline anchors of line 2, respecting the heading's rotation. */
  const underlineAnchors = (cRect: DOMRect): [P, P] => {
    const textNode = line2.firstChild;
    const lineBox = boxInCanvas(line2, cRect);
    if (textNode && textNode.nodeType === Node.TEXT_NODE && (textNode.textContent?.length ?? 0) >= 2) {
      const len = textNode.textContent!.length;
      const r0 = document.createRange();
      r0.setStart(textNode, 0);
      r0.setEnd(textNode, 1);
      const b0 = r0.getBoundingClientRect();
      const r1 = document.createRange();
      r1.setStart(textNode, len - 1);
      r1.setEnd(textNode, len);
      const b1 = r1.getBoundingClientRect();
      if (b0.width > 0 && b1.width > 0) {
        // Sit just below the Kalam baseline (~79% down each single-glyph box).
        const y0 = b0.top - cRect.top + b0.height * 0.79;
        const y1 = b1.top - cRect.top + b1.height * 0.79;
        return [
          { x: b0.left - cRect.left - 2, y: y0 },
          { x: b1.right - cRect.left + 6, y: y1 },
        ];
      }
    }
    const yBase = lineBox.y + lineBox.h * 0.78;
    return [
      { x: lineBox.x, y: yBase + 4 },
      { x: lineBox.x + lineBox.w + 4, y: yBase - 4 },
    ];
  };

  let introStarted = false;
  let introDone = false;
  let ready = false;
  let lastCanvasKey = '';
  let lastDragKey = '';

  const applyDraw = (el: SVGPathElement, delay: number, duration: number, easing = 'cubic-bezier(.35, .05, .25, 1)') => {
    el.setAttribute('pathLength', '1');
    el.style.setProperty('--draw-delay', `${Math.max(0, delay)}ms`);
    el.style.setProperty('--draw-dur', `${duration}ms`);
    el.style.setProperty('--draw-ease', easing);
    el.classList.add('is-animating');
  };

  const render = (force = false) => {
    if (!ready || !desktop.matches) {
      layer.classList.remove('is-ready');
      lastCanvasKey = '';
      return;
    }

    const cRect = canvas.getBoundingClientRect();
    if (!cRect.width || !cRect.height) return;

    const canvasKey = `${Math.round(cRect.width)}x${Math.round(cRect.height)}`;
    const dragKey = `${projectsObj.style.getPropertyValue('--board-x')}|${projectsObj.style.getPropertyValue('--board-y')}`;
    if (!force && canvasKey === lastCanvasKey && dragKey === lastDragKey) return;
    lastCanvasKey = canvasKey;
    lastDragKey = dragKey;

    const titleBox = boxInCanvas(title, cRect);
    const colBox = boxInCanvas(collage, cRect);
    const [u0, u1] = underlineAnchors(cRect);

    // Segment 1: hand-drawn orange underline sweeping right under "für Südtirol" / "in Alto Adige".
    const udx = u1.x - u0.x;
    const udy = u1.y - u0.y;
    const uc1: P = { x: u0.x + udx * 0.34, y: u0.y + udy * 0.34 - 1.5 };
    const uc2: P = { x: u0.x + udx * 0.68, y: u0.y + udy * 0.68 - 1.0 };

    // Aim cleanly at the left edge of the collage stack in its natural area, or the nearest edge if dragged away.
    let p3: P;
    if (colBox.x - u1.x > 44 && u1.y > colBox.y - 90 && u1.y < colBox.y + colBox.h + 90) {
      const targetY = Math.min(colBox.y + colBox.h * 0.6, Math.max(colBox.y + colBox.h * 0.34, u1.y - 24));
      p3 = { x: colBox.x - 14, y: targetY };
    } else {
      p3 = edgePoint(colBox, u1, 14);
    }

    const dx = p3.x - u1.x;
    const dy = p3.y - u1.y;
    const len = Math.hypot(dx, dy);

    svg.replaceChildren();

    // Sample the underline segment (ends cleanly after "Südtirol" / "Alto Adige").
    const uCount = Math.max(8, Math.round(Math.hypot(udx, udy) / 24));
    const uPts: P[] = [];
    const uPassPts: P[] = [];
    for (let s = 0; s <= uCount; s++) {
      const t = s / uCount;
      const p = bezier(u0, uc1, uc2, u1, t);
      const calm = Math.sin(Math.PI * t);
      const w = noise(s) * 0.7 * calm;
      uPts.push({ x: p.x, y: p.y + w });
      if (t > 0.05 && t < 0.95) uPassPts.push({ x: p.x, y: p.y + w + 1.2 + noise(s + 11) * 0.45 * calm });
    }

    const underline = document.createElementNS(NS, 'path');
    underline.setAttribute('d', wobbly(uPts));
    underline.classList.add('proof-shaft');

    const underlinePass = document.createElementNS(NS, 'path');
    underlinePass.setAttribute('d', wobbly(uPassPts));
    underlinePass.classList.add('proof-pass');

    svg.append(underlinePass, underline);

    const hasArrow = len >= 44;
    let arrowShaft: SVGPathElement | null = null;
    let arrowPass: SVGPathElement | null = null;
    let headL: SVGPathElement | null = null;
    let headR: SVGPathElement | null = null;

    if (hasArrow) {
      // Tangent at the end of the underline so the invisible arc stays visually aligned across the gap.
      const tx = u1.x - uc2.x;
      const ty = u1.y - uc2.y;
      const tLen = Math.hypot(tx, ty) || 1;
      const tux = tx / tLen;
      const tuy = ty / tLen;

      // Upward-pointing normal relative to the arrow span.
      const sign = dx >= 0 ? 1 : -1;
      const nx = (dy / len) * sign;
      const ny = (-dx / len) * sign;
      const arch = Math.min(48, Math.max(20, len * 0.22));

      const overhang = Math.max(0, titleBox.x + titleBox.w - u1.x);
      const lead = overhang > 12 ? Math.min(len * 0.48, overhang + 36) : len * 0.34;

      const ac1: P = {
        x: u1.x + tux * lead,
        y: u1.y + tuy * lead + (overhang > 12 ? 0 : ny * arch * 0.2),
      };
      const ac2: P = {
        x: u1.x + dx * 0.72 + nx * arch * 0.95,
        y: u1.y + dy * 0.72 + ny * arch * 0.95,
      };

      // Place "234 Einrichtungen" / "234 strutture" first so the visible arrow can begin cleanly
      // right beneath its left edge, leaving an airy gap after "Südtirol" / "Alto Adige".
      label.style.visibility = '';
      const lw = label.offsetWidth || 120;
      const lh = label.offsetHeight || 24;
      const candidates: Array<{ t: number; offset: number }> = [
        { t: 0.58, offset: 20 },
        { t: 0.66, offset: 20 },
        { t: 0.56, offset: -22 },
        { t: 0.64, offset: -24 },
      ];
      let chosen: P | null = null;
      for (const cand of candidates) {
        const m = bezier(u1, ac1, ac2, p3, cand.t);
        const cx = m.x + nx * (cand.offset + (cand.offset > 0 ? lh * 0.45 : -lh * 0.45));
        const cy = m.y + ny * (cand.offset + (cand.offset > 0 ? lh * 0.45 : -lh * 0.45));
        const box: Box = { x: cx - lw / 2, y: cy - lh / 2, w: lw, h: lh };
        const inBounds = box.x > 12 && box.y > 12 && box.x + box.w < cRect.width - 12 && box.y + box.h < cRect.height - 12;
        if (inBounds && !overlaps(box, titleBox, 8) && !overlaps(box, colBox, 8)) {
          chosen = { x: cx, y: cy };
          break;
        }
      }
      if (!chosen) {
        const m = bezier(u1, ac1, ac2, p3, 0.58);
        chosen = { x: m.x + nx * (20 + lh * 0.45), y: m.y + ny * (20 + lh * 0.45) };
      }
      label.style.left = `${f(chosen.x)}px`;
      label.style.top = `${f(chosen.y)}px`;

      // Start the arrow segment right under the start of "234..." (with a clean gap after line 2).
      let tStart = 0.36;
      if (dx > 0) {
        const startX = chosen.x - lw * 0.46;
        for (let k = 10; k <= 62; k++) {
          const t = k / 100;
          if (bezier(u1, ac1, ac2, p3, t).x >= startX) {
            tStart = Math.min(0.58, Math.max(0.3, t));
            break;
          }
        }
      }

      const aCount = Math.max(7, Math.round((len * (1 - tStart)) / 18));
      const aPts: P[] = [];
      const aPassPts: P[] = [];
      for (let s = 0; s <= aCount; s++) {
        const frac = s / aCount;
        const t = tStart + (1 - tStart) * frac;
        const p = bezier(u1, ac1, ac2, p3, t);
        const q = bezier(u1, ac1, ac2, p3, Math.min(1, t + 0.01));
        const tl = Math.hypot(q.x - p.x, q.y - p.y) || 1;
        const pnx = -(q.y - p.y) / tl;
        const pny = (q.x - p.x) / tl;
        const calm = Math.sin(Math.PI * frac);
        const w = noise(s + 30) * 0.95 * calm;
        aPts.push({ x: p.x + pnx * w, y: p.y + pny * w });
        if (frac > 0.06 && frac < 0.92) {
          const w2 = w + 1.1 + noise(s + 47) * 0.55 * calm;
          aPassPts.push({ x: p.x + pnx * w2, y: p.y + pny * w2 });
        }
      }

      arrowShaft = document.createElementNS(NS, 'path');
      arrowShaft.setAttribute('d', wobbly(aPts));
      arrowShaft.classList.add('proof-shaft');

      arrowPass = document.createElementNS(NS, 'path');
      arrowPass.setAttribute('d', wobbly(aPassPts));
      arrowPass.classList.add('proof-pass');

      const end = aPts[aPts.length - 1];
      const before = bezier(u1, ac1, ac2, p3, Math.max(tStart, 0.88));
      const tl = Math.hypot(end.x - before.x, end.y - before.y) || 1;
      const ux = (end.x - before.x) / tl;
      const uy = (end.y - before.y) / tl;
      const wing = (angle: number, size: number): P => ({
        x: end.x - size * (ux * Math.cos(angle) - uy * Math.sin(angle)),
        y: end.y - size * (uy * Math.cos(angle) + ux * Math.sin(angle)),
      });
      const wl = wing(0.49, 15.5);
      const wr = wing(-0.53, 14);

      headL = document.createElementNS(NS, 'path');
      headL.setAttribute('d', `M${f(wl.x)} ${f(wl.y)}Q${f((wl.x + end.x) / 2 - 0.8)} ${f((wl.y + end.y) / 2 + 0.6)} ${f(end.x)} ${f(end.y)}`);
      headL.classList.add('proof-head');

      headR = document.createElementNS(NS, 'path');
      headR.setAttribute('d', `M${f(end.x)} ${f(end.y)}Q${f((wr.x + end.x) / 2 + 0.6)} ${f((wr.y + end.y) / 2 - 0.7)} ${f(wr.x)} ${f(wr.y)}`);
      headR.classList.add('proof-head');

      svg.append(arrowPass, arrowShaft, headL, headR);
    } else {
      label.style.visibility = 'hidden';
    }

    const shouldAnimate = !introDone && !reduceMotion.matches;
    label.classList.remove('is-animating');

    if (shouldAnimate) {
      if (!introStarted) {
        introStarted = true;
        window.setTimeout(() => { introDone = true; }, INTRO_MS);
      }
      applyDraw(underline, START, UNDERLINE_MS);
      applyDraw(underlinePass, START + UNDERLINE_MS * 0.25, UNDERLINE_MS * 0.72);
      if (arrowShaft && arrowPass && headL && headR) {
        applyDraw(arrowShaft, ARROW_START, ARROW_MS);
        applyDraw(arrowPass, ARROW_START + ARROW_MS * 0.25, ARROW_MS * 0.72);
        applyDraw(headL, ARROW_START + ARROW_MS - 40, HEAD_MS * 0.58, 'ease-out');
        applyDraw(headR, ARROW_START + ARROW_MS + HEAD_MS * 0.35, HEAD_MS * 0.58, 'ease-out');
      }
      if (hasArrow) {
        label.style.setProperty('--text-delay', `${TEXT_DELAY}ms`);
        label.style.setProperty('--text-dur', `${TEXT_MS}ms`);
        void label.offsetWidth;
        label.classList.add('is-animating');
      }
    }

    layer.classList.add('is-ready');
  };

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
  new MutationObserver(() => {
    const dragKey = `${projectsObj.style.getPropertyValue('--board-x')}|${projectsObj.style.getPropertyValue('--board-y')}`;
    if (dragKey !== lastDragKey) {
      introDone = true;
      schedule();
    }
  }).observe(projectsObj, { attributes: true, attributeFilter: ['style'] });
  board.addEventListener('whiteboard:reset', () => { introDone = true; lastCanvasKey = ''; schedule(); });
  desktop.addEventListener('change', () => { lastCanvasKey = ''; schedule(); });

  document.fonts.ready.then(() => {
    // Wait one beat past the collage's initial scale-in so the measured target edge is final.
    requestAnimationFrame(() => {
      ready = true;
      render(true);
    });
  });

  // Guided grow-point cue for Simon's contact arrow:
  // Closing the gallery or feedback letter back to the whiteboard draws & grows
  // the contact arrow toward Simon's card.
  const bindGrowArrow = (opts: {
    triggers: Array<{ event: string; delay: number }>;
    arrow: SVGSVGElement | null;
    shaft: SVGPathElement | null;
    head: SVGPathElement | null;
    target: HTMLElement | null;
    from: string;
    peak: string;
    nodDeg: number;
  }) => {
    const { triggers, arrow, shaft, head, target, from, peak, nodDeg } = opts;
    if (!arrow || !shaft || !head) return;
    let anims: Animation[] = [];
    const clear = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
      shaft.style.strokeDasharray = '';
      head.style.strokeDasharray = '';
    };

    const play = (delay: number) => {
      if (!desktop.matches || reduceMotion.matches) return;
      clear();

      const SHAFT = 560;
      const HEAD = 220;

      const animatePath = (el: SVGPathElement, d: number, duration: number, easing: string) => {
        const total = el.getTotalLength();
        if (!total) return;
        const len = total + 2;
        el.style.strokeDasharray = `${len}`;
        const anim = el.animate(
          [
            { strokeDashoffset: `${len}px`, opacity: 0 },
            { strokeDashoffset: `${len}px`, opacity: 1, offset: 0.01 },
            { strokeDashoffset: '0px', opacity: 1 },
          ],
          { duration, delay: d, easing, fill: 'backwards' },
        );
        anims.push(anim);
        anim.finished.then(() => { el.style.strokeDasharray = ''; }).catch(() => {});
      };

      animatePath(shaft, delay, SHAFT, 'cubic-bezier(.35, .05, .45, 1)');
      animatePath(head, delay + SHAFT - 50, HEAD, 'ease-out');

      anims.push(
        arrow.animate(
          [
            { transform: `scale(0.65) translate(${from})`, color: 'var(--color-ginster)' },
            { transform: `scale(1.2) translate(${peak})`, color: 'var(--color-ginster)', offset: 0.72 },
            { transform: 'scale(1) translate(0, 0)', color: 'var(--color-ginster-deep)' },
          ],
          { duration: 920, delay, easing: 'cubic-bezier(.22, 1, .36, 1)', fill: 'backwards' },
        ),
      );

      if (target) {
        anims.push(
          target.animate(
            [
              { transform: 'none' },
              { transform: `translateY(-4px) rotate(${nodDeg}deg)`, offset: 0.45 },
              { transform: `translateY(1px) rotate(${(-nodDeg * 0.35).toFixed(2)}deg)`, offset: 0.78 },
              { transform: 'none' },
            ],
            { duration: 480, delay: delay + SHAFT + 40, easing: 'ease-out' },
          ),
        );
      }
    };

    triggers.forEach(({ event, delay }) => {
      board.addEventListener(event, () => play(delay));
    });
  };

  const cardArrow = canvas.querySelector<SVGSVGElement>('[data-card-arrow]');
  bindGrowArrow({
    triggers: [
      { event: 'whiteboard:gallery-closed', delay: 160 },
      { event: 'whiteboard:feedback-closed', delay: 720 },
    ],
    arrow: cardArrow,
    shaft: cardArrow?.querySelector<SVGPathElement>('[data-card-arrow-shaft]') ?? null,
    head: cardArrow?.querySelector<SVGPathElement>('[data-card-arrow-head]') ?? null,
    target: canvas.querySelector<HTMLElement>('.business-card'),
    from: '-4px, 1px',
    peak: '5px, -1px',
    nodDeg: 1.0,
  });
}
