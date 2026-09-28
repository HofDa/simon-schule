---
name: Trias Schule
description: Die Maßkette. Learning spaces for South Tyrol, drawn as a measured plan on hard-edged sheets of Ginstergelb, ink and paper.
colors:
  ginster: "#e2a300"
  ginster-light: "#f1c23b"
  ginster-deep: "#8a6300"
  on-ginster: "#463606"
  ink: "#1d1d1b"
  ink-deep: "#000000"
  ink-line: "#3b3a36"
  on-ink: "#aeaba1"
  paper: "#ffffff"
  warm: "#f4f3ee"
  muted: "#66645d"
  line: "#dcd9d0"
  error: "#a4331c"
typography:
  display:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.7rem, 6.2vw, 6rem)"
    fontWeight: 720
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  headline:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.3rem, 4.6vw, 4.5rem)"
    fontWeight: 720
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  step:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 5.6rem)"
    fontWeight: 720
    lineHeight: 0.94
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 118"
  title:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 2.4vw, 2.5rem)"
    fontWeight: 680
    lineHeight: 1.02
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 112"
  focal:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 680
    letterSpacing: "-0.03em"
    fontVariation: "'wdth' 112"
  lead:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.14rem, 1.25vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.5
    fontVariation: "'wdth' 100"
  body:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.06rem"
    fontWeight: 400
    lineHeight: 1.62
    fontVariation: "'wdth' 100"
  meta:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.92rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, Archivo Fallback, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  none: "0px"
  marker: "50%"
spacing:
  gutter: "clamp(20px, 4vw, 64px)"
  nav-h: "72px"
  column-gap: "clamp(24px, 2.6vw, 44px)"
  section: "clamp(104px, 12vw, 176px)"
  shell-max: "1560px"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.meta}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "52px"
  button-ink-hover:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.paper}"
  button-ginster:
    backgroundColor: "{colors.ginster}"
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.none}"
    padding: "0 1.5rem"
    height: "52px"
  button-ginster-hover:
    backgroundColor: "{colors.ginster-light}"
    textColor: "{colors.ink}"
  sheet-ginster:
    backgroundColor: "{colors.ginster}"
    textColor: "{colors.ink}"
  sheet-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  sheet-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  input-line:
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "8px 0 9px"
  chip:
    textColor: "{colors.ink}"
    typography: "{typography.meta}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "36px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
---

# Design System: Trias Schule

## Overview

**Creative North Star: "Die Maßkette"**

The site is an architect's measured drawing laid out at page scale. Colour is committed in whole, hard-edged sheets: Ginstergelb fields, ink fields and white paper fields, stacked edge to edge with no transition between them. On those sheets the only ornament is the draughtsman's own vocabulary: 1.5px ink lines, dimension lines closed by 45° ticks, hatched cut walls, door swings, tabular figures. The chain of dimensions is the organising device; it measures the project steps, the realised rooms and the visitor's own phase.

Type is one family, Archivo, used at two widths: an expanded, heavy, tightly tracked cut for anything that is a name or a claim, and the normal width for reading. Density is low. Sections breathe on 104–176px vertical padding, and the 12-column grid is held strictly, often with a copy block on 5 columns against a drawing or photograph on 7.

Motion reads as measuring. Scroll progress is animation progress (scrubbed, reversible); lines draw, fills run along the chain, frames open from a dimension line. Only the hero plan draws on load. Reduced motion renders every scene in its final state.

**Key Characteristics:**
- Page-scale colour sheets (Ginstergelb, ink, paper) with hard edges, never gradients or tints between them.
- Line drawing as the only illustration: 1.5px strokes, 45° end ticks, hatched poché.
- One typeface, two widths: expanded 118 display, normal 100 reading.
- Square corners everywhere; circles only as small point markers.
- Flat: depth comes from sheet colour, never from shadow.
- Scroll-scrubbed motion that measures and draws, and is fully static when motion is reduced.

## Colors

Three committed sheet colours, each carrying its own secondary text and line colour, plus quiet paper neutrals for photography.

### Primary
- **Ginstergelb** (ginster): the broom-flower yellow. Full sheets for the hero, the people section and the contact; on ink sheets it becomes the object and progress colour (seats in the plan, the chain fill, passed ticks, phase hover). Also the ginster button and the selection colour on ink.
- **Pale Ginster** (ginster-light): hover state of the ginster button only.
- **Deep Ginster** (ginster-deep): text caret colour; not a surface colour.
- **Ginster Shadow Text** (on-ginster): secondary text on a Ginstergelb sheet, ink tinted from the yellow (about 5:1).

### Secondary
- **Drawing Ink** (ink): body text on light sheets, the ink sheet (chain, phases, footer), primary buttons, all line drawing on light sheets, selected chips.
- **Pure Black** (ink-deep): ink button hover only.
- **Ink Rule** (ink-line): unlit rules and the chain track on an ink sheet.
- **Ink Secondary** (on-ink): secondary text and unpassed ticks on an ink sheet.

### Neutral
- **Paper** (paper): the page, the paper sheet behind photography, the inquiry form's sheet, text and lines on ink.
- **Warm Paper** (warm): placeholder fill behind images while they load.
- **Graphite** (muted): secondary text on paper.
- **Pencil Line** (line): hairline dividers on paper (list rows, project meta, scrolled nav edge).
- **Correction Red** (error): form field errors only.

### Named Rules
**The Sheet Rule.** Every section is exactly one sheet (ginster, ink or paper), and the sheet sets the text, secondary text and line colours for everything on it. Never place a sheet colour as a small tint, card or badge.

**The Object Rule.** On an ink sheet, lines turn paper and objects turn Ginstergelb. Ginstergelb on ink marks progress or the thing being placed, never decoration.

## Typography

**Display Font:** Archivo variable, expanded cut (wdth 118), with Archivo Fallback (metric-matched Arial)
**Body Font:** Archivo variable, normal cut (wdth 100)

**Character:** One grotesque stretched wide and heavy for names and claims, like lettering on a title block; the same family at normal width reads as plain technical prose.

### Hierarchy
- **Display** (720, clamp 2.7–6rem, 0.94): the hero H1 and the projects heading.
- **Headline** (720, clamp 2.3–4.5rem, 0.94): section headings on every sheet.
- **Step** (720, clamp 2.6–5.6rem, 0.94): the step names of the chain; in the pinned scene they narrow to wdth 88 so the longest Italian word fits.
- **Title** (650–680, wdth 112, clamp 1.6–2.5rem, 1.02–1.05): project names, VS categories, phase names.
- **Focal** (680, wdth 112, 1.6rem): the form title and the mobile menu links.
- **Lead** (400, clamp 1.14–1.3rem, 1.5): section intros and sublines, 40–46ch.
- **Body** (400, 1.06rem, 1.62): running text, about 40ch in project descriptions.
- **Meta** (400–600, 0.92rem): buttons, metadata rows, footer.
- **Label** (500–600, 0.8rem): form labels, the chain step names in the hero.

The people section sets the two names at an oversized clamp(2.6rem, 9.2vw, 9.5rem), 0.88 leading, -0.045em tracking; the footer carries the wordmark at display width.

### Named Rules
**The Two Widths Rule.** Expanded (112–118) is for names and claims; 100 is for reading. Nothing in between, and no second family.

**The Tabular Rule.** Every dimension, year and measured figure uses tabular numerals.

## Layout

A single shell (max 1560px, gutter clamp 20–64px) holds a 12-column grid from 1024px up, column gap clamp 24–44px. Below 1024px everything stacks into one column; 640–1023px sometimes splits into two. Recurrent splits: copy on columns 1–5 against a drawing on 6–12 (hero, chain, contact); heading on 1–7 or 1–8 against an intro on 9–12 aligned to its baseline (projects, people, phases). Projects alternate left figure (8 cols), right figure (8 cols) and a full-bleed 21:9 figure that breaks the shell.

Sections pad clamp(96–104px, 12vw, 160–176px) vertically. The navbar is 72px tall and fixed; anchors scroll with a nav-height offset. The chain section pins on large screens and scrolls its panels sideways; without scrubbing it falls back to a sticky plan beside stacked steps.

## Elevation & Depth

The system is flat. Depth is carried only by the change of sheet colour and by the paper inquiry sheet set on a Ginstergelb field. Box-shadow appears solely as line work: a 1px inset hairline under the scrolled nav, 1–2px underline rules on focused fields, and a 1.5px ring on the hero's first tick marker.

### Named Rules
**The No-Lift Rule.** No blurred or offset shadows. If something must stand forward, it sits on a different sheet.

## Shapes

All surfaces, buttons, chips, fields and images have square corners (0). The only round forms are point markers: the 7px hollow open-fact dot, the 6px selected-chip dot, the 12px Ginstergelb phase marker, the hero's first tick. Borders are drawing lines: 1.5px ink for section-level rules (list tops, form head, people rows), 1px for secondary rows. Dimension lines end in 45° ticks 13px tall. Drawings use hatching at 45° on a 7px pitch for cut walls, and 6/6 dashes for zones.

### Named Rules
**The Tick Rule.** A measured length ends in a 45° tick, never an arrowhead or a dot, except the chain's starting point.

## Components

### Buttons
Blunt, solid blocks with an arrow that moves.
- **Shape:** square (0), min-height 52px (nav 40px, 44px on touch), padding 0 1.5rem, weight 600.
- **Ink:** ink ground, paper text; hover to pure black. The primary action on ginster and paper sheets.
- **Ginster:** Ginstergelb ground, ink text; hover to pale ginster. Used on ink (mobile menu).
- **Hover / Focus:** 220ms colour change on the draw ease; the inline arrow SVG (1.6 stroke) slides 4px right. Focus is a 2px outline offset 3px in current colour.
- **Text link:** a 1px underline drawn as a background that retracts to the right on hover (280ms).

### Chips
- **Style:** square, 1px warm-grey border, 36px tall (44px on touch), meta size.
- **State:** checked fills ink with paper text and a 6px Ginstergelb dot; hover darkens the border to ink.

### Cards / Containers
There are no cards. Grouping is done with rules: a 1.5px ink top rule and 1px dividers between rows (project metadata, VS categories, people, questions). The inquiry form sits on a paper sheet padded clamp(24–56px) inside the ginster contact sheet.

### Inputs / Fields
- **Style:** underline only: transparent ground, 1px bottom border, square, body size, label above at label size.
- **Focus:** border turns ink with a 1px ink underline; keyboard focus adds a 2px Ginstergelb underline.
- **Error:** correction red border, underline and message at label size.

### Navigation
Transparent over the hero, paper with a hairline once scrolled. Wordmark "Trias Schule" in meta size, uppercase, 0.14em tracking, bold/regular split. Links underline with a 1.5px rule drawn left to right; current section keeps it. Compact ink CTA at the right. Mobile: two-bar icon crossing to an X, full menu with focal-size links and a ginster CTA.

### Dimension Line (signature)
A 1px rule with 45° end ticks, drawn by scroll (scaleX from the left); the closing tick appears when the line completes. It sits above each project photograph, whose frame then opens from it.

### The Chain (signature)
Five segments, ticks at every joint. In the hero it is an ink rule under the fold with step names. On the ink sheet it pins, a 3.5px Ginstergelb fill runs along a 1.5px ink-line track, passed ticks turn Ginstergelb, the active step name brightens to paper, and the room plan gains a layer per step. It returns as the phase ruler before the inquiry, where hovering a phase lights its segment and marker in Ginstergelb.

### Room Plan (signature)
An SVG plan that recolours per sheet through three variables (line, furniture, seat): ink lines with paper furniture on ginster; paper lines, ink furniture and Ginstergelb seats on ink.

### Open Fact
Unconfirmed facts are shown in secondary text behind a 7px hollow circle, never invented.

## Do's and Don'ts

### Do:
- **Do** give every section one full sheet (ginster, ink or paper) and take text, muted and line colours from it.
- **Do** set names and claims in Archivo at wdth 112–118, weight 650–720, tracking -0.03 to -0.045em.
- **Do** draw lines at 1.5px and end measured lengths with 45° ticks 13px tall.
- **Do** use tabular numerals for every dimension and year.
- **Do** tie motion to scroll progress with the draw ease (cubic-bezier(0.16, 1, 0.3, 1)) and render the final state under reduced motion.
- **Do** mark missing facts with the hollow open-fact dot instead of filling them in.

### Don't:
- **Don't** round corners on surfaces, buttons, fields or images; circles are only for point markers.
- **Don't** use blurred or offset drop shadows; depth is the sheet.
- **Don't** introduce a second typeface or a handwritten face.
- **Don't** build card grids; group with ink rules and hairline dividers.
- **Don't** use Ginstergelb as a tint, badge or decoration on paper; it is a sheet, a button or an object on ink.
- **Don't** add illustration beyond line drawings of plans and furniture (no drawn figures, no icon sets).
