import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const origin = 'https://sacorteantiga.com';
const routes = ['/', '/why-sa-corte-antiga', '/gallery', '/contact', '/garden-house', '/garden-house/gallery'];
const titles = new Set(), descriptions = new Set();
const configuration = JSON.parse(await readFile(resolve(root, 'vercel.json'), 'utf8'));
for (const route of routes) {
  const file = route === '/' ? 'index.html' : `${route.slice(1)}/index.html`;
  const html = await readFile(resolve(root, 'dist', file), 'utf8');
  const tag = (attribute, value) => {
    const matches = [...html.matchAll(new RegExp(`<meta ${attribute}="${value}" content="([^"]*)"`, 'g'))];
    assert.equal(matches.length, 1, `${route}: exactly one ${value}`);
    return matches[0][1];
  };
  const titleTags = [...html.matchAll(/<title>(.*?)<\/title>/g)];
  assert.equal(titleTags.length, 1, `${route}: exactly one title`);
  const title = titleTags[0][1];
  const description = tag('name', 'description');
  assert(!titles.has(title), `${route}: unique title`);
  assert(!descriptions.has(description), `${route}: unique description`);
  titles.add(title); descriptions.add(description);
  const canonicalTags = [...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)];
  assert.equal(canonicalTags.length, 1, `${route}: exactly one canonical`);
  assert.equal(canonicalTags[0][1], origin + route);
  assert.equal(tag('property', 'og:url'), origin + route);
  assert.equal(tag('property', 'og:title'), title);
  assert.equal(tag('property', 'og:description'), description);
  assert.equal(tag('name', 'twitter:title'), title);
  assert.equal(tag('name', 'twitter:description'), description);
  assert.equal(tag('name', 'twitter:card'), 'summary_large_image');
  assert(!/noindex|nofollow/.test(tag('name', 'robots')));
  assert(!/localhost|127\.0\.0\.1|\.vercel\.app|hreflang=/i.test(html));
  assert.equal(tag('property', 'og:type'), 'website');
  assert.equal(tag('property', 'og:site_name'), route.startsWith('/garden-house') ? 'Garden House' : 'Sa Corte Antiga');
  for (const image of [tag('property', 'og:image'), tag('name', 'twitter:image')]) {
    const url = new URL(image);
    assert.equal(url.origin, origin);
    await access(resolve(root, 'dist', decodeURI(url.pathname.slice(1))));
    if (!route.startsWith('/garden-house')) assert(!image.includes('garden-house'));
  }
  const schemaTags = [...html.matchAll(/<script id="seo-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.equal(schemaTags.length, 1, `${route}: exactly one JSON-LD graph`);
  const schema = JSON.parse(schemaTags[0][1]);
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@graph'][0].url, origin + route);
  assert.equal(schema['@graph'][0].inLanguage, 'en');
  const lodging = schema['@graph'].find(node => node['@type'] === 'LodgingBusiness');
  if (route.startsWith('/garden-house')) assert(!lodging);
  else {
    assert.equal(lodging.telephone, '+39 340 360 6054');
    assert.equal(lodging.address.addressLocality, 'Nebida');
    assert.equal(lodging.sameAs.length, 3);
    for (const field of ['aggregateRating', 'review', 'starRating', 'priceRange', 'geo', 'offers', 'amenityFeature', 'award']) assert(!(field in lodging));
  }
  if (route !== '/') assert(configuration.rewrites.some(rule => rule.source === route && rule.destination === `/${file}`));
}
const robots = await readFile(resolve(root, 'dist/robots.txt'), 'utf8');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert.match(robots, /Sitemap: https:\/\/sacorteantiga\.com\/sitemap\.xml/);
assert(!/Disallow:|\/api\/|ical/i.test(robots));
const sitemap = await readFile(resolve(root, 'dist/sitemap.xml'), 'utf8');
assert.match(sitemap, /xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]).sort(), routes.map(route => origin + route).sort());
assert(!/<lastmod>|\/api\/|localhost|vercel\.app/.test(sitemap));
await access(resolve(root, 'dist/favicon.png'));
await access(resolve(root, 'dist/apple-touch-icon.png'));
assert(configuration.rewrites.some(rule => rule.source === '/(.*)' && rule.destination === '/index.html'));
console.log('SEO checks passed: all 6 production HTML heads, unique metadata, canonicals, social images, JSON-LD, robots, sitemap, icons and Vercel route mappings.');
