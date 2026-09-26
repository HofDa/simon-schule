// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

const repository = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const configuredSite = process.env.SITE_URL;
const base =
  process.env.BASE_PATH ??
  (configuredSite ? '/' : isGitHubPagesBuild && repository ? `/${repository}` : '/');
const site =
  configuredSite ??
  (process.env.GITHUB_REPOSITORY_OWNER
    ? `https://${process.env.GITHUB_REPOSITORY_OWNER}.github.io`
    : 'https://trias-schule.it');

// https://astro.build/config
export default defineConfig({
  site,
  base,
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'it'],
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
