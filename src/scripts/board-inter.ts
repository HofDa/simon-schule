/**
 * Easter egg: click the tray tools ruler → eraser → pen → ruler → eraser, all within 5 seconds,
 * and a little Inter Milan match sheet gets taped to the lower left of the whiteboard. While a
 * game is running it works as a live ticker (refreshes every 30 s); otherwise it shows the last
 * result with stats plus the next fixture. Repeat the sequence or press × to take it down.
 * Data: ESPN's public site API (CORS-open, no key). Nothing is fetched until the egg is found.
 */
type Tool = 'ruler' | 'eraser' | 'pen';
const SEQUENCE: Tool[] = ['ruler', 'eraser', 'pen', 'ruler', 'eraser'];
const WITHIN = 5000; // ms from the first to the last click of the sequence
const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all';
const INTER = '110';

const board = document.querySelector<HTMLElement>('[data-board-home]');
const canvas = board?.querySelector<HTMLElement>('.board-canvas');

type Json = any; // eslint-disable-line @typescript-eslint/no-explicit-any

const it = document.documentElement.lang.startsWith('it');
const L = it
  ? { live: 'In diretta', last: 'Ultima partita', next: 'Prossima', poss: 'Possesso', shots: 'Tiri (in porta)', corners: 'Angoli', cards: 'Cartellini', close: 'Chiudi', error: 'Nessun dato al momento.', loading: 'Carico…', ht: 'Intervallo' }
  : { live: 'Live', last: 'Letztes Spiel', next: 'Nächstes', poss: 'Ballbesitz', shots: 'Schüsse (aufs Tor)', corners: 'Ecken', cards: 'Karten', close: 'Schließen', error: 'Gerade keine Daten.', loading: 'Lade…', ht: 'Halbzeit' };
const locale = it ? 'it-IT' : 'de-DE';

if (board && canvas) {
  let clicks: { tool: Tool; at: number }[] = [];
  let sheet: HTMLElement | null = null;
  let timer = 0;

  const step = (tool: Tool) => {
    clicks = [...clicks, { tool, at: performance.now() }].slice(-SEQUENCE.length);
    const matches = clicks.length === SEQUENCE.length
      && clicks.every((c, i) => c.tool === SEQUENCE[i])
      && clicks[clicks.length - 1].at - clicks[0].at <= WITHIN;
    if (matches) {
      clicks = [];
      if (sheet) close();
      else open();
    }
  };

  (['ruler', 'eraser', 'pen'] as Tool[]).forEach((tool) =>
    board.querySelector(`[data-board-${tool}]`)?.addEventListener('click', () => step(tool)));

  const el = <K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };

  const get = async (url: string): Promise<Json> => {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
  };

  function open() {
    sheet = el('aside', 'inter-ticker');
    sheet.setAttribute('aria-live', 'polite');
    sheet.setAttribute('aria-label', 'Inter');
    sheet.append(el('p', 'inter-loading', L.loading));
    canvas!.append(sheet);
    board!.classList.add('has-inter');
    void refresh();
  }

  function close() {
    window.clearTimeout(timer);
    sheet?.remove();
    sheet = null;
    board!.classList.remove('has-inter');
  }

  async function refresh() {
    const current = sheet;
    if (!current) return;
    let live = false;
    try {
      // The team endpoint has no CORS header, but both schedule lists do: results + fixtures.
      const [results, fixtures] = await Promise.all([
        get(`${API}/teams/${INTER}/schedule`),
        get(`${API}/teams/${INTER}/schedule?fixture=true`),
      ]);
      const events: Json[] = [...(results.events ?? []), ...(fixtures.events ?? [])];
      const state = (e: Json) => e.competitions?.[0]?.status?.type?.state;
      const byDate = (a: Json, b: Json) => String(a.date).localeCompare(String(b.date));
      const running = events.find((e) => state(e) === 'in');
      const next = events.filter((e) => state(e) === 'pre').sort(byDate)[0] ?? null;
      live = Boolean(running);
      const eventId: string | undefined = running?.id ?? events.filter((e) => state(e) === 'post').sort(byDate).at(-1)?.id;
      if (!eventId) throw new Error('no event');
      const summary = await get(`${API}/summary?event=${eventId}`);
      if (sheet === current) render(current, summary, live, live ? null : next);
    } catch {
      if (sheet === current) {
        current.replaceChildren(closeButton(), el('p', 'inter-loading', L.error));
      }
    }
    if (sheet === current) timer = window.setTimeout(refresh, live ? 30_000 : 5 * 60_000);
  }

  function closeButton() {
    const button = el('button', 'inter-close', '×');
    button.type = 'button';
    button.setAttribute('aria-label', L.close);
    button.addEventListener('click', close);
    return button;
  }

  function render(target: HTMLElement, summary: Json, live: boolean, next: Json | null) {
    const comp = summary.header?.competitions?.[0];
    const status = comp?.status?.type ?? {};
    const sides: Json[] = [...(comp?.competitors ?? [])].sort((a, b) => Number(a.homeAway !== 'home') - Number(b.homeAway !== 'home'));
    const stats = (teamId: string) => {
      const entry = (summary.boxscore?.teams ?? []).find((t: Json) => t.team?.id === teamId);
      const map: Record<string, string> = {};
      (entry?.statistics ?? []).forEach((s: Json) => { map[s.name] = s.displayValue; });
      return map;
    };

    const head = el('header', 'inter-head');
    const badge = el('span', live ? 'inter-badge is-live' : 'inter-badge', live ? L.live : L.last);
    const league = summary.header?.league?.shortName || summary.header?.league?.name || '';
    const when = live
      ? (status.state === 'in' && /half/i.test(status.description ?? '') ? L.ht : comp?.status?.displayClock ?? status.shortDetail ?? '')
      : new Date(comp?.date).toLocaleDateString(locale, { day: 'numeric', month: 'short' });
    head.append(badge, el('span', 'inter-meta', [league, when].filter(Boolean).join(' · ')));

    const score = el('div', 'inter-score');
    sides.forEach((side, i) => {
      const name = el('span', side.team?.id === INTER ? 'inter-team is-inter' : 'inter-team', side.team?.abbreviation ?? side.team?.displayName ?? '');
      name.title = side.team?.displayName ?? '';
      const goals = el('strong', 'inter-goals', side.score ?? '–');
      if (i === 0) score.append(name, goals, el('span', 'inter-colon', ':'));
      else score.append(goals, name);
    });

    const scorers = el('ul', 'inter-scorers');
    (summary.keyEvents ?? [])
      .filter((k: Json) => k.scoringPlay && !k.shootout)
      .forEach((k: Json) => {
        const li = el('li', k.team?.id === INTER ? 'is-inter' : undefined);
        li.append(el('span', 'inter-min', k.clock?.displayValue ?? ''), document.createTextNode(` ${k.participants?.[0]?.athlete?.displayName ?? k.shortText ?? ''}`));
        scorers.append(li);
      });

    const [home, away] = sides.map((s) => stats(s.team?.id));
    const rows = el('dl', 'inter-stats');
    if (home && away && home.possessionPct) {
      const bar = el('div', 'inter-bar');
      bar.style.setProperty('--home', `${parseFloat(home.possessionPct) || 50}%`);
      const row = el('div', 'inter-row inter-row-bar');
      row.append(el('dt', undefined, L.poss), el('dd', undefined, `${home.possessionPct}%`), bar, el('dd', undefined, `${away.possessionPct}%`));
      rows.append(row);
      const line = (label: string, h: string, a: string) => {
        const r = el('div', 'inter-row');
        r.append(el('dd', undefined, h), el('dt', undefined, label), el('dd', undefined, a));
        rows.append(r);
      };
      line(L.shots, `${home.totalShots ?? 0} (${home.shotsOnTarget ?? 0})`, `${away.totalShots ?? 0} (${away.shotsOnTarget ?? 0})`);
      line(L.corners, home.wonCorners ?? '0', away.wonCorners ?? '0');
      line(L.cards, `${home.yellowCards ?? 0}🟨 ${home.redCards ?? 0}🟥`, `${away.yellowCards ?? 0}🟨 ${away.redCards ?? 0}🟥`);
    }

    target.replaceChildren(closeButton(), head, score);
    if (scorers.childElementCount) target.append(scorers);
    if (rows.childElementCount) target.append(rows);

    if (next) {
      const date = new Date(next.date);
      const vs = next.competitions?.[0]?.competitors?.find((c: Json) => c.team?.id !== INTER);
      const home = next.competitions?.[0]?.competitors?.find((c: Json) => c.team?.id === INTER)?.homeAway === 'home';
      const text = `${L.next}: ${home ? 'vs' : it ? '@' : 'bei'} ${vs?.team?.displayName ?? next.shortName ?? ''} · ${date.toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'numeric' })} ${date.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}`;
      target.append(el('p', 'inter-next', text));
    }
  }

}

export {};
