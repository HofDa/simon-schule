const base = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`;

/** Resolve a file in /public against the configured base path (GitHub Pages). */
export const asset = (path: string) => `${base}${path.replace(/^\//, '')}`;
