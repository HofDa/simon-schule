import type { APIRoute } from 'astro';
import { company, contact, fullName, locations, people, roleFor, trias, vs } from '../data/site';
import { experience } from '../data/experience';
import { collagesFor } from '../data/collages';
import { feedbackFor } from '../data/feedback';
import { servicesFor } from '../data/services';
import { useTranslations, type Lang } from '../i18n/ui';
import { lernraumCopy } from '../i18n/lernraum';
import { homeFor, legalFor } from '../lib/paths';
import { cleanProjectSummary, siteLastModified, VS_SCHOOL_CATALOG_PDF } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => (site ? new URL(path, site).href : path);
  const totalFacilities = experience.categories.reduce((sum, category) => sum + category.count, 0);
  const postalCodes = ['39012', '39042'];

  const renderLanguageSection = (lang: Lang) => {
    const t = useTranslations(lang);
    const L = lernraumCopy(lang);
    const collages = collagesFor(lang);
    const feedback = feedbackFor(lang);
    const services = servicesFor(lang);
    const vsCats: { name: string; text: string; url?: string }[] = t.vs.categories;
    const isIt = lang === 'it';
    const baseHome = url(homeFor(lang));

    return [
      `## ${isIt ? 'Versione italiana (it-IT)' : 'Deutsche Version (de-IT)'}`,
      `- URL: ${baseHome}`,
      `- Title: ${t.meta.title}`,
      `- Description: ${t.meta.description}`,
      `- Claim: ${L.board.title.join(' ')} — ${L.board.description.join(' ')}`,
      `- Section Anchors: ${baseHome}#projekte | ${baseHome}#lernformen | ${baseHome}#leistungen | ${baseHome}#vs-moebel | ${baseHome}#stimmen | ${baseHome}#kontakt | ${baseHome}#faq`,
      '',
      `### ${L.projects.referencesTitle} (${collages.length})`,
      L.projects.referencesSub,
      ...collages.flatMap((project) => {
        const highlight = L.projects.referenceHighlights[project.slug];
        const summary = cleanProjectSummary(project.alt);
        return [
          `#### ${project.name} (${project.location})${project.credit ? ` — ${isIt ? 'Foto' : 'Fotos'}: ${project.credit}` : ''}`,
          ...(highlight ? [`- ${isIt ? 'Focus' : 'Schwerpunkt'}: ${highlight}`] : []),
          ...(project.vsProducts.length ? [`- VS Möbel: ${project.vsProducts.join(', ')}`] : []),
          `- ${summary}`,
          ...project.photos.map(
            (photo, idx) => `  ${idx + 1}. ${photo.alt}${photo.vs?.length ? ` (${photo.vs.join(', ')})` : ''}`,
          ),
          '',
        ];
      }),
      `### ${L.scenes.title}`,
      L.scenes.intro,
      ...L.scenes.items.map(
        (scene, i) =>
          `${i + 1}. **${scene.name}** (${scene.setup} · ${scene.product}): ${scene.text} — ${L.scenes.benefit}: ${scene.benefit}`,
      ),
      '',
      `### ${t.services.title}`,
      t.services.intro,
      ...services.map((item, i) => `${i + 1}. **${item.title}**: ${item.text}`),
      '',
      `### ${t.vs.title}`,
      `${t.vs.exclusive}: ${t.vs.intro} (${vs.catalogUrl[lang]})`,
      `- **${L.vs.catalogBadge}**: ${L.vs.catalogSub} (${VS_SCHOOL_CATALOG_PDF})`,
      `- **${L.vs.jumper.title}** (${L.vs.jumper.kicker}): ${L.vs.jumper.sub}`,
      ...vsCats.map((cat) => `- **${cat.name}**: ${cat.text}${cat.url ? ` (${cat.url})` : ''}`),
      '',
      `### ${L.voices.title}`,
      L.voices.lead,
      ...feedback.map(
        (entry) =>
          `- "${entry.quote}" — ${entry.name}, ${entry.role}, ${entry.organisation}${entry.translated ? ' (traduzione dal tedesco)' : ''}`,
      ),
      '',
      `### ${t.contact.title}`,
      `${t.contact.lead} ${L.talk.responsePromise}`,
      `- ${L.talk.stepsHeading}`,
      ...L.talk.steps.map((step, i) => `  ${i + 1}. ${step}`),
      '',
      `### ${L.faq.title}`,
      ...L.faq.items.flatMap((item) => [`#### ${item.question}`, item.answer, '']),
    ];
  };

  const lines = [
    '# Trias Schule — Full Context (DE & IT)',
    '',
    '> Comprehensive bilingual machine-readable knowledge base for Trias Schule (Trias KG der Anders GmbH), specialist in equipping schools, kindergartens, daycare centers (Kitas / asili nido), libraries, and open learning environments in South Tyrol / Alto Adige (Autonome Provinz Bozen, Italy). Exclusive VS Möbel partner in South Tyrol, complemented by furniture from further manufacturers for manufacturer-independent project planning.',
    '',
    `Last updated: ${siteLastModified()}`,
    '',
    '## Core Entity & Legal Metadata',
    `- Legal Entity: ${company.name}`,
    `- Registered Address: ${company.address}`,
    `- VAT / UID: ${company.vat}`,
    `- Switchboard Phone: ${company.phone}`,
    `- General E-Mail: ${contact.email}`,
    `- Company E-Mail: ${company.email}`,
    `- Parent Brand: ${trias.url.de} (DE) | ${trias.url.it} (IT)`,
    `- Exclusive Furniture Partner: VS Vereinigte Spezialmöbelfabriken (${vs.catalogUrl.de} / ${vs.catalogUrl.it})`,
    `- VS School Catalog 2026 (PDF): ${VS_SCHOOL_CATALOG_PDF}`,
    '- Product Range: VS Möbel plus furniture from further manufacturers (multi-brand, not VS-only)',
    `- Primary Advisor: ${people
      .map(
        (person) =>
          `${fullName(person)} (${[roleFor(person, 'de'), roleFor(person, 'it')].filter(Boolean).join(' / ')}, ${[person.email, person.phone].filter(Boolean).join(', ')})`,
      )
      .join('; ')}`,
    `- Showrooms / Offices: ${locations
      .map(
        (loc, i) =>
          `${loc.city.de} / ${loc.city.it}: ${loc.street.de} / ${loc.street.it}, ${postalCodes[i]} ${loc.city.de}${i === 1 ? ' (HOUSE70)' : ''}`,
      )
      .join(' | ')}`,
    '- Standards & Public Procurement: DIN / UNI EN 1729, GS, Blauer Engel, Italian CAM criteria (Criteri Ambientali Minimi), South Tyrol ISOV tender documentation & bills of quantities (Leistungsverzeichnis / capitolato), holiday-window installation by in-house assembly team',
    `- Canonical Pages: ${url(homeFor('de'))} (de-IT / de) | ${url(homeFor('it'))} (it-IT / it)`,
    `- Legal Pages: ${url(legalFor('de', 'imprint'))} (DE Impressum) | ${url(legalFor('it', 'imprint'))} (IT Note legali) | ${url(legalFor('de', 'privacy'))} (DE Datenschutz) | ${url(legalFor('it', 'privacy'))} (IT Privacy)`,
    '',
    `## Verified Track Record (${experience.period})`,
    `- Total facilities furnished in South Tyrol / Alto Adige: ${totalFacilities}`,
    ...experience.categories.map((cat) => `- ${cat.count} × ${cat.label.de} / ${cat.label.it}`),
    '',
    ...renderLanguageSection('de'),
    '---',
    '',
    ...renderLanguageSection('it'),
  ];

  return new Response(`${lines.join('\n').trim()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
