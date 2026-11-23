/**
 * One continuous textured sheet: lightweight raw WebGL1 curl shader with zero Three.js dependency,
 * so hovering the VS catalog on the whiteboard never triggers downloading the 3D classroom engine.
 */
export {};

interface CurlScene {
  draw(progress: number): void;
  resize(): void;
  dispose(): void;
}

const link = document.querySelector<HTMLAnchorElement>('.board-catalog-link');
const sheet = link?.querySelector<HTMLElement>('.board-catalog-sheet');
const canvas = sheet?.querySelector<HTMLCanvasElement>('[data-catalog-curl-canvas]');
const firstPage = sheet?.querySelector<HTMLImageElement>('.catalog-first-page');
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

  /** Resolve the real image URL even for a lazy/hidden desktopOnly <picture>. */
  const resolveImageUrl = (el: HTMLImageElement): string => {
    if (el.currentSrc && !el.currentSrc.startsWith('data:')) return el.currentSrc;
    const source = el.closest('picture')?.querySelector<HTMLSourceElement>('source[type="image/webp"]');
    const srcset = source?.getAttribute('srcset') ?? '';
    const first = srcset.split(',')[0]?.trim().split(/\s+/)[0];
    return first || el.src;
  };

  const loadImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = url;
    });

  const initialize = (): Promise<CurlScene | null> => {
    if (initialization) return initialization;
    initialization = (async () => {
      try {
        if (firstPage) {
          firstPage.loading = 'eager';
          firstPage.removeAttribute('loading');
        }
        const gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
        if (!gl) throw new Error('WebGL unavailable');

        const [frontImg, backImg] = await Promise.all([
          loadImage(resolveImageUrl(front)),
          loadImage(resolveImageUrl(back)),
        ]);

        const compile = (type: number, source: string) => {
          const shader = gl.createShader(type);
          if (!shader) throw new Error('Shader alloc failed');
          gl.shaderSource(shader, source);
          gl.compileShader(shader);
          if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            gl.deleteShader(shader);
            throw new Error('Shader compile failed');
          }
          return shader;
        };

        const vs = compile(
          gl.VERTEX_SHADER,
          `
            attribute vec2 aUv;
            uniform float uProgress;
            varying vec2 vUv;
            varying float vLight;
            void main() {
              vUv = aUv;
              float x = aUv.x * 2.0 - 1.0;
              float y = aUv.y - 0.5;
              float z = 0.0;
              float distanceFromTop = 1.0 - aUv.y;
              float freeDistance = max(0.0, distanceFromTop - 0.12);
              float angle = uProgress * 2.55;
              vLight = 1.0;
              if (freeDistance > 0.0 && angle > 0.00001) {
                float radius = 0.88 / angle;
                float theta = freeDistance / radius;
                y = 0.38 - radius * sin(theta);
                z = radius * (1.0 - cos(theta));
                vLight = 0.88 + 0.12 * abs(cos(theta));
              }
              float ndcZ = -(2.0 * z + 4.01) / 9.99;
              gl_Position = vec4(x, y * 2.0, ndcZ, 1.0);
            }
          `,
        );
        const fs = compile(
          gl.FRAGMENT_SHADER,
          `
            precision mediump float;
            uniform sampler2D uFront;
            uniform sampler2D uBack;
            varying vec2 vUv;
            varying float vLight;
            void main() {
              vec4 ink = gl_FrontFacing ? texture2D(uFront, vUv) : texture2D(uBack, vUv);
              vec3 rgb = ink.rgb * vLight;
              gl_FragColor = vec4(rgb * ink.a, ink.a);
            }
          `,
        );

        const program = gl.createProgram();
        if (!program) throw new Error('Program alloc failed');
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          gl.deleteProgram(program);
          throw new Error('Program link failed');
        }
        gl.useProgram(program);

        // Build an 8x128 UV grid with CCW front-facing triangles (matches PlaneGeometry(aspect, 1, 8, 128)).
        const segX = 8;
        const segY = 128;
        const uvs = new Float32Array((segX + 1) * (segY + 1) * 2);
        let p = 0;
        for (let iy = 0; iy <= segY; iy++) {
          const v = iy / segY;
          for (let ix = 0; ix <= segX; ix++) {
            uvs[p++] = ix / segX;
            uvs[p++] = v;
          }
        }
        const indices = new Uint16Array(segX * segY * 6);
        let idx = 0;
        for (let iy = 0; iy < segY; iy++) {
          for (let ix = 0; ix < segX; ix++) {
            const a = iy * (segX + 1) + ix;
            const b = a + 1;
            const c = a + (segX + 1);
            const d = c + 1;
            indices[idx++] = a;
            indices[idx++] = b;
            indices[idx++] = d;
            indices[idx++] = a;
            indices[idx++] = d;
            indices[idx++] = c;
          }
        }

        const vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
        const aUv = gl.getAttribLocation(program, 'aUv');
        gl.enableVertexAttribArray(aUv);
        gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);

        const ibo = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        const aniso = gl.getExtension('EXT_texture_filter_anisotropic');
        const maxAniso = aniso ? gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 0;
        const makeTexture = (unit: number, img: HTMLImageElement) => {
          const tex = gl.createTexture();
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          if (aniso && maxAniso > 1) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          return tex;
        };

        const frontTex = makeTexture(0, frontImg);
        const backTex = makeTexture(1, backImg);
        gl.uniform1i(gl.getUniformLocation(program, 'uFront'), 0);
        gl.uniform1i(gl.getUniformLocation(program, 'uBack'), 1);
        const uProgress = gl.getUniformLocation(program, 'uProgress');

        gl.enable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);
        gl.clearColor(0, 0, 0, 0);

        const dpr = () => Math.min(devicePixelRatio || 1, 2);
        const result: CurlScene = {
          draw(value) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.uniform1f(uProgress, value);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
          },
          resize() {
            if (!sheet.clientWidth || !sheet.clientHeight) return;
            const scale = dpr();
            const w = Math.round(sheet.clientWidth * scale);
            const h = Math.round(sheet.clientHeight * scale);
            if (canvas.width !== w || canvas.height !== h) {
              canvas.width = w;
              canvas.height = h;
            }
            gl.viewport(0, 0, w, h);
          },
          dispose() {
            gl.deleteTexture(frontTex);
            gl.deleteTexture(backTex);
            gl.deleteBuffer(vbo);
            gl.deleteBuffer(ibo);
            gl.deleteProgram(program);
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
