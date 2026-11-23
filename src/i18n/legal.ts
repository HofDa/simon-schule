/**
 * Imprint and privacy notice in German and Italian.
 *
 * `value: null` is a fact Trias has not confirmed yet: it renders as an open marker, never
 * as an invented value. The privacy notice is a draft (see `draft`) and describes the site
 * as it is built today: no cookies or tracking, self-hosted fonts, hosting on GitHub Pages,
 * and contact by telephone or e-mail only (the inquiry form was removed in November 2026).
 */
import { company, contact, photoCredits } from '../data/site';
import type { Lang } from './ui';

export interface LegalRow {
  label: string;
  value: string | null;
  href?: string;
}
export interface LegalSection {
  title: string;
  rows?: LegalRow[];
  paragraphs?: string[];
  links?: { label: string; href: string }[];
}
export interface LegalDoc {
  title: string;
  description: string;
  /** Shown above the text while the document awaits legal review. */
  draft?: string;
  intro?: string;
  sections: LegalSection[];
  updated?: string;
}

const mail: LegalRow = { label: 'E-Mail', value: contact.email, href: `mailto:${contact.email}` };
const credits = photoCredits.map((c) => ({ label: `${c.author} (${c.license})`, href: c.url }));
const githubPrivacy = 'https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement';

const de: Record<'imprint' | 'privacy', LegalDoc> = {
  imprint: {
    title: 'Impressum',
    description: `Impressum von Trias Schule, einem Geschäftsbereich der ${company.name}.`,
    sections: [
      {
        title: 'Anbieter',
        rows: [
          { label: 'Unternehmen', value: company.name },
          { label: 'Geschäftsbereich', value: 'Trias Schule' },
          { label: 'Anschrift', value: company.address },
          { label: 'MwSt.-Nr. / Steuernummer', value: company.vat },
          { label: 'Handelsregister', value: null },
          { label: 'PEC', value: null },
        ],
      },
      {
        title: 'Kontakt',
        rows: [{ label: 'E-Mail', value: company.email, href: `mailto:${company.email}` }, { label: 'Telefon', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` }],
      },
      { title: 'Verantwortlich für den Inhalt', rows: [{ label: 'Name', value: null }] },
      {
        title: 'Bilder und Zeichnungen',
        paragraphs: [
          'Die Referenzfotos zeigen eingerichtete Schulen, Kindergärten und Bibliotheken in Südtirol (Trias; Fotografie u. a. Jaist, jeweils in der Bildansicht angegeben). Katalog- und Produktabbildungen stammen aus den Katalogen der VS Vereinigte Spezialmöbelfabriken und werden mit deren Genehmigung verwendet. Die Raumdarstellungen und Symbole sind schematische Zeichnungen.',
        ],
        links: credits,
      },
      {
        title: 'Schriften',
        paragraphs: [
          'Archivo (Omnibus-Type), Kalam (Indian Type Foundry) und Caveat (Impallari Type), jeweils unter SIL Open Font License 1.1. Alle Schriften werden direkt von dieser Website ausgeliefert.',
        ],
      },
      {
        title: 'VS Möbel',
        paragraphs: ['Trias Schule ist Exklusivvertretung von VS Möbel in Südtirol. Produktnamen gehören ihren jeweiligen Inhabern.'],
      },
    ],
  },
  privacy: {
    title: 'Datenschutz',
    description: 'Wie Trias Schule auf dieser Website mit Ihren Daten umgeht.',
    draft: 'Entwurf: vor der Veröffentlichung rechtlich prüfen lassen.',
    intro: 'Wir erheben auf dieser Website so wenig Daten wie möglich: keine Cookies, keine Analyse, kein Tracking.',
    sections: [
      { title: 'Verantwortlich', rows: [{ label: 'Unternehmen', value: company.name }, { label: 'Anschrift', value: company.address }, mail] },
      {
        title: 'Kontakt per E-Mail oder Telefon',
        paragraphs: [
          'Diese Website hat kein Kontaktformular. Wenn Sie uns per E-Mail schreiben oder anrufen, verarbeiten wir die Angaben, die Sie uns dabei mitteilen, etwa Name, Kontaktdaten, Schule, Kindergarten oder Gemeinde und Ihr Anliegen. Eine E-Mail senden Sie aus Ihrem eigenen E-Mail-Programm; diese Website übermittelt dabei nichts.',
          'Trias verwendet die Angaben, um Ihre Anfrage zu beantworten und ein mögliches Projekt vorzubereiten (Art. 6 Abs. 1 lit. b DSGVO), und löscht sie, sobald sie dafür nicht mehr gebraucht werden und keine gesetzliche Aufbewahrungspflicht besteht.',
        ],
      },
      {
        title: 'Hosting',
        paragraphs: [
          'Diese Website wird über GitHub Pages (GitHub, Inc., USA) ausgeliefert. Beim Aufruf verarbeitet GitHub technisch notwendige Daten wie Ihre IP-Adresse, um die Seite auszuliefern und abzusichern. Dabei können Daten in die USA übermittelt werden.',
        ],
        links: [{ label: 'Datenschutzerklärung von GitHub', href: githubPrivacy }],
      },
      {
        title: 'Schriften',
        paragraphs: ['Alle Schriften werden von dieser Website selbst geladen. Es besteht keine Verbindung zu Google oder anderen Schriftanbietern.'],
      },
      {
        title: 'Links zu anderen Websites',
        paragraphs: ['Links zu VS (vs.de) und zur Muttermarke Trias (trias.it) öffnen andere Websites. Dort gelten deren jeweiligen Datenschutzerklärungen.'],
      },
      {
        title: 'Ihre Rechte',
        paragraphs: [
          `Sie können Auskunft über Ihre Daten verlangen, ihre Berichtigung, Löschung oder Einschränkung, der Verarbeitung widersprechen und Ihre Daten übertragen lassen (Art. 15 bis 21 DSGVO). Schreiben Sie dazu an ${contact.email}.`,
          'Sie können sich außerdem bei der italienischen Datenschutzbehörde beschweren (Garante per la protezione dei dati personali).',
        ],
        links: [{ label: 'garanteprivacy.it', href: 'https://www.garanteprivacy.it/' }],
      },
    ],
    updated: 'Stand: November 2026',
  },
};

const it: Record<'imprint' | 'privacy', LegalDoc> = {
  imprint: {
    title: 'Note legali',
    description: `Note legali di Trias Schule, un settore di ${company.name}.`,
    sections: [
      {
        title: 'Titolare del sito',
        rows: [
          { label: 'Impresa', value: company.name },
          { label: 'Settore', value: 'Trias Schule' },
          { label: 'Indirizzo', value: company.address },
          { label: 'Partita IVA / Codice fiscale', value: company.vat },
          { label: 'Registro delle imprese', value: null },
          { label: 'PEC', value: null },
        ],
      },
      {
        title: 'Contatti',
        rows: [{ label: 'E-mail', value: company.email, href: `mailto:${company.email}` }, { label: 'Telefono', value: company.phone, href: `tel:${company.phone.replace(/\s/g, '')}` }],
      },
      { title: 'Responsabile dei contenuti', rows: [{ label: 'Nome', value: null }] },
      {
        title: 'Immagini e disegni',
        paragraphs: [
          'Le foto di riferimento mostrano scuole, scuole dell’infanzia e biblioteche arredate in Alto Adige (Trias; fotografia tra gli altri Jaist, indicata nella rispettiva galleria). Le immagini di catalogo e prodotto provengono dai cataloghi di VS Vereinigte Spezialmöbelfabriken e sono utilizzate con la loro autorizzazione. Le viste d’aula e i simboli sono rappresentazioni schematiche.',
        ],
        links: credits,
      },
      {
        title: 'Caratteri',
        paragraphs: [
          'Archivo (Omnibus-Type), Kalam (Indian Type Foundry) e Caveat (Impallari Type), ciascuno con licenza SIL Open Font License 1.1. Tutti i caratteri sono ospitati direttamente su questo sito.',
        ],
      },
      {
        title: 'VS Möbel',
        paragraphs: ['Trias Schule è la rappresentanza esclusiva di VS Möbel in Alto Adige. I nomi dei prodotti appartengono ai rispettivi titolari.'],
      },
    ],
  },
  privacy: {
    title: 'Privacy',
    description: 'Come Trias Schule tratta i vostri dati su questo sito.',
    draft: 'Bozza: da far verificare legalmente prima della pubblicazione.',
    intro: 'Su questo sito raccogliamo il minor numero possibile di dati: niente cookie, niente statistiche, nessun tracciamento.',
    sections: [
      { title: 'Titolare del trattamento', rows: [{ label: 'Impresa', value: company.name }, { label: 'Indirizzo', value: company.address }, mail] },
      {
        title: 'Contatto via e-mail o telefono',
        paragraphs: [
          'Questo sito non ha un modulo di contatto. Se ci scrivete un’e-mail o ci chiamate, trattiamo i dati che ci comunicate, ad esempio nome, recapiti, scuola, scuola dell’infanzia o Comune e la vostra richiesta. L’e-mail viene inviata dal vostro programma di posta; questo sito non trasmette nulla.',
          'Trias usa i dati per rispondere alla richiesta e preparare un eventuale progetto (art. 6, par. 1, lett. b GDPR) e li cancella quando non servono più, salvo obblighi di conservazione previsti dalla legge.',
        ],
      },
      {
        title: 'Hosting',
        paragraphs: [
          'Questo sito è distribuito tramite GitHub Pages (GitHub, Inc., USA). Alla visita GitHub tratta i dati tecnici necessari, come il vostro indirizzo IP, per fornire e proteggere il sito. I dati possono essere trasferiti negli Stati Uniti.',
        ],
        links: [{ label: 'Informativa privacy di GitHub', href: githubPrivacy }],
      },
      {
        title: 'Caratteri',
        paragraphs: ['Tutti i caratteri vengono caricati da questo sito. Non c’è alcuna connessione a Google o ad altri fornitori di font.'],
      },
      {
        title: 'Link ad altri siti',
        paragraphs: ['I link a VS (vs.de) e al marchio principale Trias (trias.it) aprono altri siti, ai quali si applicano le rispettive informative privacy.'],
      },
      {
        title: 'I vostri diritti',
        paragraphs: [
          `Potete chiedere l’accesso ai vostri dati, la rettifica, la cancellazione o la limitazione del trattamento, opporvi al trattamento e chiedere la portabilità dei dati (artt. 15–21 GDPR). Scriveteci a ${contact.email}.`,
          'Potete inoltre presentare reclamo al Garante per la protezione dei dati personali.',
        ],
        links: [{ label: 'garanteprivacy.it', href: 'https://www.garanteprivacy.it/' }],
      },
    ],
    updated: 'Aggiornamento: novembre 2026',
  },
};

export const legal: Record<Lang, Record<'imprint' | 'privacy', LegalDoc>> = { de, it };
