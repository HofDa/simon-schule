import type { APIRoute } from 'astro';
import { asset, homeFor } from '../lib/paths';

export const GET: APIRoute = () => {
  const manifest = {
    name: 'Trias Schule',
    short_name: 'Trias Schule',
    description:
      'Schulen & Kindergärten einrichten in Südtirol: Beratung, Planung & Montage mit VS Möbel und weiteren Herstellern.',
    start_url: homeFor('de'),
    scope: asset(''),
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#20201d',
    lang: 'de-IT',
    icons: [
      {
        src: asset('favicon.svg'),
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: asset('favicon-48x48.png'),
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: asset('favicon-192x192.png'),
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: asset('apple-touch-icon.png'),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };

  return new Response(`${JSON.stringify(manifest, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
