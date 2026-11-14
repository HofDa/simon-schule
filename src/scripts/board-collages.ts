/**
 * The collage stacks on the whiteboard (BoardCollages.astro), sharing one gallery.
 * - The stacks do not flip by themselves: on every page load each one shows a randomly chosen
 *   project on top, so a returning visitor sees other schools.
 * - A click on a stack opens the gallery at the project on top. The gallery browses everything:
 *   the arrows (or arrow keys, or a swipe) run through a project's photos and on into the next
 *   project; the strip of collages jumps straight to any project. Closing it leaves the last
 *   project seen on top of its stack.
 */
export {};

const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-collages]'));
const gallery = document.querySelector<HTMLDialogElement>('[data-gallery]');
// the gallery's words in the page's language, rendered by BoardCollages.astro
const words: Record<string, string> = JSON.parse(gallery?.dataset.words ?? '{}');

type Stack = {
  root: HTMLElement;
  openButton: HTMLButtonElement;
  top: () => HTMLElement;
  has: (slug: string) => boolean;
  bringToTop: (slug: string) => void;
};

if (roots.length && gallery) {
  // Keep the gallery dialog and its SVG photo filter outside `.board-home` so mobile viewports
  // (< 1024px, where `.board-home` is `display: none`) can still open any reference project.
  const filterSvg = document.getElementById('gallery-photo-finish')?.closest('svg');
  if (filterSvg && filterSvg.parentElement !== document.body) document.body.append(filterSvg);
  if (gallery.parentElement !== document.body) document.body.append(gallery);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const photoCount = (slug: string) => gallery.querySelectorAll(`[data-gallery-set="${slug}"] [data-slide]`).length;
  const loadPrint = (print: HTMLElement) => {
    if (!desktop.matches) return;
    const template = print.querySelector<HTMLTemplateElement>('[data-collage-image]');
    template?.replaceWith(template.content.cloneNode(true));
  };

  /** One stack on the board: its order (top first), with a random project on top. */
  const makeStack = (root: HTMLElement): Stack | null => {
    const openButton = root.querySelector<HTMLButtonElement>('[data-collage-open]');
    if (!openButton) return null;
    const openHint = root.querySelector<HTMLElement>('[data-collage-open-hint]');
    const prints = Array.from(root.querySelectorAll<HTMLElement>('[data-collage-print]'));

    const layout = () => {
      order.forEach((print, pos) => {
        print.style.setProperty('--pos', String(pos));
        print.dataset.depth = pos < 3 ? String(pos) : 'deep';
        if (pos === 0) print.removeAttribute('aria-hidden');
        else print.setAttribute('aria-hidden', 'true');
      });
      openButton.setAttribute('aria-label', order[0].dataset.openLabel ?? '');
      if (openHint) openHint.textContent = (words.view ?? '').replace('{n}', String(photoCount(order[0].dataset.slug!)));
      loadPrint(order[0]);
    };
    const rotateTo = (k: number) => [...prints.slice(k), ...prints.slice(0, k)];

    // Keep the other prints inert, even when the browser considers the stack near the viewport.
    const start = Math.floor(Math.random() * prints.length);
    let order = rotateTo(start);
    layout();
    desktop.addEventListener('change', () => loadPrint(order[0]));
    root.closest('[data-board-home]')?.addEventListener('whiteboard:reset', () => {
      order = rotateTo(start);
      layout();
    });

    return {
      root,
      openButton,
      top: () => order[0],
      has: (slug) => prints.some((p) => p.dataset.slug === slug),
      bringToTop: (slug) => {
        const k = order.findIndex((p) => p.dataset.slug === slug);
        if (k > 0) {
          order = [...order.slice(k), ...order.slice(0, k)];
          layout();
        }
      },
    };
  };
  const stacks = roots.map(makeStack).filter((s): s is Stack => Boolean(s));
  // the gallery runs through every project, in the order of its sets (stack by stack)
  const slugs = Array.from(gallery.querySelectorAll<HTMLElement>('[data-gallery-set]')).map((s) => s.dataset.gallerySet!);

  // gallery ---------------------------------------------------------------------------------------

  const stage = gallery.querySelector<HTMLElement>('[data-gallery-stage]')!;
  const title = gallery.querySelector<HTMLElement>('[data-gallery-title]')!;
  const counter = gallery.querySelector<HTMLElement>('[data-gallery-count]')!;
  const credit = gallery.querySelector<HTMLElement>('[data-gallery-credit]')!;
  const prev = gallery.querySelector<HTMLButtonElement>('[data-gallery-step="-1"]')!;
  const next = gallery.querySelector<HTMLButtonElement>('[data-gallery-step="1"]')!;
  const projectButtons = Array.from(gallery.querySelectorAll<HTMLButtonElement>('[data-project]'));
  const sets = new Map(slugs.map((slug) => [slug, gallery.querySelector<HTMLElement>(`[data-gallery-set="${slug}"]`)!]));
  const slidesOf = (slug: string) => Array.from(sets.get(slug)!.querySelectorAll<HTMLElement>('[data-slide]'));
  const nameOf = (slug: string) => sets.get(slug)!.dataset.name ?? '';
  let project = 0; // index into slugs
  let index = 0; // photo within the project
  let current: HTMLElement | null = null;

  /** Load a photo before it is needed. */
  const warmPhoto = (p: number, i: number) => {
    const slides = slidesOf(slugs[(p + slugs.length) % slugs.length]);
    const img = slides[(i + slides.length) % slides.length]?.querySelector('img');
    if (img) img.loading = 'eager';
  };

  /** The photo before / after the current one, running on across projects. */
  const neighbour = (p: number, i: number, d: number): [number, number] => {
    const count = slidesOf(slugs[p]).length;
    if (i + d >= 0 && i + d < count) return [p, i + d];
    const q = (p + d + slugs.length) % slugs.length;
    return [q, d > 0 ? 0 : slidesOf(slugs[q]).length - 1];
  };

  const updateChrome = () => {
    const slug = slugs[project];
    const count = slidesOf(slug).length;
    title.textContent = nameOf(slug);
    counter.textContent = `${words.photo} ${index + 1} / ${count} · ${words.project} ${project + 1} / ${slugs.length}`;
    credit.textContent = sets.get(slug)!.dataset.credit ? `${words.credit}: ${sets.get(slug)!.dataset.credit}` : '';
    gallery.querySelectorAll<HTMLElement>('[data-thumb-set]').forEach((t) => (t.hidden = t.dataset.thumbSet !== slug));
    gallery.querySelectorAll<HTMLButtonElement>(`[data-thumb-set="${slug}"] [data-thumb]`).forEach((t, k) => t.setAttribute('aria-current', String(k === index)));
    projectButtons.forEach((b) => b.setAttribute('aria-current', String(b.dataset.project === slug)));
    projectButtons.find((b) => b.dataset.project === slug)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    // at the ends of a project the arrows name the project they lead into
    for (const [button, d] of [[prev, -1], [next, 1]] as const) {
      const [q] = neighbour(project, index, d);
      const crossing = q !== project;
      const label = button.querySelector<HTMLElement>('[data-step-project]')!;
      button.toggleAttribute('data-crossing', crossing);
      label.textContent = crossing ? nameOf(slugs[q]) : '';
      button.setAttribute('aria-label', crossing ? `${d > 0 ? words.nextProject : words.prevProject}: ${nameOf(slugs[q])}` : d > 0 ? words.next : words.prev);
    }
    warmPhoto(...neighbour(project, index, 1));
    warmPhoto(...neighbour(project, index, -1));
  };

  /** Show photo i of project p; direction slides it in from that side (0: no animation). */
  const show = (p: number, i: number, direction = 0) => {
    const from = current;
    project = (p + slugs.length) % slugs.length;
    const slides = slidesOf(slugs[project]);
    index = (i + slides.length) % slides.length;
    const to = slides[index];
    sets.forEach((set, slug) => {
      if (slug === slugs[project] || (from && set.contains(from))) set.hidden = false;
      else set.hidden = true;
    });
    slides.forEach((s) => { if (s !== to && s !== from) s.hidden = true; });
    to.hidden = false;
    const img = to.querySelector('img');
    if (img) img.loading = 'eager';
    current = to;
    updateChrome();
    if (!from || from === to) return;
    const hideFrom = () => {
      if (current === from) return;
      from.hidden = true;
      const fromSet = from.closest<HTMLElement>('[data-gallery-set]');
      if (fromSet && fromSet.dataset.gallerySet !== slugs[project]) fromSet.hidden = true;
    };
    if (reduceMotion.matches || !direction) return hideFrom();
    const easing = 'cubic-bezier(.2, .8, .2, 1)';
    // moving into another project slides further, so the change of place is felt
    const shift = from.closest('[data-gallery-set]') === to.closest('[data-gallery-set]') ? 6 : 14;
    from.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-direction * shift}%)`, opacity: 0 }], { duration: 260, easing }).finished.then(hideFrom);
    to.animate([{ transform: `translateX(${direction * shift}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing });
  };

  const step = (d: number) => {
    const [p, i] = neighbour(project, index, d);
    show(p, i, d);
  };

  let opener: HTMLElement = stacks[0].openButton;
  const openProject = (slug: string, trigger?: HTMLElement | null, sourceEl?: HTMLElement | null) => {
    opener = trigger ?? stacks[0].openButton;
    current = null;
    sets.forEach((set) => (set.hidden = true));
    show(Math.max(0, slugs.indexOf(slug)), 0);
    document.documentElement.classList.add('whiteboard-reading');
    gallery.showModal();

    // the photos grow out of the print (or card) they belong to when visible
    if (!reduceMotion.matches) {
      const origin = sourceEl ?? trigger;
      const a = origin?.getBoundingClientRect();
      const b = stage.getBoundingClientRect();
      if (a && a.width > 0 && b.width > 0) {
        const scale = Math.max(0.08, a.width / b.width);
        const dx = a.left + a.width / 2 - (b.left + b.width / 2);
        const dy = a.top + a.height / 2 - (b.top + b.height / 2);
        stage.animate(
          [{ transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0.4 }, { transform: 'none', opacity: 1 }],
          { duration: 480, easing: 'cubic-bezier(.2, .8, .2, 1)' },
        );
      }
      gallery.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' });
    }
  };

  const openGallery = (stack: Stack, event?: Event) => {
    const print = stack.top();
    openProject(print.dataset.slug!, (event?.currentTarget as HTMLElement | null) ?? stack.openButton, print);
  };

  for (const stack of stacks) {
    // hovering or focusing a stack starts loading its top project's first photos
    const warm = () => {
      const p = slugs.indexOf(stack.top().dataset.slug!);
      warmPhoto(p, 0);
      warmPhoto(p, 1);
    };
    stack.openButton.addEventListener('pointerenter', warm);
    stack.openButton.addEventListener('focus', warm);
    stack.openButton.addEventListener('click', (event) => openGallery(stack, event));
  }
  // "oder erst Projekte ansehen" under the board's headline opens the gallery at the first stack
  document.querySelectorAll<HTMLElement>('[data-open-collages]').forEach((el) => el.addEventListener('click', (event) => openGallery(stacks[0], event)));
  // Reference cards in the page body open the matching project on both desktop and mobile
  document.querySelectorAll<HTMLElement>('[data-open-project]').forEach((el) =>
    el.addEventListener('click', () => openProject(el.dataset.openProject!, el)),
  );

  gallery.querySelector('[data-gallery-close]')?.addEventListener('click', () => gallery.close());
  gallery.addEventListener('close', () => {
    document.documentElement.classList.remove('whiteboard-reading');
    // the project seen last goes on top of its own stack
    stacks.find((st) => st.has(slugs[project]))?.bringToTop(slugs[project]);
    opener.focus({ preventScroll: true });
  });
  // a click on the backdrop (outside the dialog box) closes it
  gallery.addEventListener('click', (event) => {
    const r = gallery.getBoundingClientRect();
    const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
    if (outside && event.target === gallery) gallery.close();
  });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  gallery.querySelectorAll<HTMLButtonElement>('[data-thumb]').forEach((t) =>
    t.addEventListener('click', () => {
      const k = Number(t.dataset.thumb);
      if (k !== index) show(project, k, k > index ? 1 : -1);
    }),
  );
  projectButtons.forEach((b) =>
    b.addEventListener('click', () => {
      const p = slugs.indexOf(b.dataset.project!);
      if (p !== project) show(p, 0, p > project ? 1 : -1);
    }),
  );
  gallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') step(1);
    else if (event.key === 'ArrowLeft') step(-1);
    else return;
    event.preventDefault();
  });

  // swipe on touch screens and drag with a mouse
  let swipe: { x: number; id: number } | null = null;
  stage.addEventListener('pointerdown', (event) => {
    if ((event.target as HTMLElement).closest('button')) return;
    swipe = { x: event.clientX, id: event.pointerId };
  });
  stage.addEventListener('pointerup', (event) => {
    if (!swipe || swipe.id !== event.pointerId) return;
    const dx = event.clientX - swipe.x;
    swipe = null;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
  stage.addEventListener('pointercancel', () => (swipe = null));
}
