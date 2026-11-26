import type { APIRoute } from 'astro';
import { asset, homeFor, legalFor } from '../lib/paths';
import { type Lang } from '../i18n/ui';
import { collagesFor } from '../data/collages';
import { people } from '../data/site';
import { hreflangEntries, siteLastModified } from '../lib/seo';

const pagePairs: { pair: Record<Lang, string>; homepage?: boolean }[] = [
  { pair: { de: homeFor('de'), it: homeFor('it') }, homepage: true },
  { pair: { de: legalFor('de', 'imprint'), it: legalFor('it', 'imprint') } },
  { pair: { de: legalFor('de', 'privacy'), it: legalFor('it', 'privacy') } },
];

const xmlEscape = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  const lastmod = siteLastModified();

  const renderHomeImages = (lang: Lang) => {
    if (!site) return '';
    const resolve = (path: string) => new URL(path, site).href;
    const teamPhotos = people
      .filter((person) => Boolean(person.photo))
      .map((person) => resolve(asset(`images/team/${person.photo}.webp`)));

    const locs = [
      resolve(asset('images/social-preview.jpg')),
      resolve(asset('images/trias-schule-logo.png')),
      ...teamPhotos,
      ...collagesFor(lang).map((project) => resolve(project.collage.src)),
    ];

    return [...new Set(locs)]
      .map(
        (loc) =>
          `    <image:image>\n` +
          `      <image:loc>${xmlEscape(loc)}</image:loc>\n` +
          `    </image:image>`,
      )
      .join('\n');
  };

  const urls = site
    ? pagePairs
        .flatMap(({ pair, homepage }) => {
          const resolve = (path: string) => new URL(path, site).href;
          const alternates = hreflangEntries(pair, resolve)
            .map(
              ({ hreflang, href }) =>
                `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${xmlEscape(href)}" />`,
            )
            .join('\n');

          return (Object.entries(pair) as [Lang, string][]).map(([lang, path]) => {
            const images = homepage ? `\n${renderHomeImages(lang)}` : '';
            return `  <url>\n    <loc>${xmlEscape(resolve(path))}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}${images}\n  </url>`;
          });
        })
        .join('\n')
    : '';

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
