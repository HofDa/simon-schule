/**
 * Central contact facts (language-neutral; interface copy lives in src/i18n/ui.ts).
 * `null` means the fact is not confirmed yet: components render it as an
 * open, visibly marked field instead of inventing a value.
 */

export interface Person {
  firstName: string;
  lastName: string | null;
  role: string | null;
  phone: string | null;
  email: string | null;
  /** Portrait in public/images/team/ (base name, 4:5 .webp); nothing stands in for it until it exists. */
  photo: string | null;
}

export const contact = {
  email: 'beratung@trias.it',
  phone: null as string | null,
  address: null as string | null,
};

/**
 * Public form delivery settings. Configure these at build time for the hosted
 * provider; the endpoint is necessarily visible to browsers. Without an
 * endpoint the form keeps its pre-filled e-mail fallback.
 */
const inquiryEndpoint = import.meta.env.PUBLIC_INQUIRY_ENDPOINT?.trim() || null;
const inquiryPrivacyUrl = inquiryEndpoint ? 'https://formspree.io/legal/privacy-policy/' : null;

if (inquiryEndpoint) {
  try {
    const endpointUrl = new URL(inquiryEndpoint);
    if (
      endpointUrl.protocol !== 'https:' ||
      endpointUrl.hostname !== 'formspree.io' ||
      !/^\/f\/[^/]+\/?$/.test(endpointUrl.pathname)
    ) throw new Error();
  } catch {
    throw new Error('PUBLIC_INQUIRY_ENDPOINT must be a Formspree form URL, e.g. https://formspree.io/f/xxxxxxxx.');
  }
}

export const inquiry = {
  endpoint: inquiryEndpoint,
  privacyUrl: inquiryPrivacyUrl,
  mailto: contact.email,
};

export const people: Person[] = [
  { firstName: 'Simon', lastName: 'Brugger', role: null, phone: null, email: null, photo: null },
  { firstName: 'Rene', lastName: null, role: null, phone: null, email: null, photo: null },
];

export const fullName = (p: Person) => [p.firstName, p.lastName].filter(Boolean).join(' ');

/** VS has no Italian website (vs.de/it/ is an error page), so the Italian site links to the English one. */
export const vs = {
  catalogUrl: { de: 'https://www.vs.de/de/', it: 'https://www.vs.de/en/' },
};

/** Temporary photos (Wikimedia Commons). Replace with real project photography. */
export const photoCredits = [
  { author: 'PantheraLeo1359531', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:JCRG_%E2%80%93_Klassenzimmer_HOF5022-HDR_RAW-Export.jpg' },
  { author: 'MaxMustermannFoto', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Neuer_Kindergarten_Rotenturm_H%C3%B6hle_und_Spielk%C3%BCche.jpg' },
  { author: 'Mosborne01', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ashs-learning-common-kauri.jpg' },
];
