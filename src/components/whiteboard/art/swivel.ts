/**
 * The PantoMove's turn about its gas spring column, in the chair's viewBox units (0 0 400 490).
 * Shared by the server render (the front view) and the entrance on the page.
 */

const HUB = { x: 200, y: 428 };
const REACH = 205; // arm length seen from the front: the outer tips land on x = 5 and 395
const FLOOR = 470; // tip height of an arm pointing across; nearer arms sit lower
const DEPTH = 10;

export interface Arm {
  d: string;
  glide: { x: number; y: number };
}

/** The five arms of the base for a chair turned by `angle` radians (0 = facing front). */
export function arms(angle: number): Arm[] {
  return Array.from({ length: 5 }, (_, k) => {
    const phi = angle + (k * 2 * Math.PI) / 5;
    const x = HUB.x + REACH * Math.sin(phi);
    const y = FLOOR + DEPTH * Math.cos(phi);
    // the arm dips from the hub and runs out flat to its glide
    const mx = HUB.x + (x - HUB.x) * 0.45;
    return {
      d: `M${HUB.x} ${HUB.y} Q${mx.toFixed(1)} ${(y - 4).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`,
      glide: { x: +(x - 9).toFixed(1), y: +(y + 2).toFixed(1) },
    };
  });
}

/** How the shell shows at `angle`: the front narrows as it turns away and gives way to the side profile.
    Around the hand-over both are drawn, solid, so the shell never turns see-through. */
export function shell(angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    frontScale: Math.max(0.02, Math.abs(c)),
    frontOpacity: Math.abs(c) > 0.3 ? 1 : 0,
    sideScale: (s >= 0 ? 1 : -1) * Math.max(0.02, Math.abs(s)),
    sideOpacity: Math.abs(c) < 0.5 ? 1 : 0,
    // the back of the shell, turned from the light, a shade darker
    shade: c < 0 ? 0.93 + 0.07 * (1 + c) : 1,
  };
}

/** Redraws a rendered chair (`[data-swivel]`) turned by `angle` radians. */
export function swivel(svg: SVGSVGElement, angle: number) {
  const armPaths = svg.querySelectorAll('[data-arm]');
  const glides = svg.querySelectorAll('[data-glide]');
  const front = svg.querySelector('[data-shell]');
  const side = svg.querySelector('[data-side]');
  arms(angle).forEach((arm, k) => {
    armPaths[k]?.setAttribute('d', arm.d);
    glides[k]?.setAttribute('x', String(arm.glide.x));
    glides[k]?.setAttribute('y', String(arm.glide.y));
  });
  const v = shell(angle);
  front?.setAttribute('transform', `translate(200 0) scale(${v.frontScale.toFixed(3)} 1) translate(-200 0)`);
  front?.setAttribute('opacity', v.frontOpacity.toFixed(3));
  side?.setAttribute('transform', `translate(200 0) scale(${v.sideScale.toFixed(3)} 1) translate(-200 0)`);
  side?.setAttribute('opacity', v.sideOpacity.toFixed(3));
  svg.style.setProperty('--shade', v.shade.toFixed(3));
}
