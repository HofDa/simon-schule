/** One continuous textured sheet: no individually composited strips or seams. */
export {};

interface CurlScene {
  draw(progress: number): void;
  resize(): void;
  dispose(): void;
}

const link = document.querySelector<HTMLAnchorElement>('.board-catalog-link');
const sheet = link?.querySelector<HTMLElement>('.board-catalog-sheet');
const canvas = sheet?.querySelector<HTMLCanvasElement>('[data-catalog-curl-canvas]');
const front = sheet?.querySelector<HTMLImageElement>('[data-catalog-front]');
const back = sheet?.querySelector<HTMLImageElement>('[data-catalog-back]');
const item = link?.closest<HTMLElement>('[data-board-object]');
const board = link?.closest<HTMLElement>('[data-board-home]');

if (link && sheet && canvas && front && back && item && board) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 1024px)');
  const hover = matchMedia('(hover: hover) and (pointer: fine)');
  let hovered = false;
  let wanted = false;
  let unavailable = false;
  let progress = 0;
  let frame = 0;
  let lastTime = 0;
  let scene: CurlScene | null = null;
  let initialization: Promise<CurlScene | null> | null = null;

  const present = () => {
    scene?.draw(progress);
    sheet.style.setProperty('--catalog-curl-progress', String(progress));
    sheet.classList.toggle('is-curling', progress > 0 && Boolean(scene));
  };

  const initialize = (): Promise<CurlScene | null> => {
    if (initialization) return initialization;
    initialization = (async () => {
      try {
        const THREE = await import('three');
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
        renderer.setClearColor(0x000000, 0);
        const loader = new THREE.TextureLoader();
        const [frontTexture, backTexture] = await Promise.all([
          loader.loadAsync(front.currentSrc || front.src),
          loader.loadAsync(back.currentSrc || back.src),
        ]);
        // The shader copies source sRGB pixels directly, preserving the printed cover's colors.
        frontTexture.anisotropy = backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        const aspect = 1230 / 1744;
        const geometry = new THREE.PlaneGeometry(aspect, 1, 8, 128);
        const uniforms = {
          uFront: { value: frontTexture },
          uBack: { value: backTexture },
          uProgress: { value: 0 },
        };
        const material = new THREE.ShaderMaterial({
          uniforms,
          side: THREE.DoubleSide,
          transparent: true,
          vertexShader: `
            uniform float uProgress;
            varying vec2 vUv;
            varying float vLight;
            void main() {
              vUv = uv;
              vec3 p = position;
              float distanceFromTop = 1.0 - uv.y;
              float freeDistance = max(0.0, distanceFromTop - 0.12);
              float angle = uProgress * 2.55;
              vLight = 1.0;
              if (freeDistance > 0.0 && angle > 0.00001) {
                float radius = 0.88 / angle;
                float theta = freeDistance / radius;
                p.y = 0.38 - radius * sin(theta);
                p.z = radius * (1.0 - cos(theta));
                vLight = 0.88 + 0.12 * abs(cos(theta));
              }
              gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
            }
          `,
          fragmentShader: `
            uniform sampler2D uFront;
            uniform sampler2D uBack;
            varying vec2 vUv;
            varying float vLight;
            void main() {
              vec4 ink = gl_FrontFacing ? texture2D(uFront, vUv) : texture2D(uBack, vUv);
              gl_FragColor = vec4(ink.rgb * vLight, ink.a);
            }
          `,
        });
        const world = new THREE.Scene();
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        world.add(mesh);
        const camera = new THREE.OrthographicCamera(-aspect / 2, aspect / 2, 0.5, -0.5, 0.01, 10);
        camera.position.z = 3;
        const result: CurlScene = {
          draw(value) {
            uniforms.uProgress.value = value;
            renderer.render(world, camera);
          },
          resize() {
            if (sheet.clientWidth && sheet.clientHeight) renderer.setSize(sheet.clientWidth, sheet.clientHeight, false);
          },
          dispose() {
            geometry.dispose();
            material.dispose();
            frontTexture.dispose();
            backTexture.dispose();
            renderer.dispose();
          },
        };
        result.resize();
        return result;
      } catch {
        // Static images and the PDF link remain usable when WebGL is unavailable.
        unavailable = true;
        sheet.classList.add('curl-unavailable');
        return null;
      }
    })();
    return initialization;
  };

  const tick = (time: number) => {
    frame = 0;
    const delta = Math.min(48, lastTime ? time - lastTime : 16);
    lastTime = time;
    const target = wanted ? 1 : 0;
    progress += (target - progress) * (1 - Math.exp(-delta / 140));
    if (Math.abs(target - progress) < 0.0005) progress = target;
    present();
    if (progress !== target) frame = requestAnimationFrame(tick);
  };
  const animate = () => {
    if (!frame) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };
  const flatten = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    progress = 0;
    present();
  };
  const update = async () => {
    const blocked = !desktop.matches || reduced.matches || item.classList.contains('is-dragging') || board.classList.contains('is-drawing');
    wanted = !blocked && ((hover.matches && hovered) || link.matches(':focus-visible'));
    if (blocked) { flatten(); return; }
    if (wanted && !scene && !unavailable) scene = await initialize();
    if (scene) animate();
  };

  link.addEventListener('pointerenter', () => { hovered = true; void update(); });
  link.addEventListener('pointerleave', () => { hovered = false; void update(); });
  link.addEventListener('focus', () => void update());
  link.addEventListener('blur', () => void update());
  reduced.addEventListener('change', () => void update());
  desktop.addEventListener('change', () => void update());
  const observer = new MutationObserver(() => void update());
  observer.observe(item, { attributes: true, attributeFilter: ['class'] });
  observer.observe(board, { attributes: true, attributeFilter: ['class'] });
  new ResizeObserver(() => { scene?.resize(); if (scene) present(); }).observe(sheet);
  board.addEventListener('whiteboard:reset', () => { wanted = false; flatten(); });
  canvas.addEventListener('webglcontextlost', (event) => {
    event.preventDefault();
    unavailable = true;
    wanted = false;
    flatten();
    sheet.classList.add('curl-unavailable');
  });
  window.addEventListener('pagehide', (event) => {
    wanted = false;
    flatten();
    if (!event.persisted) { observer.disconnect(); scene?.dispose(); }
  });
}
