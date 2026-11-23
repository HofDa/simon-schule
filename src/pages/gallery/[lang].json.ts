import type { APIRoute, GetStaticPaths } from 'astro';
import { langs, type Lang } from '../../i18n/ui';
import { buildGalleryManifest } from '../../lib/gallery-manifest';

export const getStaticPaths: GetStaticPaths = () =>
  langs.map((lang) => ({ params: { lang } }));

export const GET: APIRoute = async ({ params }) => {
  const lang: Lang = params.lang === 'it' ? 'it' : 'de';
  const manifest = await buildGalleryManifest(lang);
  return new Response(JSON.stringify(manifest), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
