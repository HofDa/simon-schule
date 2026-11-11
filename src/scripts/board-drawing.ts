/** The marker draws freehand, the ruler draws arrows, and the sponge resets the board. Both draw in
 * the marker colour chosen in the tool hint; the marker's cap on the tray shows it. */
export {};

const board = document.querySelector<HTMLElement>('[data-board-home]');
// announcements in the page's language, rendered by BoardNavigation.astro
const say: Record<string, string> = JSON.parse(board?.dataset.say ?? '{}');
const surface = board?.querySelector<SVGSVGElement>('[data-board-drawing]');
const pen = board?.querySelector<HTMLButtonElement>('[data-board-pen]');
const ruler = board?.querySelector<HTMLButtonElement>('[data-board-ruler]');
const eraser = board?.querySelector<HTMLButtonElement>('[data-board-eraser]');
const hint = board?.querySelector<HTMLElement>('[data-board-tool-hint]');
const hintText = board?.querySelector<HTMLElement>('[data-board-tool-hint-text]');
const announcement = board?.querySelector<HTMLElement>('[data-board-drag-status]');

if (board && surface && pen && ruler && eraser && hint && hintText && announcement) {
  const desktop = window.matchMedia('(min-width: 1024px)');
  type Tool = 'pen' | 'arrow';
  type Point = { x: number; y: number };
  type Arrow = { start: Point; end: Point };
  let mode: Tool | null = null;
  const colorButtons = Array.from(hint.querySelectorAll<HTMLButtonElement>('[data-board-color]'));
  let ink = colorButtons[0]?.dataset.boardColor ?? '#20201d';
  const setInk = (button: HTMLButtonElement) => {
    ink = button.dataset.boardColor ?? ink;
    colorButtons.forEach((b) => {
      b.setAttribute('aria-checked', String(b === button));
      b.tabIndex = b === button ? 0 : -1;
    });
    board.style.setProperty('--pen-ink', ink);
    board.dataset.penColor = button.getAttribute('aria-label') ?? '';
    announcement.textContent = `Stiftfarbe: ${button.getAttribute('aria-label')}.`;
  };
  board.dataset.penColor = colorButtons[0]?.getAttribute('aria-label') ?? '';
  colorButtons.forEach((button, i) => {
    button.addEventListener('click', () => setInk(button));
    // radio group: arrow keys move between the colours
    button.addEventListener('keydown', (event) => {
      const d = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!d) return;
      event.preventDefault();
      const next = colorButtons[(i + d + colorButtons.length) % colorButtons.length];
      setInk(next);
      next.focus();
    });
    button.tabIndex = i === 0 ? 0 : -1;
  });
  let stroke: { pointerId: number; path: SVGPathElement; d: string; tool: Tool; start: Point; end: Point } | null = null;
  const arrows = new Map<SVGPathElement, Arrow>();

  const coordinate = (point: Point) => `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  const point = (event: PointerEvent): Point => {
    const rect = surface.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1000, (event.clientX - rect.left) / rect.width * 1000)),
      y: Math.max(0, Math.min(1000, (event.clientY - rect.top) / rect.height * 1000)),
    };
  };
  const arrowLength = ({ start, end }: Arrow) => {
    const rect = surface.getBoundingClientRect();
    return Math.hypot((end.x - start.x) * rect.width / 1000, (end.y - start.y) * rect.height / 1000);
  };
  const drawArrow = (path: SVGPathElement, arrow: Arrow) => {
    const { start, end } = arrow;
    const rect = surface.getBoundingClientRect();
    const dx = (end.x - start.x) * rect.width / 1000;
    const dy = (end.y - start.y) * rect.height / 1000;
    const length = Math.hypot(dx, dy);
    if (length < 4) { path.setAttribute('d', ''); return; }
    const ux = dx / length;
    const uy = dy / length;
    const head = Math.min(24, length * .35);
    const wing = head * .5;
    // Calculate the head in screen pixels, so diagonal arrows keep their shape on wide boards.
    const left = { x: end.x + (-ux * head - uy * wing) * 1000 / rect.width, y: end.y + (-uy * head + ux * wing) * 1000 / rect.height };
    const right = { x: end.x + (-ux * head + uy * wing) * 1000 / rect.width, y: end.y + (-uy * head - ux * wing) * 1000 / rect.height };
    path.setAttribute('d', `M${coordinate(start)} L${coordinate(end)} M${coordinate(left)} L${coordinate(end)} L${coordinate(right)}`);
  };

  const updateInk = () => {
    board.dataset.boardDrawn = String(surface.childElementCount > 0);
    board.dispatchEvent(new Event('whiteboard:drawings-changed'));
  };
  const finish = (cancel = false) => {
    if (!stroke) return;
    const previous = stroke;
    stroke = null;
    if (cancel || (previous.tool === 'arrow' && arrowLength(previous) < 6)) {
      previous.path.remove();
      arrows.delete(previous.path);
    }
    if (surface.hasPointerCapture(previous.pointerId)) surface.releasePointerCapture(previous.pointerId);
    updateInk();
  };
  const setMode = (next: Tool | null) => {
    finish(true);
    mode = desktop.matches ? next : null;
    board.classList.toggle('is-drawing', mode !== null);
    if (mode) board.dataset.boardTool = mode;
    else delete board.dataset.boardTool;
    pen.setAttribute('aria-pressed', String(mode === 'pen'));
    ruler.setAttribute('aria-pressed', String(mode === 'arrow'));
    hint.hidden = mode === null;
    hintText.textContent = mode === 'arrow' ? say.rulerHint : say.penHint;
  };

  pen.addEventListener('click', () => {
    setMode(mode === 'pen' ? null : 'pen');
    announcement.textContent = mode === 'pen'
      ? say.penOn
      : say.penOff;
  });
  ruler.addEventListener('click', () => {
    setMode(mode === 'arrow' ? null : 'arrow');
    announcement.textContent = mode === 'arrow'
      ? say.rulerOn
      : say.rulerOff;
  });
  eraser.addEventListener('click', () => board.dispatchEvent(new Event('whiteboard:reset')));
  board.addEventListener('whiteboard:tools-idle', () => setMode(null));
  board.addEventListener('whiteboard:reset', () => {
    setMode(null);
    surface.replaceChildren();
    arrows.clear();
    updateInk();
    announcement.textContent = say.resetAll;
  });

  surface.addEventListener('pointerdown', (event) => {
    if (!mode || !event.isPrimary || event.button !== 0 || stroke) return;
    event.preventDefault();
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    // The tiny segment leaves a round marker dot even if the pointer never moves.
    const start = point(event);
    const d = mode === 'pen' ? `M${coordinate(start)} l0.01 0.01` : '';
    path.setAttribute('d', d);
    path.setAttribute('vector-effect', 'non-scaling-stroke');
    path.style.stroke = ink;
    surface.append(path);
    stroke = { pointerId: event.pointerId, path, d, tool: mode, start, end: start };
    if (mode === 'arrow') {
      path.setAttribute('data-board-arrow', '');
      arrows.set(path, stroke);
    }
    surface.setPointerCapture(event.pointerId);
  });
  surface.addEventListener('pointermove', (event) => {
    if (!stroke || stroke.pointerId !== event.pointerId) return;
    if (stroke.tool === 'arrow') {
      stroke.end = point(event);
      drawArrow(stroke.path, stroke);
      return;
    }
    const samples = event.getCoalescedEvents?.() ?? [];
    for (const sample of samples.length ? samples : [event]) stroke.d += ` L${coordinate(point(sample))}`;
    stroke.path.setAttribute('d', stroke.d);
  });
  surface.addEventListener('pointerup', (event) => {
    if (stroke?.pointerId !== event.pointerId) return;
    if (stroke.tool === 'arrow') {
      stroke.end = point(event);
      drawArrow(stroke.path, stroke);
    }
    finish();
  });
  surface.addEventListener('pointercancel', () => finish(true));
  surface.addEventListener('lostpointercapture', () => finish(true));
  // A completed drawing never turns into a click on a navigation item underneath it.
  surface.addEventListener('click', (event) => { event.preventDefault(); event.stopPropagation(); });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !mode) return;
    event.preventDefault();
    const activeTool = mode === 'arrow' ? ruler : pen;
    setMode(null);
    activeTool.focus({ preventScroll: true });
    announcement.textContent = say.toolOff;
  });
  board.addEventListener('click', (event) => {
    if ((event.target as Element | null)?.closest('a[href]')) setMode(null);
  });
  window.addEventListener('blur', () => finish(true));
  window.addEventListener('resize', () => {
    finish(true);
    if (desktop.matches) arrows.forEach((arrow, path) => drawArrow(path, arrow));
  });
  desktop.addEventListener('change', () => { if (!desktop.matches) setMode(null); });
  updateInk();
}
