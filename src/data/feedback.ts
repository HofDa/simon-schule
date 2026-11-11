/**
 * Customer feedback for the whiteboard's "Feedback" letters. Collected by Simon in the
 * "Feedback-Runde" (Nov 2026): customers were asked in 1–2 sentences why they chose Trias and what
 * they value in the collaboration, for publication on the new website. Only answers that came
 * back go here, word for word; add new ones as they arrive.
 */

import type { Lang } from '../i18n/ui';

export interface Feedback {
  quote: string;
  name: string;
  role: string;
  organisation: string;
  /** When the answer came in, as shown on the letter. */
  date: string;
  /** The quote is shown in translation, not in the customer's own words. */
  translated?: boolean;
}

export const feedback: Feedback[] = [
  {
    quote:
      'Trias ist für mich seit über zehn Jahren ein verlässlicher und kompetenter Partner. Besonders schätze ich die Flexibilität und die Fähigkeit, auch auf kurzfristige Anforderungen schnell, unkompliziert und lösungsorientiert zu reagieren. Die hochwertige und innovative Produktpalette rundet das Gesamtpaket perfekt ab.',
    name: 'Stefan Ganterer',
    role: 'Direktor',
    organisation: 'SSP Latsch',
    date: '10.11.2026',
  },
  {
    // the "wir als Schule" version, which she preferred
    quote:
      'Für Trias haben wir uns als Schule entschieden, weil hier einfach vieles zusammenpasst: professionelle Beratung, ein echtes Verständnis für Schule und die Bereitschaft, sich auf unsere Bedürfnisse einzulassen. Dazu kommen stilvolle, geschmackvolle Möbel und Lösungsvorschläge, eine hohe Flexibilität und kurze Bearbeitungszeiten. Genau diese Mischung macht für uns die Zusammenarbeit besonders.',
    name: 'Karin Mazzari',
    role: 'Direktorin',
    organisation: 'SSP St Leonhard',
    date: '10.11.2026',
  },
  {
    quote:
      'Als Architekt schätze ich an TRIAS besonders die kompetente, persönliche und verlässliche Beratung sowie die fachliche Unterstützung, auf die ich jederzeit zählen kann. Gerade bei der Entwicklung neuer Schul- und Lernkonzepte ist TRIAS für mich ein wertvoller Partner, der mit innovativen Möbellösungen und neuen Ideen moderne Unterrichtsformen unterstützt.',
    name: 'Wolfgang Simmerle',
    role: 'Architekt',
    organisation: 'Bozen',
    date: '11.11.2026',
  },
  {
    quote:
      'Ich sage DANKE☺️… Alles richtig toll/ schön geworden🍀🤗😊… tolles freundliches, geduldiges Team🤗Großartig und sauber gemacht🤩',
    name: 'Brigitte Trienbacher',
    role: 'Kindergartenleiterin',
    organisation: 'Reinswald',
    date: '10.11.2026',
  },
];

/** The customers wrote in German; the Italian page shows a translation and says so. */
const italian: { quote: string; role: string }[] = [
  {
    quote:
      'Da oltre dieci anni Trias è per me un partner affidabile e competente. Apprezzo in particolare la flessibilità e la capacità di rispondere anche a richieste dell’ultimo momento in modo rapido, semplice e orientato alla soluzione. La gamma di prodotti, innovativa e di alta qualità, completa perfettamente il quadro.',
    role: 'Dirigente',
  },
  {
    quote:
      'Come scuola abbiamo scelto Trias perché qui tante cose semplicemente combaciano: una consulenza professionale, una vera comprensione della scuola e la disponibilità a venire incontro alle nostre esigenze. A questo si aggiungono mobili e proposte di buon gusto, grande flessibilità e tempi di risposta brevi. È proprio questo insieme a rendere speciale per noi la collaborazione.',
    role: 'Dirigente',
  },
  {
    quote:
      'Come architetto apprezzo in particolare la consulenza competente, personale e affidabile di TRIAS e il supporto tecnico su cui posso contare in ogni momento. Soprattutto nello sviluppo di nuovi concetti scolastici e di apprendimento, TRIAS è per me un partner prezioso che sostiene forme di insegnamento moderne con soluzioni d’arredo innovative e nuove idee.',
    role: 'Architetto',
  },
  {
    quote:
      'Dico GRAZIE☺️… Tutto è venuto davvero benissimo/ bellissimo🍀🤗😊… un team fantastico, cordiale e paziente🤗Un lavoro splendido e pulito🤩',
    role: 'Responsabile della scuola dell’infanzia',
  },
];

export const feedbackFor = (lang: Lang): Feedback[] =>
  lang === 'de' ? feedback : feedback.map((entry, i) => (italian[i] ? { ...entry, ...italian[i], translated: true } : entry));
