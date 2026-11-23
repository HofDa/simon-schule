import type { APIRoute } from 'astro';
import { asset, homeFor, legalFor } from '../lib/paths';
import { useTranslations, type Lang } from '../i18n/ui';
import { collagesFor } from '../data/collages';

const pagePairs: { pair: Record<Lang, string>; homepage?: boolean }[] = [
  { pair: { de: homeFor('de'), it: homeFor('it') }, homepage: true },
  { pair: { de: legalFor('de', 'imprint'), it: legalFor('it', 'imprint') } },
  { pair: { de: legalFor('de', 'privacy'), it: legalFor('it', 'privacy') } },
];

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  const lastmod = new Date().toISOString().slice(0, 10);

  const renderHomeImages = (lang: Lang) => {
    if (!site) return '';
    const previewTitle = lang === 'it'
      ? 'Trias Schule – Spazi per imparare in Alto Adige'
      : 'Trias Schule – Lernräume für Südtirol';
    const previewCaption = lang === 'it'
      ? 'Spazio di apprendimento aperto con tavoli, sedie e aree di lavoro'
      : 'Offene Lernlandschaft mit Tischgruppen und verschiedenen Arbeitsbereichen';
    const previewGeo = lang === 'it' ? 'Alto Adige, Italia' : 'Südtirol, Italien';

    const items = [
      {
        loc: new URL(asset('images/social-preview.jpg'), site).href,
        title: previewTitle,
        caption: previewCaption,
        geo: previewGeo,
      },
      ...collagesFor(lang).map((project) => ({
        loc: new URL(project.collage.src, site).href,
        title: project.name,
        caption: project.vsProducts.length ? `${project.alt} (${project.vsProducts.join(', ')})` : project.alt,
        geo: project.location,
      })),
    ];

    return items
      .map(
        (img) =>
          `    <image:image>\n` +
          `      <image:loc>${xmlEscape(img.loc)}</image:loc>\n` +
          `      <image:title>${xmlEscape(img.title)}</image:title>\n` +
          `      <image:caption>${xmlEscape(img.caption)}</image:caption>\n` +
          `      <image:geo_location>${xmlEscape(img.geo)}</image:geo_location>\n` +
          `    </image:image>`,
      )
      .join('\n');
  };

  const urls = site
    ? pagePairs
        .flatMap(({ pair, homepage }) => {
          const alternates = (Object.entries(pair) as [Lang, string][])
            .map(
              ([lang, path]) =>
                `    <xhtml:link rel="alternate" hreflang="${useTranslations(lang).hreflang}" href="${xmlEscape(new URL(path, site).href)}" />`,
            )
            .join('\n');
          const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(new URL(pair.de, site).href)}" />`;

          return (Object.entries(pair) as [Lang, string][]).map(([lang, path]) => {
            const images = homepage ? `\n${renderHomeImages(lang)}` : '';
            return `  <url>\n    <loc>${xmlEscape(new URL(path, site).href)}</loc>\n    <lastmod>${lastmod}</lastmod>\n${alternates}\n${xDefault}${images}\n  </url>`;
          });
        })
        .join('\n')
    : '';

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
