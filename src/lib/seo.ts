import { company, contact, fullName, locations, people, roleFor, trias, vs } from '../data/site';
import { collagesFor } from '../data/collages';
import { useTranslations, type Lang } from '../i18n/ui';
import { lernraumCopy } from '../i18n/lernraum';
import { homeFor } from './paths';

interface StructuredDataOptions {
  site: URL | undefined;
  lang: Lang;
  canonicalPath: string;
  title: string;
  description: string;
  socialImage?: string;
  logoImage?: string;
  homepage?: boolean;
}

const postalCodes = ['39012', '39042'] as const;
const geoCoordinates = [
  { latitude: 46.6669, longitude: 11.1528 },
  { latitude: 46.7035, longitude: 11.6512 },
] as const;

const servedCities: Record<Lang, string[]> = {
  de: ['Bozen', 'Meran', 'Brixen', 'Bruneck', 'Sterzing', 'Schlanders', 'Leifers'],
  it: ['Bolzano', 'Merano', 'Bressanone', 'Brunico', 'Vipiteno', 'Silandro', 'Laives'],
};

const domainTopics: Record<Lang, string[]> = {
  de: [
    'Schulmöbel Südtirol',
    'Kindergarteneinrichtung',
    'Kita-Ausstattung',
    'Offene Lernlandschaften',
    'VS Möbel (VS Vereinigte Spezialmöbelfabriken)',
    'Ergonomische Schulstühle (EN 1729)',
    'Raumakustik in Schulen und Kindergärten',
    'Öffentliche Ausschreibungen für Bildungseinrichtungen (CAM / ISOV)',
  ],
  it: [
    'Arredo scolastico Alto Adige',
    'Arredamento scuola dell’infanzia',
    'Arredi per asili nido',
    'Spazi di apprendimento aperti',
    'VS Möbel (VS Vereinigte Spezialmöbelfabriken)',
    'Sedute scolastiche ergonomiche (EN 1729)',
    'Acustica per scuole e biblioteche',
    'Gare pubbliche e criteri CAM per l’edilizia scolastica',
  ],
};

/** Build Schema.org JSON-LD graph for indexable pages (rich entity graph on homepages). */
export function buildStructuredData({
  site,
  lang,
  canonicalPath,
  title,
  description,
  socialImage,
  logoImage,
  homepage = false,
}: StructuredDataOptions): string | undefined {
  if (!site) return undefined;

  const t = useTranslations(lang);
  const faqItems = lernraumCopy(lang).faq.items;
  const absolute = (path: string) => new URL(path, site).href;
  const organizationUrl = absolute(homeFor('de'));
  const pageUrl = absolute(canonicalPath);
  const regionName = lang === 'it' ? 'Alto Adige' : 'Südtirol';
  const modifiedDate = new Date().toISOString().slice(0, 10);

  const organizationId = `${organizationUrl}#organization`;
  const websiteId = `${organizationUrl}#website`;
  const serviceId = `${pageUrl}#school-furnishing`;

  const logoObject = logoImage
    ? {
        '@type': 'ImageObject',
        url: logoImage,
        width: 1200,
        height: 256,
      }
    : undefined;

  const areaServed = [
    {
      '@type': 'AdministrativeArea',
      name: regionName,
    },
    ...servedCities[lang].map((city) => ({
      '@type': 'City',
      name: city,
    })),
  ];

  const parentOrganization = {
    '@type': 'Organization',
    name: 'Trias',
    legalName: company.name,
    url: trias.url[lang],
    email: company.email,
    telephone: company.phone,
  };

  if (!homepage) {
    const breadcrumbId = `${pageUrl}#breadcrumb`;
    return JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': organizationId,
          name: 'Trias Schule',
          legalName: company.name,
          url: organizationUrl,
          email: contact.email,
          telephone: company.phone,
          vatID: company.vat,
          ...(logoObject ? { logo: logoObject } : {}),
          parentOrganization,
          sameAs: [trias.url.de, trias.url.it],
        },
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
              item: absolute(homeFor(lang)),
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
          '@type': 'WebPage',
          '@id': `${pageUrl}#webpage`,
          url: pageUrl,
          name: title,
          description,
          dateModified: modifiedDate,
          inLanguage: t.hreflang,
          isPartOf: { '@id': websiteId },
          about: { '@id': organizationId },
          breadcrumb: { '@id': breadcrumbId },
        },
      ],
    }).replace(/</g, '\\u003c');
  }

  const locationNodes = locations.map((loc, index) => {
    const postalCode = postalCodes[index];
    const mapsQuery = encodeURIComponent(`Trias ${loc.street[lang]}, ${postalCode ?? ''} ${loc.city[lang]}, Italia`.trim());
    return {
      '@type': 'FurnitureStore',
      '@id': `${organizationUrl}#location-${index === 0 ? 'meran' : 'brixen'}`,
      name: `Trias Schule · ${loc.city[lang]}`,
      url: pageUrl,
      telephone: company.phone,
      email: contact.email,
      ...(socialImage ? { image: socialImage } : {}),
      ...(logoObject ? { logo: logoObject } : {}),
      hasMap: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
      sameAs: [trias.url[lang]],
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
    '@id': `${pageUrl}#reference-projects`,
    name: lang === 'it'
      ? 'Progetti di riferimento in Alto Adige'
      : 'Referenzprojekte in Südtirol',
    numberOfItems: collagesFor(lang).length,
    itemListElement: collagesFor(lang).map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'CreativeWork',
        name: project.name,
        description: project.alt,
        image: absolute(project.collage.src),
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
    })),
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
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
            contactType: lang === 'it' ? 'Contatto diretto scuola e istituzioni educative' : 'Direktkontakt Schule & Bildungseinrichtungen',
            name: fullName(primaryAdvisor),
            email: primaryAdvisor.email,
            telephone: primaryAdvisor.phone,
            availableLanguage: ['German', 'Italian'],
            areaServed: 'IT-BZ',
          },
        ]
      : []),
  ];

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'Trias Schule',
        legalName: company.name,
        url: organizationUrl,
        email: contact.email,
        telephone: company.phone,
        vatID: company.vat,
        ...(socialImage ? { image: socialImage } : {}),
        ...(logoObject ? { logo: logoObject } : {}),
        parentOrganization,
        sameAs: [trias.url.de, trias.url.it],
        knowsAbout: domainTopics[lang],
        areaServed,
        brand: {
          '@type': 'Brand',
          name: 'VS Vereinigte Spezialmöbelfabriken',
          url: vs.catalogUrl[lang],
        },
        contactPoint: contactPoints,
        employee: people.map((person) => ({
          '@type': 'Person',
          name: fullName(person),
          ...(roleFor(person, lang) ? { jobTitle: roleFor(person, lang) } : {}),
          ...(person.email ? { email: person.email } : {}),
          ...(person.phone ? { telephone: person.phone } : {}),
        })),
      },
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
        about: { '@id': serviceId },
        speakable: {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.thesis-title', '.arc-answer .arc-text', '#faq .faq-question', '#faq .faq-answer p'],
        },
        ...(socialImage ? { primaryImageOfPage: { '@type': 'ImageObject', url: socialImage } } : {}),
      },
      {
        '@type': 'Service',
        '@id': serviceId,
        name: lang === 'it'
          ? 'Arredi per scuole e scuole dell’infanzia'
          : 'Einrichtung von Schulen und Kindergärten',
        description: t.hero.sub,
        serviceType: t.services.items.map(({ title: serviceTitle }) => serviceTitle),
        areaServed,
        provider: { '@id': organizationId },
        brand: {
          '@type': 'Brand',
          name: 'VS Vereinigte Spezialmöbelfabriken',
          url: vs.catalogUrl[lang],
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: lang === 'it' ? 'Sistemi di arredo VS Möbel' : 'VS Möbel Einrichtungssysteme',
          itemListElement: (t.vs.categories as { name: string; text: string; url?: string }[]).map((cat) => ({
            '@type': 'OfferCatalog',
            name: cat.name,
            description: cat.text,
            ...(cat.url ? { url: cat.url } : {}),
          })),
        },
      },
      projectsList,
      faqPage,
    ],
  }).replace(/</g, '\\u003c');
}
