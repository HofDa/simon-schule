/**
 * Central contact facts (language-neutral; interface copy lives in src/i18n/ui.ts).
 * `null` means the fact is not confirmed yet: components render it as an
 * open, visibly marked field instead of inventing a value.
 */

import type { Lang } from '../i18n/ui';

export interface Person {
  firstName: string;
  lastName: string | null;
  role: Record<Lang, string> | null;
  phone: string | null;
  email: string | null;
  /** Portrait in public/images/team/ (base name, 4:5 .webp); nothing stands in for it until it exists. */
  photo: string | null;
}

export interface Location {
  city: Record<Lang, string>;
  street: Record<Lang, string>;
}

/** Confirmed in the supplied company details sheet (November 2026). */
export const company = {
  name: 'Trias KG der Anders GmbH',
  address: 'Julius Durst Straße 70, 39042 Brixen (BZ), Italien',
  vat: 'IT 00707930210',
  phone: '+39 0472 971 206',
  email: 'info@trias.it',
};

export const locations: Location[] = [
  {
    city: { de: 'Meran', it: 'Merano' },
    street: { de: 'Romstraße 77', it: 'Via Roma 77' },
  },
  {
    city: { de: 'Brixen', it: 'Bressanone' },
    street: { de: 'Julius-Durst-Straße 70', it: 'Via Julius Durst 70' },
  },
];

export const contact = {
  email: 'beratung@trias.it',
  directEmail: 'simon.brugger@trias.it',
  /** Company switchboard; Simon's direct line is on his entry in `people`. */
  phone: company.phone as string | null,
  address: 'Romstraße 77, 39012 Meran, Italien' as string | null,
};

export const people: Person[] = [
  {
    firstName: 'Simon',
    lastName: 'Brugger',
    role: {
      de: 'Verantwortlicher Schule & Bildungseinrichtungen bei Trias',
      it: 'Responsabile area scuola e istituzioni educative presso Trias',
    },
    /** Simon's direct line, given for the whiteboard card (Änderungen, 23.11.2026). */
    phone: '+39 338 9342398',
    email: 'simon.brugger@trias.it',
    photo: 'simon-portrait',
  },
];

export const fullName = (p: Person) => [p.firstName, p.lastName].filter(Boolean).join(' ');
export const roleFor = (p: Person, lang: Lang) => (p.role ? p.role[lang] : null);

/** The Trias umbrella brand, linked from the header on desktop. */
export const trias = {
  url: { de: 'https://www.trias.it/de', it: 'https://www.trias.it/it' },
};

/** VS has no Italian website (vs.de/it/ is an error page), so the Italian site links to the English one. */
export const vs = {
  catalogUrl: { de: 'https://www.vs.de/de/', it: 'https://www.vs.de/en/' },
};

/** Preview photos from the VS catalogues (low resolution). Replace with the VS originals, then with real project photography. */
export const photoCredits = [
  { author: 'VS Vereinigte Spezialmöbelfabriken', license: 'Kataloge Schule & Digital 2026', url: 'https://www.vs.de/de/' },
];
