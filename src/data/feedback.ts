/**
 * Customer feedback for the whiteboard's "Feedback" letters. Collected by Simon in the
 * "Feedback-Runde" (Nov 2026): customers were asked in 1–2 sentences why they chose Trias and what
 * they value in the collaboration, for publication on the new website. Only answers that came
 * back go here, word for word; add new ones as they arrive. No dates on purpose: the letters should
 * read as current, not as answers collected on one or two days.
 */

import type { Lang } from '../i18n/ui';

export interface Feedback {
  quote: string;
  name: string;
  role: string;
  organisation: string;
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
  },
  {
    // the "wir als Schule" version, which she preferred
    quote:
      'Für Trias haben wir uns als Schule entschieden, weil hier einfach vieles zusammenpasst: professionelle Beratung, ein echtes Verständnis für Schule und die Bereitschaft, sich auf unsere Bedürfnisse einzulassen. Dazu kommen stilvolle, geschmackvolle Möbel und Lösungsvorschläge, eine hohe Flexibilität und kurze Bearbeitungszeiten. Genau diese Mischung macht für uns die Zusammenarbeit besonders.',
    name: 'Karin Mazzari',
    role: 'Direktorin',
    organisation: 'SSP St Leonhard',
  },
  {
    quote:
      'Als Architekt schätze ich an TRIAS besonders die kompetente, persönliche und verlässliche Beratung sowie die fachliche Unterstützung, auf die ich jederzeit zählen kann. Gerade bei der Entwicklung neuer Schul- und Lernkonzepte ist TRIAS für mich ein wertvoller Partner, der mit innovativen Möbellösungen und neuen Ideen moderne Unterrichtsformen unterstützt.',
    name: 'Wolfgang Simmerle',
    role: 'Architekt',
    organisation: 'Bozen',
  },
  {
    quote:
      'Sehr gute Zusammenarbeit und erstklassige Betreuung! Wir wurden von Anfang an kompetent, freundlich und zuverlässig beraten und begleitet. Die Lieferung erfolgte reibungslos und die Qualität der Möbel überzeugt absolut.',
    name: 'Gerd Zuegg',
    role: '3D Designer',
    organisation: 'Torggler GmbH',
  },
  {
    quote:
      'Ich sage DANKE☺️… Alles richtig toll/ schön geworden🍀🤗😊… tolles freundliches, geduldiges Team🤗Großartig und sauber gemacht🤩',
    name: 'Brigitte Trienbacher',
    role: 'Kindergartenleiterin',
    organisation: 'Reinswald',
  },
  {
    // her answer has two paragraphs, one on Simon and one on René: one letter each, so both fit the board's page
    quote:
      'Mit Simon verbindet mich eine wertvolle Zusammenarbeit, die auf einem partnerschaftlichen und vertrauensvollen Austausch basiert. Besonders schätze ich das offene Miteinander und seine Expertise rund um unsere VS-Produkte, die er durch die langjährige Partnerschaft mit uns aufgebaut hat.',
    name: 'Anna-Lena Liebler',
    role: 'Vertriebsinnendienst Export',
    organisation: 'VS Vereinigte Spezialmöbelfabriken',
  },
  {
    quote:
      'Die Zusammenarbeit mit René ist unkompliziert und jederzeit freundlich. Besonders die Bearbeitung von Ausschreibungen erfolgt sorgfältig und kompetent. Auch bei Rückfragen und Abstimmungen ist René ein zuverlässiger und lösungsorientierter Ansprechpartner.',
    name: 'Anna-Lena Liebler',
    role: 'Vertriebsinnendienst Export',
    organisation: 'VS Vereinigte Spezialmöbelfabriken',
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
      'Un’ottima collaborazione e un’assistenza di prim’ordine! Fin dall’inizio siamo stati consigliati e seguiti con competenza, cordialità e affidabilità. La consegna è avvenuta senza intoppi e la qualità dei mobili convince pienamente.',
    role: 'Designer 3D',
  },
  {
    quote:
      'Dico GRAZIE☺️… Tutto è venuto davvero benissimo/ bellissimo🍀🤗😊… un team fantastico, cordiale e paziente🤗Un lavoro splendido e pulito🤩',
    role: 'Responsabile della scuola dell’infanzia',
  },
  {
    quote:
      'Con Simon mi lega una collaborazione preziosa, basata su uno scambio di partnership e di fiducia. Apprezzo in particolare il rapporto aperto e la sua competenza sui nostri prodotti VS, maturata in una lunga collaborazione con noi.',
    role: 'Ufficio vendite interno export',
  },
  {
    quote:
      'Lavorare con René è semplice e sempre cordiale. Soprattutto la gestione delle gare d’appalto avviene con cura e competenza. Anche per domande e chiarimenti René è un interlocutore affidabile e orientato alla soluzione.',
    role: 'Ufficio vendite interno export',
  },
];

export const feedbackFor = (lang: Lang): Feedback[] =>
  lang === 'de' ? feedback : feedback.map((entry, i) => (italian[i] ? { ...entry, ...italian[i], translated: true } : entry));
