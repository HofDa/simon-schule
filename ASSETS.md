# Trias Schule – offene Inhalte & Assets

Alles hier ist auf der Seite sichtbar als Platzhalter markiert (gestrichelt unterstrichen, „Platzhalter“, „folgt“). Nichts davon ist erfunden – bitte mit echtem, freigegebenem Material ersetzen.

## Fakten (`src/data/site.ts`)
- [ ] Telefon Trias Schule (`contact.phone`) → aktiviert „Direkt anrufen“ in der Kontakt-Szene
- [ ] Adresse (`contact.address`)
- [ ] Rene: Nachname, Rolle/Zuständigkeit, Telefon, E-Mail (`people[1]`)
- [ ] Simon Brugger: Rolle/Zuständigkeit, Telefon, E-Mail (`people[0]`)
- [ ] VS-Deep-Links pro Produktkategorie (derzeit alle auf `vs.catalogUrl`)
- [ ] Impressum- und Datenschutz-Seiten (Footer verlinkt `#impressum` / `#datenschutz`)
- [ ] Formular-Dienst (optional): `inquiry.endpoint` setzen (Formspree/Web3Forms), sonst öffnet das Formular eine vorbereitete E-Mail
- [ ] Finaler Web-Farbwert für VS Ginstergelb (RAL 1032) – aktuell `#E2A300` in `src/styles/global.css`

## Italienische Version (`/it/`)
- [ ] Italienische Texte von einer Muttersprachlerin / einem Muttersprachler prüfen lassen: Oberfläche in `src/i18n/ui.ts`, Projekte in `src/data/projects.ts`
- [ ] VS hat keine italienische Website (vs.de/it/ ist eine Fehlerseite); die italienische Seite verlinkt deshalb auf vs.de/en/. Bei Bedarf in `src/data/site.ts` (`vs.catalogUrl.it`) ändern
- [ ] Echte Projekttexte und Zitate jeweils auf Deutsch und Italienisch liefern

## Projekte (`src/data/projects.ts`)
Pro Projekt: Name, Ort, Gebäudetyp, Leistungsumfang, Beschreibung, optional Jahr / Architektur / Auftraggeber, dazu ein freigegebenes Zitat (Name, Funktion, Schule/Gemeinde). Danach `placeholder: false` setzen.
- [ ] Projekt 1 (Schule)
- [ ] Projekt 2 (Kindergarten)
- [ ] Projekt 3 (Lernlandschaft, vollbreites Foto)
- [ ] Abschluss-Testimonial (`closingSource`)

## Fotos
Projektfotos liegen als `public/images/projects/<name>-900.webp` und `-1800.webp` (Querformat, Architekturfotografie). Die Whiteboard-Bilder im Hero sind dieselben Projekte.

Aktuelle **temporäre** Fotos von Wikimedia Commons (Namensnennung im Footer, bitte ersetzen):

| Datei | Quelle | Urheber | Lizenz |
|---|---|---|---|
| classroom-blue-chairs | [JCRG – Klassenzimmer](https://commons.wikimedia.org/wiki/File:JCRG_%E2%80%93_Klassenzimmer_HOF5022-HDR_RAW-Export.jpg) | PantheraLeo1359531 | CC BY 4.0 |
| kindergarten-cave | [Neuer Kindergarten Rotenturm](https://commons.wikimedia.org/wiki/File:Neuer_Kindergarten_Rotenturm_H%C3%B6hle_und_Spielk%C3%BCche.jpg) | MaxMustermannFoto | CC BY-SA 4.0 |
| kindergarten-kitchen | [Spielküche Rotenturm](https://commons.wikimedia.org/wiki/File:Spielk%C3%BCche_im_neuen_Kindergarten_Rotenturm.jpg) | MaxMustermannFoto | CC BY-SA 4.0 |
| learning-commons | [Ashs learning common](https://commons.wikimedia.org/wiki/File:Ashs-learning-common-kauri.jpg) | Mosborne01 | CC BY-SA 3.0 |

Wenn alle ersetzt sind: `photoCredits` in `site.ts` leeren (die Zeile im Footer verschwindet dann nicht automatisch – Absatz in `Footer.astro` entfernen).

## Zeichnungen, die durch Fotos ersetzt werden sollen
- [ ] **VS-Stuhl ginstergelb** (Hero, Leistungen, VS-Sektion): `src/components/art/VSChair.astro` ist eine schematische Zeichnung. Ideal: freigestelltes PNG/WebP `public/images/products/vs-pantoswing-ginstergelb.webp` (offizielles VS-Material mit Nutzungsrechten), Ansicht leicht von vorn, mit Kontaktschatten.
- [ ] **Portraits Simon & Rene** (Menschen-Sektion): `public/images/team/simon-portrait.webp`, `rene-portrait.webp`, 4:5, ruhiger Hintergrund, gleiche Lichtstimmung.
- [ ] **Kontakt-Szene**: Simon und Rene auf ginstergelben VS-Hockern (Hokki). Die Szene blendet scrollgebunden durch drei Frames: seitlich zueinander → ¾ → frontal. Dafür je Person drei freigestellte Frames aus identischer Kameraposition: `public/images/team/simon-rene-contact-frame-01..03.webp` (oder je Person einzeln). Die Zeichnung in `src/components/art/SeatedPerson.astro` hat dieselbe Frame-Struktur (`data-pose="side|quarter|front"`), sodass die Fotos 1:1 an ihre Stelle treten.
