# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Decision makers for school and kindergarten buildings in South Tyrol: school principals, kindergarten leads, municipal (Gemeinde) building and education offices, and the architects working for them. They arrive with a concrete room or building project in some phase (first idea, planning, tendering, refurbishment) and want to know whether Trias Schule can carry it, who they would deal with, and how to start a conversation.

## Product Purpose

Trias Schule is the school and kindergarten division of Trias. It advises on, plans and delivers furnished learning spaces, from first conversation through ordering, coordination and installation to after-care. Success for the website: a qualified inquiry ("Projekt anfragen") from a school, kindergarten or municipality.

## Positioning

Exclusive representation of VS Möbel in South Tyrol, combined with local, personal project guidance by named people (Simon Brugger and Rene). Trias sells the process of making a learning space, not a furniture catalog.

## Operating Context

Public procurement and municipal decision cycles; projects move through phases: Erste Idee, Planung läuft, Konkrete Ausstattung, Ausschreibung, Umbau / Erweiterung. German-language audience in South Tyrol.

## Capabilities and Constraints

- Stack: Astro 5 + Tailwind CSS 4 (via `@tailwindcss/vite`), deployed as a static site to GitHub Pages (base path derived from env in `astro.config.mjs`).
- No backend. The inquiry form composes a `mailto:` to the Trias address; the submit target is a single configurable endpoint so a form service can replace it later.
- Client JavaScript kept minimal; scroll-linked motion only where it carries meaning; `prefers-reduced-motion` must yield a complete static page.
- Open facts (must stay marked, never invented): Rene's surname, both roles, phone numbers, direct e-mail addresses, VS deep links per category, final digital value for VS Ginstergelb (RAL 1032, working value `#E2A300`).

## Brand Commitments

- Name set as "TRIAS SCHULE"; part of the Trias umbrella brand (Trias OHG).
- VS Möbel partnership shown prominently but not dominating; VS logo only per VS brand guidelines.
- Ginstergelb (RAL 1032) as the single, rare accent.
- Not a furniture webshop, not a classic office outfitter.

## Evidence on Hand

- No real project photography, team photography, product cut-outs or testimonials in the repo yet.
- Temporary placeholder photos (Unsplash licence) are allowed during development and must be listed in `ASSETS.md` for replacement.
- Testimonials, project names/locations/years, client names and any figures must not be fabricated; slots stay visibly marked as open until real, approved material exists.
- Contact: `beratung@trias.it` (from previous site). Phone number unconfirmed.

## Product Principles

1. Show the path, not the product: idea → planning → realisation → people → products → conversation.
2. Real over representative: real projects, real people, real quotes, or an honest empty slot.
3. Personal and local: every section should make it clearer who you will talk to.
4. VS is the toolkit, Trias is the planner.

## Accessibility & Inclusion

Public-sector audience: WCAG 2.1 AA as target, keyboard navigation, visible focus, real form labels, no information conveyed only through motion or colour, full reduced-motion path.
