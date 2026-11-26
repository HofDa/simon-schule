import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const DIST = path.resolve('dist');

const readDist = (relPath) => fs.readFileSync(path.join(DIST, relPath), 'utf8');

function extractJsonLd(html) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
  assert.ok(match, 'JSON-LD script tag is present');
  return JSON.parse(match[1]);
}

function collectIdRefs(node, refs = new Set()) {
  if (!node || typeof node !== 'object') return refs;
  if (Array.isArray(node)) {
    for (const item of node) collectIdRefs(item, refs);
    return refs;
  }
  const keys = Object.keys(node);
  if (keys.length === 1 && keys[0] === '@id' && typeof node['@id'] === 'string') {
    refs.add(node['@id']);
    return refs;
  }
  for (const [k, v] of Object.entries(node)) {
    if (k !== '@id') collectIdRefs(v, refs);
  }
  return refs;
}

const homepages = [
  { file: 'index.html', lang: 'de', url: 'https://trias-schule.it/', h1: 'Lernräume für Südtirol' },
  { file: 'it/index.html', lang: 'it', url: 'https://trias-schule.it/it/', h1: 'Spazi per imparare in Alto Adige' },
];

const legalPages = [
  { file: 'impressum/index.html', url: 'https://trias-schule.it/impressum/' },
  { file: 'datenschutz/index.html', url: 'https://trias-schule.it/datenschutz/' },
  { file: 'it/note-legali/index.html', url: 'https://trias-schule.it/it/note-legali/' },
  { file: 'it/privacy/index.html', url: 'https://trias-schule.it/it/privacy/' },
];

for (const page of homepages) {
  test(`Homepage (${page.file}) has complete SEO/GEO head metadata and clean H1`, () => {
    const html = readDist(page.file);
    assert.match(
      html,
      /<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/,
    );
    assert.ok(html.includes(`<link rel="canonical" href="${page.url}"`));
    assert.ok(html.includes('<link rel="alternate" hreflang="de-IT" href="https://trias-schule.it/"'));
    assert.ok(html.includes('<link rel="alternate" hreflang="de" href="https://trias-schule.it/"'));
    assert.ok(html.includes('<link rel="alternate" hreflang="it-IT" href="https://trias-schule.it/it/"'));
    assert.ok(html.includes('<link rel="alternate" hreflang="it" href="https://trias-schule.it/it/"'));
    assert.ok(html.includes('<link rel="alternate" hreflang="x-default" href="https://trias-schule.it/"'));
    assert.ok(html.includes('<link rel="sitemap" type="application/xml" href="https://trias-schule.it/sitemap.xml"'));
    assert.ok(html.includes('<link rel="alternate" type="text/plain" href="https://trias-schule.it/llms.txt"'));
    assert.ok(html.includes('<link rel="alternate" type="text/plain" href="https://trias-schule.it/llms-full.txt"'));
    assert.ok(html.includes('<link rel="icon" type="image/png" sizes="48x48"'));
    assert.ok(html.includes('<link rel="apple-touch-icon" sizes="180x180"'));
    assert.ok(html.includes('<link rel="manifest"'));
    assert.ok(html.includes('<meta name="geo.region" content="IT-BZ"'));
    assert.ok(html.includes('<meta property="og:image:secure_url"'));

    const h1Match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
    assert.ok(h1Match, 'single H1 is present');
    const h1Text = h1Match[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    assert.equal(h1Text, page.h1, 'H1 text preserves whitespace across <br>');
  });

  test(`Homepage (${page.file}) JSON-LD @graph is connected, accurate, and speakable selectors exist`, () => {
    const html = readDist(page.file);
    const ld = extractJsonLd(html);
    assert.equal(ld['@context'], 'https://schema.org');
    const graph = ld['@graph'];
    assert.ok(Array.isArray(graph) && graph.length >= 10, 'rich entity graph emitted');

    const definedIds = new Set(graph.map((node) => node['@id']).filter(Boolean));
    const referencedIds = collectIdRefs(graph);
    for (const ref of referencedIds) {
      assert.ok(definedIds.has(ref), `JSON-LD @id reference ${ref} resolves within @graph`);
    }

    const org = graph.find((n) => n['@type'] === 'Organization');
    assert.ok(org, 'Organization node present');
    assert.equal(org.logo.width, 1200);
    assert.equal(org.logo.height, 262);
    assert.ok(org.description && org.description.includes('234'));

    const service = graph.find((n) => n['@type'] === 'Service');
    assert.ok(service, 'Service node present');
    assert.equal(service.serviceType.length, 5);
    if (page.lang === 'de') {
      assert.ok(service.serviceType.includes('Beratung vor Ort'));
      assert.ok(service.serviceType.includes('VS Möbel & mehr'));
    } else {
      assert.ok(service.serviceType.includes('Consulenza sul posto'));
      assert.ok(service.serviceType.includes('VS Möbel e altro'));
    }

    const webpage = graph.find((n) => n['@type'] === 'WebPage');
    assert.ok(webpage?.speakable?.cssSelector?.length >= 6);
    // Verify every ID and class targeted by SpeakableSpecification actually exists in the built HTML
    for (const selector of webpage.speakable.cssSelector) {
      const idMatch = selector.match(/#([a-z0-9-]+)/i);
      if (idMatch) {
        assert.ok(
          html.includes(`id="${idMatch[1]}"`),
          `speakable selector ${selector} references existing id="${idMatch[1]}"`,
        );
      }
      const classMatch = selector.match(/\.([a-z0-9-]+)/i);
      if (classMatch) {
        assert.match(
          html,
          new RegExp(`class="[^"]*\\b${classMatch[1]}\\b`),
          `speakable selector ${selector} references existing class="${classMatch[1]}"`,
        );
      }
    }

    const projects = graph.find((n) => n['@id']?.endsWith('#reference-projects'));
    assert.equal(projects?.numberOfItems, 12);
    for (const entry of projects.itemListElement) {
      const imageUrl = new URL(entry.item.image);
      assert.ok(fs.existsSync(path.join(DIST, imageUrl.pathname)), `project image exists: ${imageUrl.pathname}`);
      assert.ok(!entry.item.description.startsWith('Collage '), 'project description omits raw Collage prefix');
    }

    const scenes = graph.find((n) => n['@id']?.endsWith('#learning-environments'));
    assert.equal(scenes?.numberOfItems, 8);
  });
}

for (const page of legalPages) {
  test(`Legal page (${page.file}) has canonical, reciprocal hreflang, and valid JSON-LD`, () => {
    const html = readDist(page.file);
    assert.ok(html.includes(`<link rel="canonical" href="${page.url}"`));
    assert.ok(html.includes('hreflang="de-IT"'));
    assert.ok(html.includes('hreflang="de"'));
    assert.ok(html.includes('hreflang="it-IT"'));
    assert.ok(html.includes('hreflang="it"'));
    assert.ok(html.includes('hreflang="x-default"'));
    const ld = extractJsonLd(html);
    const definedIds = new Set(ld['@graph'].map((n) => n['@id']).filter(Boolean));
    for (const ref of collectIdRefs(ld['@graph'])) {
      assert.ok(definedIds.has(ref), `Legal JSON-LD @id reference ${ref} resolves`);
    }
  });
}

test('Legacy /lernraum/ redirect uses noindex, follow and canonical to /', () => {
  const html = readDist('lernraum/index.html');
  assert.ok(html.includes('<meta name="robots" content="noindex, follow"'));
  assert.ok(html.includes('<link rel="canonical" href="https://trias-schule.it/"'));
});

test('sitemap.xml has valid hreflangs, no deprecated image tags, and all image files exist', () => {
  const xml = readDist('sitemap.xml');
  assert.ok(!xml.includes('<image:title>'), 'deprecated <image:title> removed');
  assert.ok(!xml.includes('<image:caption>'), 'deprecated <image:caption> removed');
  assert.ok(!xml.includes('<image:geo_location>'), 'deprecated <image:geo_location> removed');
  assert.ok(xml.includes('hreflang="de-IT"'));
  assert.ok(xml.includes('hreflang="de"'));
  assert.ok(xml.includes('hreflang="it-IT"'));
  assert.ok(xml.includes('hreflang="it"'));
  assert.ok(xml.includes('hreflang="x-default"'));

  const imageLocs = [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((m) => m[1]);
  assert.ok(imageLocs.length >= 28, 'both DE and IT homepages include image entries');
  for (const loc of new Set(imageLocs)) {
    const pathname = new URL(loc).pathname;
    assert.ok(fs.existsSync(path.join(DIST, pathname)), `sitemap image exists on disk: ${pathname}`);
  }
});

test('robots.txt allows major search & AI crawlers and declares sitemap', () => {
  const txt = readDist('robots.txt');
  for (const bot of ['OAI-SearchBot', 'ChatGPT-User', 'GPTBot', 'PerplexityBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', '*']) {
    assert.ok(txt.includes(`User-agent: ${bot}\nAllow: /`), `${bot} is explicitly allowed`);
  }
  assert.ok(txt.includes('Sitemap: https://trias-schule.it/sitemap.xml'));
});

test('llms.txt and llms-full.txt reflect live multi-brand positioning, services, and catalog', () => {
  for (const file of ['llms.txt', 'llms-full.txt']) {
    const text = readDist(file);
    assert.ok(text.includes('Beratung vor Ort'), `${file} uses live services`);
    assert.ok(text.includes('VS Möbel & mehr'), `${file} includes multi-brand service`);
    assert.ok(text.includes('HOUSE70'), `${file} mentions HOUSE70 Brixen`);
    assert.ok(text.includes('234'), `${file} includes verified 234-facility track record`);
    assert.ok(text.includes('JUMPER'), `${file} includes VS JUMPER`);
    assert.ok(text.includes('45-057-49_V2026-01_DE_Basics'), `${file} links VS School Catalog 2026 PDF`);
    assert.ok(!text.includes('Collage Grundschule Gais:'), `${file} avoids raw Collage alt prefix`);
    assert.match(text, /Last updated: \d{4}-\d{2}-\d{2}/);
  }
});

test('site.webmanifest is valid JSON and all icon files exist', () => {
  const manifest = JSON.parse(readDist('site.webmanifest'));
  assert.equal(manifest.name, 'Trias Schule');
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 3);
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(DIST, icon.src.replace(/^\//, ''))), `manifest icon exists: ${icon.src}`);
  }
});
