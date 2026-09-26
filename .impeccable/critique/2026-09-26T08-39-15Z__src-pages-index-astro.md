---
target: landing page (homepage), re-critique after fixes
total_score: 25
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:/home/davidhofer/Desktop/github_repos_hofda/trias-schule-landingpage/src/pages/index.astro"
target_fingerprint: "sha256:40d478f834cab9aa9ef1301f93043c0cca33aea25874705b32798a3c5dcd5715"
target_path: /home/davidhofer/Desktop/github_repos_hofda/trias-schule-landingpage/src/pages/index.astro
timestamp: 2026-09-26T08-39-15Z
slug: src-pages-index-astro
---
⚠️ DEGRADED: single-context (sub-agents only on explicit user request). The design review ran after the same session built the changes, so the detector results were already known; weigh the scores accordingly.

## Design Health Score (Nielsen, 0–4)

| # | Heuristic | Then | Now | Key issue now |
|---|---|---|---|---|
| 1 | Visibility of system status | 3 | 3 | Step and phase rulers work; the sideways project row shows no progress; nav dot stale over the phase section |
| 2 | Match with the real world | 3 | 3 | Procurement phases guide visitors into the form; "Beispielprojekt · Platzhalter" and "folgt" remain internal |
| 3 | User control and freedom | 2 | 3 | Shorter contact scene, button in every header; services (+170vh) and the project row still scroll long |
| 4 | Consistency and standards | 2 | 3 | One drawing style, type tokens, nav matches the page; VS rows behave like a selection without being links |
| 5 | Error prevention | 3 | 3 | Inline validation; phase choice fills in the form |
| 6 | Recognition rather than recall | 3 | 3 | The plan makes steps visible; step texts one at a time |
| 7 | Flexibility and efficiency | n/a | n/a | Landing page |
| 8 | Aesthetic and minimalist design | 2 | 3 | Placeholders quiet, pinned sections filled; placeholder photos are the weakest large surfaces |
| 9 | Error recovery | 3 | 4 | Errors explain the fix, input kept, copy fallback when no mail program opens |
| 10 | Help and documentation | n/a | n/a | Landing page |
| **Total** | | **21/32** | **25/32** | **Good (78%)** |

## Is the design specific to Trias?
Yes, and now coherent: chair as grid, route drawing the projects, floor plan building per step, phase ruler into the form, one ink-and-yellow drawing language, a pen-written headline. The earlier gap between concept (8/10) and craft (5/10) has mostly closed; what holds it back now is content rather than design.

Detectors: source scan 2 findings (documented exception: labels inside SVG drawings, in drawing units); in-page 10 desktop / 7 mobile, down from 13 / 10, the same false-positive classes plus the ~110-character footer credit line.

## What's working
- One authored line of thought: idea on paper, plan builds per step, projects on the line, the people, "Wo stehen Sie gerade?", the conversation, all in one drawing vocabulary.
- Honesty without cost: missing facts are quiet one-line markers.
- A robust foundation: four text tokens, self-hosted fonts, everything in place ~1.8s after load, working mobile menu, legal pages, complete reduced-motion and no-JS paths.

## Priority issues
[P1] Placeholder photos are the weakest large surfaces (hero collage, project row; "Lernlandschaft" visibly soft). Fix: real photography; interim option, one consistent treatment for placeholder photos so they read as stand-ins. Owner: content, /impeccable polish for the interim treatment.

[P2] The sideways project row is long (~5,800px of scrolling for three placeholder projects and the people stop) with no progress cue, plus an empty ~140px band under the nav in each frame. Fix: one tick per project on the drawn line, tighter gaps. Command: /impeccable layout

[P2] Tablets in portrait (768–1023px) get the phone layout scaled up: single column, wide empty margins, plan hidden, vertical phase ruler. Fix: two-column tablet layout. Command: /impeccable adapt

[P3] Non-link VS rows still behave like a selection (hollow dots plus a scroll-following yellow dot). Fix: turn off the scroll highlight until rows have deep links. Command: /impeccable polish

## Problems through the eyes of different visitors
First-time visitor: offer readable within 0.3s, phase ruler shows where to start; the soft placeholder photo is what feels unfinished.
Mobile visitor: "Anfragen" always in the header, working menu, 44px taps. Nothing blocking.
Municipal building office: the design no longer gets in the way; content is missing (address, VAT number, references, legal review of the privacy draft).

## Smaller observations
- The nav's active-section dot stays on the last section over "Wo stehen Sie gerade?".
- Footer photo-credit line ~110 characters wide.
- In-page false positives unchanged: link underlines read as 1:1 contrast; pinned stages clip overflow on purpose.
