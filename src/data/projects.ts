/**
 * Reference projects. Add a project by appending an entry; the homepage
 * layouts alternate automatically (image left, image right, full width).
 *
 * All current entries are placeholders (`placeholder: true`): the photos are
 * temporary Wikimedia Commons images and no project facts are confirmed.
 * Optional fields (`year`, `architect`, `client`) render only when set.
 */

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

const pendingQuote: Testimonial = {
  quote: 'Platzhalter: Hier kommt ein freigegebenes Zitat aus diesem Projekt hin, zum Beispiel von der Schulleitung oder der Gemeinde.',
  author: null,
  role: null,
  organisation: null,
};

export const projects: Project[] = [
  {
    id: 'schule-klassenraeume',
    title: 'Klassenräume für bewegtes Lernen',
    location: null,
    type: 'Schule',
    services: ['Beratung', 'Planung', 'Ausstattung', 'Montage'],
    description:
      'Bewegliche Stühle und Tische, die sich schnell von Frontalunterricht auf Gruppenarbeit umstellen lassen. Der Stauraum steht an den Wänden, die Mitte des Raums bleibt frei.',
    images: [
      { file: 'classroom-blue-chairs', alt: 'Klassenzimmer mit blauen Schalenstühlen, die auf hellen Holztischen hochgestellt sind' },
    ],
    boardLabel: 'Klassenraum',
    testimonial: pendingQuote,
    placeholder: true,
  },
  {
    id: 'kindergarten-spielraum',
    title: 'Ein Gruppenraum mit Höhle und Spielküche',
    location: null,
    type: 'Kindergarten',
    services: ['Raumkonzept', 'Ausstattung', 'Montage'],
    description:
      'Eine Höhle zum Zurückziehen, eine Spielküche und Sitzkissen auf Kinderhöhe, eingebaut in einen hellen Gruppenraum.',
    images: [
      { file: 'kindergarten-cave', alt: 'Kindergartenraum mit eingebauter Höhle, Sitzkissen und Holzregalen' },
      { file: 'kindergarten-kitchen', alt: 'Spielküche aus Holz in einem hellen Kindergartenraum' },
    ],
    boardLabel: 'Kindergarten',
    testimonial: pendingQuote,
    placeholder: true,
  },
  {
    id: 'lernlandschaft',
    title: 'Offene Lernlandschaft',
    location: null,
    type: 'Lernlandschaft',
    services: ['Beratung', 'Planung', 'Ausstattung'],
    description:
      'Tischinseln für Gruppenarbeit, ruhige Plätze für Einzelarbeit und genug Platz, um sich zwischen beiden zu bewegen.',
    images: [
      { file: 'learning-commons', alt: 'Offene Lernlandschaft mit Tischgruppen, Stühlen und Stellwänden' },
    ],
    boardLabel: 'Lernlandschaft',
    testimonial: null,
    placeholder: true,
  },
];

export const closingTestimonial: Testimonial = {
  quote: 'Platzhalter: Hier kommt ein freigegebenes Zitat darüber hin, wie die Zusammenarbeit mit Trias Schule gelaufen ist.',
  author: null,
  role: null,
  organisation: null,
};
