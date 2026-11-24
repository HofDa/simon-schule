/**
 * The five services as the whiteboard pages show them, in German and Italian.
 */
import type { Lang } from '../i18n/ui';

export interface Service {
  title: string;
  text: string;
}

const de: Service[] = [
  { title: 'Beratung vor Ort', text: 'Simon kennt den Schulalltag im Land aus erster Hand und schaut gern persönlich vorbei.' },
  { title: 'Planung', text: 'Raumkonzepte, Grundrisse und klare Unterlagen, auch für Gemeinden, Architekten und Ausschreibungen.' },
  { title: 'VS Möbel & mehr', text: 'VS als Exklusivpartner und weitere Hersteller: langlebige Systeme für Unterricht, Ganztag, Bibliothek und Rückzug.' },
  { title: 'Lieferung & Montage', text: 'Unser eigenes Team baut sauber und termingerecht auf, abgestimmt auf Bauzeiten und Ferien.' },
  { title: 'Betreuung im Land', text: 'Aus Meran und Brixen auch Jahre später erreichbar, für Erweiterungen, Nachbestellungen und neue Bauabschnitte.' },
];

const it: Service[] = [
  { title: 'Consulenza sul posto', text: 'Simon conosce da vicino la realtà delle scuole in Alto Adige e passa volentieri di persona.' },
  { title: 'Progettazione', text: 'Concetti di spazio, piante e documenti chiari, anche per Comuni, architetti e gare d’appalto.' },
  { title: 'VS Möbel e altro', text: 'VS come partner esclusivo e altri produttori: sistemi durevoli per la lezione, il tempo pieno, la biblioteca e la concentrazione.' },
  { title: 'Consegna e montaggio', text: 'La nostra squadra interna monta con cura e puntualità, in accordo con il cantiere e le vacanze.' },
  { title: 'Assistenza sul territorio', text: 'Da Merano e Bressanone sempre raggiungibili anche anni dopo, per ampliamenti, riordini e nuovi lotti.' },
];

export const servicesFor = (lang: Lang): Service[] => (lang === 'de' ? de : it);
