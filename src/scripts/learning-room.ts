/**
 * The learning room in 3D: one classroom floor with a board at the front, furnished from
 * room-scenes.ts. Switching the arrangement moves the furniture both arrangements share
 * (chairs and Tano tops slide and turn to their new places), lets the rest shrink away and
 * brings new pieces in. Drag turns the room. It renders only while something moves;
 * reduced motion switches arrangements without the travel.
 */
import type * as THREE_NS from 'three';
import type { Piece, SceneName } from './room-scenes';

interface Live {
  key: string;
  object: THREE_NS.Object3D;
  from: { x: number; y: number; z: number; turn: number; scale: number };
  to: { x: number; y: number; z: number; turn: number; scale: number };
  /** seconds before this piece starts to move */
  delay: number;
  leaving: boolean;
}

export interface LearningRoom {
  show: (name: SceneName, instant?: boolean) => void;
}

const MOVE = 1.15; // s, one piece's travel
const STAGGER = 0.022; // s between pieces
const ROOM = { w: 8.6, d: 7.0 };

export async function createLearningRoom(host: HTMLElement, canvas: HTMLCanvasElement, first: SceneName): Promise<LearningRoom | null> {
  const [THREE, { Workshop }, { roomScene }] = await Promise.all([import('three'), import('./showroom-models'), import('./room-scenes')]);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer: THREE_NS.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 80);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xd8d4c8, 1.7));
  const key = new THREE.DirectionalLight(0xffffff, 2.3);
  key.position.set(4.5, 9, 5);
  key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  key.shadow.radius = 5;
  key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -6.5, right: 6.5, top: 6.5, bottom: -6.5, near: 0.5, far: 30 });
  key.shadow.camera.updateProjectionMatrix();
  scene.add(key, key.target);
  const fill = new THREE.DirectionalLight(0xfff3d6, 0.9);
  fill.position.set(-5, 4, -4);
  scene.add(fill);

  // the room turns as a whole: floor, board and furniture
  const room = new THREE.Group();
  scene.add(room);

  const floorShape = new THREE.Shape();
  const hw = ROOM.w / 2;
  const hd = ROOM.d / 2;
  const corner = 0.18;
  floorShape.moveTo(-hw + corner, -hd);
  floorShape.lineTo(hw - corner, -hd);
  floorShape.quadraticCurveTo(hw, -hd, hw, -hd + corner);
  floorShape.lineTo(hw, hd - corner);
  floorShape.quadraticCurveTo(hw, hd, hw - corner, hd);
  floorShape.lineTo(-hw + corner, hd);
  floorShape.quadraticCurveTo(-hw, hd, -hw, hd - corner);
  floorShape.lineTo(-hw, -hd + corner);
  floorShape.quadraticCurveTo(-hw, -hd, -hw + corner, -hd);
  const floor = new THREE.Mesh(
    new THREE.ExtrudeGeometry(floorShape, { depth: 0.06, bevelEnabled: false }),
    new THREE.MeshStandardMaterial({ color: 0xfbfaf6, roughness: 0.92 }),
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.06;
  floor.receiveShadow = true;
  room.add(floor);

  // the board at the front of the room, so every arrangement reads as the same classroom
  const boardFrame = new THREE.Mesh(new THREE.BoxGeometry(3.3, 1.26, 0.05), new THREE.MeshStandardMaterial({ color: 0xc9c6bd, roughness: 0.6 }));
  boardFrame.position.set(0, 1.45, -hd + 0.05);
  boardFrame.castShadow = true;
  const boardFace = new THREE.Mesh(new THREE.BoxGeometry(3.18, 1.14, 0.02), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35 }));
  boardFace.position.set(0, 1.45, -hd + 0.08);
  const tray = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.03, 0.1), new THREE.MeshStandardMaterial({ color: 0xa3a8a5, roughness: 0.4, metalness: 0.6 }));
  tray.position.set(0, 0.8, -hd + 0.1);
  const posts = [-1.5, 1.5].map((x) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 2.08, 0.05), new THREE.MeshStandardMaterial({ color: 0xa3a8a5, roughness: 0.4, metalness: 0.6 }));
    post.position.set(x, 1.04, -hd + 0.02);
    post.castShadow = true;
    return post;
  });
  room.add(boardFrame, boardFace, tray, ...posts);

  const workshop = new Workshop(THREE);
  const furniture = new THREE.Group();
  room.add(furniture);
  let live: Live[] = [];
  /** pieces taken out of the room, kept by key for the next arrangement that needs one */
  const spare = new Map<string, THREE_NS.Object3D[]>();

  const apply = (piece: Live, k: number) => {
    const { from, to, object } = piece;
    const lerp = (a: number, b: number) => a + (b - a) * k;
    object.position.set(lerp(from.x, to.x), lerp(from.y, to.y), lerp(from.z, to.z));
    object.rotation.y = lerp(from.turn, to.turn);
    object.scale.setScalar(Math.max(0.0001, lerp(from.scale, to.scale)));
  };
  const place = (spec: Piece) => ({ x: spec.x, y: spec.y, z: spec.z, turn: spec.turn, scale: 1 });
  const now = (piece: Live) => ({
    x: piece.object.position.x,
    y: piece.object.position.y,
    z: piece.object.position.z,
    turn: piece.object.rotation.y,
    scale: piece.object.scale.x,
  });

  let clock = 0;
  let travelling = false;

  const show = (name: SceneName, instant = false) => {
    const specs = roomScene(name);
    const jump = instant || reduceMotion;
    // what stands in the room, by kind, nearest first for each new place
    const standing = new Map<string, Live[]>();
    for (const piece of live) {
      if (piece.leaving) continue;
      standing.set(piece.key, [...(standing.get(piece.key) ?? []), piece]);
    }
    const next: Live[] = [];
    let order = 0;
    for (const spec of specs) {
      const same = standing.get(spec.key);
      const to = place(spec);
      if (same?.length) {
        // the nearest piece of this kind moves over
        let best = 0;
        let bestDistance = Infinity;
        same.forEach((candidate, i) => {
          const distance = Math.hypot(candidate.object.position.x - to.x, candidate.object.position.z - to.z);
          if (distance < bestDistance) {
            bestDistance = distance;
            best = i;
          }
        });
        const [piece] = same.splice(best, 1);
        piece.from = now(piece);
        // turn the short way round
        const turns = Math.round((piece.from.turn - to.turn) / (Math.PI * 2));
        piece.to = { ...to, turn: to.turn + turns * Math.PI * 2 };
        piece.delay = order++ * STAGGER;
        next.push(piece);
      } else {
        const object = spare.get(spec.key)?.pop() ?? spec.make(workshop);
        furniture.add(object);
        const piece: Live = { key: spec.key, object, from: { ...to, y: to.y + 0.35, scale: 0 }, to, delay: 0.25 + order++ * STAGGER, leaving: false };
        apply(piece, 0);
        next.push(piece);
      }
    }
    // whatever found no new place leaves
    const leaving: Live[] = [];
    for (const rest of standing.values()) {
      for (const piece of rest) {
        piece.from = now(piece);
        piece.to = { ...piece.from, scale: 0 };
        piece.delay = leaving.length * STAGGER * 0.5;
        piece.leaving = true;
        leaving.push(piece);
      }
    }
    const stillLeaving = live.filter((piece) => piece.leaving && !leaving.includes(piece));
    live = [...next, ...leaving, ...stillLeaving];
    clock = 0;
    if (jump) {
      settle();
      render();
    } else {
      travelling = true;
      start();
    }
  };

  const retire = (piece: Live) => {
    furniture.remove(piece.object);
    spare.set(piece.key, [...(spare.get(piece.key) ?? []), piece.object]);
  };
  const settle = () => {
    for (const piece of live) {
      if (piece.leaving) retire(piece);
      else apply(piece, 1);
    }
    live = live.filter((piece) => !piece.leaving);
    travelling = false;
  };

  // the view: a fixed height above the room, turned by dragging
  const HOME = -0.52;
  const view = { yaw: HOME, goal: HOME };
  let distance = 20;
  const fit = () => {
    const aspect = Math.max(0.4, camera.aspect);
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
    // the room is wider than it is tall on screen: fit its floor into the width, its depth and height into the height
    const across = Math.hypot(hw, hd) * 0.9;
    const upright = Math.hypot(hw, hd) * 0.56 + 0.85;
    distance = Math.max(across / Math.tan(hFov / 2), upright / Math.tan(vFov / 2));
  };
  const applyView = () => {
    room.rotation.y = view.yaw;
    const elevation = 0.6; // rad above the floor
    camera.position.set(0, Math.sin(elevation) * distance + 0.5, Math.cos(elevation) * distance);
    camera.lookAt(0, 0.5, 0);
  };
  const render = () => {
    applyView();
    renderer.render(scene, camera);
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = canvas;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    fit();
    render();
  };

  let dragging = false;
  let lastX = 0;
  canvas.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
    host.classList.add('is-dragging');
    start();
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    view.goal = Math.min(HOME + 1.1, Math.max(HOME - 1.1, view.goal + (e.clientX - lastX) * 0.006));
    lastX = e.clientX;
  });
  const release = () => {
    dragging = false;
    host.classList.remove('is-dragging');
  };
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', release);
  // the room is also turned from the keyboard
  canvas.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    view.goal = Math.min(HOME + 1.1, Math.max(HOME - 1.1, view.goal + (e.key === 'ArrowLeft' ? -0.25 : 0.25)));
    start();
  });

  const ease = (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
  let visible = true;
  let running = false;
  let last = performance.now();
  function start() {
    if (running || !visible) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(tick);
  }
  function tick(time: number) {
    // wall-clock, so a slow device finishes the move in the same time with fewer frames
    const dt = Math.min(0.25, (time - last) / 1000);
    last = time;
    if (travelling) {
      clock += dt;
      let busy = false;
      for (const piece of live) {
        const k = Math.min(1, Math.max(0, (clock - piece.delay) / (piece.leaving ? MOVE * 0.45 : MOVE)));
        apply(piece, ease(k));
        if (k < 1) busy = true;
      }
      if (!busy) settle();
    }
    const turning = Math.abs(view.goal - view.yaw) > 0.0008;
    view.yaw += (view.goal - view.yaw) * (reduceMotion ? 1 : 1 - Math.exp(-dt * 9));
    render();
    if (visible && (travelling || turning || dragging)) requestAnimationFrame(tick);
    else running = false;
  }

  new ResizeObserver(resize).observe(canvas);
  // Moving the canvas into another panel queues "gone" and "back" together: the last entry counts.
  new IntersectionObserver((entries) => {
    visible = entries[entries.length - 1].isIntersecting;
    start();
  }).observe(host);

  resize();
  show(first, true);
  return { show };
}
