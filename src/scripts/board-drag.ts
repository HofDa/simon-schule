/** Magnet handles move the board objects; their separate links retain navigation. */
export {};

const board = document.querySelector<HTMLElement>('[data-board-home]');
const canvas = board?.querySelector<HTMLElement>('.board-canvas');
const reset = board?.querySelector<HTMLButtonElement>('[data-board-reset]');
const status = board?.querySelector<HTMLElement>('[data-board-drag-status]');

if (board && canvas && reset && status) {
  const desktop = window.matchMedia('(min-width: 1024px)');
  const items = Array.from(canvas.querySelectorAll<HTMLElement>('[data-board-object]'));
  const positions = new Map(items.map((item) => [item, { x: 0, y: 0 }]));
  let layer = 1;
  let drag: {
    item: HTMLElement; handle: HTMLButtonElement; pointerId: number;
    startX: number; startY: number; origin: { x: number; y: number }; moved: boolean;
  } | null = null;

  const updateReset = () => {
    const moved = Array.from(positions.values()).some(({ x, y }) => Math.abs(x) > .5 || Math.abs(y) > .5);
    reset.hidden = !moved && board.dataset.boardDrawn !== 'true';
  };
  const place = (item: HTMLElement, x: number, y: number, constrain = true) => {
    if (constrain) {
      const surface = canvas.getBoundingClientRect();
      const rect = item.getBoundingClientRect();
      const handle = item.querySelector<HTMLElement>('[data-board-handle]')!.getBoundingClientRect();
      const position = positions.get(item)!;
      const minX = position.x + surface.left + 10 - Math.min(rect.left, handle.left);
      const maxX = position.x + surface.right - 10 - Math.max(rect.right, handle.right);
      const minY = position.y + surface.top + 10 - Math.min(rect.top, handle.top);
      const maxY = position.y + surface.bottom - 10 - Math.max(rect.bottom, handle.bottom);
      x = Math.max(minX, Math.min(maxX, x));
      y = Math.max(minY, Math.min(maxY, y));
    }
    positions.set(item, { x, y });
    item.style.setProperty('--board-x', `${x}px`);
    item.style.setProperty('--board-y', `${y}px`);
    updateReset();
  };
  const announce = (item: HTMLElement, handle: HTMLButtonElement) => {
    const surface = canvas.getBoundingClientRect();
    const rect = item.getBoundingClientRect();
    const left = Math.round((rect.left - surface.left) / surface.width * 100);
    const top = Math.round((rect.top - surface.top) / surface.height * 100);
    status.textContent = `${handle.dataset.label}: ${left} Prozent von links, ${top} Prozent von oben.`;
  };
  const finish = (cancel = false) => {
    if (!drag) return;
    const previous = drag;
    drag = null;
    if (cancel) place(previous.item, previous.origin.x, previous.origin.y, false);
    previous.item.classList.remove('is-dragging');
    document.documentElement.classList.remove('whiteboard-dragging');
    if (previous.handle.hasPointerCapture(previous.pointerId)) previous.handle.releasePointerCapture(previous.pointerId);
    if (previous.moved) {
      if (cancel) status.textContent = 'Verschieben abgebrochen.';
      else announce(previous.item, previous.handle);
    }
  };

  items.forEach((item) => {
    const handle = item.querySelector<HTMLButtonElement>('[data-board-handle]')!;
    handle.addEventListener('pointerdown', (event) => {
      if (!desktop.matches || event.button !== 0 || !event.isPrimary || drag) return;
      event.preventDefault();
      handle.focus({ preventScroll: true });
      drag = { item, handle, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, origin: { ...positions.get(item)! }, moved: false };
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener('pointermove', (event) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.moved && Math.hypot(dx, dy) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        item.style.setProperty('--board-layer', String(++layer));
        item.classList.add('is-dragging');
        document.documentElement.classList.add('whiteboard-dragging');
      }
      place(item, drag.origin.x + dx, drag.origin.y + dy);
    });
    handle.addEventListener('pointerup', (event) => {
      if (drag?.pointerId === event.pointerId) finish();
    });
    handle.addEventListener('pointercancel', () => finish(true));
    handle.addEventListener('lostpointercapture', () => finish(true));
    handle.addEventListener('click', (event) => event.preventDefault());
    handle.addEventListener('keydown', (event) => {
      if (!desktop.matches || drag || event.altKey || event.ctrlKey || event.metaKey) return;
      const arrows: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      const direction = arrows[event.key];
      if (!direction && event.key !== 'Home') return;
      event.preventDefault();
      item.style.setProperty('--board-layer', String(++layer));
      const position = positions.get(item)!;
      const step = event.shiftKey ? 40 : 10;
      if (direction) place(item, position.x + direction[0] * step, position.y + direction[1] * step);
      else place(item, 0, 0, false);
      announce(item, handle);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && drag) {
      event.preventDefault();
      finish(true);
    }
  });
  window.addEventListener('blur', () => finish(true));
  board.addEventListener('whiteboard:drawings-changed', updateReset);
  board.addEventListener('whiteboard:reset', () => {
    finish(true);
    items.forEach((item) => {
      place(item, 0, 0, false);
      item.style.removeProperty('--board-layer');
    });
    layer = 1;
    status.textContent = 'Whiteboard zurückgesetzt.';
  });
  reset.addEventListener('click', () => {
    board.dispatchEvent(new Event('whiteboard:reset'));
    items[0]?.querySelector<HTMLButtonElement>('[data-board-handle]')?.focus({ preventScroll: true });
  });
  new ResizeObserver(() => {
    finish(true);
    if (!desktop.matches) return;
    items.forEach((item) => {
      const { x, y } = positions.get(item)!;
      if (x || y) place(item, x, y);
    });
  }).observe(canvas);
  board.classList.add('has-magnet-drag');
}
