import { getImage } from 'astro:assets';
import { collagesFor } from '../data/collages';
import { lernraumCopy } from '../i18n/lernraum';
import type { Lang } from '../i18n/ui';

const groupOf: Record<string, 'gs' | 'ms' | 'kb'> = {
  'gs-gais': 'gs',
  'gs-deflorian-meran': 'gs',
  'gs-sarnthein': 'gs',
  'gs-st-jakob': 'gs',
  'gs-st-martin-gsies': 'gs',
  'gs-riffian': 'gs',
  'gs-sinich': 'gs',
  'ms-lana': 'ms',
  'ms-sterzing': 'ms',
  'musikschule-brixen': 'ms',
  'kiga-tisens': 'kb',
  'bibliothek-terlan': 'kb',
};

export function orderedCollages(lang: Lang) {
  const collages = collagesFor(lang);
  return (['gs', 'ms', 'kb'] as const).flatMap((key) =>
    collages.filter((c) => (groupOf[c.slug] ?? 'gs') === key),
  );
}

export async function buildGalleryManifest(lang: Lang, useAvif = !import.meta.env.DEV) {
  const copy = lernraumCopy(lang);
  const ordered = orderedCollages(lang);

  return Promise.all(
    ordered.map(async (c) => {
      const [projThumb, photos] = await Promise.all([
        getImage({ src: c.collage, width: 320, widths: [160, 320], format: 'webp', quality: 70 }),
        Promise.all(
          c.photos.map(async (p) => {
            const [webp, avif, thumb] = await Promise.all([
              getImage({ src: p.image, widths: [640, 960, 1280, 1600, 2000], format: 'webp', quality: 82 }),
              useAvif ? getImage({ src: p.image, widths: [640, 960, 1280, 1600, 2000], format: 'avif', quality: 55 }) : undefined,
              getImage({ src: p.image, width: 240, widths: [120, 240], format: 'webp', quality: 70 }),
            ]);
            return {
              alt: p.alt,
              ...(p.vs?.length ? { vs: p.vs } : {}),
              src: webp.src,
              w: webp.attributes.width,
              h: webp.attributes.height,
              webp: webp.srcSet.attribute || webp.src,
              ...(avif ? { avif: avif.srcSet.attribute || avif.src } : {}),
              thumb: thumb.src,
              thumbSet: thumb.srcSet.attribute || thumb.src,
            };
          }),
        ),
      ]);
      return {
        slug: c.slug,
        name: c.name,
        credit: c.credit ?? '',
        highlight: copy.projects.referenceHighlights[c.slug] ?? '',
        collage: projThumb.src,
        collageSet: projThumb.srcSet.attribute || projThumb.src,
        photos,
      };
    }),
  );
}
