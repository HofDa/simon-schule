/**
 * Reference projects in German and Italian. Add a project by appending an
 * entry to `sources`; the homepage layouts alternate automatically
 * (image left, image right, full width).
 *
 * All current entries are placeholders (`placeholder: true`): the photos are
 * temporary Wikimedia Commons images and no project facts are confirmed.
 * Optional fields (`year`, `architect`, `client`) render only when set.
 */
import type { Lang } from '../i18n/ui';

/** A text in both site languages. */
type T = Record<Lang, string>;

export interface ProjectImage {
  /** Base name in public/images/projects/, without the -900/-1800.webp suffix. */
  file: string;
  alt: string;
}

export interface Testimonial {
  quote: string;
  author: string | null;
  role: string | null;
  organisation: string | null;
}

export interface Project {
  id: string;
  title: string;
  location: string | null;
  type: string;
  year?: number;
  architect?: string;
  client?: string;
  services: string[];
  description: string;
  images: ProjectImage[];
  /** Short marker label used on the whiteboard. */
  boardLabel: string;
  testimonial: Testimonial | null;
  placeholder: boolean;
}

interface TestimonialSource {
  quote: T;
  author: string | null;
  role: T | null;
  organisation: string | null;
}

interface ProjectSource {
  id: string;
  title: T;
  location: T | null;
  type: T;
  year?: number;
  architect?: string;
  client?: string;
  services: T[];
  description: T;
  images: { file: string; alt: T }[];
  boardLabel: T;
  testimonial: TestimonialSource | null;
  placeholder: boolean;
}

const service = {
  consulting: { de: 'Beratung', it: 'Consulenza' },
  planning: { de: 'Planung', it: 'Progettazione' },
  furnishing: { de: 'Ausstattung', it: 'Arredamento' },
  assembly: { de: 'Montage', it: 'Montaggio' },
  concept: { de: 'Raumkonzept', it: 'Concetto spaziale' },
} satisfies Record<string, T>;

const pendingQuote: TestimonialSource = {
  quote: {
    de: 'Platzhalter: Hier kommt ein freigegebenes Zitat aus diesem Projekt hin, zum Beispiel von der Schulleitung oder der Gemeinde.',
    it: 'Segnaposto: qui andrà una citazione approvata da questo progetto, per esempio della dirigenza scolastica o del Comune.',
  },
  author: null,
  role: null,
  organisation: null,
};

const sources: ProjectSource[] = [
  {
    id: 'schule-klassenraeume',
    title: { de: 'Klassenräume für bewegtes Lernen', it: 'Aule per imparare in movimento' },
    location: null,
    type: { de: 'Schule', it: 'Scuola' },
    services: [service.consulting, service.planning, service.furnishing, service.assembly],
    description: {
      de: 'Bewegliche Stühle und Tische, die sich schnell von Frontalunterricht auf Gruppenarbeit umstellen lassen. Der Stauraum steht an den Wänden, die Mitte des Raums bleibt frei.',
      it: 'Sedie e tavoli mobili che passano in fretta dalla lezione frontale al lavoro di gruppo. Gli armadi stanno lungo le pareti, il centro dell’aula resta libero.',
    },
    images: [
      {
        file: 'classroom-blue-chairs',
        alt: {
          de: 'Klassenzimmer mit blauen Schalenstühlen, die auf hellen Holztischen hochgestellt sind',
          it: 'Aula con sedie blu a scocca capovolte su tavoli in legno chiaro',
        },
      },
    ],
    boardLabel: { de: 'Klassenraum', it: 'Aula' },
    testimonial: pendingQuote,
    placeholder: true,
  },
  {
    id: 'kindergarten-spielraum',
    title: { de: 'Ein Gruppenraum mit Höhle und Spielküche', it: 'Una sezione con tana e cucina giocattolo' },
    location: null,
    type: { de: 'Kindergarten', it: 'Scuola dell’infanzia' },
    services: [service.concept, service.furnishing, service.assembly],
    description: {
      de: 'Eine Höhle zum Zurückziehen, eine Spielküche und Sitzkissen auf Kinderhöhe, eingebaut in einen hellen Gruppenraum.',
      it: 'Una tana in cui ritirarsi, una cucina giocattolo e cuscini all’altezza dei bambini, integrati in una sezione luminosa.',
    },
    images: [
      {
        file: 'kindergarten-cave',
        alt: {
          de: 'Kindergartenraum mit eingebauter Höhle, Sitzkissen und Holzregalen',
          it: 'Sezione di scuola dell’infanzia con tana integrata, cuscini e scaffali in legno',
        },
      },
      {
        file: 'kindergarten-kitchen',
        alt: {
          de: 'Spielküche aus Holz in einem hellen Kindergartenraum',
          it: 'Cucina giocattolo in legno in una sezione luminosa',
        },
      },
    ],
    boardLabel: { de: 'Kindergarten', it: 'Infanzia' },
    testimonial: pendingQuote,
    placeholder: true,
  },
  {
    id: 'lernlandschaft',
    title: { de: 'Offene Lernlandschaft', it: 'Spazio di apprendimento aperto' },
    location: null,
    type: { de: 'Lernlandschaft', it: 'Spazio di apprendimento' },
    services: [service.consulting, service.planning, service.furnishing],
    description: {
      de: 'Tischinseln für Gruppenarbeit, ruhige Plätze für Einzelarbeit und genug Platz, um sich zwischen beiden zu bewegen.',
      it: 'Isole di tavoli per il lavoro di gruppo, posti tranquilli per lo studio individuale e spazio per muoversi tra le due zone.',
    },
    images: [
      {
        file: 'learning-commons',
        alt: {
          de: 'Offene Lernlandschaft mit Tischgruppen, Stühlen und Stellwänden',
          it: 'Spazio di apprendimento aperto con gruppi di tavoli, sedie e pannelli',
        },
      },
    ],
    boardLabel: { de: 'Lernlandschaft', it: 'Spazio aperto' },
    testimonial: null,
    placeholder: true,
  },
];

const closingSource: TestimonialSource = {
  quote: {
    de: 'Platzhalter: Hier kommt ein freigegebenes Zitat darüber hin, wie die Zusammenarbeit mit Trias Schule gelaufen ist.',
    it: 'Segnaposto: qui andrà una citazione approvata su come è andata la collaborazione con Trias Schule.',
  },
  author: null,
  role: null,
  organisation: null,
};

const localiseTestimonial = (t: TestimonialSource, lang: Lang): Testimonial => ({
  quote: t.quote[lang],
  author: t.author,
  role: t.role ? t.role[lang] : null,
  organisation: t.organisation,
});

export const getProjects = (lang: Lang): Project[] =>
  sources.map((p) => ({
    id: p.id,
    title: p.title[lang],
    location: p.location ? p.location[lang] : null,
    type: p.type[lang],
    year: p.year,
    architect: p.architect,
    client: p.client,
    services: p.services.map((s) => s[lang]),
    description: p.description[lang],
    images: p.images.map((img) => ({ file: img.file, alt: img.alt[lang] })),
    boardLabel: p.boardLabel[lang],
    testimonial: p.testimonial ? localiseTestimonial(p.testimonial, lang) : null,
    placeholder: p.placeholder,
  }));

export const getClosingTestimonial = (lang: Lang): Testimonial => localiseTestimonial(closingSource, lang);
