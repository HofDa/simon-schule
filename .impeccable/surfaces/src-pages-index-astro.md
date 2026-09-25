---
version: 1
slug: "src-pages-index-astro"
primary_target: "src/pages/index.astro"
related_targets: []
---

# Homepage (src/pages/index.astro)

Scope: the Trias Schule homepage. Mode: Persuade. Visitor: school principal, kindergarten lead, municipal office or architect with a room project. Action: "Projekt anfragen" (inline form, mailto). Proof: real projects, integrated testimonials, named people (all currently placeholders, visibly marked). Constraints: Astro 5 + Tailwind 4, vanilla JS scroll engine, full reduced-motion path, no fabricated facts.

Direction pinned by the user's creative brief (whiteboard → plan → realised room), which beats the direction roll (seed baf6f1dc, assigned index 5, overridden by the brief). The closest dealt challenger, the hand-drawn zine, was declined because the brief bans childish marker styling and keeps handwriting rare. The raise kept from it: every drawn line is an SVG stroke tied to scroll position, and under reduced motion every line renders already drawn.

## Direction contract

THESIS: A planning surface that becomes a building. The page reads as one continuous architectural drawing: a whiteboard with pinned photos, then a chair whose width sets the page grid, then a single ruler-drawn line that turns 90° into the projects. It refuses the category default of hero, three icons, stats, cards, reviews, contact.

OWN-WORLD: White paper ground, ink #20201D, hairlines #DDDAD1, warm white #F6F5F0 for the board frame and footer. Ginstergelb #E2A300 appears only on the magnets, the chair, the Hokki stools, line nodes, the active marker underline and the final CTA. Type: Archivo grotesque for all UI and headlines; Caveat marker only for annotations on the board and planning notes. Technical-drawing vocabulary throughout: dimension lines with end ticks, right-angle marks, 1.5px ink strokes. People are shown as Otl-Aicher-style scale figures until photos exist.

STORY: The idea is sketched on a board, the chair steps forward and becomes the column for Beraten → Begleiten, the line draws "Unsere Projekte", real rooms appear at full scale with the client's own words, then the two people, the VS toolkit, one strong quote, and finally the two people turning to face the visitor.

FIRST VIEWPORT: A full-width whiteboard with an aluminium frame and marker tray. Top-left: the H1 "Lernräume für Südtirol." (≤6rem), a two-line subline, a primary ink button "Projekte entdecken" and a text link "Projekt besprechen". Right half: three photos with ginstergelb magnets rotated ±1–2°, 4 marker words, connector arrows and a small floor-plan sketch. Bottom-left: the backrest of the yellow VS chair rises out of the viewport edge in front of the board.

FORM: Brief-pinned whiteboard-to-plan world (not taken from the dealt list; seed baf6f1dc). Signature interaction: the scroll-scrubbed line that reveals "Unsere Projekte" and bends 90° into the project column. Motion grammar: scroll = drawing; nothing moves on a timer except the ≤1.2s board preparation on load.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## Open decisions
- Real photography, testimonials, project facts, Rene's surname, roles, phone numbers (see ASSETS.md).
- Form service endpoint (currently mailto).
