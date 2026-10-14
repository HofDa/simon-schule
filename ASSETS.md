# Trias Schule – offene Inhalte & Assets

Alles hier ist auf der Seite sichtbar als Platzhalter markiert (gestrichelt unterstrichen, „Platzhalter“, „folgt“). Nichts davon ist erfunden – bitte mit echtem, freigegebenem Material ersetzen.

## Fakten (`src/data/site.ts`)
- [ ] Telefon Trias Schule (`contact.phone`) → aktiviert „Direkt anrufen“ in der Kontakt-Szene
- [ ] Adresse (`contact.address`)
- [ ] Rene: Nachname, Rolle/Zuständigkeit, Telefon, E-Mail (`people[1]`)
- [ ] Simon Brugger: Rolle/Zuständigkeit, Telefon, E-Mail (`people[0]`)
- [x] VS-Deep-Links pro Produktkategorie (`src/i18n/ui.ts`, geprüft 14.10.2026): Sitzen, Tische, Stauraum, Flexible Lernlandschaften. Italienisch verlinkt die englischen VS-Seiten.
- [ ] Kindergarten: VS hat keine eigene Kindergarten-Seite (`/de/LP-Kita`, `/de/LP-Kindergarten` gibt es nicht). Ziel mit VS klären, bis dahin ohne Link
- [ ] Impressum- und Datenschutz-Seiten (Footer verlinkt `#impressum` / `#datenschutz`)
- [ ] Formspree-Formular für `beratung@trias.it` anlegen, Empfängeradresse bestätigen und die Formular-URL als GitHub-Actions-Variable `PUBLIC_INQUIRY_ENDPOINT` setzen (lokal: `.env`). Ohne URL bleibt der vorbereitete E-Mail-Fallback aktiv. Danach Datenschutzhinweis rechtlich prüfen.
- [ ] Finaler Web-Farbwert für VS Ginstergelb (RAL 1032) – aktuell `#E2A300` in `src/styles/global.css`

## Italienische Version (`/it/`)
- [ ] Italienische Texte von einer Muttersprachlerin / einem Muttersprachler prüfen lassen: Oberfläche in `src/i18n/ui.ts`, Projekte in `src/data/projects.ts`
- [ ] VS hat keine italienische Website (vs.de/it/ ist eine Fehlerseite); die italienische Seite verlinkt deshalb auf vs.de/en/. Bei Bedarf in `src/data/site.ts` (`vs.catalogUrl.it`) ändern
- [ ] Echte Projekttexte und Zitate jeweils auf Deutsch und Italienisch liefern

## Projekte (`src/data/projects.ts`)
Pro Projekt: Name, Ort, Gebäudetyp, Leistungsumfang, Beschreibung, optional Jahr / Architektur / Auftraggeber, dazu ein freigegebenes Zitat (Name, Funktion, Schule/Gemeinde). Danach `placeholder: false` setzen.
Zitate erscheinen erst, wenn sie eingetragen sind: `testimonial` pro Projekt, das Abschlusszitat in `closingSource`. Bis dahin steht dort nichts (auch kein Platzhalter); ein fehlender Ort wird ebenfalls ausgelassen.
- [ ] Projekt 1 (Schule)
- [ ] Projekt 2 (Kindergarten)
- [ ] Projekt 3 (Lernlandschaft, vollbreites Foto)
- [ ] Abschluss-Testimonial (`closingSource`)

## Fotos
Projektfotos liegen als WebP-Varianten mit 320, 480, 640, 720, 900, 960 und 1800 Pixel Breite unter `public/images/projects/`. `srcset` wählt je nach Darstellungsgröße die passende Datei. Das Vorschaubild für geteilte Links ist `public/images/social-preview.jpg` (1200 × 630) und basiert auf dem Lernlandschaft-Foto.

Aktuelle **temporäre** Fotos aus den VS-Katalogen (Nutzungsrechte liegen vor). Quelle sind die Archiv-PDFs, deren Bilder verkleinert sind. Die Fotos aus dem Basiskatalog stammen aus der höher aufgelösten Archivfassung (`45-057-49_VXX_DE_Basics--Der-Katalog-fuer-die-Schule.archiv.pdf`, ca. 1180–1730 px breit); nur die 1800er-Variante ist dort noch hochskaliert. Das Foto aus dem Digital-Katalog (1085 px) ist ab der 1800er-Variante unscharf. **Vor dem Livegang durch die Originaldateien von VS ersetzen**, gleiche Dateinamen behalten, dann einfach neu exportieren.

| Datei | Projekt-Slot | Quelle | Originalgröße im PDF |
|---|---|---|---|
| vs-klassenzimmer-gelb | Schule | Digital-Katalog 2026, S. 25 (Rendering) | 1085 × 641 |
| vs-lernraum-boden | Kindergarten (1. Bild) | Basiskatalog Schule 2026, S. 12 | 1515 × 823 |
| vs-lernraum-flur | Kindergarten (2. Bild) | Basiskatalog Schule 2026, S. 11 | 1179 × 641 |
| vs-lernlandschaft-halle | Lernlandschaft + `social-preview.jpg` | Basiskatalog Schule 2026, S. 13 | 1726 × 939 |

Hinweis: Die beiden „Kindergarten“-Fotos zeigen Grundschulkinder, nicht einen Kindergarten. Für den Slot passende VS-Kindergartenfotos anfragen.

Die Herkunft der Fotos steht nur in dieser Tabelle; unter `public/` liegen keine Begleitdateien, damit nichts davon öffentlich ausgeliefert wird.

Lernformen-Szenen („Whiteboard, ruhig“, Abschnitt „Ein Raum, viele Arten zu lernen“) sind gezeichnet, keine Fotos: VS-Möbel modelliert in `src/components/whiteboard/art/vs-models.ts` (PantoSwing-LuPo S. 37, Hokki S. 46, Tano S. 74, Puzzle S. 95, Shift+ Landscape S. 21–22, Vancouver S. 178, Farben aus den Katalogfotos), angeordnet in `learning-scenes.ts`. Beim Build entstehen daraus die Dateien `/scenes/<name>.svg`.

Produktfreisteller: `public/images/products/vs-pantomove-lupo-gelb.webp` (PantoMove-LuPo gelb, Basiskatalog S. 36). Nur grob freigestellt aus einem ca. 190 px hohen Bild, noch nicht eingebunden. Einen ginstergelben PantoSwing gibt es in den Katalogen nicht.

## Zeichnungen, die durch Fotos ersetzt werden können
- [ ] **VS-Stuhl ginstergelb** (VS-Sektion): `src/components/art/VSChair.astro` ist eine schematische Seitenansicht, die beim Scrollen schwingt. Ideal: freigestelltes PNG/WebP `public/images/products/vs-pantoswing-ginstergelb.webp` (offizielles VS-Material mit Nutzungsrechten).
- [ ] **Portraits Simon & Rene** (Menschen-Sektion): `public/images/team/simon-portrait.webp`, `rene-portrait.webp`, 4:5. Danach in `src/data/site.ts` bei der Person `photo: 'simon-portrait'` eintragen; bis dahin zeigt die Sektion nur die Namen.
