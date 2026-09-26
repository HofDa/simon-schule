---
name: Trias Schule
description: A planning surface that becomes a building – white, architectural, ruler-drawn.
colors:
  paper: "#ffffff"
  warm: "#f6f5f0"
  surface: "#f2f1ec"
  ink: "#20201d"
  ink-deep: "#000000"
  muted: "#6e6c65"
  line: "#dddad1"
  ginster: "#e2a300"
  ginster-deep: "#b88400"
  ginster-light: "#f1c23b"
  error: "#a4331c"
typography:
  display:
    fontFamily: "EMS Felix (single-line, lettered at build time as SVG pen strokes)"
    fontSize: "clamp(3.4rem, min(6.4vw, 11vh), 6.8rem)"
    lineHeight: 1.06
    letterSpacing: "normal"
  headline:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.45rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  route-title:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.95
    letterSpacing: "-0.045em"
  quote:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.9vw, 2.75rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.03em"
  phi-1:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.7rem"
    fontWeight: 600
    letterSpacing: "-0.03em"
  lead:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.65
  meta:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 500
    lineHeight: 1.4
  marker:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "clamp(1.35rem, 1.8vw, 1.9rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0"
rounded:
  none: "0px"
  sm: "2px"
  full: "9999px"
spacing:
  gutter: "clamp(20px, 4vw, 64px)"
  nav: "72px"
  chair-w: "clamp(250px, 21vw, 330px)"
  section: "112px"
  section-lg: "160px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    padding: "0 1.4rem"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.ink-deep}"
  button-cta:
    backgroundColor: "{colors.ginster}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    padding: "0 1.4rem"
    height: "48px"
  button-cta-hover:
    backgroundColor: "{colors.ginster-light}"
  nav-cta:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "40px"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 0 9px"
  open-fact:
    textColor: "{colors.muted}"
---

# Design System: Trias Schule

## Overview

**Creative North Star: "A planning surface that becomes a building"**

The site reads as one continuous architectural drawing. It opens on white paper: pinned photo prints held by ginstergelb magnets, marker notes and a small floor-plan sketch, with the claim hand-lettered across it like the first idea of a plan. A flat ginstergelb PantoSwing (front view) turns in last at the bottom of the hero; its legs run on as lines down the services column, and the left one becomes the route that carries the projects and the two people and finally lands on the VS section. Everything drawn is a technical line drawing: ink strokes, flat ginstergelb only on the object, no gradients. The interface itself stays white and quiet; colour comes from photographs, the chairs, the stools and a few ginstergelb points.

**Key Characteristics:**
- Generous white space; hairline structure instead of containers.
- Technical-drawing vocabulary: end ticks, right-angle marks, dimension lines, hatched floors, dashed zones.
- One drawing style: ink contours, flat ginstergelb fills, no gradients, no blurred shadows.
- Handwriting only as annotation; the claim is lettered, not set.
- Motion scrubbed by scroll rather than played on a timer; final states without motion.

## Colors

White paper, one ink, one yellow.

### Primary
- **Ink** (#20201d): text, drawn lines, the ink button, figure contours, plan walls and filled tables.

### Secondary
- **Ginstergelb** (#e2a300; RAL 1032, working value): magnets, chairs and stools, the drawn route, the active-step and phase nodes, the active nav dot, the hand-underline under the claim, the conversion CTA. **Ginster light** (#f1c23b): CTA hover and the lit face of a shell or seat. **Ginster deep** (#b88400): the hollow open-fact ring and the caret.

### Neutral
- **Paper** (#ffffff): page ground and the opened form. **Warm** (#f6f5f0): footer. **Surface** (#f2f1ec): portrait ground and the far limbs of the seated figures. **Line** (#dddad1): hairline dividers. **Muted** (#6e6c65): secondary text (≥4.5:1 on paper). **Error** (#a4331c): invalid field underline and message.

### Named Rules
**The Rare Yellow Rule.** Ginstergelb marks objects, points and the one drawn route, never fills a region. At most one ginstergelb button on screen; the conversion CTA owns it.

**The Honest Blank Rule.** Missing content is left out, not staged. Testimonials and the closing quote render only when approved; portraits only when a photo is set; unknown optional facts (such as a project location) are omitted. What remains open collapses into one quiet line per person or footer, marked as an open fact (muted text after a 6px hollow ginster-deep ring, never an underline that reads as a link). Placeholder projects carry "Beispielprojekt · Platzhalter" with the same marker. Never fill a gap with invented names, numbers or quotes.

## Typography

**Display:** EMS Felix, a single-line plotter font, lettered at build time into inline SVG pen strokes.
**Body Font:** Archivo variable 400–700 (with "Archivo Fallback": Arial at size-adjust 105.5%, ascent 83.2%, descent 19.9%).
**Marker Font:** Caveat variable 500–700.

Fonts are self-hosted Latin subsets (woff2, OFL); Archivo is preloaded. No third-party font requests.

**Character:** A plain architectural grotesque carries every UI and editorial role; a marker hand annotates the plan.

### Hierarchy
Every role is a token in `global.css` (`--text-label|meta|body|lead`, `--text-headline|title|route-title|marker`, `--text-phi-1|2|3`); components use the token, never a literal size. The one exception is lettering inside SVG drawings (plan labels, the chair's "Sitzhöhe"), sized in drawing units so it scales with its drawing. Reading sizes are four steps (label, meta, body, lead). Titles follow a golden scale from body: 1.7rem (`phi-1`, focal text such as the active step, form title, menu links), 2.75rem (`phi-2`, project titles and quotes at most), 4.45rem (`phi-3`, the cap of every section heading).

- **Display (hero claim):** each word an SVG of pen strokes (58 font units wide, round caps and joins, current colour), scale 1.1 of the em, line step 1.06em, rotated −1.5°, a ginstergelb hand-underline under the last word. Umlauts are the base letter plus two short strokes. Screen readers get the plain text.
- **Headline:** section H2, weight 600, capped at `phi-3`.
- **Route title:** "Unsere Projekte", the one heading the drawn route writes; the largest Archivo size on the page.
- **Title:** person, project and category names, 600. Step names between the chair legs sit on `phi-1`, capped by `clamp(lead, 1.95vw, phi-1)` while pinned so the longest (Italian "Accompagnare") fits.
- **Quote:** 500, hanging opening quote.
- **Lead / Body:** intros and subline at lead; running text at body, measure ≤ 52ch.
- **Meta / Label:** buttons, nav, lists and details at meta; field labels, captions and credits at label.

### Named Rules
**The Annotation Rule.** Handwriting annotates: board notes, photo captions, planning questions, plan labels, the active-step label, the chat line. Caveat never carries navigation, buttons, body text or anything a visitor must read to act. The hero claim is lettered with a single-line pen, not set in Caveat; the offer beside it (subline, buttons) stays in Archivo.

## Layout

A 12-column grid inside a shell (max 1520px, gutter token), column gap `clamp(24px, 2.6vw, 44px)`. The chair column (`chair-w`) is the PantoSwing's width and shares the left edge with the hero claim.

- **Hero:** a board of `clamp(600px, 100svh − nav − 30px, 1000px)`. The text column is 38.2% wide and starts 14.6% down. On desktop the prints and sketch live in a frame `min(100%, board height × 1.66)` anchored right, so they keep golden proportions on wide, short screens; the largest print is centred on the golden point.
- **Services:** desktop grid `chair column · 4fr · 5fr` (chair and steps · heading, ruler and active step · floor plan). Without the scrubbed scene (reduced motion, short screens, no script) the heading moves beside the list.
- **Projects:** a pinned stage of flex rows resting on the route: image sized by height `min(row height, 60vw / 1.618)` at 1.618:1, the full-width project at 66vw, info `min(22rem, 26vw)`; the people follow as the last stop (heading `min(26rem, 26vw)`, persons stacked, notes). Static layout alternates image 8 + info 4, then a 21:9 full-width image with three info columns.
- **Phases:** five phases along a ruler, five columns on desktop, vertical on phones.
- **Contact:** pinned scene of 160vh with headline and CTA visible from the start; the opened form pushes the figures aside by ±3vw.
- **Legal pages:** section title in columns 1–4, text from column 5, hairline divider above each section.
- **Rhythm:** sections 112px vertical padding, 144–160px on desktop. Mobile stacks everything.
- **Touch:** every target is 44px on coarse pointers (text links through an invisible extension, footer rows, chips, header CTA).

## Elevation & Depth

Flat. UI carries no shadow; drawings carry no blurred shadow and stand on hatched floor lines instead. Depth belongs only to the physical objects pinned on the hero paper. The header turns to white at 88% with a 12px blur once scrolled, and drops the blur when the menu is open.

### Shadow Vocabulary
- **Print** (`box-shadow: 0 1px 1px rgba(32,32,29,.08), 0 12px 22px -12px rgba(32,32,29,.35)`): photo prints (white 5px border, rotated ±1–2.5°).
- **Magnet** (`box-shadow: inset 0 -1px 1px rgba(120,80,0,.35), 0 2px 2px rgba(32,32,29,.22), 0 6px 10px -4px rgba(32,32,29,.3)`): the 22px ginstergelb magnet, the one object with a rendered (radial) shading.

## Shapes

Architectural corners: 2px on buttons, chips and focus rings; 0 on inputs and images. Circles are reserved for magnets, line nodes, status dots and the open-fact ring.

## Components

### Buttons
- **Shape:** rectangular, 48px tall, slightly softened corners (2px), weight 600.
- **Primary:** ink on white paper. **CTA:** ginstergelb with ink text, lightening on hover.
- **Hover / Focus:** the arrow nudges 3px; focus is a 2px ink outline at 3px offset.
- **Text link:** a 1px underline that retracts on hover.

### Chips
- **Style:** project-phase radios, 1px #c9c6bc border, 36px (44px on touch).
- **State:** selected fills ink with white text and a small ginstergelb dot.

### Inputs / Fields
- **Style:** underline only (1px #b9b6ad), label above at label size.
- **Focus:** underline turns ink; keyboard focus adds a 2px ginstergelb underline.
- **Error:** underline and a sentence explaining the fix in the error colour.
- **Around it:** a privacy line at label size under submit; the mailto status says the mail program should open, with an "Anfrage kopieren" link that copies the composed inquiry.

### Navigation
Wordmark "TRIAS SCHULE" (bold / regular, tracked 0.14em), five links in page order with a ginstergelb dot for the current section, and a compact ink "Projekt anfragen" button. Below 640px: wordmark, a 40px "Anfragen" button and "Menü"; the language switch moves to the top of the full-height white sheet, whose own ginstergelb CTA replaces the header button.

### Signature: Drawn Line
A ginstergelb SVG route as thick as the chair legs (`--leg-w`), `stroke-dashoffset` scrubbed by scroll, with ink nodes (start point and moving head). It comes down from the chair's left leg, runs along the bottom of the pinned stage revealing "Unsere Projekte". The pen tip then stays at ~62% of the screen width while the whole plan sheet (line, title, the row of projects and quotes, then the two contact people as the last stop) slides left beneath it, so the line keeps drawing to the right under everything. At the end of the row it turns 90° down (ink right-angle mark in the inner corner) and lands at the top of the VS section with an ink dot. Mobile and reduced motion show the U-shaped line with the title and the projects stacked below.

### Signature: Planning Surface (hero)
White paper, prints held by magnets, marker notes and arrows, and a floor-plan sketch with a "7,20 m" dimension. Preparation takes about a second: the claim is written stroke by stroke at constant pen speed (~0.85s in any language) from 0.1s, subline and buttons rise at 0.12s, prints pin from 0.35s with magnets 0.3s later, notes draw from ~0.75s, and the chair arrives at 0.9s in one 900ms turn from off-left. The wordmark does not animate.

### Signature: Drawings
- **Services chair:** flat PantoSwing front silhouette whose legs become the route; the right leg stands on a 14×3px ink glide.
- **Services plan (desktop):** a room plan that builds one layer per step: walls, door and dimension; dashed zones with marker labels; tables with ginstergelb chair and stool dots; tables filled ink, cabinets, zones stepping back to 40%; a marker note "und später?" with an arrow. Complete without motion.
- **VS chair:** the PantoSwing in side elevation: flat ginster shell with a ginster-light face, tube frame as outlined ink (paper core over a wider ink stroke), pivot circle, dashed swing arc, hatched floor, "Sitzhöhe" dimension.
- **Contact figures:** contour figures (paper core over ink), heads as ink rings, far limbs in surface; Hokki stools flat ginster with a ginster-light seat; one shared hatched floor line that stays level while the figures turn to the visitor.

### Signature: Phase Ruler
"Wo stehen Sie gerade?": a 1px ink rule drawn on scroll with a tick per phase and a closing end tick. Each phase opens the form with that phase selected; hover and focus set a ginstergelb node on the tick and reveal an arrow.

## Do's and Don'ts

### Do:
- **Do** make motion a function of scroll position so it reverses when scrolling back, and render the final state under `prefers-reduced-motion`.
- **Do** keep content visible by default; scripts may only add scrubbing.
- **Do** keep new sections to hairline dividers and white space.
- **Do** draw new illustrations as ink contours with flat ginstergelb objects, standing on a hatched floor line.
- **Do** leave out what is not confirmed, and name what is still open once, quietly.

### Don't:
- **Don't** use cards, gradients, glass panels or big shadows on UI or drawings.
- **Don't** use ginstergelb as a background area or for body text.
- **Don't** invent or stage testimonials, project facts, people's titles, portraits or figures.
- **Don't** use handwriting for anything a visitor must read to act.
