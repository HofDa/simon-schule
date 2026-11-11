# Whiteboard arrangement review: Lernraum (Best-of)

Reviewed 2026-11-10 on `/lernraum/` at 1920×1080, 1536×864, 1440×900, 1366×768, 1280×800, 1280×720, 1024×768, 820×1180 and 390×844. Nothing has been changed yet.

The board is the shared `BoardNavigation` component, so these findings apply to the other whiteboard variants as well.

## Summary

The arrangement holds up well at 1440px and wider. It has real problems at laptop sizes (1024–1366px wide, or under about 800px tall).

## Problems, most important first

1. **"② Planung" slides under the feedback card.**
   At 1024×768 the label is cut off to "Plan…" (24px hidden). At 1280×800 it just touches the card. The path labels are placed from the arrow alone and do not avoid neighbouring objects.

2. **The three project collages touch each other at 1024px.**
   They overlap by 3–5px along their full height, so the row reads as one strip instead of three pinned prints.

3. **The headline appears twice.**
   The board says "Lernräume für Südtirol." and the section straight after it repeats the same claim as a second hero, so the page has two `h1`s. `WhiteboardHero` mounts the board and then its own hero.

4. **The left column is cramped on short screens.**
   At 1280×720 the HOUSE70 magnet sits directly under "oder erst Projekte ansehen" with about 3px of air. The "Magnete greifen & verschieben" hint disappears at 1366px and below.

5. **The weight is lopsided on large screens.**
   At 1920×1080 and 1440×900 the right half carries all three collages, the feedback card, the catalogue and the contact card. The lower left holds only the house magnet and the hint.

6. **"Feedback ↗" and "④ Montage & Begleitung" read as one line.**
   At 1024–1280px the caption and the path label sit on the same baseline a few pixels apart.

## What works

- The path CTA → Grundschulen → VS catalogue → Feedback → Simon Brugger reads clearly in the right order at 1440px and up.
- Nothing leaves the board frame at any size.
- Below 1024px the board is hidden and the normal hero takes over cleanly (checked at 820px and 390px).

## Proposed fixes

| Fix | Where | Solves |
| --- | --- | --- |
| Make path labels avoid object boxes (flip to the other side of the arrow on collision) | `src/scripts/board-path.ts` | 1, 6 |
| Shrink the collages slightly or add a gap at 1024–1280px | `src/styles/board-navigation.css` | 2 |
| Drop or reword the second hero's headline on desktop, where the board already shows it | `src/components/whiteboard/WhiteboardHero.astro` | 3 |
| Move the house magnet up beside the CTA on short screens | `src/styles/board-navigation.css` | 4 |
| Pull the feedback card or catalogue left on wide screens | `src/styles/board-navigation.css` | 5 |

## Not covered

The sections below the board were only skimmed as far as Lernformen. Projekte, Menschen, VS Möbel, Phasen and Kontakt have not been reviewed.
