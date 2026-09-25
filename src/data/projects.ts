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
  quote: 'Hier steht ein freigegebenes Zitat aus diesem Projekt – in den Worten der Schulleitung, der Pädagoginnen oder der Gemeinde.',
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
      'Bewegliche Stühle und Tische, die sich ohne Aufwand von Frontalunterricht zu Gruppenarbeit umstellen lassen. Stauraum entlang der Wände hält die Mitte des Raums frei.',
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
      'Rückzugsorte und Spielbereiche auf Kinderhöhe, eingebaut in einen hellen Gruppenraum. Weiche Zonen zum Ausruhen, klare Wege zum Spielen.',
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
      'Ein Raum, viele Nutzungen: Tischinseln für Gruppen, ruhige Zonen für Einzelarbeit und Wege, die Bewegung zulassen.',
    images: [
      { file: 'learning-commons', alt: 'Offene Lernlandschaft mit Tischgruppen, Stühlen und Stellwänden' },
    ],
    boardLabel: 'Lernlandschaft',
    testimonial: null,
    placeholder: true,
  },
];

export const closingTestimonial: Testimonial = {
  quote: 'Hier steht das stärkste freigegebene Zitat: nicht über Möbel, sondern darüber, wie die Zusammenarbeit mit Trias Schule erlebt wurde.',
  author: null,
  role: null,
  organisation: null,
};
