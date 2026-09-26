---
target: landing page (homepage)
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
target_identity: "file:/home/davidhofer/Desktop/github_repos_hofda/trias-schule-landingpage/src/pages/index.astro"
target_fingerprint: "sha256:40d478f834cab9aa9ef1301f93043c0cca33aea25874705b32798a3c5dcd5715"
target_path: /home/davidhofer/Desktop/github_repos_hofda/trias-schule-landingpage/src/pages/index.astro
timestamp: 2026-09-26T07-22-53Z
slug: src-pages-index-astro
closed: true
---
⚠️ DEGRADED: single-context (in this setup sub-agents can only be started when the user asks for them, and the user didn't invoke the critique directly). The design review was finished before the detector ran.

Evidence: all 17 components read; 42 screenshots while scrolling (1440×900, 390×844); hero load timing measured; form opened and errors triggered; source detector and in-page detector run (headless Playwright, because the Chrome extension wasn't connected).

## Design Health Score (Nielsen heuristics, 0–4)

| # | Heuristic | Score | Key issue |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Step ruler and nav dot work well; the long sideways project row gives no sense of how far is left |
| 2 | Match with the real world | 3 | Plain German, phases match real procurement; "Platzhalter: Hier kommt…" is internal wording on the page |
| 3 | User control and freedom | 2 | Three pinned sections take a lot of scrolling and can't be skipped (services +170vh, projects ~6,500px, contact +260vh) |
| 4 | Consistency and standards | 2 | Five drawing styles; Simon and Rene drawn two different ways; nav order doesn't match page order |
| 5 | Error prevention | 3 | Good inline validation; the email route says "sent" whether or not a mail program opened |
| 6 | Recognition rather than recall | 3 | Step descriptions only show one at a time while pinned |
| 7 | Flexibility and efficiency | n/a | Landing page |
| 8 | Aesthetic and minimalist design | 2 | Placeholders get the biggest type; a third or more of the pinned sections is empty |
| 9 | Error recovery | 3 | Errors explain the fix; focus moves to the first wrong field |
| 10 | Help and documentation | n/a | Landing page |
| **Total** | | **21/32** | **Acceptable (66%)** |

## Is the design specific to Trias?

Assessment: yes, clearly. The chair's width sets the page grid, its legs become the yellow line drawn by scrolling, the line writes "Unsere Projekte" and leads down into the VS section, and the form's phase buttons use the real procurement stages. It avoids the usual "hero, three icons, stats, cards" layout completely. The problem is execution: about 8/10 for the idea and 5/10 for the craft. What makes it look lower quality is uneven drawings, empty space in the pinned sections, and placeholder text at headline size.

Source checks: 44 findings: 39 font sizes outside the DESIGN.md type scale, 4 colours outside the palette, 1 animation of `padding` (ContactScene.astro:136). They agree that there are too many font sizes; they didn't catch any of the layout problems.

In-page checks: 13 findings on desktop, 10 on mobile, mostly false alarms (the `.link-line` gradient underline read as a background colour; intentional hidden overflow on pinned sections; tight line spacing on large quotes). One real hit: the ~105-character footer credit line. No visible highlighting, because this ran in a headless browser.

## Overall impression
A strong, original idea that currently looks unfinished rather than high-end. Biggest improvements: stop showing missing content at headline size, and fill the empty space in the pinned sections with the floor plan itself.

## What's working
- The yellow line: from the chair leg, drawn by scrolling, reveals the title, slides under a fixed pen tip, turns 90° with a right-angle mark and lands in the VS section. One continuous gesture that runs backwards cleanly.
- The form: underline-only fields, phase buttons that match real procurement stages, specific error messages, focus on the first wrong field, status announced to screen readers.
- Restraint: one yellow button, thin lines instead of cards, a complete version without animation, nothing made up.

## Priority issues

[P1] Placeholders get the loudest spots on the page. The placeholder quote appears 3 times (2.75rem ×2, 4.45rem as the closing section), plus 3 "Beispielprojekt · Platzhalter" labels, 2 empty portrait boxes and about 12 dashed "…folgt" notes. The closing quote is the last thing read before the main button. Fix: leave empty slots out of the layout (`testimonial: null` until approved); replace the closing quote with "Wo stehen Sie gerade?" plus the five phases as links that open the form with that phase selected; reduce missing person details to one line; hide the portrait boxes until photos exist. Command: /impeccable distill

[P1] Five drawing styles, and some look like clip art: flat PantoSwing (services), gradient fake-3D chair of a different model (VS), pale standing figures (people), black pictograms on gradient stools (contact), marker arrows. Simon and Rene appear twice in unrelated styles; the gradients break DESIGN.md's "no gradients" rule. Fix: one style, technical line drawing (1.5px ink, flat yellow only on the object); redraw the VS chair as the same PantoSwing from the side with dimension lines; flat stools; one figure style for People and Contact. Command: /impeccable polish

[P1] Pinned sections use a lot of scrolling on empty space, and the main button comes late. The desktop page is 15,600px. Services pinned for +170vh with the right ~40% and bottom third empty; project frames leave the top third empty and the photos are only ~375px tall on a 900px screen; contact pinned for 260vh with the CTA only fading in during the last 15%. Fix: services becomes a floor plan that develops step by step; project photos sized by available height (~620px); contact pinned for 120–140vh with headline and button shown from the start. Command: /impeccable layout

[P2] On first load the offer stays hidden for about 3 seconds: sub-heading and buttons at 2.83s, photos ~3.2s, chair done ~6.7s (spins 2.5 times). At 2.5s the screen shows "Lernräume für Sü". The brief caps timed animation at 1.2s. Fix: sub-heading and buttons within 0.3s, headline in under 0.9s, photos 0.4–0.9s, one chair turn of 1s or less. Command: /impeccable animate

[P2] Too many small font sizes: 14 sizes between 0.75 and 1.15rem, some 0.03rem apart. The hero headline is Caveat, the most common handwriting font on Google Fonts. Fix: four small-text sizes (0.82 / 0.92 / 1.05 / 1.2); custom hand-lettered headline drawn as real strokes; Caveat for small notes only. Command: /impeccable typeset

## Problems through the eyes of different visitors
First-time visitor: after 2.5s sees only "Lernräume für Sü"; then reads the placeholder quote at headline size and assumes the site isn't live; "Telefon folgt" looks clickable and does nothing.
Link tester: Impressum and Datenschutz point to anchors that don't exist; five VS category links all go to the vs.de homepage; the email route says "opened" even without a mail program; the "7,20 m" line and a photo overlap the services heading about 675px down.
Mobile visitor: below 640px there's no button in the header; the only ways to get in touch are a ~26px text link in the hero and the end of a 12,700px page.
Municipal building office: no company details, address, phone or confirmed references; no privacy notice on the form; Google Fonts loaded from Google's servers (GDPR problem, fixed by self-hosting). Not design problems, but they block launch.

## Smaller observations
- The whiteboard is gone (DESIGN.md describes frame, texture, marker tray); the magnets hold onto nothing. Bring back a quiet board or switch to drafting paper, and update DESIGN.md.
- The right chair leg stops in mid-air and looks broken; a small end mark would make it look deliberate.
- When the project row lets go, the "Zwei Ansprechpartner…" heading is cut off at the left edge.
- The nav lists Projekte before Leistungen but the page shows Leistungen first, so the active-section dot jumps backwards.
- "Projektort" sits alone in a two-column row; the figures flanking the form face the visitor.
- The dark button's hover uses #000 (not in the palette); the headline size in DESIGN.md doesn't match the code.

## Questions to consider
- What if the services section was the floor plan, drawing itself into a furnished room step by step?
- Is a ~6,500px sideways row worth it for three placeholder projects?
- If every placeholder were simply left out, would the page be closer to launch-ready?
- Is Caveat the voice of Trias, or just the default handwriting font?
