const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Resolve a file in /public against the configured base path (GitHub Pages). */
export const asset = (path: string) => `${base}${path.replace(/^\//, '')}`;

/** Home page of a language: German at the base path, Italian under /it/. */
export const homeFor = (lang: 'de' | 'it') => asset(lang === 'it' ? 'it/' : '');

/** The legal pages, each with its counterpart in the other language. */
export type LegalPage = 'imprint' | 'privacy';
const legalSlugs: Record<LegalPage, Record<'de' | 'it', string>> = {
  imprint: { de: 'impressum/', it: 'it/note-legali/' },
  privacy: { de: 'datenschutz/', it: 'it/privacy/' },
};
export const legalFor = (lang: 'de' | 'it', page: LegalPage) => asset(legalSlugs[page][lang]);

/** Whether a URL path is the home page of a language (trailing slash optional). */
export const isHome = (pathname: string, lang: 'de' | 'it') => pathname.replace(/\/$/, '') === homeFor(lang).replace(/\/$/, '');
