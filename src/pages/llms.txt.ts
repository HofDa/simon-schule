import type { APIRoute } from 'astro';
import { company, contact, fullName, locations, people, roleFor, trias, vs } from '../data/site';
import { experience } from '../data/experience';
import { collagesFor } from '../data/collages';
import { feedbackFor } from '../data/feedback';
import { servicesFor } from '../data/services';
import { useTranslations } from '../i18n/ui';
import { lernraumCopy } from '../i18n/lernraum';
import { homeFor, legalFor, asset } from '../lib/paths';
import { cleanProjectSummary, siteLastModified, VS_SCHOOL_CATALOG_PDF } from '../lib/seo';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => (site ? new URL(path, site).href : path);
  const de = useTranslations('de');
  const it = useTranslations('it');
  const deL = lernraumCopy('de');
  const itL = lernraumCopy('it');
  const deServices = servicesFor('de');
  const itServices = servicesFor('it');
  const deCollages = collagesFor('de');
  const totalFacilities = experience.categories.reduce((sum, category) => sum + category.count, 0);
  const verifiedVsProducts = [
    ...new Set([
      ...deCollages.flatMap((project) => project.vsProducts),
      ...deL.scenes.items.map((scene) => scene.product),
      'VS JUMPER',
    ]),
  ];
  const postalCodes = ['39012', '39042'];

  const lines = [
    '# Trias Schule',
    '',
    '> Einrichtung für Schulen, Kindergärten, Kitas, Bibliotheken und offene Lernlandschaften in Südtirol / Alto Adige (Italien) – ein Geschäftsbereich der Trias KG der Anders GmbH. Exklusivpartner von VS Möbel (VS Vereinigte Spezialmöbelfabriken) in Südtirol, ergänzt durch weitere bewährte Hersteller. 234 eingerichtete Bildungseinrichtungen (2015–2026), Standorte in Meran und Brixen (HOUSE70).',
    '',
    `Last updated: ${siteLastModified()}`,
    '',
    '## Canonical Pages & Key Sections',
    `- [Startseite (Deutsch · de-IT)](${url(homeFor('de'))}): ${de.meta.description}`,
    `- [Home (Italiano · it-IT)](${url(homeFor('it'))}): ${it.meta.description}`,
    `- [Referenzprojekte / Progetti di riferimento](${url(`${homeFor('de')}#projekte`)}) | [IT](${url(`${homeFor('it')}#projekte`)})`,
    `- [Lernformen & Raumaufstellungen / Modi di imparare](${url(`${homeFor('de')}#lernformen`)}) | [IT](${url(`${homeFor('it')}#lernformen`)})`,
    `- [Leistungen & Ablauf / Servizi](${url(`${homeFor('de')}#leistungen`)}) | [IT](${url(`${homeFor('it')}#leistungen`)})`,
    `- [VS Möbel & Katalog 2026 / Mobili VS](${url(`${homeFor('de')}#vs-moebel`)}) | [IT](${url(`${homeFor('it')}#vs-moebel`)})`,
    `- [Kundenstimmen / Feedback](${url(`${homeFor('de')}#stimmen`)}) | [IT](${url(`${homeFor('it')}#stimmen`)})`,
    `- [Direktkontakt & FAQ / Contatti e FAQ](${url(`${homeFor('de')}#kontakt`)}) | [IT](${url(`${homeFor('it')}#kontakt`)})`,
    `- [Impressum (DE)](${url(legalFor('de', 'imprint'))}) / [Note legali (IT)](${url(legalFor('it', 'imprint'))})`,
    `- [Datenschutz (DE)](${url(legalFor('de', 'privacy'))}) / [Privacy (IT)](${url(legalFor('it', 'privacy'))})`,
    `- [Vollständige Wissensbasis / Full Knowledge Base (DE & IT)](${url(asset('llms-full.txt'))})`,
    '',
    '## Organization, Territory & Direct Contact',
    `- Brand: Trias Schule (${company.name})`,
    `- Parent Brand: [Trias (DE)](${trias.url.de}) / [Trias (IT)](${trias.url.it})`,
    `- VAT / UID: ${company.vat}`,
    `- Territory: South Tyrol / Südtirol / Alto Adige (Autonome Provinz Bozen, IT-BZ, Italy)`,
    `- Exclusive Partner: [VS Vereinigte Spezialmöbelfabriken](${vs.catalogUrl.de}) ([VS School Catalog 2026 PDF](${VS_SCHOOL_CATALOG_PDF}))`,
    '- Multi-Brand Product Range: VS Möbel plus furniture from further manufacturers (manufacturer-independent planning, not VS-only)',
    `- Primary Advisor: ${people
      .map(
        (person) =>
          `${fullName(person)} (${[roleFor(person, 'de'), person.email, person.phone].filter(Boolean).join(', ')})`,
      )
      .join('; ')}`,
    `- General Contact: ${contact.email}, ${company.phone}`,
    `- Locations / Showrooms: ${locations
      .map(
        (loc, i) =>
          `${loc.city.de} / ${loc.city.it} (${loc.street.de} / ${loc.street.it}, ${postalCodes[i]} ${loc.city.de}${i === 1 ? ' · HOUSE70' : ''})`,
      )
      .join('; ')}`,
    '- Languages: German (de-IT) and Italian (it-IT)',
    '',
    `## Verified Track Record (${experience.period})`,
    `- Total furnished educational institutions in South Tyrol / Alto Adige: ${totalFacilities}`,
    ...experience.categories.map((cat) => `- ${cat.count} ${cat.label.de} (${cat.label.it})`),
    '',
    '## Standards, Certifications & Public Tenders',
    '- Ergonomic school seating & tables compliant with DIN / UNI EN 1729 (VS Möbel, certified GS & Blauer Engel)',
    '- Compliant with Italian public procurement CAM criteria (Criteri Ambientali Minimi)',
    '- Support for South Tyrol municipalities (Gemeinden / Comuni), schools, architects & ISOV tenders with bills of quantities (Leistungsverzeichnis / capitolato), sampling, and in-house holiday-window assembly',
    '',
    '## 5-Step Project Process (Live Services)',
    ...deServices.map((item, i) => `${i + 1}. **${item.title}** (${itServices[i]?.title}): ${item.text}`),
    '',
    '## Verified VS Möbel Product Families & Systems',
    `- Product lines featured on site and in South Tyrol reference projects: ${verifiedVsProducts.join(', ')}`,
    `- Highlighted chair: ${deL.vs.jumper.title} (${deL.vs.jumper.kicker}) — ${deL.vs.jumper.sub}`,
    '',
    '## Reference Projects in South Tyrol / Alto Adige (11)',
    ...deCollages.map((project) => {
      const highlight = deL.projects.referenceHighlights[project.slug];
      const summary = cleanProjectSummary(project.alt);
      const vsTag = project.vsProducts.length ? ` [VS: ${project.vsProducts.join(', ')}]` : '';
      return `- **${project.name}** (${project.location}): ${highlight ? `${highlight} — ` : ''}${summary}${vsTag}`;
    }),
    '',
    '## Verified Customer & Partner Feedback',
    ...feedbackFor('de').map((entry) => `- ${entry.name} (${entry.role}, ${entry.organisation}): "${entry.quote}"`),
    '',
    '## Frequently Asked Questions (DE)',
    ...deL.faq.items.flatMap((item) => [`### ${item.question}`, item.answer, '']),
    '## Domande frequenti (IT)',
    ...itL.faq.items.flatMap((item) => [`### ${item.question}`, item.answer, '']),
  ];

  return new Response(`${lines.join('\n').trim()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
