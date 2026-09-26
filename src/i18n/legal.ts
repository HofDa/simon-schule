/**
 * Imprint and privacy notice in German and Italian.
 *
 * `value: null` is a fact Trias has not confirmed yet: it renders as an open marker, never
 * as an invented value. The privacy notice is a draft (see `draft`) and describes the site
 * as it is built today: no cookies or tracking, self-hosted fonts, hosting on GitHub Pages,
 * and an inquiry form that composes an e-mail (mailto). If the form moves to a form service
 * (src/data/site.ts: inquiry.endpoint) or the hosting changes, update the matching section.
 */
import { contact, photoCredits } from '../data/site';
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
    description: 'Impressum von Trias Schule, einem Geschäftsbereich der Trias OHG.',
    sections: [
      {
        title: 'Anbieter',
        rows: [
          { label: 'Unternehmen', value: 'Trias OHG' },
          { label: 'Geschäftsbereich', value: 'Trias Schule' },
          { label: 'Anschrift', value: contact.address },
          { label: 'MwSt.-Nr.', value: null },
          { label: 'Handelsregister', value: null },
          { label: 'PEC', value: null },
        ],
      },
      {
        title: 'Kontakt',
        rows: [mail, { label: 'Telefon', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : undefined }],
      },
      { title: 'Verantwortlich für den Inhalt', rows: [{ label: 'Name', value: null }] },
      {
        title: 'Bilder und Zeichnungen',
        paragraphs: [
          'Die Projektfotos sind vorläufige Platzhalter von Wikimedia Commons. Die Zeichnungen von Stühlen, Hockern und Personen sind schematische Darstellungen.',
        ],
        links: credits,
      },
      {
        title: 'Schriften',
        paragraphs: [
          'Archivo und Caveat, SIL Open Font License 1.1. Die Handschrift der Überschrift ist aus EMS Felix gezeichnet (Sheldon B. Michaels und Windell H. Oskay, nach Felipa von Fontstage), SIL Open Font License 1.1.',
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
      { title: 'Verantwortlich', rows: [{ label: 'Unternehmen', value: 'Trias OHG' }, { label: 'Anschrift', value: contact.address }, mail] },
      {
        title: 'Anfrageformular',
        paragraphs: [
          'Wenn Sie das Anfrageformular nutzen, verarbeiten wir die Angaben, die Sie eintragen: Name, Schule, Kindergarten oder Gemeinde, E-Mail, auf Wunsch Telefon, Projektort, Projektphase und Ihre Nachricht.',
          `Das Formular sendet nichts an diese Website. Es bereitet eine E-Mail an ${contact.email} vor, die Sie in Ihrem eigenen E-Mail-Programm absenden.`,
          'Wir verwenden die Angaben nur, um Ihre Anfrage zu beantworten und ein mögliches Projekt vorzubereiten (Art. 6 Abs. 1 lit. b DSGVO). Wir geben sie nicht an Dritte weiter und löschen sie, sobald sie dafür nicht mehr gebraucht werden und keine gesetzliche Aufbewahrungspflicht besteht.',
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
        paragraphs: ['Links zu VS (vs.de) öffnen eine andere Website. Dort gilt deren Datenschutzerklärung.'],
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
    updated: 'Stand: September 2026',
  },
};

const it: Record<'imprint' | 'privacy', LegalDoc> = {
  imprint: {
    title: 'Note legali',
    description: 'Note legali di Trias Schule, un settore di Trias OHG.',
    sections: [
      {
        title: 'Titolare del sito',
        rows: [
          { label: 'Impresa', value: 'Trias OHG' },
          { label: 'Settore', value: 'Trias Schule' },
          { label: 'Indirizzo', value: contact.address },
          { label: 'Partita IVA', value: null },
          { label: 'Registro delle imprese', value: null },
          { label: 'PEC', value: null },
        ],
      },
      {
        title: 'Contatti',
        rows: [mail, { label: 'Telefono', value: contact.phone, href: contact.phone ? `tel:${contact.phone.replace(/\s/g, '')}` : undefined }],
      },
      { title: 'Responsabile dei contenuti', rows: [{ label: 'Nome', value: null }] },
      {
        title: 'Immagini e disegni',
        paragraphs: [
          'Le foto dei progetti sono segnaposto provvisori da Wikimedia Commons. I disegni di sedie, sgabelli e persone sono rappresentazioni schematiche.',
        ],
        links: credits,
      },
      {
        title: 'Caratteri',
        paragraphs: [
          'Archivo e Caveat, SIL Open Font License 1.1. La scritta a mano del titolo è disegnata con EMS Felix (Sheldon B. Michaels e Windell H. Oskay, da Felipa di Fontstage), SIL Open Font License 1.1.',
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
      { title: 'Titolare del trattamento', rows: [{ label: 'Impresa', value: 'Trias OHG' }, { label: 'Indirizzo', value: contact.address }, mail] },
      {
        title: 'Modulo di richiesta',
        paragraphs: [
          'Se utilizzate il modulo di richiesta, trattiamo i dati che inserite: nome, scuola, scuola dell’infanzia o Comune, e-mail, facoltativamente telefono, luogo e fase del progetto e il vostro messaggio.',
          `Il modulo non invia nulla a questo sito: prepara un’e-mail a ${contact.email} che inviate dal vostro programma di posta.`,
          'Usiamo i dati solo per rispondere alla vostra richiesta e preparare un eventuale progetto (art. 6, par. 1, lett. b GDPR). Non li cediamo a terzi e li cancelliamo quando non servono più, salvo obblighi di conservazione previsti dalla legge.',
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
        paragraphs: ['I link a VS (vs.de) aprono un altro sito, a cui si applica la sua informativa privacy.'],
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
    updated: 'Aggiornamento: settembre 2026',
  },
};

export const legal: Record<Lang, Record<'imprint' | 'privacy', LegalDoc>> = { de, it };
