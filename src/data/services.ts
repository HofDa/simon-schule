/**
 * The five services as the whiteboard pages show them, in German and Italian.
 */
import type { Lang } from '../i18n/ui';

export interface Service {
  title: string;
  text: string;
}

const de: Service[] = [
  { title: 'Beratung vor Ort', text: 'Simon Brugger kommt zu Ihnen an die Schule, in den Kindergarten oder in die Gemeinde – überall in Südtirol.' },
  { title: 'Planung', text: 'Wir planen Raumaufteilung, Ergonomie und Akustik und unterstützen Gemeinden sowie Architekturbüros mit klaren Unterlagen.' },
  { title: 'VS Möbel', text: 'Als Südtiroler Exklusivpartner von VS wählen wir langlebige Tische, Stühle und Stauraum – gerne mit Musterstühlen zum Probesitzen.' },
  { title: 'Lieferung & Montage', text: 'Unser eigenes Montageteam liefert verlässlich zum vereinbarten Termin und baut jeden Raum bezugsfertig auf.' },
  { title: 'Betreuung im Land', text: 'Mit Standorten in Meran und Brixen bleiben wir auch Jahre nach der Übergabe für Ergänzungen und Fragen direkt erreichbar.' },
];

const it: Service[] = [
  { title: 'Consulenza sul posto', text: 'Simon Brugger viene da voi a scuola, alla scuola dell’infanzia o in Comune, ovunque in Alto Adige.' },
  { title: 'Progettazione', text: 'Progettiamo distribuzione degli spazi, ergonomia e acustica e affianchiamo Comuni e studi di architettura con documenti chiari.' },
  { title: 'VS Möbel', text: 'Come partner esclusivo di VS in Alto Adige scegliamo tavoli, sedie e contenitori durevoli, volentieri con sedie campione da provare.' },
  { title: 'Consegna e montaggio', text: 'La nostra squadra di montaggio consegna puntuale alla data concordata e allestisce ogni ambiente pronto all’uso.' },
  { title: 'Assistenza sul territorio', text: 'Con le sedi di Merano e Bressanone restiamo raggiungibili direttamente anche anni dopo la consegna, per integrazioni e domande.' },
];

export const servicesFor = (lang: Lang): Service[] => (lang === 'de' ? de : it);
