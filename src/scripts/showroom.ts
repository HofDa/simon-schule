/**
 * Showroom turntable: VS furniture (see showroom-models.ts) spinning slowly inside the showroom
 * frame, switched with the piece buttons below it. Three.js loads when the visitor activates
 * the viewer; rendering pauses while it is off-screen. Drag rotates the piece by hand;
 * reduced motion keeps it still (drag still works) and swaps pieces without the transition.
 */
import type * as THREE_NS from 'three';
import type { PieceId } from './showroom-models';

/** How each piece is shown: camera elevation (rise per unit of distance) and a margin round it. */
const STAGING: Record<PieceId, { rise: number; margin: number; start: number }> = {
  pantoswing: { rise: 0.32, margin: 1.12, start: -0.6 },
  hokki: { rise: 0.38, margin: 1.35, start: 0 },
  tano: { rise: 0.62, margin: 1.02, start: 0.3 },
  puzzle: { rise: 0.62, margin: 1.02, start: -0.35 },
};

async function initShowroom(root: HTMLElement) {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-showroom-canvas]');
  if (!canvas) return false;
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-piece]')];
  const nameEl = root.querySelector<HTMLElement>('[data-piece-name]');
  const specEl = root.querySelector<HTMLElement>('[data-piece-spec]');

  const [THREE, { Workshop }] = await Promise.all([import('three'), import('./showroom-models')]);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: THREE_NS.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    root.classList.add('is-fallback');
    return false;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 40);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d4c8, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 6;
  key.shadow.bias = -0.0006;
  scene.add(key, key.target);
  const rim = new THREE.DirectionalLight(0xfff3d6, 1.2);
  rim.position.set(-1.8, 1.4, -1.6);
  scene.add(rim);

  // turntable plinth, a unit disc scaled to each piece's footprint
  const plinth = new THREE.Mesh(
    new THREE.CylinderGeometry(1, 1.03, 0.04, 128),
    new THREE.MeshStandardMaterial({ color: 0xf2f1ec, roughness: 0.85 }),
  );
  plinth.position.y = -0.02;
  plinth.receiveShadow = true;
  scene.add(plinth);

  const workshop = new Workshop(THREE);
  const built = new Map<PieceId, { group: THREE_NS.Group; radius: number; height: number }>();
  const turntable = new THREE.Group();
  scene.add(turntable);

  const prepare = (id: PieceId) => {
    let piece = built.get(id);
    if (!piece) {
      const group = workshop.build(id);
      // centre the footprint on the turntable
      const box = new THREE.Box3().setFromObject(group);
      const centre = box.getCenter(new THREE.Vector3());
      group.position.x -= centre.x;
      group.position.z -= centre.z;
      box.setFromObject(group);
      const radius = Math.max(
        ...[box.min.x, box.max.x].flatMap((x) => [box.min.z, box.max.z].map((z) => Math.hypot(x, z))),
      );
      piece = { group, radius, height: box.max.y };
      built.set(id, piece);
    }
    return piece;
  };

  // the camera eases towards the framing of the current piece
  const view = { distance: 2.4, targetY: 0.4, rise: 0.32, plinth: 0.52 };
  const goal = { ...view };
  let current: PieceId | null = null;

  const frame = (id: PieceId) => {
    const piece = prepare(id);
    const { rise, margin } = STAGING[id];
    const aspect = Math.max(0.5, camera.aspect);
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    // a sphere round the piece, fitted into the tighter of the two fields of view
    const halfHeight = piece.height / 2;
    const sphere = Math.hypot(piece.radius, halfHeight) * margin;
    goal.distance = sphere / Math.sin(Math.min(vFov, hFov) / 2);
    goal.targetY = halfHeight * 0.92;
    goal.rise = rise;
    goal.plinth = piece.radius * 1.08 + 0.04;
    // shadow camera to cover the piece
    const s = piece.radius * 1.4 + 0.2;
    Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 0.1, far: 12 });
    key.shadow.camera.updateProjectionMatrix();
  };

  const applyView = () => {
    const d = view.distance;
    const dir = new THREE.Vector3(0, view.rise, 1).normalize();
    camera.position.set(0, view.targetY, 0).addScaledVector(dir, d);
    camera.lookAt(0, view.targetY, 0);
    plinth.scale.set(view.plinth, 1, view.plinth);
    key.position.set(1.4, 2.6, 1.6).multiplyScalar(Math.max(1, d / 2.4));
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (current) frame(current);
  };

  // switching: shrink the old piece, swap, grow the new one
  let swap: { to: PieceId; t: number; swapped: boolean } | null = null;
  const show = (id: PieceId, instant = false) => {
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.piece === id)));
    const button = buttons.find((b) => b.dataset.piece === id);
    if (button && nameEl && specEl) {
      nameEl.textContent = button.dataset.name ?? '';
      specEl.textContent = button.dataset.spec ?? '';
      canvas.setAttribute('aria-label', button.dataset.label ?? '');
    }
    if (instant || reduceMotion || !current) {
      place(id);
      Object.assign(view, goal);
      applyView();
      renderer.render(scene, camera);
      return;
    }
    swap = { to: id, t: 0, swapped: false };
    start();
  };
  const place = (id: PieceId) => {
    turntable.clear();
    turntable.add(prepare(id).group);
    turntable.rotation.y = STAGING[id].start;
    turntable.scale.setScalar(1);
    current = id;
    frame(id);
  };

  new ResizeObserver(resize).observe(canvas);
  resize();
  show((buttons.find((b) => b.getAttribute('aria-pressed') === 'true')?.dataset.piece as PieceId) ?? 'pantoswing', true);
  buttons.forEach((b) => b.addEventListener('click', () => {
    const id = b.dataset.piece as PieceId;
    if (id !== current || swap) show(id);
  }));

  // drag to turn
  let dragging = false;
  let lastX = 0;
  let velocity = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
    root.classList.add('is-dragging');
    start();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    velocity = dx * 0.01;
    turntable.rotation.y += velocity;
  });
  const release = () => {
    dragging = false;
    root.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);

  const SPIN = 0.4; // rad/s
  const SWAP_TIME = 0.7; // s
  let visible = false;
  let running = false;
  let last = performance.now();
  function start() {
    if (running || !visible) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }
  const ease = (x: number) => 1 - (1 - x) ** 3;
  function tick(now: number) {
    const elapsed = (now - last) / 1000;
    const dt = Math.min(0.05, elapsed);
    last = now;
    if (!dragging) {
      velocity *= 0.92;
      turntable.rotation.y += velocity + (reduceMotion ? 0 : SPIN * dt);
    }
    if (swap) {
      swap.t += Math.min(0.25, elapsed) / SWAP_TIME; // wall-clock, so slow frames do not stall the swap
      if (!swap.swapped && swap.t >= 0.4) {
        place(swap.to);
        swap.swapped = true;
      }
      // out over the first 40 %, in over the rest
      const k = swap.t < 0.4 ? 1 - ease(swap.t / 0.4) : ease(Math.min(1, (swap.t - 0.4) / 0.6));
      turntable.scale.setScalar(Math.max(0.001, k));
      if (swap.t >= 1) {
        turntable.scale.setScalar(1);
        swap = null;
      }
    }
    // ease the camera and plinth towards the current piece
    const f = 1 - Math.exp(-Math.min(0.25, elapsed) * 6);
    let moving = false;
    for (const k of ['distance', 'targetY', 'rise', 'plinth'] as const) {
      view[k] += (goal[k] - view[k]) * f;
      if (Math.abs(goal[k] - view[k]) > 0.0005) moving = true;
    }
    applyView();
    renderer.render(scene, camera);
    const busy = !reduceMotion || dragging || swap || moving || Math.abs(velocity) > 0.0005;
    if (visible && busy) requestAnimationFrame(tick);
    else running = false;
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    start();
  }).observe(root);
  root.classList.add('is-ready');
  return true;
}

export function setupShowrooms() {
  document.querySelectorAll<HTMLElement>('[data-showroom]').forEach((root) => {
    const activate = root.querySelector<HTMLButtonElement>('[data-showroom-activate]');
    const status = root.querySelector<HTMLElement>('[data-showroom-status]');
    if (!activate || !status) return;
    let pending = false;
    activate.addEventListener('click', async () => {
      if (pending || root.classList.contains('is-ready')) return;
      const moveFocus = document.activeElement === activate;
      pending = true;
      activate.disabled = true;
      activate.textContent = activate.dataset.loadingLabel ?? '';
      status.textContent = activate.textContent;
      root.setAttribute('aria-busy', 'true');
      root.classList.remove('is-fallback');
      try {
        if (!await initShowroom(root)) throw new Error('Viewer unavailable');
        root.querySelectorAll<HTMLButtonElement>('[data-piece]').forEach((button) => { button.disabled = false; });
        status.textContent = '';
        if (moveFocus) root.querySelector<HTMLButtonElement>('[data-piece]')?.focus({ preventScroll: true });
      } catch {
        root.classList.add('is-fallback');
        activate.textContent = activate.dataset.retryLabel ?? '';
        status.textContent = activate.dataset.errorLabel ?? '';
      } finally {
        pending = false;
        activate.disabled = false;
        root.setAttribute('aria-busy', 'false');
      }
    });
  });
}
