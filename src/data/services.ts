/**
 * The five services as the whiteboard pages show them, in German and Italian.
 */
import type { Lang } from '../i18n/ui';

export interface Service {
  title: string;
  text: string;
}

const de: Service[] = [
  { title: 'Beratung vor Ort', text: 'Simon Brugger kommt zu Ihnen – überall in Südtirol.' },
  { title: 'Planung', text: 'Raumaufteilung, Ergonomie und Akustik – mit klaren Unterlagen.' },
  { title: 'VS Möbel', text: 'Langlebige Tische, Stühle und Stauraum – gern mit Musterstuhl zum Probesitzen.' },
  { title: 'Lieferung & Montage', text: 'Unser eigenes Team liefert zum Termin und baut bezugsfertig auf.' },
  { title: 'Betreuung im Land', text: 'Aus Meran und Brixen auch Jahre später für Sie da.' },
];

const it: Service[] = [
  { title: 'Consulenza sul posto', text: 'Simon Brugger viene da voi, ovunque in Alto Adige.' },
  { title: 'Progettazione', text: 'Distribuzione degli spazi, ergonomia e acustica, con documenti chiari.' },
  { title: 'VS Möbel', text: 'Tavoli, sedie e contenitori durevoli, anche con sedia campione da provare.' },
  { title: 'Consegna e montaggio', text: 'La nostra squadra consegna alla data concordata e monta tutto pronto all’uso.' },
  { title: 'Assistenza sul territorio', text: 'Da Merano e Bressanone restiamo a disposizione anche anni dopo.' },
];

export const servicesFor = (lang: Lang): Service[] => (lang === 'de' ? de : it);
