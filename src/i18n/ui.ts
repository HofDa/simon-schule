/**
 * All interface copy in German (default, served at /) and Italian (/it/).
 * Project content lives in src/data/projects.ts, contact facts in src/data/site.ts.
 * The Italian copy was written for this site and should be reviewed by a native speaker.
 */

import { company } from '../data/site';

export const langs = ['de', 'it'] as const;
export type Lang = (typeof langs)[number];

/** The page's language, from Astro's i18n routing (German when nothing matches). */
export const getLang = (locale: string | undefined): Lang => (locale === 'it' ? 'it' : 'de');

const de = {
  htmlLang: 'de',
  ogLocale: 'de_IT',
  langName: 'Deutsch',
  meta: {
    title: 'Trias Schule | Einrichtung für Schulen und Kindergärten in Südtirol',
    description:
      'Ihr verlässlicher Partner für die Einrichtung von Schulen und Kindergärten in Südtirol. Persönliche Projektbegleitung durch Simon Brugger, Standorte Meran & Brixen, Exklusivvertretung von VS Möbel.',
  },
  skip: 'Zum Inhalt springen',
  /** One quiet line for facts that are not confirmed yet, e.g. "Rolle und Telefon folgen". */
  pending: (items: string[]) =>
    `${items.length > 1 ? `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}` : items[0]} ${items.length > 1 ? 'folgen' : 'folgt'}`,
  pendingFields: { lastName: 'Nachname', role: 'Rolle', phone: 'Telefon', address: 'Adresse' },
  nav: {
    items: [
      { label: 'Leistungen', href: '#leistungen' },
      { label: 'Schule & Kindergarten', href: '#projekte' },
      { label: 'Ansprechpartner', href: '#menschen' },
      { label: 'VS Möbel', href: '#vs-moebel' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    cta: 'Projekt anfragen',
    ctaShort: 'Anfragen',
    home: 'Trias Schule, zum Seitenanfang',
    main: 'Hauptnavigation',
    mobile: 'Mobile Navigation',
    menu: 'Menü',
    family: 'Ein Bereich von Trias',
    familyNewTab: '(öffnet trias.it in neuem Tab)',
    close: 'Schließen',
    switchLabel: 'Sprache',
  },
  hero: {
    headline: 'Lernräume für Südtirol.',
    sub: 'Trias Schule ist in ganz Südtirol bekannt als verlässlicher Partner für die Einrichtung von Schulen und Kindergärten. Persönlich betreut von Simon Brugger – von der Planung bis zur pünktlichen Montage, mit Möbeln von VS.',
    /** the short line under the handwritten claim (Whiteboard) */
    subShort: 'Wir richten Schulen und Kindergärten in ganz Südtirol ein – persönlich betreut von Simon Brugger, von der Planung bis zur Montage, mit Möbeln von VS.',
    primary: 'Raumlösungen ansehen',
    secondary: 'Projekt anfragen',
    notes: { flex: 'Flexibilität', acoustics: 'Akustik?', groups: 'Gruppenarbeit' },
  },
  chair: {
    label: 'Ginstergelber PantoSwing-Schulstuhl von VS, Vorderansicht',
    detailed: 'Ginstergelber Schulstuhl von VS in der Seitenansicht (schematische Darstellung)',
    seatHeight: 'Sitzhöhe',
  },
  services: {
    title: 'So läuft ein Projekt mit uns.',
    intro:
      'Am Anfang steht ein Gespräch vor Ort: Wer nutzt den Raum, wofür und zu welchen Zeiten? Daraus entsteht der Plan. Danach liefern und montieren wir.',
    step: 'Schritt',
    of: 'von',
    plan: { title: 'Grundriss', zones: ['Gruppentische', 'Ruhe', 'Sitzkreis'], later: 'und später?' },
    items: [
      { title: 'Beraten', text: 'Wir schauen uns den Raum an und sprechen mit den Menschen, die darin lernen und arbeiten.' },
      { title: 'Planen', text: 'Wir legen Möblierung, Raumaufteilung und Nutzung gemeinsam mit Ihnen fest.' },
      { title: 'Ausstatten', text: 'Wir wählen die Möbel und Systeme von VS aus, die zu Ihrem Projekt passen.' },
      { title: 'Umsetzen', text: 'Wir kümmern uns um Bestellung, Lieferung und Montage.' },
      { title: 'Begleiten', text: 'Auch nach der Übergabe erreichen Sie uns direkt, hier in Südtirol.' },
    ],
  },
  projects: {
    title: 'Raumlösungen für Schule & Kindergarten',
    sub: 'Wie zeitgemäße Lern- und Gruppenräume in Südtirol funktionieren – geplant, geliefert und montiert von Trias Schule mit Systemmöbeln von VS.',
    placeholder: 'Raumlösung · VS Möbel',
    meta: { location: 'Ort', type: 'Bereich', services: 'Leistungen', year: 'Jahr', architect: 'Architektur', client: 'Auftraggeber' },
  },
  quotes: {
    closingLabel: 'Kundenstimme',
  },
  phases: {
    title: 'Wo stehen Sie gerade?',
    lead: 'Wählen Sie die Phase Ihres Projekts. Das Anfrageformular ist dann schon vorbereitet.',
    /** one line per phase, in the order of form.phases */
    hints: [
      'Es gibt Räume in Schule oder Kindergarten und den Wunsch, sie neu zu denken.',
      'Architekturbüro oder Gemeinde planen bereits.',
      'Sie wissen, was gebraucht wird, und suchen die passenden Möbel.',
      'Die Einrichtung wird öffentlich ausgeschrieben.',
      'Ein bestehendes Gebäude wird umgebaut oder erweitert.',
    ],
  },
  people: {
    title: 'Ein verlässlicher Partner im Land.',
    intro: 'Gemeinden, Direktionen und Architekturbüros in ganz Südtirol schätzen kurze Wege und Handschlagqualität. Simon Brugger begleitet Ihr Projekt persönlich – vom ersten Gespräch vor Ort bis weit nach der Montage.',
    portraitAlt: (name: string) => `Portrait von ${name}`,
    teamTitle: 'Trias Meran & Brixen',
    teamRole: 'Planung, Bemusterung & eigenes Montageteam in ganz Südtirol',
    reachBoth: 'Allgemeine Projektanfragen:',
    questionsLabel: 'Fragen aus dem Gespräch vor Ort',
    questions: [
      'Wie wechselt der Raum zwischen Unterricht, Spiel und Ruhe?',
      'Welche Altersgruppen nutzen Tische, Stühle und Stauraum?',
      'Welche bestehenden Möbel bleiben sinnvoll im Raum?',
      'Welches Bau- oder Ferienfenster steht für die Montage fest?',
    ],
  },
  vs: {
    title: 'Möbel für Schulen und Kindergärten in Bewegung.',
    intro: 'Als Exklusivvertretung von VS Möbel in Südtirol verbinden wir eines der führenden europäischen Möbelsysteme für Bildungsbauten mit regionaler Planung und eigener Montage.',
    caption: 'Schulstuhl von VS in Ginstergelb · schematische Darstellung',
    newTab: '(öffnet vs.de in neuem Tab)',
    all: 'Gesamtes VS Sortiment entdecken',
    exclusive: 'Exklusivvertretung VS Möbel in Südtirol',
    // deep links into VS (checked 14.10.2026); VS has no kindergarten page, so that category stays without one
    categories: [
      { name: 'Schul- & Gruppentische', text: 'Leichte Einzel- und Mehrecktische, die sich im Alltag schnell umstellen lassen.', url: 'https://www.vs.de/de/cb/Bildung/Produkte-Bildung/Tische-Bildung' },
      { name: 'Ergonomisches Sitzen', text: 'Schwingstühle, Drehstühle und Bewegungshocker für ruhiges, gesundes Sitzen.', url: 'https://www.vs.de/de/cb/Bildung/Produkte-Bildung/Sitzmoebel-Bildung' },
      { name: 'Kindergarten', text: 'Kippsichere Sitzmöbel, Spieltische, Bodenpolster und offene Regale auf Kinderhöhe.' },
      { name: 'Stauraum & Garderoben', text: 'Schränke, Eigentumsfächer, Raumteiler und robuste Garderobenlösungen.', url: 'https://www.vs.de/de/cb/Bildung/Produkte-Bildung/Stauraum-Bildung' },
      { name: 'Offene Lernlandschaften', text: 'Modulare Polsterinseln und akustisch abgeschirmte Rückzugsorte für offene Bereiche.', url: 'https://www.vs.de/de/roomconcepts/Bildung/Raumkonzepte/LernenEntdecken/FlexiblerLernraum' },
    ],
  },
  contact: {
    title: 'Sprechen wir über Ihre Schule oder Ihren Kindergarten.',
    lead: 'Schreiben Sie kurz, worum es geht. Simon Brugger meldet sich persönlich bei Ihnen.',
    chat: '… und die Gruppentische ans Fenster?',
    cta: 'Projekt anfragen',
    call: 'Direkt anrufen',
    mail: (email: string) => `Direkt an ${email}`,
    seated: (name: string) => `${name} auf einem ginstergelben VS-Hocker (Zeichnung)`,
  },
  form: {
    title: 'Ihre Anfrage',
    required: '* Pflichtfeld',
    optional: '(optional)',
    fields: {
      name: { label: 'Name', key: 'Name', error: 'Bitte geben Sie Ihren Namen an.' },
      org: { label: 'Schule, Kindergarten oder Gemeinde', key: 'Organisation', error: 'Für wen planen wir? Bitte Einrichtung oder Gemeinde angeben.' },
      mail: { label: 'E-Mail', key: 'E-Mail', error: 'Bitte eine gültige E-Mail-Adresse angeben, z. B. name@schule.it.' },
      tel: { label: 'Telefon', key: 'Telefon' },
      place: { label: 'Projektort', key: 'Projektort', placeholder: 'z. B. Gemeinde oder Gebäude' },
      phase: { label: 'Projektphase', key: 'Projektphase' },
      msg: { label: 'Nachricht', key: 'Nachricht', placeholder: 'Um welchen Raum geht es, und was soll er künftig können?', error: 'Bitte beschreiben Sie Ihr Projekt in ein, zwei Sätzen.' },
    },
    phases: ['Erste Idee', 'Planung läuft', 'Konkrete Ausstattung', 'Ausschreibung', 'Umbau / Erweiterung'],
    /** Whiteboard form: an extra choice next to the phases, for orders without a project */
    orderOption: 'Bestellung / Nachbestellung',
    /** Whiteboard form: e-mail or phone is enough */
    reach: { hint: 'E-Mail oder Telefon – eines von beiden genügt.', error: 'Bitte eine gültige E-Mail-Adresse oder eine Telefonnummer angeben, damit wir Sie erreichen.', callback: '(für einen Rückruf)' },
    reassure: 'Unverbindlich. Simon Brugger meldet sich persönlich bei Ihnen.',
    submit: 'Anfrage senden',
    status: {
      invalid: 'Bitte prüfen Sie die markierten Felder.',
      sending: 'Anfrage wird gesendet …',
      sent: 'Danke, Ihre Anfrage ist angekommen. Wir melden uns bei Ihnen.',
      failed: 'Senden hat nicht geklappt. Bitte schreiben Sie direkt an {email}.',
      mailto: 'Ihr E-Mail-Programm sollte sich jetzt mit einer vorbereiteten Nachricht an {email} öffnen. Falls nicht, kopieren Sie Ihre Anfrage und senden Sie sie selbst.',
      copied: 'Kopiert. Fügen Sie den Text in eine E-Mail an {email} ein.',
      copyFailed: 'Kopieren hat nicht geklappt. Bitte schreiben Sie direkt an {email}.',
      subject: 'Projektanfrage',
    },
    copy: 'Anfrage kopieren',
    emailAction: 'E-Mail öffnen',
    privacy: 'Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten.',
    privacyHosted: 'Zur Übermittlung nutzen wir Formspree.',
    privacyLink: 'Datenschutz',
  },
  legal: { back: 'Zur Startseite', pending: 'folgt' },
  footer: {
    claim: 'Ihr verlässlicher Partner für Schul- und Kindergarteneinrichtung in Südtirol. Exklusivvertretung von VS Möbel.',
    contact: 'Kontakt & Standorte',
    page: 'Seite',
    legal: 'Rechtliches',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    company: `ein Geschäftsbereich der ${company.name}`,
    partner: 'Exklusivpartner von VS Möbel in Südtirol',
    credits: 'Bildnachweis:',
  },
};

export type UI = typeof de;

const it: UI = {
  htmlLang: 'it',
  ogLocale: 'it_IT',
  langName: 'Italiano',
  meta: {
    title: 'Trias Schule | Spazi di apprendimento per scuole e scuole dell’infanzia in Alto Adige',
    description:
      'Trias Schule offre consulenza, progettazione, fornitura e montaggio di arredi per scuole e scuole dell’infanzia in Alto Adige. Rappresentanza esclusiva di VS Möbel.',
  },
  skip: 'Vai al contenuto',
  pending: (items: string[]) => {
    const list = items.length > 1 ? `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}` : items[0];
    return `${list.charAt(0).toUpperCase()}${list.slice(1)} in arrivo`;
  },
  pendingFields: { lastName: 'cognome', role: 'ruolo', phone: 'telefono', address: 'indirizzo' },
  nav: {
    items: [
      { label: 'Servizi', href: '#leistungen' },
      { label: 'Scuola e infanzia', href: '#projekte' },
      { label: 'Referente', href: '#menschen' },
      { label: 'Mobili VS', href: '#vs-moebel' },
      { label: 'Contatti', href: '#kontakt' },
    ],
    cta: 'Richiedi un progetto',
    ctaShort: 'Richiedi',
    home: 'Trias Schule, torna all’inizio',
    main: 'Navigazione principale',
    mobile: 'Navigazione mobile',
    menu: 'Menu',
    family: 'Una divisione di Trias',
    familyNewTab: '(apre trias.it in una nuova scheda)',
    close: 'Chiudi',
    switchLabel: 'Lingua',
  },
  hero: {
    headline: 'Spazi per imparare in Alto Adige.',
    sub: 'Trias Schule è il partner affidabile in tutto l’Alto Adige per l’arredo di scuole e scuole dell’infanzia. Con Simon Brugger seguiamo il vostro progetto dalla consulenza al montaggio puntuale, con i mobili di VS.',
    /** the short line under the handwritten claim (Whiteboard) */
    subShort: 'Arrediamo scuole e scuole dell’infanzia in tutto l’Alto Adige – seguiti personalmente da Simon Brugger, dalla progettazione al montaggio, con i mobili di VS.',
    primary: 'Vedi le soluzioni',
    secondary: 'Richiedi un progetto',
    notes: { flex: 'Flessibilità', acoustics: 'Acustica?', groups: 'Lavoro di gruppo' },
  },
  chair: {
    label: 'Sedia scolastica PantoSwing di VS in giallo ginestra, vista frontale',
    detailed: 'Sedia scolastica VS in giallo ginestra vista di lato (rappresentazione schematica)',
    seatHeight: 'altezza seduta',
  },
  services: {
    title: 'Come funziona un progetto con noi.',
    intro:
      'Tutto inizia con un incontro sul posto: chi usa lo spazio, per cosa e in quali orari? Da lì nasce il progetto. Poi consegniamo e montiamo.',
    step: 'Passo',
    of: 'di',
    plan: { title: 'Pianta', zones: ['Tavoli di gruppo', 'Quiete', 'Cerchio'], later: 'e più avanti?' },
    items: [
      { title: 'Consigliare', text: 'Visitiamo gli spazi e parliamo con chi ci studia e ci lavora.' },
      { title: 'Progettare', text: 'Definiamo insieme a voi arredi, disposizione e utilizzo degli spazi.' },
      { title: 'Arredare', text: 'Scegliamo i mobili e i sistemi VS adatti al vostro progetto.' },
      { title: 'Realizzare', text: 'Ci occupiamo di ordine, consegna e montaggio.' },
      { title: 'Accompagnare', text: 'Anche dopo la consegna ci trovate direttamente, qui in Alto Adige.' },
    ],
  },
  projects: {
    title: 'Soluzioni per scuola e infanzia',
    sub: 'Come funzionano spazi moderni per scuole e scuole dell’infanzia in Alto Adige – progettati, forniti e montati da Trias Schule con i mobili di VS.',
    placeholder: 'Soluzione · VS Möbel',
    meta: { location: 'Luogo', type: 'Ambito', services: 'Servizi', year: 'Anno', architect: 'Architettura', client: 'Committente' },
  },
  quotes: {
    closingLabel: 'Testimonianza',
  },
  phases: {
    title: 'A che punto siete?',
    lead: 'Scegliete la fase del vostro progetto: il modulo di richiesta sarà già pronto.',
    hints: [
      'Ci sono spazi a scuola o all’infanzia e il desiderio di ripensarli.',
      'Architetti o Comune stanno già progettando.',
      'Sapete cosa serve e cercate i mobili giusti.',
      'L’arredamento viene messo a gara pubblica.',
      'Un edificio esistente viene ristrutturato o ampliato.',
    ],
  },
  people: {
    title: 'Un partner affidabile sul territorio.',
    intro: 'Comuni, direzioni scolastiche e studi di architettura in tutto l’Alto Adige apprezzano la vicinanza e l’affidabilità di Trias. Simon Brugger segue personalmente il vostro progetto dal primo sopralluogo al montaggio.',
    portraitAlt: (name: string) => `Ritratto di ${name}`,
    teamTitle: 'Trias Merano & Bressanone',
    teamRole: 'Progettazione, campionatura e squadra di montaggio interna in tutto l’Alto Adige',
    reachBoth: 'Richieste generali:',
    questionsLabel: 'Domande dal sopralluogo',
    questions: [
      'Come cambia l’uso dello spazio tra lezione, gioco e riposo?',
      'Quali fasce d’età utilizzano tavoli, sedute e contenitori?',
      'Quali arredi esistenti restano nello spazio?',
      'Quale finestra temporale è prevista per il montaggio?',
    ],
  },
  vs: {
    title: 'Mobili per scuole e scuole dell’infanzia in movimento.',
    intro: 'Come rappresentanza esclusiva di VS Möbel in Alto Adige uniamo uno dei principali sistemi europei per l’edilizia scolastica alla progettazione locale e al montaggio interno.',
    caption: 'Sedia scolastica VS in giallo ginestra · rappresentazione schematica',
    newTab: '(apre vs.de in una nuova scheda)',
    all: 'Scopri l’assortimento VS completo',
    exclusive: 'Rappresentanza esclusiva VS Möbel in Alto Adige',
    categories: [
      { name: 'Tavoli scolastici e di gruppo', text: 'Tavoli singoli e poligonali leggeri, facili da riorganizzare ogni giorno.', url: 'https://www.vs.de/en/cb/Bildung/Produkte-Bildung/Tische-Bildung' },
      { name: 'Sedute ergonomiche', text: 'Sedie oscillanti, girevoli e sgabelli dinamici per ogni fascia d’età.', url: 'https://www.vs.de/en/cb/Bildung/Produkte-Bildung/Sitzmoebel-Bildung' },
      { name: 'Scuola dell’infanzia', text: 'Sedute antiribaltamento, tavoli gioco, materassini e scaffali aperti a misura di bambino.' },
      { name: 'Contenitori e guardaroba', text: 'Armadi, casellari, divisori e soluzioni guardaroba robuste.', url: 'https://www.vs.de/en/cb/Bildung/Produkte-Bildung/Stauraum-Bildung' },
      { name: 'Spazi di apprendimento aperti', text: 'Isole imbottite modulari e nicchie acustiche per aree comuni e tempo pieno.', url: 'https://www.vs.de/en/roomconcepts/Bildung/Raumkonzepte/LernenEntdecken/FlexiblerLernraum' },
    ],
  },
  contact: {
    title: 'Parliamo della vostra scuola o scuola dell’infanzia.',
    lead: 'Scriveteci in breve di cosa si tratta. Simon Brugger vi ricontatterà personalmente.',
    chat: '… e i tavoli di gruppo vicino alla finestra?',
    cta: 'Richiedi un progetto',
    call: 'Chiamateci',
    mail: (email: string) => `Direttamente a ${email}`,
    seated: (name: string) => `${name} su uno sgabello VS giallo ginestra (disegno)`,
  },
  form: {
    title: 'La vostra richiesta',
    required: '* Campo obbligatorio',
    optional: '(facoltativo)',
    fields: {
      name: { label: 'Nome', key: 'Nome', error: 'Indicate il vostro nome.' },
      org: { label: 'Scuola, scuola dell’infanzia o Comune', key: 'Istituto', error: 'Per chi progettiamo? Indicate l’istituto o il Comune.' },
      mail: { label: 'E-mail', key: 'E-mail', error: 'Indicate un indirizzo e-mail valido, p. es. nome@scuola.it.' },
      tel: { label: 'Telefono', key: 'Telefono' },
      place: { label: 'Luogo del progetto', key: 'Luogo del progetto', placeholder: 'p. es. Comune o edificio' },
      phase: { label: 'Fase del progetto', key: 'Fase del progetto' },
      msg: { label: 'Messaggio', key: 'Messaggio', placeholder: 'Di quale spazio si tratta e cosa dovrà offrire in futuro?', error: 'Descrivete il progetto in una o due frasi.' },
    },
    phases: ['Prima idea', 'Progettazione in corso', 'Arredamento concreto', 'Gara d’appalto', 'Ristrutturazione / ampliamento'],
    orderOption: 'Ordine / riordino',
    reach: { hint: 'E-mail o telefono: basta uno dei due.', error: 'Indicate un indirizzo e-mail valido o un numero di telefono per potervi ricontattare.', callback: '(per essere richiamati)' },
    reassure: 'Senza impegno. Simon Brugger vi ricontatterà personalmente.',
    submit: 'Invia richiesta',
    status: {
      invalid: 'Controllate i campi evidenziati.',
      sending: 'Invio in corso …',
      sent: 'Grazie, abbiamo ricevuto la vostra richiesta. Vi ricontatteremo.',
      failed: 'Invio non riuscito. Scriveteci direttamente a {email}.',
      mailto: 'Il vostro programma di posta dovrebbe aprirsi ora con un messaggio pronto per {email}. Se non si apre, copiate la richiesta e inviatela voi.',
      copied: 'Copiata. Incollate il testo in un’e-mail a {email}.',
      copyFailed: 'Copia non riuscita. Scriveteci direttamente a {email}.',
      subject: 'Richiesta progetto',
    },
    copy: 'Copia la richiesta',
    emailAction: 'Apri e-mail',
    privacy: 'Usiamo i vostri dati solo per rispondere alla vostra richiesta.',
    privacyHosted: 'Per l’invio utilizziamo Formspree.',
    privacyLink: 'Privacy',
  },
  legal: { back: 'Torna alla home', pending: 'in arrivo' },
  footer: {
    claim: 'Il vostro partner affidabile per l’arredo di scuole e scuole dell’infanzia in Alto Adige. Rappresentanza esclusiva di VS Möbel.',
    contact: 'Contatti e sedi',
    page: 'Pagina',
    legal: 'Note legali',
    imprint: 'Note legali',
    privacy: 'Privacy',
    company: `un settore di ${company.name}`,
    partner: 'Partner esclusivo di VS Möbel in Alto Adige',
    credits: 'Crediti fotografici:',
  },
};

export const ui: Record<Lang, UI> = { de, it };

export const useTranslations = (lang: Lang) => ui[lang];
