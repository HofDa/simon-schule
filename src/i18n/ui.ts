/**
 * All interface copy in German (default, served at /) and Italian (/it/).
 * Project content lives in src/data/projects.ts, contact facts in src/data/site.ts.
 * The Italian copy was written for this site and should be reviewed by a native speaker.
 */

export const langs = ['de', 'it'] as const;
export type Lang = (typeof langs)[number];

/** The page's language, from Astro's i18n routing (German when nothing matches). */
export const getLang = (locale: string | undefined): Lang => (locale === 'it' ? 'it' : 'de');

const de = {
  htmlLang: 'de',
  ogLocale: 'de_IT',
  langName: 'Deutsch',
  meta: {
    title: 'Trias Schule | Lernräume für Schulen und Kindergärten in Südtirol',
    description:
      'Trias Schule berät, plant, liefert und montiert die Einrichtung von Schulen und Kindergärten in Südtirol. Exklusivvertretung von VS Möbel.',
  },
  skip: 'Zum Inhalt springen',
  /** One quiet line for facts that are not confirmed yet, e.g. "Rolle und Telefon folgen". */
  pending: (items: string[]) =>
    `${items.length > 1 ? `${items.slice(0, -1).join(', ')} und ${items[items.length - 1]}` : items[0]} ${items.length > 1 ? 'folgen' : 'folgt'}`,
  pendingFields: { lastName: 'Nachname', role: 'Rolle', phone: 'Telefon', address: 'Adresse' },
  nav: {
    items: [
      { label: 'Leistungen', href: '#leistungen' },
      { label: 'Projekte', href: '#projekte' },
      { label: 'Über uns', href: '#menschen' },
      { label: 'VS Möbel', href: '#vs-moebel' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    cta: 'Projekt anfragen',
    ctaShort: 'Anfragen',
    home: 'Trias Schule, zum Seitenanfang',
    main: 'Hauptnavigation',
    mobile: 'Mobile Navigation',
    menu: 'Menü',
    close: 'Schließen',
    switchLabel: 'Sprache',
  },
  hero: {
    headline: 'Lernräume für Südtirol.',
    sub: 'Wir planen und richten Schulen und Kindergärten in Südtirol ein, mit Möbeln von VS. Sie haben dabei von Anfang an feste Ansprechpartner.',
    primary: 'Projekte entdecken',
    secondary: 'Projekt besprechen',
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
    plan: { zones: ['Gruppentische', 'Ruhe', 'Sitzkreis'], later: 'und später?' },
    items: [
      { title: 'Beraten', text: 'Wir schauen uns den Raum an und sprechen mit den Menschen, die darin lernen und arbeiten.' },
      { title: 'Planen', text: 'Wir legen Möblierung, Raumaufteilung und Nutzung gemeinsam mit Ihnen fest.' },
      { title: 'Ausstatten', text: 'Wir wählen die Möbel und Systeme von VS aus, die zu Ihrem Projekt passen.' },
      { title: 'Umsetzen', text: 'Wir kümmern uns um Bestellung, Lieferung und Montage.' },
      { title: 'Begleiten', text: 'Auch nach der Übergabe erreichen Sie uns direkt, hier in Südtirol.' },
    ],
  },
  projects: {
    title: 'Unsere Projekte',
    sub: 'Schulen und Kindergärten in Südtirol, die wir geplant und eingerichtet haben.',
    placeholder: 'Beispielprojekt · Platzhalter',
    meta: { location: 'Ort', type: 'Gebäude', services: 'Leistungen', year: 'Jahr', architect: 'Architektur', client: 'Auftraggeber' },
  },
  quotes: {
    closingLabel: 'Kundenstimme',
  },
  phases: {
    title: 'Wo stehen Sie gerade?',
    lead: 'Wählen Sie die Phase Ihres Projekts. Das Anfrageformular ist dann schon vorbereitet.',
    /** one line per phase, in the order of form.phases */
    hints: [
      'Es gibt einen Raum und den Wunsch, ihn zu verändern.',
      'Architektur oder Gemeinde planen bereits.',
      'Sie wissen, was gebraucht wird, und suchen die passenden Möbel.',
      'Die Einrichtung wird öffentlich ausgeschrieben.',
      'Ein bestehendes Gebäude wird umgebaut oder erweitert.',
    ],
  },
  people: {
    title: 'Zwei Ansprechpartner für Ihr ganzes Projekt.',
    intro: 'Simon und Rene planen Ihr Projekt, koordinieren Lieferung und Montage und sind auch danach für Sie da.',
    portraitAlt: (name: string) => `Portrait von ${name}`,
    reachBoth: 'Beide erreichen Sie unter',
    questionsLabel: 'Fragen aus einem Planungsgespräch',
    questions: [
      'Wie viele Kinder nutzen den Raum?',
      'Wie flexibel muss er sein?',
      'Welche Möbel bleiben bestehen?',
      'Was ändert sich im Laufe des Tages?',
    ],
  },
  vs: {
    title: 'Möbel für Lernräume in Bewegung.',
    intro: 'Wir sind die Exklusivvertretung von VS Möbel in Südtirol. Hier sehen Sie eine Auswahl, das ganze Sortiment finden Sie bei VS.',
    caption: 'Schulstuhl von VS in Ginstergelb · schematische Darstellung',
    newTab: '(öffnet vs.de in neuem Tab)',
    all: 'Gesamtes VS Sortiment entdecken',
    exclusive: 'Exklusivvertretung VS Möbel in Südtirol',
    categories: [
      { name: 'Sitzen', text: 'Stühle und Hocker, auf denen man sich bewegen kann.' },
      { name: 'Tische', text: 'Einzel- und Gruppentische, die sich schnell umstellen lassen.' },
      { name: 'Stauraum', text: 'Schränke und Regale, die auch als Raumteiler dienen.' },
      { name: 'Flexible Lernlandschaften', text: 'Möbel für offene Bereiche, die im Laufe des Tages unterschiedlich genutzt werden.' },
      { name: 'Kindergarten', text: 'Möbel und Stauraum in Kinderhöhe.' },
    ],
  },
  contact: {
    title: 'Sprechen wir über Ihren nächsten Lernraum.',
    lead: 'Schreiben Sie uns kurz, worum es geht. Simon oder Rene melden sich bei Ihnen.',
    chat: '… und die Gruppentische ans Fenster?',
    cta: 'Projekt anfragen',
    call: 'Direkt anrufen',
    mail: (email: string) => `E-Mail an ${email}`,
    seated: (name: string) => `${name} auf einem ginstergelben VS-Hocker (Platzhalterzeichnung)`,
  },
  form: {
    title: 'Ihr Projekt',
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
    privacy: 'Wir verwenden Ihre Angaben nur, um Ihre Anfrage zu beantworten.',
    privacyLink: 'Datenschutz',
  },
  legal: { back: 'Zur Startseite', pending: 'folgt' },
  footer: {
    claim: 'Einrichtung für Schulen und Kindergärten in Südtirol. Exklusivvertretung von VS Möbel.',
    contact: 'Kontakt',
    page: 'Seite',
    legal: 'Rechtliches',
    imprint: 'Impressum',
    privacy: 'Datenschutz',
    company: 'ein Geschäftsbereich der Trias OHG',
    partner: 'Partner von VS Möbel',
    credits: 'Platzhalterfotos von Wikimedia Commons:',
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
      { label: 'Progetti', href: '#projekte' },
      { label: 'Chi siamo', href: '#menschen' },
      { label: 'Mobili VS', href: '#vs-moebel' },
      { label: 'Contatti', href: '#kontakt' },
    ],
    cta: 'Richiedi un progetto',
    ctaShort: 'Richiedi',
    home: 'Trias Schule, torna all’inizio',
    main: 'Navigazione principale',
    mobile: 'Navigazione mobile',
    menu: 'Menu',
    close: 'Chiudi',
    switchLabel: 'Lingua',
  },
  hero: {
    headline: 'Spazi per imparare in Alto Adige.',
    sub: 'Progettiamo e arrediamo scuole e scuole dell’infanzia in Alto Adige, con i mobili di VS. Fin dall’inizio avete referenti fissi.',
    primary: 'Scopri i progetti',
    secondary: 'Parliamo del progetto',
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
    plan: { zones: ['Tavoli di gruppo', 'Quiete', 'Cerchio'], later: 'e più avanti?' },
    items: [
      { title: 'Consigliare', text: 'Visitiamo gli spazi e parliamo con chi ci studia e ci lavora.' },
      { title: 'Progettare', text: 'Definiamo insieme a voi arredi, disposizione e utilizzo degli spazi.' },
      { title: 'Arredare', text: 'Scegliamo i mobili e i sistemi VS adatti al vostro progetto.' },
      { title: 'Realizzare', text: 'Ci occupiamo di ordine, consegna e montaggio.' },
      { title: 'Accompagnare', text: 'Anche dopo la consegna ci trovate direttamente, qui in Alto Adige.' },
    ],
  },
  projects: {
    title: 'I nostri progetti',
    sub: 'Scuole e scuole dell’infanzia in Alto Adige che abbiamo progettato e arredato.',
    placeholder: 'Progetto d’esempio · segnaposto',
    meta: { location: 'Luogo', type: 'Edificio', services: 'Servizi', year: 'Anno', architect: 'Architettura', client: 'Committente' },
  },
  quotes: {
    closingLabel: 'Testimonianza',
  },
  phases: {
    title: 'A che punto siete?',
    lead: 'Scegliete la fase del vostro progetto: il modulo di richiesta sarà già pronto.',
    hints: [
      'C’è uno spazio e il desiderio di cambiarlo.',
      'Architetti o Comune stanno già progettando.',
      'Sapete cosa serve e cercate i mobili giusti.',
      'L’arredamento viene messo a gara pubblica.',
      'Un edificio esistente viene ristrutturato o ampliato.',
    ],
  },
  people: {
    title: 'Due referenti per tutto il vostro progetto.',
    intro: 'Simon e Rene seguono la progettazione, coordinano consegna e montaggio e restano a vostra disposizione anche dopo.',
    portraitAlt: (name: string) => `Ritratto di ${name}`,
    reachBoth: 'Li trovate entrambi a',
    questionsLabel: 'Domande da un colloquio di progettazione',
    questions: [
      'Quanti bambini usano lo spazio?',
      'Quanto deve essere flessibile?',
      'Quali mobili restano?',
      'Cosa cambia nel corso della giornata?',
    ],
  },
  vs: {
    title: 'Mobili per spazi di apprendimento in movimento.',
    intro: 'Siamo la rappresentanza esclusiva di VS Möbel in Alto Adige. Qui trovate una selezione, l’assortimento completo è sul sito di VS.',
    caption: 'Sedia scolastica VS in giallo ginestra · rappresentazione schematica',
    newTab: '(apre vs.de in una nuova scheda)',
    all: 'Scopri l’assortimento VS completo',
    exclusive: 'Rappresentanza esclusiva VS Möbel in Alto Adige',
    categories: [
      { name: 'Sedute', text: 'Sedie e sgabelli su cui ci si può muovere.' },
      { name: 'Tavoli', text: 'Tavoli singoli e di gruppo, facili da riorganizzare.' },
      { name: 'Contenitori', text: 'Armadi e scaffali che fanno anche da divisori.' },
      { name: 'Spazi di apprendimento flessibili', text: 'Mobili per aree aperte, usate in modi diversi nel corso della giornata.' },
      { name: 'Scuola dell’infanzia', text: 'Mobili e contenitori all’altezza dei bambini.' },
    ],
  },
  contact: {
    title: 'Parliamo del vostro prossimo spazio di apprendimento.',
    lead: 'Scriveteci in breve di cosa si tratta. Simon o Rene vi ricontatteranno.',
    chat: '… e i tavoli di gruppo vicino alla finestra?',
    cta: 'Richiedi un progetto',
    call: 'Chiamateci',
    mail: (email: string) => `E-mail a ${email}`,
    seated: (name: string) => `${name} su uno sgabello VS giallo ginestra (disegno segnaposto)`,
  },
  form: {
    title: 'Il vostro progetto',
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
    privacy: 'Usiamo i vostri dati solo per rispondere alla vostra richiesta.',
    privacyLink: 'Privacy',
  },
  legal: { back: 'Torna alla home', pending: 'in arrivo' },
  footer: {
    claim: 'Arredi per scuole e scuole dell’infanzia in Alto Adige. Rappresentanza esclusiva di VS Möbel.',
    contact: 'Contatti',
    page: 'Pagina',
    legal: 'Note legali',
    imprint: 'Note legali',
    privacy: 'Privacy',
    company: 'un settore di Trias OHG',
    partner: 'Partner di VS Möbel',
    credits: 'Foto segnaposto da Wikimedia Commons:',
  },
};

export const ui: Record<Lang, UI> = { de, it };

export const useTranslations = (lang: Lang) => ui[lang];
