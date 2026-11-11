import type { Lang } from '../i18n/ui';

/** Supplied workbook: Übersicht Objekte 2015-2026.xlsx, sheet 1, rows 4, 6–7. */
export const experience = {
  period: '2015–2026',
  heading: {
    de: 'Von uns eingerichtete Einrichtungen',
    it: 'Strutture arredate da noi',
  } satisfies Record<Lang, string>,
  categories: [
    { count: 112, label: { de: 'Grundschulen', it: 'Scuole primarie' } },
    { count: 53, label: { de: 'Mittelschulen', it: 'Scuole medie' } },
    { count: 23, label: { de: 'Oberschulen', it: 'Scuole superiori' } },
    { count: 23, label: { de: 'Berufs- & Fachschulen', it: 'Scuole professionali e di specializzazione' } },
    { count: 15, label: { de: 'Kindergärten', it: 'Scuole dell’infanzia' } },
    { count: 5, label: { de: 'Kitas', it: 'Asili nido' } },
    { count: 3, label: { de: 'Bibliotheken', it: 'Biblioteche' } },
  ],
};
