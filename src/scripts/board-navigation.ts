/** The desktop board presents the existing sections; each returns to its place on close. */
const board = document.querySelector<HTMLElement>('[data-board-home]');
const reader = document.querySelector<HTMLDialogElement>('[data-board-reader]');
const body = reader?.querySelector<HTMLElement>('[data-board-reader-body]');
const title = document.getElementById('board-reader-title');
const pageLink = reader?.querySelector<HTMLAnchorElement>('[data-board-read-page]');
const desktop = window.matchMedia('(min-width: 1024px)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

if (board && reader && body && title && pageLink) {
  let current: HTMLElement | null = null;
  let marker: Comment | null = null;
  let opener: HTMLElement | null = null;
  let returnHash = '#top';
  let scrollPosition = 0;
  let currentTopic = '';

  const refresh = () => window.dispatchEvent(new Event('whiteboard:content'));
  const sectionFor = (id: string) => document.getElementById(id)?.closest<HTMLElement>('main > section, [data-board-reader-body] > section') ?? null;
  const restore = () => {
    if (current && marker) marker.replaceWith(current);
    current = null;
    marker = null;
  };
  const close = (updateUrl = true, focus = true) => {
    if (!reader.open) return;
    reader.close();
    restore();
    document.documentElement.classList.remove('whiteboard-reading');
    refresh();
    window.scrollTo({ top: scrollPosition, behavior: 'instant' });
    if (updateUrl) history.replaceState(null, '', returnHash);
    if (focus) opener?.focus({ preventScroll: true });
    currentTopic = '';
  };

  const open = (id: string, trigger?: HTMLElement, updateUrl = true) => {
    const section = sectionFor(id);
    if (!desktop.matches || !section) return false;
    const topic = section.id;
    const navLink = reader.querySelector<HTMLAnchorElement>(`[data-board-topic="${topic}"]`);
    if (!navLink) return false;

    if (!reader.open) {
      opener = trigger ?? document.activeElement as HTMLElement;
      returnHash = location.hash.startsWith('#tafel-') ? '#top' : location.hash || '#top';
      scrollPosition = window.scrollY;
    }
    if (current !== section) {
      restore();
      marker = document.createComment(`whiteboard: ${topic}`);
      section.before(marker);
      body.append(section);
      current = section;
      currentTopic = topic;
      title.textContent = navLink.textContent;
      pageLink.setAttribute('href', `#${topic}`);
      reader.querySelectorAll<HTMLAnchorElement>('[data-board-topic]').forEach((link) => {
        link.setAttribute('aria-current', String(link.dataset.boardTopic === topic));
      });
      body.scrollTop = 0;
    }
    document.documentElement.classList.add('whiteboard-reading');
    if (id === 'anfrage') section.classList.add('is-form');
    if (!reader.open) reader.showModal();
    refresh();
    if (id !== topic) {
      requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target && body.contains(target)) body.scrollTop += target.getBoundingClientRect().top - body.getBoundingClientRect().top - 24;
      });
    }
    if (updateUrl) history.pushState(null, '', `#tafel-${id}`);
    return true;
  };

  // Capture before individual inquiry handlers: they retain their phase/topic transfer logic.
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href]');
    if (!link) return;
    if (link.matches('[data-board-scroll], [data-board-read-page]')) {
      if (reader.open) close(true, false);
      return;
    }
    if (!desktop.matches) return;

    const topic = link.dataset.boardTopic;
    const fromBoard = Boolean(link.closest('[data-board-home], [data-board-reader]'));
    const fromMenu = Boolean(link.closest('[data-board-menu]')) && window.scrollY < board.offsetHeight;
    const inquiry = link.hasAttribute('data-open-form');
    if (!topic && !fromBoard && !fromMenu && !(inquiry && window.scrollY < board.offsetHeight)) return;

    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const id = topic ?? url.hash.slice(1);
    if (id === 'top') {
      if (reader.open) { event.preventDefault(); close(); }
      return;
    }
    if (open(id, link)) {
      event.preventDefault();
      // Inquiry listeners run at the target, after this capture handler.
      // Keep the board URL after those listeners update the conventional form anchor.
      if (inquiry) queueMicrotask(() => history.replaceState(null, '', `#tafel-${id}`));
      else reader.querySelector<HTMLButtonElement>('[data-board-close]')?.focus({ preventScroll: true });
    }
  }, true);

  reader.querySelectorAll('[data-board-close]').forEach((button) => button.addEventListener('click', () => close()));
  reader.addEventListener('cancel', (event) => { event.preventDefault(); close(); });
  reader.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const controls = Array.from(reader.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex]'))
      .filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  // Follow ordinary anchor history and direct board links without cloning sections or forms.
  const followLocation = () => {
    if (location.hash.startsWith('#tafel-')) {
      const id = location.hash.slice(7);
      if (desktop.matches) open(id, undefined, false);
      else {
        close(false, false);
        history.replaceState(null, '', `#${id}`);
        document.getElementById(id)?.scrollIntoView();
      }
    } else if (reader.open) {
      close(false, false);
      const target = document.getElementById(location.hash.slice(1));
      target?.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth' });
    }
  };
  window.addEventListener('popstate', followLocation);
  window.addEventListener('hashchange', followLocation);
  desktop.addEventListener('change', () => {
    if (!desktop.matches && reader.open) {
      const id = currentTopic;
      close(false, false);
      history.replaceState(null, '', `#${id}`);
      document.getElementById(id)?.scrollIntoView();
    }
  });
  followLocation();
}
