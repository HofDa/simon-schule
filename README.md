# Trias Schule

Bilingual landing page for Trias Schule (DE/IT), built with Astro and deployed as a static site to GitHub Pages.

## Local development

Use Node.js 24 LTS (`.nvmrc`) so local development matches GitHub Actions.

```sh
npm ci
npm run dev
```

Create a Formspree form at [formspree.io/create](https://formspree.io/create) and route notifications to `beratung@trias.it`. Copy `.env.example` to `.env` and set `PUBLIC_INQUIRY_ENDPOINT` to the form URL from the Formspree dashboard. Without this value, the site keeps its prepared-email fallback.

The endpoint is public by design because it is embedded in the generated site; do not put account passwords or API keys in this variable. For production, add it as a GitHub Actions repository variable named `PUBLIC_INQUIRY_ENDPOINT` under **Settings → Secrets and variables → Actions → Variables**. The deploy workflow reads that variable during the Astro build. In Formspree, restrict submissions to `trias-schule.it` and verify the recipient address.

Test a submission on both `/` and `/it/`, confirm it appears in Formspree and reaches the notification inbox, and test the failure fallback. The privacy page identifies Formspree when the endpoint is configured; it remains marked as a draft until the business has reviewed the provider and legal wording.

## Build

```sh
npm run build
npm run preview
```
