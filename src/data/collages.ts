/**
 * The project collages on the whiteboard and the single photos behind each one (the gallery that
 * opens from a collage). Collages: src/assets/whiteboard/collages/<slug>.webp. Photos:
 * src/assets/whiteboard/gallery/<slug>/NN.jpg, web-sized copies (2000 px max) of the originals in
 * the Trias project folders, numbered in the order given here.
 */
import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n/ui';

export interface CollagePhoto {
  image: ImageMetadata;
  alt: string;
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

const collageFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/whiteboard/collages/*.webp', { eager: true });
const photoFiles = import.meta.glob<{ default: ImageMetadata }>('../assets/whiteboard/gallery/*/*.jpg', { eager: true });

const collageOf = (slug: string) => collageFiles[`../assets/whiteboard/collages/${slug}.webp`].default;
const photosOf = (slug: string, alts: string[]): CollagePhoto[] =>
  alts.map((alt, i) => ({ image: photoFiles[`../assets/whiteboard/gallery/${slug}/${String(i + 1).padStart(2, '0')}.jpg`].default, alt }));

const source: { slug: string; name: string; alt: string; credit?: string; photos: string[] }[] = [
  {
    slug: 'gs-gais',
    name: 'Grundschule Gais',
    alt: 'Collage Grundschule Gais: der Neubau vor den Bergen, ein Klassenzimmer mit blauen und violetten Stühlen, Leseecken mit roten Sitzelementen und ein Fenstersitz.',
    credit: 'Jaist',
    photos: [
      'Der weiße Neubau der Grundschule Gais auf der Wiese, dahinter die Berge.',
      'Klassenzimmer mit Tischen in U-Form, blauen und violetten Schülerstühlen und Bildschirm.',
      'Offener Lernbereich mit Oberlicht, roten Sitzelementen und Regalen in Holz.',
      'Leseraum mit Kindern auf orangen Sitzrollen und roten Sitzsäcken.',
      'Ein Kind liest im tiefen Fenstersitz mit Blick auf das Dorf.',
    ],
  },
  {
    slug: 'kiga-tisens',
    name: 'KiTa & Kindergarten Tisens',
    alt: 'Collage KiTa und Kindergarten Tisens: Spielbereich mit Sitzpoufs, Bücherwände mit weichen Sofas, ein runder Tisch mit Kinderstühlen und der Blick in den Garten.',
    photos: [
      'Bücherwand mit Sofas und Sesseln in Rostrot und Blau.',
      'Das Gebäude von außen, ein langer Holzbau am Hang unter blauem Himmel.',
      'Blick durch die große Fensterfront in den begrünten Innenhof.',
      'Spielbereich am Fenster mit rosa und blauen Sitzpoufs und Puppentheater.',
      'Leseecke mit weichen Sitzmöbeln vor offenen Bücherregalen.',
      'Runder Tisch mit Kinderstühlen in Rosa und Violett am Fenster.',
    ],
  },
  {
    slug: 'ms-lana',
    name: 'Mittelschule Lana',
    alt: 'Collage Mittelschule Lana: Außenansicht, Computerraum mit grünen Drehstühlen, Aula mit Reihenbestuhlung und Klassenräume mit orangen und grünen Stühlen.',
    credit: 'Jaist',
    photos: [
      'Die Mittelschule Lana von der Straße aus.',
      'Computerraum mit grünen Drehstühlen an langen Tischreihen.',
      'Aula mit schwarzen und weißen Stühlen in Reihen vor der Bühne.',
      'Klassenraum mit leuchtend grünem Boden und Gruppentischen.',
      'Klassenraum mit Tischen im Kreis und Stühlen in Orange und Grün.',
    ],
  },
  {
    slug: 'musikschule-brixen',
    name: 'Musikschule Brixen',
    alt: 'Collage Musikschule Brixen: der rosa Neubau, der Eingang, ein heller Raum mit Sesseln, der Konzertsaal und ein Übungsraum mit Sitzwürfeln.',
    photos: [
      'Der rosa Neubau der Musikschule Brixen mit großen Fensteröffnungen.',
      'Der Eingang mit der Aufschrift Musikschule – Scuola di musica.',
      'Heller Raum mit weißen Vorhängen und grünen Sesseln.',
      'Konzertsaal mit ansteigenden Sitzstufen und roten Wänden.',
      'Übungsraum mit grünem Vorhang und schwarzen Sitzwürfeln.',
    ],
  },
  {
    slug: 'gs-deflorian-meran',
    name: 'Grundschule Deflorian, Meran',
    alt: 'Collage Grundschule Deflorian in Meran: das historische Gebäude, offene Lernbereiche, ein Klassenraum mit Tafel und ein Saal mit Stuhlreihen.',
    credit: 'Jaist',
    photos: [
      'Das historische Schulgebäude mit dem modernen Anbau.',
      'Großer offener Raum mit Säulen und vielen Arbeitstischen.',
      'Klassenraum mit runden Leuchten, Tischreihen und digitaler Tafel.',
      'Saal mit Holzdecke und Stuhlreihen vor einem Bildschirm.',
    ],
  },
  {
    slug: 'ms-sterzing',
    name: 'Mittelschule Sterzing',
    alt: 'Collage Mittelschule Sterzing: das grüne Schulgebäude, eine Lernlandschaft mit Sitzsäcken, ein Besprechungsraum, Aula und Werkraum.',
    photos: [
      'Lernlandschaft über zwei Ebenen, Schülerinnen und Schüler auf großen Sitzsäcken.',
      'Das grüne Schulgebäude mit Herbstbaum.',
      'Aula mit Holzlamellen und hellen Stuhlreihen.',
      'Raum mit Fensterband, Holzregal und ovalem Tisch.',
      'Werkraum mit Werkbänken, an denen Jugendliche arbeiten.',
    ],
  },
  {
    slug: 'gs-sarnthein',
    name: 'Grundschule Sarnthein',
    alt: 'Collage Grundschule Sarnthein: der Neubau am Abend, eine runde Sitzinsel, Gruppentische mit roten Stühlen und Klassenräume in Holz.',
    photos: [
      'Runde Sitzinsel mit roten Polstern und weißen Rückwänden.',
      'Lernbereich mit geschwungenen weißen Tischen und roten Stühlen.',
      'Der Neubau in der Dämmerung mit vielen erleuchteten Fenstern.',
      'Offener Gang mit Gruppentischen und roten Stühlen.',
      'Flur mit Klassenzimmertüren, Sitzinsel und Tischen vor der Fensterfront.',
    ],
  },
  {
    slug: 'gs-st-jakob',
    name: 'Grundschule St. Jakob/Leifers',
    alt: 'Collage Grundschule St. Jakob in Leifers: Außenansicht, Klassenzimmer, eine Leseecke mit Sesseln und offene Lernbereiche.',
    photos: [
      'Kleine Sitzecke mit zwei roten Sesseln und rundem Tisch.',
      'Das Schulgebäude mit gepflastertem Hof.',
      'Offener Lernbereich mit Bücherregal, weißen Stühlen und Sitzpouf.',
      'Geschwungener Gruppentisch mit weißen Stühlen in der Halle.',
      'Klassenzimmer mit Holzwänden und Einzeltischen.',
    ],
  },
  {
    slug: 'gs-st-martin-gsies',
    name: 'Grundschule St. Martin in Gsies',
    alt: 'Collage Grundschule St. Martin in Gsies: der Holzbau am Hang, ein Klassenzimmer, die Garderobe, ein Werkraum und ein Bereich mit Hängesessel.',
    photos: [
      'Klassenzimmer mit Holzdecke, Gruppentischen und roten Stühlen.',
      'Garderobe mit Holzbänken und Haken voller Mützen und Taschen.',
      'Klassenraum mit Holzlamellendecke, Regalwand und Arbeitstischen.',
      'Der Holzbau der Grundschule am Hang.',
      'Flur mit Hängesessel und blauer Sitzbank vor der Fensterfront.',
    ],
  },
  {
    slug: 'bibliothek-terlan',
    name: 'Bibliothek Terlan',
    alt: 'Collage Bibliothek Terlan: das Gebäude mit Glasfassade, Lesetische mit grünen Stühlen, Regale in Grün und die Kinderecke.',
    photos: [
      'Die Bibliothek Terlan mit Glasfassade.',
      'Lesetische mit hellgrünen Stühlen vor großen Fenstern.',
      'Fahrbare Bücherregale in Grün.',
      'Kinderecke mit grünem Teppich, Kuscheltieren und niedrigen Bücherkisten.',
    ],
  },
];

/** Italian names and descriptions, by slug, the photos in the same order as above. */
const italian: Record<string, { name: string; alt: string; photos: string[] }> = {
  'gs-gais': {
    name: 'Scuola primaria di Gais',
    alt: 'Collage della scuola primaria di Gais: il nuovo edificio davanti alle montagne, un’aula con sedie blu e viola, angoli lettura con sedute rosse e una seduta in finestra.',
    photos: [
      'Il nuovo edificio bianco della scuola primaria di Gais sul prato, sullo sfondo le montagne.',
      'Aula con tavoli a ferro di cavallo, sedie blu e viola e uno schermo.',
      'Area di apprendimento aperta con lucernario, sedute rosse e scaffali in legno.',
      'Sala di lettura con bambini su rulli arancioni e pouf rossi.',
      'Un bambino legge nella profonda seduta in finestra con vista sul paese.',
    ],
  },
  'kiga-tisens': {
    name: 'Asilo nido e scuola dell’infanzia di Tesimo',
    alt: 'Collage dell’asilo nido e della scuola dell’infanzia di Tesimo: area gioco con pouf, pareti di libri con divani morbidi, un tavolo rotondo con sedie per bambini e la vista sul giardino.',
    photos: [
      'Parete di libri con divani e poltrone color ruggine e blu.',
      'L’edificio dall’esterno, una lunga costruzione in legno sul pendio sotto il cielo azzurro.',
      'Vista attraverso la grande vetrata sul cortile interno verde.',
      'Area gioco alla finestra con pouf rosa e blu e un teatrino delle marionette.',
      'Angolo lettura con sedute morbide davanti a scaffali aperti.',
      'Tavolo rotondo con sedie per bambini rosa e viola alla finestra.',
    ],
  },
  'ms-lana': {
    name: 'Scuola media di Lana',
    alt: 'Collage della scuola media di Lana: vista esterna, aula informatica con sedie girevoli verdi, aula magna con file di sedie e aule con sedie arancioni e verdi.',
    photos: [
      'La scuola media di Lana vista dalla strada.',
      'Aula informatica con sedie girevoli verdi lungo file di tavoli.',
      'Aula magna con sedie nere e bianche in file davanti al palco.',
      'Aula con pavimento verde acceso e tavoli di gruppo.',
      'Aula con tavoli in cerchio e sedie arancioni e verdi.',
    ],
  },
  'musikschule-brixen': {
    name: 'Scuola di musica di Bressanone',
    alt: 'Collage della scuola di musica di Bressanone: il nuovo edificio rosa, l’ingresso, una sala luminosa con poltrone, la sala da concerto e una sala prove con cubi per sedersi.',
    photos: [
      'Il nuovo edificio rosa della scuola di musica di Bressanone con grandi aperture.',
      'L’ingresso con la scritta Musikschule – Scuola di musica.',
      'Sala luminosa con tende bianche e poltrone verdi.',
      'Sala da concerto con gradoni e pareti rosse.',
      'Sala prove con tenda verde e cubi neri per sedersi.',
    ],
  },
  'gs-deflorian-meran': {
    name: 'Scuola primaria Deflorian, Merano',
    alt: 'Collage della scuola primaria Deflorian a Merano: l’edificio storico, aree di apprendimento aperte, un’aula con lavagna e una sala con file di sedie.',
    photos: [
      'L’edificio scolastico storico con l’ampliamento moderno.',
      'Grande spazio aperto con colonne e molti tavoli da lavoro.',
      'Aula con lampade rotonde, file di banchi e lavagna digitale.',
      'Sala con soffitto in legno e file di sedie davanti a uno schermo.',
    ],
  },
  'ms-sterzing': {
    name: 'Scuola media di Vipiteno',
    alt: 'Collage della scuola media di Vipiteno: l’edificio verde, un paesaggio didattico con pouf, una sala riunioni, l’aula magna e il laboratorio.',
    photos: [
      'Paesaggio didattico su due livelli, alunne e alunni su grandi pouf.',
      'L’edificio scolastico verde con un albero d’autunno.',
      'Aula magna con lamelle in legno e file di sedie chiare.',
      'Sala con finestra a nastro, scaffale in legno e tavolo ovale.',
      'Laboratorio con banchi da lavoro a cui lavorano i ragazzi.',
    ],
  },
  'gs-sarnthein': {
    name: 'Scuola primaria di Sarentino',
    alt: 'Collage della scuola primaria di Sarentino: il nuovo edificio di sera, un’isola rotonda per sedersi, tavoli di gruppo con sedie rosse e aule in legno.',
    photos: [
      'Isola rotonda con imbottiture rosse e schienali bianchi.',
      'Area di apprendimento con tavoli bianchi curvi e sedie rosse.',
      'Il nuovo edificio al crepuscolo con molte finestre illuminate.',
      'Corridoio aperto con tavoli di gruppo e sedie rosse.',
      'Corridoio con porte delle aule, un’isola per sedersi e tavoli davanti alla vetrata.',
    ],
  },
  'gs-st-jakob': {
    name: 'Scuola primaria di San Giacomo/Laives',
    alt: 'Collage della scuola primaria di San Giacomo a Laives: vista esterna, aule, un angolo lettura con poltrone e aree di apprendimento aperte.',
    photos: [
      'Piccolo angolo con due poltrone rosse e un tavolo rotondo.',
      'L’edificio scolastico con il cortile lastricato.',
      'Area di apprendimento aperta con libreria, sedie bianche e un pouf.',
      'Tavolo di gruppo curvo con sedie bianche nell’atrio.',
      'Aula con pareti in legno e banchi singoli.',
    ],
  },
  'gs-st-martin-gsies': {
    name: 'Scuola primaria di San Martino in Casies',
    alt: 'Collage della scuola primaria di San Martino in Casies: la costruzione in legno sul pendio, un’aula, il guardaroba, un laboratorio e un’area con poltrona sospesa.',
    photos: [
      'Aula con soffitto in legno, tavoli di gruppo e sedie rosse.',
      'Guardaroba con panche in legno e ganci pieni di berretti e zaini.',
      'Aula con soffitto a lamelle in legno, parete di scaffali e tavoli da lavoro.',
      'La costruzione in legno della scuola primaria sul pendio.',
      'Corridoio con poltrona sospesa e panca blu davanti alla vetrata.',
    ],
  },
  'bibliothek-terlan': {
    name: 'Biblioteca di Terlano',
    alt: 'Collage della biblioteca di Terlano: l’edificio con facciata in vetro, tavoli di lettura con sedie verdi, scaffali verdi e l’angolo dei bambini.',
    photos: [
      'La biblioteca di Terlano con la facciata in vetro.',
      'Tavoli di lettura con sedie verde chiaro davanti a grandi finestre.',
      'Scaffali mobili per libri in verde.',
      'Angolo dei bambini con tappeto verde, peluche e cassette basse per i libri.',
    ],
  },
};

const build = (lang: Lang): Collage[] =>
  source.map((c) => {
    const text = lang === 'it' ? italian[c.slug] ?? c : c;
    return {
      slug: c.slug,
      name: text.name,
      alt: text.alt,
      credit: c.credit,
      collage: collageOf(c.slug),
      photos: photosOf(c.slug, text.photos),
    };
  });

export const collagesFor = (lang: Lang): Collage[] => build(lang);

export const collages: Collage[] = build('de');
