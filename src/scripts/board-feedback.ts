/**
 * The "Feedback" letters on the whiteboard (BoardFeedback.astro): a click takes the letter off the
 * board into the middle and unfolds it; the pager flips through the letters; Escape, the backdrop,
 * the close button, picking up its magnet, the pen or a board reset fold it back onto the board.
 */
export {};

const board = document.querySelector<HTMLElement>('[data-board-home]');
const canvas = board?.querySelector<HTMLElement>('.board-canvas');
const item = board?.querySelector<HTMLElement>('[data-feedback]');

if (board && canvas && item) {
  const anchor = item.querySelector<HTMLElement>('[data-feedback-anchor]')!;
  const letter = item.querySelector<HTMLElement>('[data-feedback-letter]')!;
  const openButton = item.querySelector<HTMLButtonElement>('[data-feedback-open]')!;
  const closeButton = item.querySelector<HTMLButtonElement>('[data-feedback-close]')!;
  const controls = item.querySelector<HTMLElement>('[data-feedback-controls]')!;
  const count = item.querySelector<HTMLElement>('[data-feedback-count]');
  const from = item.querySelector<HTMLElement>('[data-feedback-from]');
  const handle = item.querySelector<HTMLElement>('[data-board-handle]');
  const backdrop = board.querySelector<HTMLElement>('[data-feedback-backdrop]');
  const panels = Array.from(item.querySelectorAll<HTMLElement>('[data-feedback-panel]'));
  const total = new Set(panels.map((p) => p.dataset.feedbackPanel)).size;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0;
  let open = false;

  /** Where the letter goes: unfolded and centred on the board, as large as the board allows. */
  const measure = () => {
    const surface = canvas.getBoundingClientRect();
    const rect = anchor.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height * 3; // the anchor is one third of the page
    const s = Math.min((surface.height * 0.88) / h, (surface.width * 0.6) / w);
    const cx = surface.left + surface.width / 2;
    const cy = surface.top + surface.height / 2;
    letter.style.setProperty('--open-x', `${cx - (s * w) / 2 - rect.left}px`);
    letter.style.setProperty('--open-y', `${cy - (s * h) / 2 - (rect.top - rect.height)}px`);
    letter.style.setProperty('--open-s', s.toFixed(3));
  };

  /** Show letter i in all three folds and let its words be written again. */
  const show = (i: number, paging: boolean) => {
    index = (i + total) % total;
    panels.forEach((panel) => (panel.hidden = Number(panel.dataset.feedbackPanel) !== index));
    if (count) count.textContent = `${index + 1} / ${total}`;
    const name = panels.find((p) => Number(p.dataset.feedbackPanel) === index)?.querySelector('.entry-name')?.textContent;
    if (from && name) from.textContent = name;
    letter.classList.remove('is-live', 'is-paging');
    void letter.offsetWidth; // restart the animations
    letter.classList.add('is-live');
    letter.classList.toggle('is-paging', paging);
  };

  const setOpen = (next: boolean) => {
    if (next === open) return;
    open = next;
    if (open) {
      measure();
      show(index, false);
    }
    item.classList.toggle('is-open', open);
    board.classList.toggle('is-feedback-open', open);
    openButton.setAttribute('aria-expanded', String(open));
    controls.inert = !open;
    if (open) {
      closeButton.focus({ preventScroll: true });
    } else {
      window.setTimeout(() => { if (!open) letter.classList.remove('is-live', 'is-paging'); }, reduceMotion.matches ? 0 : 900);
      openButton.focus({ preventScroll: true });
    }
  };

  openButton.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', () => setOpen(false));
  backdrop?.addEventListener('click', () => setOpen(false));
  item.querySelectorAll<HTMLButtonElement>('[data-feedback-step]').forEach((button) =>
    button.addEventListener('click', () => show(index + Number(button.dataset.feedbackStep), true)),
  );

  document.addEventListener('keydown', (event) => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    } else if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && item.contains(document.activeElement)) {
      event.preventDefault();
      show(index + (event.key === 'ArrowRight' ? 1 : -1), true);
    } else if (event.key === 'Tab') {
      // keep focus inside the open letter
      const focusable = Array.from(controls.querySelectorAll<HTMLElement>('button'));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  // while folded on the board, the name on the outside changes every few seconds (the letter then
  // opens on that person); it rests while the letter is hovered, focused, dragged, open or off-screen
  const ROTATE_MS = 4500;
  let onScreen = true;
  let resting = false;
  const rotate = () => {
    if (open || resting || !onScreen || total < 2 || document.hidden || reduceMotion.matches || item.classList.contains('is-dragging')) return;
    const nextIndex = (index + 1) % total;
    const name = panels.find((p) => Number(p.dataset.feedbackPanel) === nextIndex)?.querySelector('.entry-name')?.textContent;
    if (!from || !name) return;
    from.classList.add('is-changing');
    window.setTimeout(() => {
      if (open) return from.classList.remove('is-changing');
      index = nextIndex;
      panels.forEach((panel) => (panel.hidden = Number(panel.dataset.feedbackPanel) !== index));
      if (count) count.textContent = `${index + 1} / ${total}`;
      from.textContent = name;
      from.classList.remove('is-changing');
    }, 350);
  };
  window.setInterval(rotate, ROTATE_MS);
  for (const [type, value] of [['pointerenter', true], ['pointerleave', false], ['focus', true], ['blur', false]] as const) {
    openButton.addEventListener(type, () => (resting = value));
  }
  new IntersectionObserver(([entry]) => (onScreen = entry.isIntersecting)).observe(item);

  handle?.addEventListener('pointerdown', () => setOpen(false), { capture: true });
  board.addEventListener('whiteboard:reset', () => setOpen(false));
  board.querySelector('[data-board-pen]')?.addEventListener('click', () => setOpen(false));
  new ResizeObserver(() => { if (open) measure(); }).observe(canvas);
}
