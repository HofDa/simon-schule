---
name: Trias Schule
description: A planning surface that becomes a building – white, architectural, ruler-drawn.
colors:
  paper: "#ffffff"
  warm: "#f6f5f0"
  surface: "#f2f1ec"
  ink: "#20201d"
  muted: "#6e6c65"
  line: "#dddad1"
  ginster: "#e2a300"
  ginster-deep: "#b88400"
  ginster-light: "#f1c23b"
  pending-text: "#86837a"
  error: "#a4331c"
typography:
  display:
    fontFamily: "Caveat, cursive"
    fontSize: "clamp(3.6rem, min(8.6vw, 13vh), 7.6rem)"
    fontWeight: 700
    lineHeight: 0.86
    letterSpacing: "normal"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 5vw, 4.75rem)"
    fontWeight: 600
    lineHeight: 0.98
    letterSpacing: "-0.045em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 2.6vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  quote:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.9vw, 2.6rem)"
    fontWeight: 500
    lineHeight: 1.18
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.82rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  marker:
    fontFamily: "Caveat, cursive"
    fontSize: "clamp(1.35rem, 1.8vw, 2rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "2px"
  board: "6px"
  full: "9999px"
spacing:
  gutter: "clamp(20px, 4vw, 64px)"
  nav: "72px"
  section: "clamp(112px, 12vw, 160px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 1.4rem"
    height: "48px"
  button-cta:
    backgroundColor: "{colors.ginster}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 1.4rem"
    height: "48px"
  button-cta-hover:
    backgroundColor: "{colors.ginster-light}"
  chip:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 0 9px"
---

# Design System: Trias Schule

## Overview

The site reads as one continuous architectural drawing. It opens on a physical whiteboard with pinned photos and marker notes. A flat ginstergelb PantoSwing (front view: shell with round grip hole, seat, two tubular legs without crossbar) spins in last at the bottom of the hero; below it, the seat's front edge carries the services list and its two legs continue as ginstergelb lines down the column and end with the list, which sits between them; the steps are marked with hand-drawn marker arrows. The chair's width is the column width. A single 1.5px ink line, drawn by scrolling, then crosses the page, lays down the title "Unsere Projekte" and turns 90° into a lane that runs down the side of the projects. It ends as a dimension line above the full-width project. The interface itself stays white and quiet; colour comes from photographs, the chair, the stools and a few ginstergelb points.

Key characteristics: generous white space, hairline structure instead of containers, technical-drawing vocabulary (end ticks, right-angle marks, axis lines), handwriting only as annotation, and motion scrubbed by scroll rather than played on a timer.

## Colors

### Primary
- **Ink** `#20201d`: text, drawn lines, primary buttons, scale figures.

### Secondary
- **Ginstergelb** `#e2a300` (RAL 1032, working value): magnets, chair, Hokki stools, the head of the drawn line, the active-step underline, active nav dot, the final CTA and the form submit. Never used as a background area. `ginster-deep` is for dashed "open fact" underlines and shading only.

### Neutral
- **Paper** `#ffffff`: page ground. **Warm** `#f6f5f0`: footer. **Surface** `#f2f1ec`: photo and portrait placeholders. **Line** `#dddad1`: hairline dividers. **Muted** `#6e6c65`: secondary text (≥4.5:1 on paper). **Pending text** `#86837a`: quotes that are still placeholders (large text only).

### Named Rules
- **The Rare Yellow Rule.** Ginstergelb marks objects, points and the one drawn route (chair, legs, line), never fills a region. At most one ginstergelb button on screen; the conversion CTA owns it.
- **The Honest Blank Rule.** An unconfirmed fact renders as a dashed-underlined `.open-fact`, and a placeholder project carries "Beispielprojekt · Platzhalter". Never fill a gap with invented names, numbers or quotes.

## Typography

Archivo (a grotesque) carries every UI and editorial role. Caveat is the whiteboard marker, used for the hero headline (Caveat 700, written letter by letter on load, with a ginstergelb marker underline under the last word), board notes, photo captions, planning questions, the active-step label and the one conversation bubble. It never appears in navigation, buttons or body text.

### Hierarchy
Sizes follow a golden type scale: body 1.05rem, then ×φ per step: 1.7rem (`--text-phi-1`, focal body text such as the active step), 2.75rem (`--text-phi-2`, project titles and quotes), 4.45rem (`--text-phi-3`, every section heading).

- Hero H1: Caveat 700, `clamp(3.6rem, min(8.6vw, 13vh), 7.6rem)`, line height 0.86, rotated -1.5°.
- Display (large Archivo headings) ≤ 6rem, tracking -0.045em, line height 0.94.
- Headline (section H2) ≈ 4.75rem max.
- Title (step, project, category names) 1.75–2.75rem, weight 600.
- Quote 1.6–2.6rem, weight 500, hanging opening quote.
- Body 1.05rem at 1.65, measure ≤ 52ch. Label 0.82rem for meta, field labels and credits.

### Named Rules
- **The Annotation Rule.** Handwriting annotates. The only exception is the hero claim, written on the board like the first idea of a plan; the offer itself (subline, buttons) stays in Archivo.

## Layout

A 12-column editorial grid inside `.shell` (max 1520px, gutter `clamp(20px, 4vw, 64px)`). The services column width is `clamp(250px, 21vw, 330px)`, which is the chair's width. The chair and its column share the left edge of the content column with the hero headline. The hero follows the same golden grid: the text column is 38.2% wide and starts at 14.6% (0.382²) of the board height, the chair rests below it on the same left edge; the three pinned photos form a Fibonacci sequence (33%, 33/φ, 33/φ² of the width), the largest centred on the golden point 61.8% / 38.2%, the next on 76.4% / 76.4%. On desktop the projects form a horizontal row above the drawn line on a pinned stage (image + details side by side per project, quotes in between). Projects alternate: image left (8 columns) + info (4), info (4) + image right (8), then a full-width 21:9 photo with three info columns below. Section rhythm is 112–160px vertical padding with more space above headings than below. Mobile stacks everything with no pinned sequences.

## Elevation & Depth

Composition: in the pinned projects row everything rests on the drawn line (images as 1.618:1 golden rectangles, details and quotes bottom-aligned). In the contact scene the floor sits on the golden line (76.4% from the top). Almost flat. Depth appears only on physical objects: the whiteboard frame (inset hairline + soft drop shadow), pinned photo prints (`0 12px 22px -12px`), magnets (small offset shadow), and blurred contact shadows under the chair and stools. UI elements carry no shadow. The nav gains a 1px shadow and `rgba(255,255,255,.88)` + 12px blur only once the page is scrolled.

## Shapes

Architectural corners: 2px on buttons, chips and focus rings, 0 on inputs and images, 6px on the whiteboard only. Circles are reserved for magnets, line nodes and status dots.

## Components

### Buttons
Rectangular, 48px tall, 2px radius, weight 600. Primary is ink on white. The CTA ("Projekt anfragen", "Anfrage senden") is ginstergelb with ink text. An arrow icon nudges 3px on hover. The secondary action is a text link with a 1px underline that retracts on hover (`.link-line`).

### Chips
Radio chips for the project phase: 1px `#c9c6bc` border. When selected: an ink fill, white text and a small ginstergelb dot.

### Inputs / Fields
Underline-only fields. The underline turns ink on focus and ginstergelb on keyboard focus; errors turn `#a4331c` with a sentence explaining the fix.

### Navigation
Wordmark "TRIAS SCHULE" (bold / regular, tracked 0.14em), five links with a ginstergelb dot marking the current section, and a small ink "Projekt anfragen" button. On mobile, a full-height white sheet with large links.

### Signature: Drawn Line
A 4px ginstergelb SVG route, `stroke-dashoffset` scrubbed by scroll, with ink nodes (start point and moving head). It comes down from the chair's left leg, runs along the bottom of the pinned stage revealing "Unsere Projekte". The pen tip then stays at ~62% of the screen width while the whole plan sheet (line, title and the row of projects and quotes) slides left beneath it, so the line keeps drawing to the right under each project. At the end of the row it turns 90° up (ink right-angle mark in the inner corner). Mobile and reduced motion show the U-shaped line with the title and the projects stacked below.

### Signature: Whiteboard
A frame, a surface with a noise texture and a faint sheen, prints held by magnets (rotated ±1–2°), marker notes and arrows drawn on load, and a marker tray.

## Do's and Don'ts

### Do:
- **Do** make motion a function of scroll position so it reverses when scrolling back, and render the final state under `prefers-reduced-motion`.
- **Do** keep content visible by default; scripts may only add scrubbing.
- **Do** keep new sections to hairline dividers and white space.

### Don't:
- **Don't** use cards, gradients, glass, eyebrow labels or big shadows on UI.
- **Don't** use ginstergelb as a background area or for body text.
- **Don't** invent testimonials, project facts, people's titles or figures.
- **Don't** use handwriting for anything a visitor must read to act.
