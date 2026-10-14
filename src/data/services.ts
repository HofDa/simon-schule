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
  { title: 'Beratung', text: 'Wir kommen zu Ihnen, hören zu und schauen uns Ihre Räume und den Alltag vor Ort an.' },
  { title: 'Planung', text: 'Gemeinsam entwickeln wir die Raumaufteilung und Einrichtung für Ihre Schule oder Ihren Kindergarten.' },
  { title: 'VS Möbel', text: 'Wir wählen passende Tische, Stühle und Stauraumlösungen aus dem Sortiment von VS.' },
  { title: 'Lieferung & Montage', text: 'Wir kümmern uns um Bestellung, Lieferung und Montage – bis alles an seinem Platz steht.' },
  { title: 'Betreuung', text: 'Auch danach sind wir für Fragen, Ergänzungen und neue Ideen für Sie da. Direkt hier in Südtirol.' },
];

export const servicesFor = (lang: Lang): Service[] => (lang === 'de' ? de : useTranslations(lang).services.items);
