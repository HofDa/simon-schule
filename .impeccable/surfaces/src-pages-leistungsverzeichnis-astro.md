---
version: 1
slug: "src-pages-leistungsverzeichnis-astro"
primary_target: "src/pages/leistungsverzeichnis.astro"
related_targets: ["src/components/planer/PlanerTable.astro","src/components/planer/PlanerExamples.astro","src/components/planer/PlanerPeople.astro","src/components/planer/PlanerVS.astro","src/components/planer/PlanerContact.astro"]
---

# Der Raumplaner (route /leistungsverzeichnis/)

Persuade surface, German only, noindex design variant. Replaces the earlier "Leistungsverzeichnis" dossier structure (user asked for a redesign that is more professional, engaging and interesting; concept open, build-your-inquiry interaction chosen, variant-only section versions allowed). Visual world stays Die Maßkette (DESIGN.md). URL stays for the entry page and shared links.

Audience: principals, kindergarten leads, Gemeinde offices, architects. Action: a qualified inquiry that already says which arrangement, VS equipment, services and phase they have in mind.

## Direction contract

THESIS: The visitor furnishes a real classroom on a live, measured plan, and that plan becomes the inquiry. Refuses the default headline + feature list + form: the product (planning a room with you) is demonstrated, not described.

OWN-WORLD: Maßkette unchanged: Ginstergelb, ink and paper sheets with hard edges, Archivo at wdth 118/100, 1.5px ink line drawing with hatched cut walls, 45° dimension ticks, tabular figures, an architect's title block (Planschriftfeld) as the live readout. No cards, no shadows, square corners.

STORY: Seconds in, the visitor sees a drawn 8,40 × 7,20 m classroom and switches it from Frontal to Gruppentische, Lerninseln or Sitzkreis; the furniture moves. They add VS equipment, choose which services Trias should carry and their phase; the title block tracks everything. Room examples and the two people back it up. The inquiry arrives pre-filled with their plan.

FIRST VIEWPORT: Ginstergelb sheet. Columns 1–5: H1 at headline size (display size breaks "Lernraum ein." into four lines in five columns and pushes the tiles and CTA below the fold at 1440×900), a short lead, then the first step "Anordnung" as four near-square toggle tiles in one row, each led by a true miniature of that arrangement drawn from the same positions as the plan (2×2 on phones). Columns 6–12, sticky: the room plan at full column width, a title block beneath it (Anordnung, Plätze, Ausstattung, Leistungen, Phase). Primary action: ink button "Plan als Anfrage senden" under the tiles; the nav CTA stays.

FORM: Der Raumplaner, position 7 of the seven grounded structures (architect's Möblierungsplan as configurator); surface seed 215e5618, dealt lead.

SIGNATURE: all 25 chairs and 13 tables are one set of SVG objects that glide (staggered transform transitions on the draw ease) into each arrangement; equipment choices fill or add plan layers (seats fill ink, storage wall, lounge steps, child-height note). Reduced motion: arrangements switch instantly.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Sections
1. Planungstisch (ginster): intro + steps Anordnung / Ausstattung (VS categories) / Leistungen (five services, id leistungen) / Projektphase; sticky plan + title block.
2. Musterräume (paper, id projekte): the three placeholder examples, each opens its arrangement in the planner.
3. Menschen (ink, id menschen): Simon and Rene, open facts, their on-site questions.
4. VS Möbel (variant, paper, id vs-moebel): the chair drawing and the five categories as toggles that put each category into the plan or show it is already in.
5. Anfrage (ginster, id kontakt/anfrage): a still copy of the drawing and the live Planauszug beside the shared inquiry form; the plan travels as hidden fields, the phase syncs to the form's radio.

Open: real photos, confirmed people facts (see PRODUCT.md, ASSETS.md). Seat counts are the drawing's, not a promise.
