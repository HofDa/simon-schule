---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Homepage (src/pages/index.astro)

Scope: the Trias Schule homepage. Mode: Persuade. Visitor: school principal, kindergarten lead, municipal office or architect with a room project. Action: "Projekt anfragen" (inline form, Formspree or mailto). Proof: the process made visible, named people, example rooms (placeholders, visibly marked). Constraints: Astro 5 + Tailwind 4, vanilla JS scroll engine (src/scripts/motion.ts), full reduced-motion path, no fabricated facts, DE + IT.

User answers (2026-09-28): keep the plan/drawing concept but elevate it; register "bold brand statement"; motion "rich scroll choreography". Surface roll (seed af834461) dealt Schnitt / Maßkette / Leistungsverzeichnis; the user locked "Die Maßkette". Code-led (no image generation available).

## Direction contract

THESIS: One giant dimension chain carries the page. Each segment of the chain is a step of the project, and the room plan builds beneath it while the page scrolls sideways. It refuses the category default (hero, icon cards, stats, logo strip, testimonials, contact) and the old whiteboard costume (handwriting, pinned prints, drawn figures).

OWN-WORLD: Colour committed at page scale in hard-edged sheets: Ginstergelb #E2A300 fields (hero, people, contact), ink #1D1D1B fields (the chain, the phases, the footer), white paper for photography (projects, VS). Ink line drawings at 1.5px with end-tick dimension lines, 45° ticks, hatched cut walls; on ink sheets the lines turn paper with Ginstergelb objects. Archivo only, 700 at display scale with tight tracking, tabular figures for every dimension. No handwriting, no cards, no shadows.

STORY: The visitor sees the offer and the plan at once; then walks the chain Beraten → Planen → Ausstatten → Umsetzen → Begleiten while the room fills; sees rooms measured and realised; meets the two people by name; sees VS as the toolkit (the PantoSwing swings); places themself on the phase ruler; lands in the inquiry with their phase preselected.

FIRST VIEWPORT: Full-bleed Ginstergelb sheet. Left 5/12: H1 "Lernräume für Südtirol." at ~6rem Archivo 700 in ink, the subline, ink button "Projekt besprechen" + text link "Beispiele ansehen". Right 7/12: an ink room plan (walls with hatched cut, door swing, windows, table groups, 7,20 m dimension) drawing itself in on load. Across the bottom edge: the five-segment dimension chain with the step names, first tick lit.

FORM: Die Maßkette, position 4 on the ordered structural list, surface seed key af834461. Signature interaction: the chain pins on an ink sheet and the step panels scroll sideways along it; a Ginstergelb fill runs the chain, each passed tick turns solid and the plan gains one layer per step. Motion grammar: scroll = measuring; only the hero plan draws on load (≤1.4s). The chain returns as the phase ruler before the inquiry.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions
- Real photography, testimonials, project facts, Rene's surname, roles, phone numbers (see ASSETS.md).
- Form service endpoint (Formspree variable; mailto fallback active).
