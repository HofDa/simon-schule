/**
 * Customer feedback for the whiteboard's "Feedback" letters. Collected by Simon in the
 * "Feedback-Runde" (Nov 2026): customers were asked in 1–2 sentences why they chose Trias and what
 * they value in the collaboration, for publication on the new website. Only answers that came
 * back go here, word for word; add new ones as they arrive.
 */

export interface Feedback {
  quote: string;
  name: string;
  role: string;
  organisation: string;
  /** When the answer came in, as shown on the letter. */
  date: string;
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
];
