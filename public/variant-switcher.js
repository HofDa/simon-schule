(() => {
  const script = document.querySelector('script[data-variant-switcher]');
  if (!script || document.querySelector('[data-variant-palette]')) return;

  const base = new URL(script.src, location.href).pathname.replace(/variant-switcher\.js$/, '');
  const variants = [
    { key: 'masskette', number: '01', title: 'Die Maßkette', description: 'Der neue Entwurf' },
    { key: 'schnitt', number: '02', title: 'Schnitt durch die Schule', description: 'Ein Rundgang durch die Räume' },
    { key: 'old', number: '03', title: 'Bisherige Version', description: 'Der vorherige Entwurf' },
    { key: 'leistungsverzeichnis', number: '04', title: 'Das Leistungsverzeichnis', description: 'Ein Projekt als Dossier' },
  ];
  const current = location.pathname.slice(base.length).split('/')[0];
  const root = document.createElement('div');
  root.className = 'vs-switcher';
  root.dataset.variantPalette = '';
  root.innerHTML = `
    <button class="vs-trigger" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="vs-palette">
      <span class="vs-trigger-mark" aria-hidden="true">↗</span>
      <span>Varianten</span>
      <kbd>⌘ K</kbd>
    </button>
    <div class="vs-backdrop" hidden></div>
    <section id="vs-palette" class="vs-panel" role="dialog" aria-modal="true" aria-labelledby="vs-title" hidden>
      <div class="vs-heading">
        <div><p>TRIAS SCHULE / ENTWÜRFE</p><h2 id="vs-title">Variante wechseln</h2></div>
        <button class="vs-close" type="button" aria-label="Schließen">×</button>
      </div>
      <label class="vs-search-label" for="vs-search">Variante suchen</label>
      <input id="vs-search" class="vs-search" type="search" placeholder="Name oder Nummer eingeben …" autocomplete="off" />
      <nav aria-label="Website-Varianten"><ul class="vs-list"></ul></nav>
      <p class="vs-empty" hidden>Keine Variante gefunden.</p>
      <div class="vs-footer"><span>↑ ↓ auswählen</span><span>↵ öffnen</span><span>Esc schließen</span></div>
    </section>`;
  document.body.append(root);
  root.querySelector('.vs-trigger kbd').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';

  const trigger = root.querySelector('.vs-trigger');
  const backdrop = root.querySelector('.vs-backdrop');
  const panel = root.querySelector('.vs-panel');
  const closeButton = root.querySelector('.vs-close');
  const search = root.querySelector('.vs-search');
  const list = root.querySelector('.vs-list');
  const empty = root.querySelector('.vs-empty');
  let previousFocus = null;
  let previousOverflow = '';

  for (const variant of variants) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = `${base}${variant.key}/`;
    link.className = 'vs-option';
    link.dataset.search = `${variant.number} ${variant.title} ${variant.description}`.toLocaleLowerCase('de');
    if (current === variant.key) link.setAttribute('aria-current', 'page');
    const number = document.createElement('span');
    number.className = 'vs-number';
    number.textContent = variant.number;
    const copy = document.createElement('span');
    copy.className = 'vs-copy';
    const title = document.createElement('strong');
    title.textContent = variant.title;
    const description = document.createElement('small');
    description.textContent = variant.description;
    copy.append(title, description);
    const end = document.createElement('span');
    end.className = 'vs-end';
    end.textContent = current === variant.key ? 'AKTUELL' : '↗';
    link.append(number, copy, end);
    item.append(link);
    list.append(item);
  }

  const visibleLinks = () => [...list.querySelectorAll('a')].filter((link) => !link.parentElement.hidden);
  const open = () => {
    if (!panel.hidden) return;
    previousFocus = document.activeElement;
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panel.hidden = false;
    backdrop.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    search.value = '';
    filter();
    search.focus();
  };
  const close = () => {
    if (panel.hidden) return;
    panel.hidden = true;
    backdrop.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = previousOverflow;
    if (previousFocus instanceof HTMLElement) previousFocus.focus();
  };
  const filter = () => {
    const query = search.value.trim().toLocaleLowerCase('de');
    for (const link of list.querySelectorAll('a')) {
      link.parentElement.hidden = !link.dataset.search.includes(query);
    }
    empty.hidden = visibleLinks().length > 0;
  };

  trigger.addEventListener('click', open);
  closeButton.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  search.addEventListener('input', filter);
  panel.addEventListener('keydown', (event) => {
    const links = visibleLinks();
    if (event.key === 'Enter' && document.activeElement === search && links[0]) {
      location.href = links[0].href;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!links.length) return;
      event.preventDefault();
      const index = links.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (index + 1) % links.length : (index <= 0 ? links.length - 1 : index - 1);
      links[next].focus();
    }
    if (event.key === 'Tab') {
      const focusable = [closeButton, search, ...links];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      panel.hidden ? open() : close();
    } else if (event.key === 'Escape' && !panel.hidden) {
      event.preventDefault();
      close();
    }
  });
})();
