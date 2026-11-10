/**
 * The project collages on the whiteboard and the single photos behind each one (the gallery that
 * opens from a collage). Collages: src/assets/whiteboard/collages/<slug>.webp. Photos:
 * src/assets/whiteboard/gallery/<slug>/NN.jpg, web-sized copies (2000 px max) of the originals in
 * the Trias project folders, numbered in the order given here.
 */
import type { ImageMetadata } from 'astro';

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

export const collages: Collage[] = source.map((c) => ({
  slug: c.slug,
  name: c.name,
  alt: c.alt,
  credit: c.credit,
  collage: collageOf(c.slug),
  photos: photosOf(c.slug, c.photos),
}));
