import type { APIRoute } from 'astro';
import { company, contact, fullName, locations, people, roleFor, trias, vs } from '../data/site';
import { experience } from '../data/experience';
import { collagesFor } from '../data/collages';
import { feedbackFor } from '../data/feedback';
import { useTranslations } from '../i18n/ui';
import { lernraumCopy } from '../i18n/lernraum';
import { homeFor, legalFor, asset } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => (site ? new URL(path, site).href : path);
  const de = useTranslations('de');
  const it = useTranslations('it');
  const deL = lernraumCopy('de');
  const itL = lernraumCopy('it');
  const totalFacilities = experience.categories.reduce((sum, category) => sum + category.count, 0);

  const lines = [
    '# Trias Schule',
    '',
    '> Einrichtung für Schulen, Kindergärten, Kitas und offene Lernlandschaften in Südtirol / Alto Adige (Italien) – ein Geschäftsbereich der Trias KG der Anders GmbH und Exklusivpartner von VS Möbel (VS Vereinigte Spezialmöbelfabriken) in Südtirol.',
    '',
    '## Canonical Pages',
    `- [Startseite (Deutsch · de-IT)](${url(homeFor('de'))}): ${de.meta.description}`,
    `- [Home (Italiano · it-IT)](${url(homeFor('it'))}): ${it.meta.description}`,
    `- [Impressum (DE)](${url(legalFor('de', 'imprint'))}) / [Note legali (IT)](${url(legalFor('it', 'imprint'))})`,
    `- [Datenschutz (DE)](${url(legalFor('de', 'privacy'))}) / [Privacy (IT)](${url(legalFor('it', 'privacy'))})`,
    `- [Vollständige Wissensbasis / Full Knowledge Base (DE · IT)](${url(asset('llms-full.txt'))})`,
    '',
    '## Organization & Locations',
    `- Brand: Trias Schule (${company.name})`,
    `- Parent Brand: [Trias (DE)](${trias.url.de}) / [Trias (IT)](${trias.url.it})`,
    `- VAT / UID: ${company.vat}`,
    `- Exclusive Partner: [VS Vereinigte Spezialmöbelfabriken](${vs.catalogUrl.de})`,
    `- Primary Advisor: ${people.map((person) => `${fullName(person)} (${roleFor(person, 'de') ?? ''}, ${person.email ?? ''})`).join('; ')}`,
    `- General Contact: ${contact.email}, ${company.phone}`,
    `- Showrooms / Locations: ${locations.map((loc) => `${loc.city.de} / ${loc.city.it} (${loc.street.de} / ${loc.street.it})`).join('; ')}`,
    '',
    `## Track Record (${experience.period})`,
    `- Total furnished educational institutions in South Tyrol / Alto Adige: ${totalFacilities}`,
    ...experience.categories.map((cat) => `- ${cat.count} ${cat.label.de} (${cat.label.it})`),
    '',
    '## Services',
    ...de.services.items.map((item, i) => `- ${item.title} (${it.services.items[i]?.title}): ${item.text}`),
    '',
    '## Reference Projects in South Tyrol / Alto Adige',
    ...collagesFor('de').map((project) => `- ${project.name}: ${project.alt}`),
    '',
    '## Verified Customer Feedback',
    ...feedbackFor('de').map((entry) => `- ${entry.name} (${entry.role}, ${entry.organisation}, ${entry.date}): "${entry.quote}"`),
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
