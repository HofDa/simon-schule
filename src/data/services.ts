/**
 * The five services as the whiteboard pages show them. German has its own longer copy;
 * Italian uses the short service texts from the UI strings.
 */
import { useTranslations, type Lang } from '../i18n/ui';

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

export const servicesFor = (lang: Lang): Service[] => (lang === 'de' ? de : useTranslations(lang).services.items);
