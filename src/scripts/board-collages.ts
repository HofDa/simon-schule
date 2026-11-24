/**
 * The collage stack on the whiteboard (BoardCollages.astro) and its gallery.
 * - Each page load starts with a randomly chosen project on top. While the stack is on screen and
 *   nobody is pointing at it, it shuffles: every few seconds the top print slides aside and is
 *   tucked underneath. Hover, focus, an open gallery, a drag or reduced motion pause it.
 * - A click on a stack opens the gallery at the project on top. The gallery builds each project's
 *   slides and thumbnails on demand from the JSON manifest in [data-gallery-data] so initial HTML
 *   and DOM stay small. Closing it leaves the last project seen on top of its stack.
 */
export {};

type GalleryPhoto = {
  alt: string;
  vs?: string[];
  src: string;
  w?: number | string;
  h?: number | string;
  webp: string;
  avif?: string;
  thumb: string;
  thumbSet: string;
};

type GalleryProject = {
  slug: string;
  name: string;
  credit: string;
  highlight: string;
  collage: string;
  collageSet: string;
  photos: GalleryPhoto[];
};

const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-collages]'));
const gallery = document.querySelector<HTMLDialogElement>('[data-gallery]');
// the gallery's words in the page's language, rendered by BoardCollages.astro
const words: Record<string, string> = JSON.parse(gallery?.dataset.words ?? '{}');
const galleryUrl = gallery?.dataset.galleryUrl ?? '';

type Stack = {
  root: HTMLElement;
  openButton: HTMLButtonElement;
  top: () => HTMLElement;
  has: (slug: string) => boolean;
  bringToTop: (slug: string) => void;
};

if (roots.length && gallery && galleryUrl) {
  // Keep the reference gallery available even on pages with a hidden board.
  if (gallery.parentElement !== document.body) document.body.append(gallery);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = window.matchMedia('(min-width: 1024px)');
  const responsive = Boolean(document.querySelector('[data-board-responsive]'));

  let projects: GalleryProject[] = [];
  let bySlug = new Map<string, GalleryProject>();
  let slugs: string[] = [];
  let manifestPromise: Promise<GalleryProject[]> | null = null;

  const ensureManifest = (): Promise<GalleryProject[]> => {
    if (projects.length) return Promise.resolve(projects);
    if (!manifestPromise) {
      manifestPromise = fetch(galleryUrl)
        .then((res) => {
          if (!res.ok) throw new Error(`Gallery manifest HTTP ${res.status}`);
          return res.json() as Promise<GalleryProject[]>;
        })
        .then((data) => {
          projects = data;
          bySlug = new Map(data.map((p) => [p.slug, p]));
          slugs = data.map((p) => p.slug);
          return data;
        })
        .catch(() => {
          manifestPromise = null;
          return [];
        });
    }
    return manifestPromise;
  };

  const photoCount = (slug: string) => bySlug.get(slug)?.photos.length ?? 0;

  const loadPrint = (print: HTMLElement) => {
    if (!responsive && !desktop.matches) return;
    const template = print.querySelector<HTMLTemplateElement>('[data-collage-image]');
    template?.replaceWith(template.content.cloneNode(true));
  };

  /** One stack on the board: starts on the SSR top print for instant LCP, then shuffles through all projects. */
  const makeStack = (root: HTMLElement): Stack | null => {
    const openButton = root.querySelector<HTMLButtonElement>('[data-collage-open]');
    if (!openButton) return null;
    const openHint = root.querySelector<HTMLElement>('[data-collage-open-hint]');
    const mapPin = root.querySelector<SVGGElement>('[data-map-pin]');
    const prints = Array.from(root.querySelectorAll<HTMLElement>('[data-collage-print]'));

    const loadStack = () => order.slice(0, desktop.matches ? 3 : 1).forEach(loadPrint);

    const layout = () => {
      order.forEach((print, pos) => {
        print.style.setProperty('--pos', String(pos));
        print.dataset.depth = pos < 3 ? String(pos) : 'deep';
        if (pos === 0) print.removeAttribute('aria-hidden');
        else print.setAttribute('aria-hidden', 'true');
      });
      root.dataset.topGroup = order[0].dataset.group ?? '';
      if (mapPin && order[0].dataset.pinX && order[0].dataset.pinY) {
        mapPin.style.transform = `translate(${order[0].dataset.pinX}px, ${order[0].dataset.pinY}px)`;
      }
      openButton.setAttribute('aria-label', order[0].dataset.openLabel ?? '');
      const count = order[0].dataset.photoCount ?? String(photoCount(order[0].dataset.slug!));
      if (openHint) openHint.textContent = (words.view ?? '').replace('{n}', count);
      loadStack();
    };

    // Keep print 0 on top at load so the HTML-preloaded LCP photo never flashes or double-fetches.
    let order = [...prints];
    layout();
    desktop.addEventListener('change', loadStack);
    root.closest('[data-board-home]')?.addEventListener('whiteboard:reset', () => {
      order = [...prints];
      layout();
    });

    // the shuffle -------------------------------------------------------------------------------
    const SHUFFLE_EVERY = 4200;
    let onScreen = false;
    let held = false; // pointer or keyboard focus on the stack
    let leaving: HTMLElement | null = null;
    const paused = () =>
      reduceMotion.matches || !onScreen || held || document.hidden || Boolean(gallery?.open) ||
      root.classList.contains('is-dragging') || Boolean(root.closest('[data-board-reader]'));
    const shuffle = () => {
      if (paused() || leaving || order.length < 2) return;
      loadPrint(order[1]); // the next print is ready before it is uncovered
      const top = order[0];
      leaving = top;
      top.classList.add('is-leaving');
      window.setTimeout(() => {
        order = [...order.slice(1), top];
        layout();
        top.classList.remove('is-leaving');
        leaving = null;
        loadPrint(order[1]);
      }, 560);
    };
    window.setInterval(shuffle, SHUFFLE_EVERY);
    new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; }, { threshold: 0.4 }).observe(root);
    root.addEventListener('pointerenter', () => (held = true));
    root.addEventListener('pointerleave', () => (held = false));
    root.addEventListener('focusin', () => (held = true));
    root.addEventListener('focusout', () => (held = false));

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

  // gallery ---------------------------------------------------------------------------------------

  const stage = gallery.querySelector<HTMLElement>('[data-gallery-stage]')!;
  const setsHost = gallery.querySelector<HTMLElement>('[data-gallery-sets]')!;
  const thumbsHost = gallery.querySelector<HTMLElement>('[data-gallery-thumbs-wrap]')!;
  const projectsHost = gallery.querySelector<HTMLElement>('[data-gallery-projects]')!;
  const title = gallery.querySelector<HTMLElement>('[data-gallery-title]')!;
  const counter = gallery.querySelector<HTMLElement>('[data-gallery-count]')!;
  const highlight = gallery.querySelector<HTMLElement>('[data-gallery-highlight]');
  const credit = gallery.querySelector<HTMLElement>('[data-gallery-credit]')!;
  const galleryInquire = gallery.querySelector<HTMLAnchorElement>('[data-gallery-inquire]');
  const prev = gallery.querySelector<HTMLButtonElement>('[data-gallery-step="-1"]')!;
  const next = gallery.querySelector<HTMLButtonElement>('[data-gallery-step="1"]')!;

  const sets = new Map<string, HTMLElement>();
  const thumbSets = new Map<string, HTMLElement>();
  let projectButtons: HTMLButtonElement[] = [];

  const makePicture = (opts: { src: string; webp: string; avif?: string; sizes: string; alt: string; w?: number | string; h?: number | string; lazy?: boolean }) => {
    const picture = document.createElement('picture');
    picture.style.display = 'contents';
    if (opts.avif) {
      const s = document.createElement('source');
      s.type = 'image/avif';
      s.srcset = opts.avif;
      s.sizes = opts.sizes;
      picture.append(s);
    }
    const s = document.createElement('source');
    s.type = 'image/webp';
    s.srcset = opts.webp;
    s.sizes = opts.sizes;
    picture.append(s);

    const img = document.createElement('img');
    img.src = opts.src;
    img.alt = opts.alt;
    img.decoding = 'async';
    img.draggable = false;
    if (opts.w) img.width = Number(opts.w);
    if (opts.h) img.height = Number(opts.h);
    if (opts.lazy) img.loading = 'lazy';
    picture.append(img);
    return picture;
  };

  const ensureProjectStrip = () => {
    if (projectButtons.length) return;
    const frag = document.createDocumentFragment();
    for (const c of projects) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'project';
      btn.dataset.project = c.slug;
      btn.setAttribute('aria-label', `${c.name}, ${c.photos.length} ${words.photos ?? ''}`);
      btn.title = c.name;
      btn.append(makePicture({ src: c.collage, webp: c.collageSet, sizes: '112px', alt: '', w: 320, h: 213 }));
      const label = document.createElement('span');
      label.textContent = c.name;
      btn.append(label);
      btn.addEventListener('click', () => {
        const p = slugs.indexOf(c.slug);
        if (p !== project) show(p, 0, p > project ? 1 : -1);
      });
      projectButtons.push(btn);
      frag.append(btn);
    }
    projectsHost.append(frag);
  };

  const ensureSet = (slug: string) => {
    const existing = sets.get(slug);
    if (existing) return existing;
    const c = bySlug.get(slug)!;
    const set = document.createElement('div');
    set.className = 'gallery-set';
    set.dataset.gallerySet = c.slug;
    set.hidden = true;

    c.photos.forEach((p, k) => {
      const fig = document.createElement('figure');
      fig.className = 'slide';
      fig.dataset.slide = '';
      fig.hidden = k !== 0;
      fig.append(makePicture({
        src: p.src,
        webp: p.webp,
        avif: p.avif,
        sizes: '(min-width: 1024px) 82vw, 100vw',
        alt: `${c.name} – ${p.alt}`,
        w: p.w,
        h: p.h,
        lazy: true,
      }));
      const cap = document.createElement('figcaption');
      const text = document.createElement('span');
      text.textContent = p.alt;
      cap.append(text);
      if (p.vs?.length) {
        const list = document.createElement('ul');
        list.className = 'slide-vs';
        list.setAttribute('aria-label', 'VS Möbel');
        for (const model of p.vs) {
          const item = document.createElement('li');
          item.textContent = model;
          list.append(item);
        }
        cap.append(list);
      }
      fig.append(cap);
      set.append(fig);
    });
    setsHost.append(set);
    sets.set(slug, set);

    const thumbs = document.createElement('div');
    thumbs.className = 'gallery-thumbs';
    thumbs.dataset.thumbSet = c.slug;
    thumbs.hidden = true;
    c.photos.forEach((p, k) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'thumb';
      btn.dataset.thumb = String(k);
      btn.setAttribute('aria-label', `${words.photo} ${k + 1}: ${p.alt}`);
      btn.append(makePicture({ src: p.thumb, webp: p.thumbSet, sizes: '120px', alt: '', w: 240, h: 160 }));
      btn.addEventListener('click', () => {
        if (k !== index) show(project, k, k > index ? 1 : -1);
      });
      thumbs.append(btn);
    });
    thumbsHost.append(thumbs);
    thumbSets.set(slug, thumbs);
    return set;
  };

  const slidesOf = (slug: string) => Array.from(ensureSet(slug).querySelectorAll<HTMLElement>('[data-slide]'));
  const nameOf = (slug: string) => bySlug.get(slug)?.name ?? '';
  let project = 0; // index into slugs
  let index = 0; // photo within the project
  let current: HTMLElement | null = null;

  const eagerImage = (img: HTMLImageElement | null | undefined) => {
    if (!img) return;
    img.loading = 'eager';
    img.removeAttribute('loading');
  };

  /** Load a photo before it is needed. */
  const warmPhoto = (p: number, i: number) => {
    const slug = slugs[(p + slugs.length) % slugs.length];
    const slides = slidesOf(slug);
    eagerImage(slides[(i + slides.length) % slides.length]?.querySelector('img'));
  };

  /** The photo before / after the current one, running on across projects. */
  const neighbour = (p: number, i: number, d: number): [number, number] => {
    const count = photoCount(slugs[p]);
    if (i + d >= 0 && i + d < count) return [p, i + d];
    const q = (p + d + slugs.length) % slugs.length;
    return [q, d > 0 ? 0 : photoCount(slugs[q]) - 1];
  };

  const updateChrome = () => {
    const slug = slugs[project];
    const meta = bySlug.get(slug)!;
    const count = meta.photos.length;
    title.textContent = meta.name;
    if (highlight) highlight.textContent = meta.highlight;
    if (galleryInquire) galleryInquire.dataset.topic = meta.name;
    counter.textContent = `${words.photo} ${index + 1} / ${count} · ${words.project} ${project + 1} / ${slugs.length}`;
    credit.textContent = meta.credit ? `${words.credit}: ${meta.credit}` : '';
    thumbSets.forEach((t, key) => {
      t.hidden = key !== slug;
    });
    thumbSets.get(slug)?.querySelectorAll<HTMLButtonElement>('[data-thumb]').forEach((t, k) => t.setAttribute('aria-current', String(k === index)));
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
    sets.forEach((set) => {
      set.querySelectorAll<HTMLElement>('[data-slide]').forEach((s) => {
        if (s !== to && s !== from) {
          s.getAnimations().forEach((a) => a.cancel());
          s.hidden = true;
        }
      });
    });
    from?.getAnimations().forEach((a) => a.cancel());
    to.getAnimations().forEach((a) => a.cancel());
    sets.forEach((set, slug) => {
      if (slug === slugs[project] || (from && set.contains(from))) set.hidden = false;
      else set.hidden = true;
    });
    slides.forEach((s) => eagerImage(s.querySelector('img')));
    to.hidden = false;
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
    from.animate([{ transform: 'none', opacity: 1 }, { transform: `translateX(${-direction * shift}%)`, opacity: 0 }], { duration: 260, easing }).finished.then(hideFrom, () => {});
    to.animate([{ transform: `translateX(${direction * shift}%)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 360, easing });
  };

  const step = (d: number) => {
    if (!slugs.length) return;
    const [p, i] = neighbour(project, index, d);
    show(p, i, d);
  };

  let opener: HTMLElement = stacks[0].openButton;
  let openToken = 0;
  const openProject = async (slug: string, trigger?: HTMLElement | null, sourceEl?: HTMLElement | null) => {
    const token = ++openToken;
    opener = trigger ?? stacks[0].openButton;
    current = null;
    sets.forEach((set) => (set.hidden = true));
    document.documentElement.classList.add('whiteboard-reading');
    if (!gallery.open) gallery.showModal();

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

    const loaded = await ensureManifest();
    if (!loaded.length || !gallery.open || token !== openToken) return;
    ensureProjectStrip();
    show(Math.max(0, slugs.indexOf(slug)), 0);
  };

  const openGallery = (stack: Stack, event?: Event) => {
    const print = stack.top();
    void openProject(print.dataset.slug!, (event?.currentTarget as HTMLElement | null) ?? stack.openButton, print);
  };

  const warmSlug = (slug: string) => {
    void ensureManifest().then((loaded) => {
      if (!loaded.length) return;
      const p = slugs.indexOf(slug);
      if (p < 0) return;
      warmPhoto(p, 0);
      warmPhoto(p, 1);
    });
  };

  for (const stack of stacks) {
    // hovering or focusing a stack prefetches the manifest and its top project's first photos
    const warm = () => warmSlug(stack.top().dataset.slug!);
    stack.openButton.addEventListener('pointerenter', warm);
    stack.openButton.addEventListener('focus', warm);
    stack.openButton.addEventListener('click', (event) => openGallery(stack, event));
  }
  // "oder erst Projekte ansehen" under the board's headline opens the gallery at the first stack
  document.querySelectorAll<HTMLElement>('[data-open-collages]').forEach((el) => {
    const warm = () => warmSlug(stacks[0].top().dataset.slug!);
    el.addEventListener('pointerenter', warm, { once: true });
    el.addEventListener('focus', warm, { once: true });
    el.addEventListener('click', (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      openGallery(stacks[0], event);
    });
  });
  // Reference cards in the page body open the matching project on both desktop and mobile
  document.querySelectorAll<HTMLElement>('[data-open-project]').forEach((el) => {
    const warm = () => { void ensureManifest(); };
    el.addEventListener('pointerenter', warm, { once: true });
    el.addEventListener('focus', warm, { once: true });
    el.addEventListener('click', () => void openProject(el.dataset.openProject!, el));
  });

  let closingForInquiry = false;
  galleryInquire?.addEventListener('click', () => {
    closingForInquiry = true;
    gallery.close();
  });
  gallery.querySelector('[data-gallery-close]')?.addEventListener('click', () => gallery.close());
  gallery.addEventListener('close', () => {
    const readerOpen = Boolean(document.querySelector('[data-board-reader][open]'));
    if (!readerOpen) document.documentElement.classList.remove('whiteboard-reading');
    // the project seen last goes on top of its own stack
    stacks.find((st) => st.has(slugs[project]))?.bringToTop(slugs[project]);
    if (!closingForInquiry) {
      opener.focus({ preventScroll: true });
      const boardHome = opener.closest<HTMLElement>('[data-board-home]');
      if (boardHome && desktop.matches) {
        boardHome.dispatchEvent(new CustomEvent('whiteboard:gallery-closed'));
      }
    }
    closingForInquiry = false;
  });
  // a click on the backdrop (outside the dialog box) closes it
  gallery.addEventListener('click', (event) => {
    const r = gallery.getBoundingClientRect();
    const outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
    if (outside && event.target === gallery) gallery.close();
  });
  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
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
