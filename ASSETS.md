# Trias Schule – offene Inhalte & Assets

Alles hier ist auf der Seite sichtbar als Platzhalter markiert (gestrichelt unterstrichen, „Platzhalter“, „folgt“). Nichts davon ist erfunden – bitte mit echtem, freigegebenem Material ersetzen.

## Fakten (`src/data/site.ts`)
- [ ] Telefon Trias Schule (`contact.phone`) → aktiviert „Direkt anrufen“ in der Kontakt-Szene
- [ ] Adresse (`contact.address`)
- [ ] Rene: Nachname, Rolle/Zuständigkeit, Telefon, E-Mail (`people[1]`)
- [ ] Simon Brugger: Rolle/Zuständigkeit, Telefon, E-Mail (`people[0]`)
- [ ] VS-Deep-Links pro Produktkategorie (derzeit alle auf `vs.catalogUrl`)
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

Aktuelle **temporäre** Fotos von Wikimedia Commons (Namensnennung im Footer, bitte ersetzen):

| Datei | Quelle | Urheber | Lizenz |
|---|---|---|---|
| classroom-blue-chairs | [JCRG – Klassenzimmer](https://commons.wikimedia.org/wiki/File:JCRG_%E2%80%93_Klassenzimmer_HOF5022-HDR_RAW-Export.jpg) | PantheraLeo1359531 | CC BY 4.0 |
| kindergarten-cave | [Neuer Kindergarten Rotenturm](https://commons.wikimedia.org/wiki/File:Neuer_Kindergarten_Rotenturm_H%C3%B6hle_und_Spielk%C3%BCche.jpg) | MaxMustermannFoto | CC BY-SA 4.0 |
| kindergarten-kitchen | [Spielküche Rotenturm](https://commons.wikimedia.org/wiki/File:Spielk%C3%BCche_im_neuen_Kindergarten_Rotenturm.jpg) | MaxMustermannFoto | CC BY-SA 4.0 |
| learning-commons | [Ashs learning common](https://commons.wikimedia.org/wiki/File:Ashs-learning-common-kauri.jpg) | Mosborne01 | CC BY-SA 3.0 |

Wenn alle ersetzt sind: `photoCredits` in `site.ts` leeren (die Zeile im Footer verschwindet dann nicht automatisch – Absatz in `Footer.astro` entfernen).

## Zeichnungen, die durch Fotos ersetzt werden können
- [ ] **VS-Stuhl ginstergelb** (VS-Sektion): `src/components/art/VSChair.astro` ist eine schematische Seitenansicht, die beim Scrollen schwingt. Ideal: freigestelltes PNG/WebP `public/images/products/vs-pantoswing-ginstergelb.webp` (offizielles VS-Material mit Nutzungsrechten).
- [ ] **Portraits Simon & Rene** (Menschen-Sektion): `public/images/team/simon-portrait.webp`, `rene-portrait.webp`, 4:5. Danach in `src/data/site.ts` bei der Person `photo: 'simon-portrait'` eintragen; bis dahin zeigt die Sektion nur die Namen.
