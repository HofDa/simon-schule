import { execSync } from 'node:child_process';
import { company, contact, fullName, locations, people, roleFor, trias, vs } from '../data/site';
import { collagesFor } from '../data/collages';
import { experience } from '../data/experience';
import { servicesFor } from '../data/services';
import { langs, useTranslations, type Lang } from '../i18n/ui';
import { lernraumCopy } from '../i18n/lernraum';
import { asset, homeFor } from './paths';

export const VS_SCHOOL_CATALOG_PDF =
  'https://web-media.vs.de/file/p1/pdf/45-057-49_V2026-01_DE_Basics--Der-Katalog-fuer-die-Schule.archiv.pdf';

/** ISO YYYY-MM-DD date of the latest git commit, cached per build (falls back to build date). */
let cachedLastMod: string | undefined;
export function siteLastModified(): string {
  if (cachedLastMod) return cachedLastMod;
  try {
    const out = execSync('git log -1 --format=%cs', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(out)) {
      cachedLastMod = out;
      return cachedLastMod;
    }
  } catch {
    // Fall through to build date when git metadata is unavailable.
  }
  cachedLastMod = new Date().toISOString().slice(0, 10);
  return cachedLastMod;
}

/**
 * Reciprocal hreflang entries for a bilingual DE/IT page pair:
 * includes both regional (`de-IT`, `it-IT`) and generic language (`de`, `it`) codes
 * plus `x-default` so generic German and Italian searchers land on the right locale.
 */
export function hreflangEntries(
  alternates: Record<Lang, string>,
  resolveUrl: (path: string) => string,
): { hreflang: string; href: string }[] {
  const entries: { hreflang: string; href: string }[] = [];
  for (const l of langs) {
    const href = resolveUrl(alternates[l]);
    const regional = useTranslations(l).hreflang;
    entries.push({ hreflang: regional, href });
    if (regional !== l) {
      entries.push({ hreflang: l, href });
    }
  }
  entries.push({ hreflang: 'x-default', href: resolveUrl(alternates.de) });
  return entries;
}

/** Strip decorative "Collage <Name>: " prefixes from image alt text for clean entity prose. */
export function cleanProjectSummary(alt: string): string {
  return alt.replace(/^Collage\s+[^:]+:\s*/i, '').trim();
}

interface StructuredDataOptions {
  site: URL | undefined;
  lang: Lang;
  canonicalPath: string;
  title: string;
  description: string;
  socialImage?: string;
  socialImageAlt?: string;
  logoImage?: string;
  homepage?: boolean;
  pageType?: 'WebPage' | 'AboutPage' | 'ContactPage';
}

const postalCodes = ['39012', '39042'] as const;
const geoCoordinates = [
  { latitude: 46.6669, longitude: 11.1528 },
  { latitude: 46.7035, longitude: 11.6512 },
] as const;

const servedCities: Record<Lang, string[]> = {
  de: [
    'Bozen',
    'Meran',
    'Brixen',
    'Bruneck',
    'Sterzing',
    'Schlanders',
    'Leifers',
    'Lana',
    'Sarnthein',
    'Terlan',
    'Gais',
    'Tisens',
    'Riffian',
    'Gsies',
  ],
  it: [
    'Bolzano',
    'Merano',
    'Bressanone',
    'Brunico',
    'Vipiteno',
    'Silandro',
    'Laives',
    'Lana',
    'Sarentino',
    'Terlano',
    'Gais',
    'Tesimo',
    'Rifiano',
    'Casies',
  ],
};

const domainTopics: Record<Lang, string[]> = {
  de: [
    'Schulmöbel Südtirol',
    'Kindergarteneinrichtung',
    'Kita-Ausstattung',
    'Schulbibliotheken und Lernflure',
    'Offene Lernlandschaften',
    'VS Möbel (VS Vereinigte Spezialmöbelfabriken)',
    'Herstellerübergreifende Bildungseinrichtung',
    'Ergonomische Schulstühle und Schülertische (DIN EN 1729)',
    'GS- und Blauer-Engel-zertifizierte Schulmöbel',
    'Raumakustik in Schulen und Kindergärten',
    'Öffentliche Ausschreibungen für Bildungseinrichtungen (CAM / ISOV)',
    'Ferienmontage für Schulen und Kindergärten',
  ],
  it: [
    'Arredo scolastico Alto Adige',
    'Arredamento scuola dell’infanzia',
    'Arredi per asili nido',
    'Biblioteche scolastiche e corridoi didattici',
    'Spazi di apprendimento aperti',
    'VS Möbel (VS Vereinigte Spezialmöbelfabriken)',
    'Progettazione di arredi scolastici multimarca',
    'Sedute e banchi scolastici ergonomici (UNI EN 1729)',
    'Arredi scolastici certificati GS e Blauer Engel',
    'Acustica per scuole e biblioteche',
    'Gare pubbliche, capitolati ISOV e criteri CAM per l’edilizia scolastica',
    'Montaggio arredi scolastici durante le vacanze',
  ],
};

const projectGroupLabel: Record<string, Record<Lang, string>> = {
  'gs-gais': { de: 'Grundschule', it: 'Scuola primaria' },
  'gs-deflorian-meran': { de: 'Grundschule', it: 'Scuola primaria' },
  'gs-sarnthein': { de: 'Grundschule', it: 'Scuola primaria' },
  'gs-st-jakob': { de: 'Grundschule', it: 'Scuola primaria' },
  'gs-st-martin-gsies': { de: 'Grundschule', it: 'Scuola primaria' },
  'gs-riffian': { de: 'Grundschule', it: 'Scuola primaria' },
  'ms-lana': { de: 'Mittelschule', it: 'Scuola media' },
  'ms-sterzing': { de: 'Mittelschule', it: 'Scuola media' },
  'musikschule-brixen': { de: 'Musikschule', it: 'Scuola di musica' },
  'kiga-tisens': { de: 'KiTa & Kindergarten', it: 'Asilo nido e scuola dell’infanzia' },
  'bibliothek-terlan': { de: 'Bibliothek', it: 'Biblioteca' },
};

/** Build Schema.org JSON-LD graph for indexable pages (rich connected entity graph on homepages). */
export function buildStructuredData({
  site,
  lang,
  canonicalPath,
  title,
  description,
  socialImage,
  socialImageAlt,
  logoImage,
  homepage = false,
  pageType = 'WebPage',
}: StructuredDataOptions): string | undefined {
  if (!site) return undefined;

  const t = useTranslations(lang);
  const L = lernraumCopy(lang);
  const services = servicesFor(lang);
  const faqItems = L.faq.items;
  const totalFacilities = experience.categories.reduce((sum, category) => sum + category.count, 0);
  const absolute = (path: string) => new URL(path, site).href;
  const organizationUrl = absolute(homeFor('de'));
  const localizedHomeUrl = absolute(homeFor(lang));
  const pageUrl = absolute(canonicalPath);
  const regionName = lang === 'it' ? 'Alto Adige (Provincia autonoma di Bolzano)' : 'Südtirol (Autonome Provinz Bozen)';
  const modifiedDate = siteLastModified();

  const organizationId = `${organizationUrl}#organization`;
  const websiteId = `${organizationUrl}#website`;
  const vsBrandId = `${organizationUrl}#brand-vs`;
  const serviceId = `${pageUrl}#school-furnishing`;
  const projectsId = `${pageUrl}#reference-projects`;
  const scenesId = `${pageUrl}#learning-environments`;
  const catalogDocId = `${pageUrl}#vs-school-catalog`;
  const faqId = `${pageUrl}#faq`;

  const logoObject = logoImage
    ? {
        '@type': 'ImageObject',
        url: logoImage,
        width: 1200,
        height: 262,
      }
    : undefined;

  const primaryImageObject = socialImage
    ? {
        '@type': 'ImageObject',
        url: socialImage,
        width: 1200,
        height: 630,
        ...(socialImageAlt ? { caption: socialImageAlt } : {}),
      }
    : undefined;

  const areaServed = [
    {
      '@type': 'AdministrativeArea',
      name: regionName,
      sameAs: 'https://www.wikidata.org/wiki/Q15124',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'BZ',
        addressCountry: 'IT',
      },
    },
    ...servedCities[lang].map((city) => ({
      '@type': 'City',
      name: city,
      containedInPlace: {
        '@type': 'AdministrativeArea',
        name: lang === 'it' ? 'Alto Adige' : 'Südtirol',
      },
    })),
  ];

  const parentOrganization = {
    '@type': 'Organization',
    name: 'Trias',
    legalName: company.name,
    url: trias.url[lang],
    email: company.email,
    telephone: company.phone,
    sameAs: [trias.url.de, trias.url.it],
  };

  const vsBrandNode = {
    '@type': 'Brand',
    '@id': vsBrandId,
    name: 'VS Vereinigte Spezialmöbelfabriken',
    alternateName: 'VS Möbel',
    url: vs.catalogUrl[lang],
    sameAs: [vs.catalogUrl.de, vs.catalogUrl.it],
  };

  const primaryAdvisor = people[0];
  const contactPoints = [
    {
      '@type': 'ContactPoint',
      contactType: lang === 'it' ? 'Consulenza e progetti' : 'Beratung & Projektanfragen',
      email: contact.email,
      telephone: company.phone,
      availableLanguage: ['German', 'Italian'],
      areaServed: 'IT-BZ',
    },
    ...(primaryAdvisor?.phone && primaryAdvisor.email
      ? [
          {
            '@type': 'ContactPoint',
            contactType:
              lang === 'it'
                ? 'Contatto diretto scuola e istituzioni educative'
                : 'Direktkontakt Schule & Bildungseinrichtungen',
            name: fullName(primaryAdvisor),
            email: primaryAdvisor.email,
            telephone: primaryAdvisor.phone,
            availableLanguage: ['German', 'Italian'],
            areaServed: 'IT-BZ',
          },
        ]
      : []),
  ];

  const organizationDescription =
    lang === 'it'
      ? `Trias Schule è la divisione di ${company.name} specializzata nell’arredo di scuole, scuole dell’infanzia, asili nido e biblioteche in Alto Adige. Partner esclusivo di VS Möbel in Alto Adige e fornitore multimarca con sedi a Merano e Bressanone (${totalFacilities} strutture arredate ${experience.period}).`
      : `Trias Schule ist der auf Schulen, Kindergärten, Kitas und Bibliotheken spezialisierte Geschäftsbereich der ${company.name} in Südtirol. Exklusivpartner von VS Möbel in Südtirol mit weiteren Herstellern im Sortiment, Standorten in Meran und Brixen (${totalFacilities} eingerichtete Bildungseinrichtungen ${experience.period}).`;

  const headquartersAddress = {
    '@type': 'PostalAddress',
    streetAddress: locations[1].street[lang],
    postalCode: postalCodes[1],
    addressLocality: locations[1].city[lang],
    addressRegion: 'BZ',
    addressCountry: 'IT',
  };

  const baseOrganization = {
    '@type': 'Organization',
    '@id': organizationId,
    name: 'Trias Schule',
    alternateName: ['TRIAS SCHULE', 'Trias'],
    legalName: company.name,
    description: organizationDescription,
    url: organizationUrl,
    email: contact.email,
    telephone: company.phone,
    vatID: company.vat,
    address: headquartersAddress,
    knowsLanguage: ['de', 'it'],
    ...(socialImage ? { image: socialImage } : {}),
    ...(logoObject ? { logo: logoObject } : {}),
    parentOrganization,
    sameAs: [trias.url.de, trias.url.it],
    contactPoint: contactPoints,
  };

  if (!homepage) {
    const breadcrumbId = `${pageUrl}#breadcrumb`;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        baseOrganization,
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: organizationUrl,
          name: 'Trias Schule',
          publisher: { '@id': organizationId },
          inLanguage: ['de-IT', 'it-IT'],
        },
        {
          '@type': 'BreadcrumbList',
          '@id': breadcrumbId,
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Trias Schule',
              item: localizedHomeUrl,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: title,
              item: pageUrl,
            },
          ],
        },
        {
          '@type': pageType,
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          dateModified: modifiedDate,
          inLanguage: t.hreflang,
          isPartOf: { '@id': websiteId },
          about: { '@id': organizationId },
          breadcrumb: { '@id': breadcrumbId },
          ...(primaryImageObject ? { primaryImageOfPage: primaryImageObject } : {}),
        },
      ],
    }).replace(/</g, '\\u003c');
  }

  const locationIds = locations.map((_, index) => `${organizationUrl}#location-${index === 0 ? 'meran' : 'brixen'}`);
  const locationNodes = locations.map((loc, index) => {
    const postalCode = postalCodes[index];
    const mapsQuery = encodeURIComponent(
      `Trias ${loc.street[lang]}, ${postalCode ?? ''} ${loc.city[lang]}, Italia`.trim(),
    );
    return {
      '@type': ['FurnitureStore', 'LocalBusiness'],
      '@id': locationIds[index],
      name: `Trias Schule · ${loc.city[lang]}`,
      ...(index === 1 ? { alternateName: `HOUSE70 · Trias ${loc.city[lang]}` } : {}),
      url: pageUrl,
      telephone: company.phone,
      email: contact.email,
      knowsLanguage: ['de', 'it'],
      ...(socialImage ? { image: socialImage } : {}),
      ...(logoObject ? { logo: logoObject } : {}),
      hasMap: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: loc.street[lang],
        postalCode,
        addressLocality: loc.city[lang],
        addressRegion: 'BZ',
        addressCountry: 'IT',
      },
      ...(geoCoordinates[index]
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: geoCoordinates[index].latitude,
              longitude: geoCoordinates[index].longitude,
            },
          }
        : {}),
      areaServed,
      parentOrganization: { '@id': organizationId },
    };
  });

  const projectsList = {
    '@type': 'ItemList',
    '@id': projectsId,
    name: lang === 'it' ? 'Progetti di riferimento in Alto Adige' : 'Referenzprojekte in Südtirol',
    description: L.projects.referencesSub,
    numberOfItems: collagesFor(lang).length,
    itemListElement: collagesFor(lang).map((project, index) => {
      const highlight = L.projects.referenceHighlights[project.slug];
      const category = projectGroupLabel[project.slug]?.[lang];
      const summary = cleanProjectSummary(project.alt);
      return {
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'CreativeWork',
          name: project.name,
          description: highlight ? `${highlight}. ${summary}` : summary,
          ...(category ? { genre: category } : {}),
          inLanguage: t.hreflang,
          image: absolute(project.collage.src),
          provider: { '@id': organizationId },
          contentLocation: {
            '@type': 'Place',
            name: project.location,
            address: {
              '@type': 'PostalAddress',
              addressRegion: 'BZ',
              addressCountry: 'IT',
            },
          },
          ...(project.vsProducts.length
            ? {
                keywords: project.vsProducts.join(', '),
                about: project.vsProducts.map((product) => ({
                  '@type': 'Thing',
                  name: product,
                })),
              }
            : {}),
          ...(project.credit ? { creator: { '@type': 'Organization', name: project.credit } } : {}),
        },
      };
    }),
  };

  const learningEnvironmentsList = {
    '@type': 'ItemList',
    '@id': scenesId,
    name: L.scenes.title,
    description: L.scenes.intro,
    numberOfItems: L.scenes.items.length,
    itemListElement: L.scenes.items.map((scene, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: scene.name,
        description: `${scene.text} ${L.scenes.benefit}: ${scene.benefit}`,
        disambiguatingDescription: scene.setup,
        inLanguage: t.hreflang,
        about: {
          '@type': 'Thing',
          name: scene.product,
        },
      },
    })),
  };

  const vsCatalogDocument = {
    '@type': 'DigitalDocument',
    '@id': catalogDocId,
    name: L.vs.catalogBadge,
    description: L.vs.catalogSub,
    url: VS_SCHOOL_CATALOG_PDF,
    encodingFormat: 'application/pdf',
    inLanguage: 'de',
    publisher: { '@id': vsBrandId },
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': faqId,
    inLanguage: t.hreflang,
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  const serviceDescription =
    lang === 'it'
      ? `Consulenza sul posto, progettazione di spazi didattici, capitolati per gare pubbliche (CAM / ISOV), fornitura di arredi scolastici VS Möbel e di altri produttori e montaggio con squadra interna in tutto l’Alto Adige. ${totalFacilities} strutture arredate (${experience.period}).`
      : `Vor-Ort-Beratung, Raumplanung, Leistungsverzeichnisse für öffentliche Ausschreibungen (CAM / ISOV), Schul- und Kindergartenmöbel von VS Möbel und weiteren Herstellern sowie eigene Montage in ganz Südtirol. ${totalFacilities} eingerichtete Bildungseinrichtungen (${experience.period}).`;

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...baseOrganization,
        knowsAbout: domainTopics[lang],
        areaServed,
        brand: { '@id': vsBrandId },
        location: locationIds.map((id) => ({ '@id': id })),
        employee: people.map((person) => ({
          '@type': 'Person',
          name: fullName(person),
          ...(roleFor(person, lang) ? { jobTitle: roleFor(person, lang) } : {}),
          ...(person.email ? { email: person.email } : {}),
          ...(person.phone ? { telephone: person.phone } : {}),
          ...(person.photo ? { image: absolute(asset(`images/team/${person.photo}.webp`)) } : {}),
          knowsLanguage: ['de', 'it'],
          worksFor: { '@id': organizationId },
        })),
      },
      vsBrandNode,
      ...locationNodes,
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: organizationUrl,
        name: 'Trias Schule',
        publisher: { '@id': organizationId },
        inLanguage: ['de-IT', 'it-IT'],
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: title,
        description,
        dateModified: modifiedDate,
        inLanguage: t.hreflang,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
        mainEntity: { '@id': serviceId },
        hasPart: [
          { '@id': projectsId },
          { '@id': scenesId },
          { '@id': catalogDocId },
          { '@id': faqId },
        ],
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: [
            '#board-title',
            '.board-description',
            '#projects-title',
            '#projekte .sub',
            '#services-title',
            '#leistungen .intro',
            '#vs-title',
            '#vs-moebel .intro',
            '#faq .faq-item dt',
            '#faq .faq-item dd',
          ],
        },
        ...(primaryImageObject ? { primaryImageOfPage: primaryImageObject } : {}),
      },
      {
        '@type': 'Service',
        '@id': serviceId,
        name:
          lang === 'it'
            ? 'Arredi e progettazione per scuole, scuole dell’infanzia e biblioteche in Alto Adige'
            : 'Einrichtung und Planung für Schulen, Kindergärten und Bibliotheken in Südtirol',
        description: serviceDescription,
        serviceType: services.map(({ title: serviceTitle }) => serviceTitle),
        areaServed,
        provider: { '@id': organizationId },
        brand: { '@id': vsBrandId },
        hasOfferCatalog: [
          {
            '@type': 'OfferCatalog',
            name: lang === 'it' ? 'Fasi di progetto e servizi' : 'Leistungen & Projektablauf',
            itemListElement: services.map((service) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service.title,
                description: service.text,
              },
            })),
          },
          {
            '@type': 'OfferCatalog',
            name: lang === 'it' ? 'Sistemi di arredo VS Möbel' : 'VS Möbel Einrichtungssysteme',
            itemListElement: (t.vs.categories as { name: string; text: string; url?: string }[]).map((cat) => ({
              '@type': 'OfferCatalog',
              name: cat.name,
              description: cat.text,
              ...(cat.url ? { url: cat.url } : {}),
            })),
          },
        ],
      },
      projectsList,
      learningEnvironmentsList,
      vsCatalogDocument,
      faqPage,
    ],
  }).replace(/</g, '\\u003c');
}
