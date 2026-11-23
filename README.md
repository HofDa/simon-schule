# Trias Schule

Bilingual landing page for Trias Schule (DE/IT), built with Astro and deployed as a static site to GitHub Pages.

## Local development

Use Node.js 24 LTS (`.nvmrc`) so local development matches GitHub Actions.

```sh
npm ci
npm run dev
```

The live page has no inquiry form (removed in November 2026 at Trias's request). Every "Projekt anfragen" link leads to Simon Brugger's direct line in the contact section: a `tel:` link and a prepared `mailto:` whose subject carries the topic chosen on the page. `PUBLIC_INQUIRY_ENDPOINT` (Formspree) is only read by the older, unpublished page variants and can stay empty.

## Build

```sh
npm run build
npm run preview
```
