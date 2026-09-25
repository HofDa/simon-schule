/**
 * Minimal scroll-scrubbing engine: scroll progress = animation progress.
 * Scenes render only from their progress value, so scrolling back plays the
 * animation backwards. With reduced motion (or when a scene's media query
 * does not match) every scene renders its final, fully visible state once.
 */

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Map p from [a, b] to [0, 1]. */
export const range = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export interface Scene {
  el: HTMLElement;
  /** Only scrub while this media query matches; otherwise render(1). */
  media?: string;
  /** Recompute geometry; called on start and resize. `active` tells whether the scene scrubs. */
  measure?: (active: boolean) => void;
  progress: (rect: DOMRect, vh: number) => number;
  render: (p: number) => void;
}

interface Entry extends Scene {
  active: boolean;
  last?: number;
}

const entries: Entry[] = [];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
let queued = false;
let started = false;

function frame() {
  queued = false;
  const vh = window.innerHeight;
  for (const s of entries) {
    if (!s.active) continue;
    const rect = s.el.getBoundingClientRect();
    const p = clamp(s.progress(rect, vh));
    if (p !== s.last) {
      s.last = p;
      s.render(p);
    }
  }
}

export function requestFrame() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(frame);
}

function refresh() {
  for (const s of entries) {
    s.active = !reduced.matches && (!s.media || window.matchMedia(s.media).matches);
    s.measure?.(s.active);
    s.last = undefined;
    if (!s.active) s.render(1);
  }
  requestFrame();
}

let resizeTimer = 0;
function onResize() {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(refresh, 120);
}

export function isMotionAllowed() {
  return !reduced.matches;
}

export function addScene(scene: Scene) {
  const entry: Entry = { ...scene, active: false };
  entries.push(entry);
  entry.active = !reduced.matches && (!scene.media || window.matchMedia(scene.media).matches);
  entry.measure?.(entry.active);
  if (!entry.active) entry.render(1);

  if (!started) {
    started = true;
    window.addEventListener('scroll', requestFrame, { passive: true });
    window.addEventListener('resize', onResize);
    reduced.addEventListener('change', refresh);
    // Fonts and images change layout after first paint.
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
  }
  requestFrame();
}

/**
 * Progress while a section with a sticky child scrolls past.
 * 0 when the child sticks, 1 when it releases.
 */
export const stickyProgress =
  (getTop: () => number = () => 0, getChildHeight?: () => number) =>
  (rect: DOMRect, vh: number) => {
    const top = getTop();
    const h = getChildHeight ? getChildHeight() : vh;
    return (top - rect.top) / Math.max(1, rect.height - h);
  };

/** Progress while an element's top travels from `from`·vh to `to`·vh. */
export const viewProgress =
  (from = 1, to = 0.4) =>
  (rect: DOMRect, vh: number) =>
    (vh * from - rect.top) / (vh * (from - to));

/** Reveal once when the element enters the viewport (for quiet sections). */
export function revealOnce(nodes: Iterable<Element>, rootMargin = '0px 0px -12% 0px') {
  const list = Array.from(nodes);
  if (reduced.matches || !('IntersectionObserver' in window)) {
    list.forEach((n) => n.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(
    (items) => {
      for (const item of items) {
        if (!item.isIntersecting) continue;
        item.target.classList.add('is-in');
        io.unobserve(item.target);
      }
    },
    { rootMargin },
  );
  list.forEach((n) => io.observe(n));
}
