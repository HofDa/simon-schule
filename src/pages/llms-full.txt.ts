import type { APIRoute } from 'astro';
import { company, contact, fullName, locations, people, roleFor, trias, vs } from '../data/site';
import { experience } from '../data/experience';
import { collagesFor } from '../data/collages';
import { feedbackFor } from '../data/feedback';
import { getProjects } from '../data/projects';
import { useTranslations, type Lang } from '../i18n/ui';
import { lernraumCopy } from '../i18n/lernraum';
import { homeFor, legalFor } from '../lib/paths';

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => (site ? new URL(path, site).href : path);
  const de = useTranslations('de');
  const it = useTranslations('it');
  const deL = lernraumCopy('de');
  const itL = lernraumCopy('it');
  const totalFacilities = experience.categories.reduce((sum, category) => sum + category.count, 0);

  const renderLanguageSection = (lang: Lang) => {
    const t = useTranslations(lang);
    const L = lernraumCopy(lang);
    const projects = getProjects(lang);
    const collages = collagesFor(lang);
    const feedback = feedbackFor(lang);
    const vsCats: { name: string; text: string; url?: string }[] = t.vs.categories;
    const isIt = lang === 'it';

    return [
      `## ${isIt ? 'Versione italiana (it-IT)' : 'Deutsche Version (de-IT)'}`,
      `- URL: ${url(homeFor(lang))}`,
      `- Title: ${t.meta.title}`,
      `- Description: ${t.meta.description}`,
      `- Claim: ${t.hero.headline} — ${t.hero.sub}`,
      '',
      `### ${L.narrative.title}`,
      `- ${L.narrative.tensionLabel}: ${L.narrative.tensionText}`,
      `- ${L.narrative.answerLabel}: ${L.narrative.answerText}`,
      '',
      `### ${L.services.rolesEyebrow}`,
      ...L.services.roles.map((r) => `- **${r.audience} — ${r.title}** ${r.text}`),
      '',
      `### ${t.services.title}`,
      t.services.intro,
      ...t.services.items.map((item, i) => `${i + 1}. **${item.title}**: ${item.text}`),
      '',
      `### ${L.scenes.title}`,
      L.scenes.intro,
      ...L.scenes.items.map(
        (scene, i) =>
          `${i + 1}. **${scene.name}** (${scene.setup} · ${scene.product}): ${scene.text} — ${L.scenes.benefit}: ${scene.benefit}`,
      ),
      '',
      `### ${t.projects.title}`,
      L.projects.sub,
      ...projects.flatMap((project, i) => {
        const plan = L.projects.annotations[project.id];
        return [
          `#### ${i + 1}. ${project.title} (${project.type})`,
          project.description,
          `- ${t.projects.meta.services}: ${project.services.join(', ')}`,
          ...(plan
            ? [
                `- ${plan.callout}:`,
                ...plan.pins.map((pin) => `  - **${pin.title}**: ${pin.detail}`),
              ]
            : []),
          '',
        ];
      }),
      `### ${L.projects.referencesTitle} (${collages.length})`,
      ...collages.flatMap((project) => [
        `#### ${project.name}${project.credit ? ` (${isIt ? 'Foto' : 'Fotos'}: ${project.credit})` : ''}`,
        project.alt,
        ...project.photos.map((photo, idx) => `  ${idx + 1}. ${photo.alt}`),
        '',
      ]),
      `### ${t.vs.title}`,
      `${t.vs.exclusive}: ${t.vs.intro} (${vs.catalogUrl[lang]})`,
      ...vsCats.map((cat) => `- **${cat.name}**: ${cat.text}${cat.url ? ` (${cat.url})` : ''}`),
      '',
      `### ${t.phases.title}`,
      ...t.form.phases.map((phase, i) => `- **${phase}**: ${t.phases.hints[i]}`),
      `- **${t.form.orderOption}**`,
      '',
      `### ${t.people.title}`,
      t.people.intro,
      ...t.people.questions.map((question, i) => `- **${question}** ${L.people.why[i]}`),
      '',
      `### ${L.voices.title}`,
      ...feedback.map((entry) => `- "${entry.quote}" — ${entry.name}, ${entry.role}, ${entry.organisation} (${entry.date})`),
      '',
      `### ${L.faq.title}`,
      ...L.faq.items.flatMap((item) => [`#### ${item.question}`, item.answer, '']),
    ];
  };

  const lines = [
    '# Trias Schule — Full Context (DE & IT)',
    '',
    '> Comprehensive bilingual machine-readable reference for Trias Schule (Trias KG der Anders GmbH), specialist in equipping schools, kindergartens, daycare centers, and open learning environments in South Tyrol / Alto Adige, Italy, and exclusive VS Möbel partner in South Tyrol.',
    '',
    '## Core Entity & Legal Metadata',
    `- Legal Entity: ${company.name}`,
    `- Registered Address: ${company.address}`,
    `- VAT / UID: ${company.vat}`,
    `- Phone: ${company.phone}`,
    `- General E-Mail: ${contact.email}`,
    `- Company E-Mail: ${company.email}`,
    `- Parent Brand: ${trias.url.de} (DE) | ${trias.url.it} (IT)`,
    `- Exclusive Furniture Partner: VS Vereinigte Spezialmöbelfabriken (${vs.catalogUrl.de} / ${vs.catalogUrl.it})`,
    `- Primary Advisor: ${people.map((person) => `${fullName(person)} (${roleFor(person, 'de') ?? ''} / ${roleFor(person, 'it') ?? ''}, ${person.email ?? ''})`).join('; ')}`,
    `- Showrooms / Offices: ${locations.map((loc) => `${loc.city.de} / ${loc.city.it}: ${loc.street.de} / ${loc.street.it}`).join(' | ')}`,
    `- Canonical Pages: ${url(homeFor('de'))} (de-IT) | ${url(homeFor('it'))} (it-IT)`,
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

  // Suppress unused import lint if de/it constants are referenced above.
  void de;
  void it;
  void deL;
  void itL;

  return new Response(`${lines.join('\n').trim()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
