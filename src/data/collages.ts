/**
 * The project collages on the whiteboard and the single photos behind each one (the gallery that
 * opens from a collage). Collages: src/assets/whiteboard/collages/<slug>.webp. Photos:
 * src/assets/whiteboard/gallery/<slug>/NN.jpg, web-sized copies (2000 px max) of the originals in
 * the Trias project folders, numbered in the order given here.
 *
 * `vs` lists only VS Möbel product families visually verified in that photo.
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

export interface CollagePhoto {
  image: ImageMetadata;
  alt: string;
  /** Visually verified VS Möbel product names shown in this photo. */
  vs?: string[];
}

export interface Collage {
  slug: string;
  name: string;
  collage: ImageMetadata;
  alt: string;
  photos: CollagePhoto[];
  /** Photographer, where the source files name one. */
  credit?: string;
}

interface PhotoSource {
  alt: string;
  vs?: string[];
}

const collageFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/whiteboard/collages/*.webp', { eager: true });
const photoFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/whiteboard/gallery/*/*.jpg', { eager: true });

const collageOf = (slug: string) => collageFiles[`../assets/whiteboard/collages/${slug}.webp`].default;
const photosOf = (slug: string, items: PhotoSource[]): CollagePhoto[] =>
  items.map((item, i) => ({
    image: photoFiles[`../assets/whiteboard/gallery/${slug}/${String(i + 1).padStart(2, '0')}.jpg`].default,
    alt: item.alt,
    ...(item.vs?.length ? { vs: item.vs } : {}),
  }));

const source: { slug: string; name: string; alt: string; credit?: string; photos: PhotoSource[] }[] = [
  {
    slug: 'gs-gais',
    name: 'Grundschule Gais',
    alt: 'Collage Grundschule Gais: Neubau, Klassenzimmer in U-Form mit VS PantoSwing-LuPo, offene Lernzone, Leseraum und Fenstersitz.',
    credit: 'Jaist',
    photos: [
      { alt: 'Außenansicht des Neubaus' },
      { alt: 'Klassenzimmer in U-Form mit Freischwingern und Pylonentafel', vs: ['VS PantoSwing-LuPo', 'VS Pylonentafel'] },
      { alt: 'Offene Lernzone mit Polsterinseln und Einbauregalen' },
      { alt: 'Leseraum mit Sitzpoufs und tiefer Fensternische' },
      { alt: 'Lesenische am Fenster mit Blick ins Dorf' },
    ],
  },
  {
    slug: 'kiga-tisens',
    name: 'KiTa & Kindergarten Tisens',
    alt: 'Collage KiTa und Kindergarten Tisens: Spielbereich mit Sitzpoufs, Lesebereich mit Bücherwand, runder Gruppentisch und Blick in den Innenhof.',
    photos: [
      { alt: 'Lesebereich mit offenen Bücherregalen und Polstermöbeln' },
      { alt: 'Außenansicht des Holzbaus am Hang' },
      { alt: 'Blick durch die Fensterfront in den begrünten Innenhof' },
      { alt: 'Spiel- und Erzählbereich am Fenster mit Sitzpoufs' },
      { alt: 'Leseecke mit Sofas, Poufs und umlaufendem Bücherregal' },
      { alt: 'Gruppentisch mit Kinderstühlen aus Massivholz' },
    ],
  },
  {
    slug: 'ms-lana',
    name: 'Mittelschule Lana',
    alt: 'Collage Mittelschule Lana: Außenansicht, EDV-Raum mit VS PantoMove-Soft, Aula sowie flexible Klassenräume mit VS Shift+ ThumbPrint und VS PantoSwing-LuPo.',
    credit: 'Jaist',
    photos: [
      { alt: 'Außenansicht und Haupteingang' },
      { alt: 'EDV-Raum mit ergonomischen Drehstühlen', vs: ['VS PantoMove-Soft'] },
      { alt: 'Aula mit Reihenbestuhlung vor der Bühne' },
      { alt: 'Flexibler Lernbereich mit fahrbaren Gruppentischen und Bewegungshocker', vs: ['VS Shift+ ThumbPrint', 'VS PantoSwing-LuPo', 'VS Hokki'] },
      { alt: 'Klassenraum in Kreisaufstellung mit mobilen Regalen und Eigentumsfächern', vs: ['VS Shift+ ThumbPrint', 'VS PantoSwing-LuPo', 'VS Serie 800', 'VS Shift+ Landscape'] },
    ],
  },
  {
    slug: 'musikschule-brixen',
    name: 'Musikschule Brixen',
    alt: 'Collage Musikschule Brixen: Neubau, Haupteingang, Foyer mit Sesseln, Konzertsaal und Übungsraum.',
    photos: [
      { alt: 'Außenansicht des Neubaus' },
      { alt: 'Haupteingang der Musikschule' },
      { alt: 'Foyer mit Sesseln und Beistelltischen' },
      { alt: 'Konzertsaal mit ansteigender Tribünenbestuhlung' },
      { alt: 'Übungsraum mit Akustikvorhang und Sitzwürfeln' },
    ],
  },
  {
    slug: 'gs-deflorian-meran',
    name: 'Grundschule Deflorian, Meran',
    alt: 'Collage Grundschule Deflorian in Meran: historisches Schulgebäude mit Anbau, Mensa, Musikraum und Mehrzwecksaal.',
    credit: 'Jaist',
    photos: [
      { alt: 'Historisches Schulgebäude mit modernem Erweiterungsbau' },
      { alt: 'Mensa mit Tischen und Freischwingern' },
      { alt: 'Musikraum mit Gruppen- und Übungstischen sowie digitaler Tafel' },
      { alt: 'Mehrzwecksaal mit Reihenbestuhlung und Medienwand' },
    ],
  },
  {
    slug: 'ms-sterzing',
    name: 'Mittelschule Sterzing',
    alt: 'Collage Mittelschule Sterzing: Schulgebäude, Lernlandschaft über zwei Ebenen, Aula, Besprechungsraum mit VS PantoMove-VF und Werkraum.',
    photos: [
      { alt: 'Lernlandschaft über zwei Ebenen mit Leseplattform und Schulbibliothek' },
      { alt: 'Außenansicht des Schulgebäudes' },
      { alt: 'Aula mit Reihenbestuhlung aus Formholz' },
      { alt: 'Besprechungs- und Arbeitsplatz mit Drehstuhl aus Formholz', vs: ['VS PantoMove-VF'] },
      { alt: 'Werkraum mit Werkbänken' },
    ],
  },
  {
    slug: 'gs-sarnthein',
    name: 'Grundschule Sarnthein',
    alt: 'Collage Grundschule Sarnthein: Neubau, runde VS Shift+ Landscape Sitzinsel, offene Lernzonen mit VS Puzzle Tischen und VS PantoSwing-VF.',
    photos: [
      { alt: 'Runde Sitz- und Leseinsel mit Lochblech-Regalen', vs: ['VS Shift+ Landscape'] },
      { alt: 'Offener Lernbereich mit zusammengestellten Freiformtischen', vs: ['VS Puzzle', 'VS PantoSwing-VF'] },
      { alt: 'Außenansicht des Neubaus in der Dämmerung' },
      { alt: 'Offene Lernzone mit Freiformtischen und Sitzinsel', vs: ['VS Puzzle', 'VS PantoSwing-VF', 'VS Shift+ Landscape'] },
      { alt: 'Lernflur vor den Klassenräumen mit Sitzinsel und Gruppentischen', vs: ['VS Shift+ Landscape', 'VS Puzzle', 'VS PantoSwing-VF'] },
    ],
  },
  {
    slug: 'gs-st-jakob',
    name: 'Grundschule St. Jakob/Leifers',
    alt: 'Collage Grundschule St. Jakob in Leifers: Außenansicht, Sitzecke, offene Lernbereiche mit VS Puzzle und VS JUMPER Air Active sowie Klassenzimmer mit VS Uno-C.',
    photos: [
      { alt: 'Kleine Sitzecke mit Polstersesseln und Beistelltisch' },
      { alt: 'Außenansicht mit Schulhof' },
      { alt: 'Offener Lern- und Lesebereich mit aufstellbaren Freischwingern', vs: ['VS JUMPER Air Active'] },
      { alt: 'Gruppenarbeitsplatz in der offenen Halle', vs: ['VS Puzzle', 'VS JUMPER Air Active'] },
      { alt: 'Klassenzimmer mit höhenverstellbaren Einzeltischen und Freischwingern', vs: ['VS JUMPER Air Active', 'VS Uno-C'] },
    ],
  },
  {
    slug: 'gs-st-martin-gsies',
    name: 'Grundschule St. Martin in Gsies',
    alt: 'Collage Grundschule St. Martin in Gsies: Holzbau am Hang, Klassenzimmer mit VS PantoSwing-VF und VS Shift+ ThumbPrint, Garderobe und Lernflur.',
    photos: [
      { alt: 'Klassenzimmer in Holz mit fahrbaren Gruppentischen und Einzeltischen', vs: ['VS PantoSwing-VF', 'VS Shift+ ThumbPrint'] },
      { alt: 'Garderobe in Holz mit Sitzbänken und Schuhfächern' },
      { alt: 'Klassenraum mit Regalwand, Gruppentischen und Lehrerarbeitsplatz', vs: ['VS PantoSwing-VF', 'VS Shift+ ThumbPrint', 'VS JUMPER Air Move'] },
      { alt: 'Außenansicht des Holzbaus am Hang' },
      { alt: 'Lernflur mit Hängesessel und Polsterbänken am Fenster' },
    ],
  },
  {
    slug: 'gs-riffian',
    name: 'Grundschule Riffian',
    alt: 'Collage Grundschule Riffian: Schulbau im Ortsbild, Bibliothek mit fahrbaren VS Shift+ Landscape Bogenregalen, Lernzone mit VS Hokki und Gruppentisch.',
    photos: [
      { alt: 'Außenansicht zwischen Obstwiesen und Bergen' },
      { alt: 'Lage der Grundschule im Ortsbild von Riffian' },
      { alt: 'Schulbibliothek mit fahrbaren Bogenregalen', vs: ['VS Shift+ Landscape'] },
      { alt: 'Lernzone bei der Garderobe mit Bewegungshockern', vs: ['VS Hokki'] },
      { alt: 'Gruppentisch mit farbigen Holzstühlen am Fenster' },
    ],
  },
  {
    slug: 'bibliothek-terlan',
    name: 'Bibliothek Terlan',
    alt: 'Collage Bibliothek Terlan: Gebäude mit Glasfassade, Lesebereich, fahrbare Bibliotheksregale und Kinderecke.',
    photos: [
      { alt: 'Außenansicht mit Glasfassade' },
      { alt: 'Lesebereich mit fahrbaren Tischen und grünen Schalenstühlen' },
      { alt: 'Fahrbare Bibliotheksregale und Lesetische' },
      { alt: 'Kinderecke mit runder Spielmatte und fahrbaren Bilderbuchtrögen' },
    ],
  },
];

/** Italian names and descriptions, by slug, the photos in the same order as above. */
const italian: Record<string, { name: string; alt: string; photos: string[] }> = {
  'gs-gais': {
    name: 'Scuola primaria di Gais',
    alt: 'Collage della scuola primaria di Gais: nuovo edificio, aula a ferro di cavallo con VS PantoSwing-LuPo, area aperta, sala lettura e seduta in finestra.',
    photos: [
      'Vista esterna del nuovo edificio',
      'Aula con disposizione a U, sedie a sbalzo e lavagna su piloni',
      'Area di apprendimento aperta con isole imbottite e scaffali integrati',
      'Sala lettura con pouf e profonda nicchia alla finestra',
      'Nicchia di lettura alla finestra con vista sul paese',
    ],
  },
  'kiga-tisens': {
    name: 'Asilo nido e scuola dell’infanzia di Tesimo',
    alt: 'Collage dell’asilo nido e della scuola dell’infanzia di Tesimo: area gioco con pouf, angolo lettura con libreria, tavolo rotondo e vista sul cortile.',
    photos: [
      'Area lettura con librerie aperte e sedute imbottite',
      'Vista esterna dell’edificio in legno sul pendio',
      'Vista attraverso la vetrata sul cortile interno verde',
      'Area gioco e narrazione alla finestra con pouf',
      'Angolo lettura con divani, pouf e libreria perimetrale',
      'Tavolo di gruppo con sedie per bambini in legno massello',
    ],
  },
  'ms-lana': {
    name: 'Scuola media di Lana',
    alt: 'Collage della scuola media di Lana: vista esterna, aula informatica con VS PantoMove-Soft, aula magna e aule flessibili con VS Shift+ ThumbPrint e VS PantoSwing-LuPo.',
    photos: [
      'Vista esterna e ingresso principale',
      'Aula informatica con sedie girevoli ergonomiche',
      'Aula magna con sedie in file davanti al palco',
      'Area di apprendimento flessibile con tavoli mobili e sgabello dinamico',
      'Aula con disposizione a cerchio, scaffali mobili e casellari',
    ],
  },
  'musikschule-brixen': {
    name: 'Scuola di musica di Bressanone',
    alt: 'Collage della scuola di musica di Bressanone: nuovo edificio, ingresso, foyer con poltrone, sala da concerto e sala prove.',
    photos: [
      'Vista esterna del nuovo edificio',
      'Ingresso principale della scuola di musica',
      'Foyer con poltrone e tavolini',
      'Sala da concerto con gradinata imbottita',
      'Sala prove con tenda acustica e cubi per sedersi',
    ],
  },
  'gs-deflorian-meran': {
    name: 'Scuola primaria Deflorian, Merano',
    alt: 'Collage della scuola primaria Deflorian a Merano: edificio storico con ampliamento, mensa, aula di musica e sala polifunzionale.',
    photos: [
      'Edificio scolastico storico con ampliamento moderno',
      'Mensa scolastica con tavoli e sedie a sbalzo',
      'Aula di musica con tavoli di lavoro e lavagna digitale',
      'Sala polifunzionale con sedie in file e parete multimediale',
    ],
  },
  'ms-sterzing': {
    name: 'Scuola media di Vipiteno',
    alt: 'Collage della scuola media di Vipiteno: edificio scolastico, paesaggio didattico su due livelli, aula magna, sala riunioni con VS PantoMove-VF e laboratorio.',
    photos: [
      'Paesaggio didattico su due livelli con piattaforma lettura e biblioteca',
      'Vista esterna dell’edificio scolastico',
      'Aula magna con sedie in multistrato in file',
      'Postazione di lavoro e riunioni con sedia girevole in multistrato',
      'Laboratorio con banchi da lavoro',
    ],
  },
  'gs-sarnthein': {
    name: 'Scuola primaria di Sarentino',
    alt: 'Collage della scuola primaria di Sarentino: nuovo edificio, isola circolare VS Shift+ Landscape, aree aperte con tavoli VS Puzzle e VS PantoSwing-VF.',
    photos: [
      'Isola circolare di lettura e seduta con scaffali forati',
      'Area di apprendimento aperta con tavoli a forma libera componibili',
      'Vista esterna del nuovo edificio al crepuscolo',
      'Zona di apprendimento aperta con tavoli a forma libera e isola imbottita',
      'Corridoio didattico davanti alle aule con isola imbottita e tavoli di gruppo',
    ],
  },
  'gs-st-jakob': {
    name: 'Scuola primaria di San Giacomo/Laives',
    alt: 'Collage della scuola primaria di San Giacomo a Laives: vista esterna, angolo lettura, aree aperte con VS Puzzle e VS JUMPER Air Active e aula con VS Uno-C.',
    photos: [
      'Piccolo angolo con poltrone imbottite e tavolino',
      'Vista esterna con cortile scolastico',
      'Area aperta di lettura e studio con sedie a sbalzo appoggiabili sui tavoli',
      'Postazione di gruppo nell’atrio aperto',
      'Aula con banchi singoli regolabili in altezza e sedie a sbalzo',
    ],
  },
  'gs-st-martin-gsies': {
    name: 'Scuola primaria di San Martino in Casies',
    alt: 'Collage della scuola primaria di San Martino in Casies: edificio in legno, aule con VS PantoSwing-VF e VS Shift+ ThumbPrint, guardaroba e corridoio didattico.',
    photos: [
      'Aula in legno con tavoli mobili di gruppo e banchi singoli',
      'Guardaroba in legno con panche e vani portascarpe',
      'Aula con parete attrezzata, tavoli di gruppo e postazione docente',
      'Vista esterna dell’edificio in legno sul pendio',
      'Corridoio didattico con poltrona sospesa e panche imbottite alla finestra',
    ],
  },
  'gs-riffian': {
    name: 'Scuola primaria di Rifiano',
    alt: 'Collage della scuola primaria di Rifiano: edificio scolastico nel paese, biblioteca con scaffali curvi VS Shift+ Landscape, zona studio con VS Hokki e tavolo di gruppo.',
    photos: [
      'Vista esterna tra i frutteti e le montagne',
      'Posizione della scuola primaria nel tessuto del paese di Rifiano',
      'Biblioteca scolastica con scaffali curvi su ruote',
      'Area studio vicino al guardaroba con sgabelli oscillanti',
      'Tavolo di gruppo con sedie in legno colorate davanti alla vetrata',
    ],
  },
  'bibliothek-terlan': {
    name: 'Biblioteca di Terlano',
    alt: 'Collage della biblioteca di Terlano: edificio con facciata in vetro, area lettura, scaffali mobili e angolo bambini.',
    photos: [
      'Vista esterna con facciata in vetro',
      'Area lettura con tavoli su ruote e sedie a scocca verdi',
      'Scaffali mobili da biblioteca e tavoli di lettura',
      'Angolo bambini con tappeto rotondo e contenitori mobili per albi illustrati',
    ],
  },
};

const build = (lang: Lang): Collage[] =>
  source.map((c) => {
    const it = lang === 'it' ? italian[c.slug] : undefined;
    const photos: PhotoSource[] = c.photos.map((p, i) => ({
      alt: it?.photos[i] ?? p.alt,
      vs: p.vs,
    }));
    return {
      slug: c.slug,
      name: it?.name ?? c.name,
      alt: it?.alt ?? c.alt,
      credit: c.credit,
      collage: collageOf(c.slug),
      photos: photosOf(c.slug, photos),
    };
  });

export const collagesFor = (lang: Lang): Collage[] => build(lang);

export const collages: Collage[] = build('de');
