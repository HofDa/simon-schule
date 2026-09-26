import type { APIRoute } from 'astro';
import { homeFor, legalFor } from '../lib/paths';

const pagePairs = [
  { de: homeFor('de'), it: homeFor('it') },
  { de: legalFor('de', 'imprint'), it: legalFor('it', 'imprint') },
  { de: legalFor('de', 'privacy'), it: legalFor('it', 'privacy') },
];

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  const urls = site
    ? pagePairs.flatMap((pair) => {
        const alternates = Object.entries(pair)
          .map(([lang, path]) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${xmlEscape(new URL(path, site).href)}" />`)
          .join('\n');
        const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(new URL(pair.de, site).href)}" />`;

        return Object.values(pair).map((path) => `  <url>\n    <loc>${xmlEscape(new URL(path, site).href)}</loc>\n${alternates}\n${xDefault}\n  </url>`);
      }).join('\n')
    : '';

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
