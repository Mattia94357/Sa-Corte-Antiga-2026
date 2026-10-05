# Sa Corte Antiga technical SEO report

Implemented for `https://sacorteantiga.com`. This is a source/build optimization pass; no production deployment, Search Console registration or DNS change was performed. Approved public-page copy, layout, spacing, typography, colors, original photographs, booking links, calendar/iCal logic and backend behavior were preserved.

## 1. Files changed

All frontend paths below are relative to `frontend/`:

- `src/seo/metadata.ts` — one source for all English/Italian metadata, canonical URLs, social tags and factual JSON-LD.
- `src/components/Seo.tsx` — synchronize the document head on route/language changes, without duplicate tags.
- `src/components/Layout.tsx` — mount the SEO component.
- `src/i18n/LanguageContext.tsx` — remove the old global description that overwrote route descriptions; retain language persistence and `html lang` updates.
- `index.html` — metadata generation markers, Search Console insertion comment, icon links and corrected homepage hero preload.
- `vite.config.ts` — generate static HTML heads for the existing six routes; make built preview match route-specific Vercel rewrites.
- `tsconfig.node.json` — type-check the shared build metadata without emitting stale JS configuration beside source files.
- `vercel.json` — route-specific HTML rewrites before the preserved SPA fallback. Filesystem assets and the existing API function remain in place.
- `public/robots.txt`, `public/sitemap.xml` — public crawler resources.
- `public/favicon.png`, `public/apple-touch-icon.png` — 32px/180px icons derived from the existing Sa Corte Antiga hero photograph; no new logo was invented. Existing theme color `#f4efe5` remains.
- `src/constants/gardenHouseImages.ts` — six image alt descriptions corrected or made more precise.
- `src/i18n/translations.ts` — corresponding Italian alt text and translations for the new unknown-route error state.
- `src/pages/NotFound.tsx`, `src/App.tsx` — a sensible unknown-route page; existing route paths are unchanged.
- `scripts/check-seo.mjs` — dependency-free checks against actual production build artifacts.
- `SEO.md` (repository root) — this report and Search Console handoff.

## 2. Page titles

| Route | English | Italian |
| --- | --- | --- |
| `/` | Sa Corte Antiga \| Holiday Home in Nebida, Sardinia | Sa Corte Antiga \| Casa vacanze a Nebida, Sardegna |
| `/why-sa-corte-antiga` | Why Sa Corte Antiga \| Nebida, South-West Sardinia | Perché Sa Corte Antiga \| Nebida, Sardegna sud-occidentale |
| `/gallery` | Sa Corte Antiga Gallery \| Nebida, Sardinia | Galleria Sa Corte Antiga \| Nebida, Sardegna |
| `/contact` | Contact Sa Corte Antiga \| Nebida, Sardinia | Contatta Sa Corte Antiga \| Nebida, Sardegna |
| `/garden-house` | Garden House \| Sea-View Stay in Sardinia \| Coming Soon | Garden House \| Soggiorno vista mare in Sardegna \| Prossimamente |
| `/garden-house/gallery` | Garden House Gallery \| Sardinia | Galleria Garden House \| Sardegna |

## 3. Meta descriptions

Each route has a unique description in each language. Exact copy:

| Route | English | Italian |
| --- | --- | --- |
| `/` | Sa Corte Antiga is a quiet holiday home in Nebida, South-West Sardinia, with private outdoor space and easy access to the sea, coastal walks and climbing. | Sa Corte Antiga è una casa vacanze tranquilla a Nebida, nella Sardegna sud-occidentale, con spazi esterni privati e facile accesso al mare, ai sentieri costieri e alle zone di arrampicata. |
| `/why-sa-corte-antiga` | Discover Nebida and South-West Sardinia from Sa Corte Antiga: nearby beaches, coastal walks, Mediterranean landscapes and rock climbing by the sea. | Scopri Nebida e la Sardegna sud-occidentale da Sa Corte Antiga: spiagge vicine, sentieri costieri, paesaggi mediterranei e arrampicata sul mare. |
| `/gallery` | Explore real photographs of Sa Corte Antiga in Nebida, Sardinia: the private garden, shaded terrace, bedrooms, kitchen and indoor living spaces. | Guarda le fotografie di Sa Corte Antiga a Nebida, in Sardegna: il giardino privato, la terrazza ombreggiata, le camere, la cucina e gli spazi interni. |
| `/contact` | Contact Sa Corte Antiga in Nebida, South-West Sardinia. Send your travel dates or questions about the house and planning your stay near the coast. | Contatta Sa Corte Antiga a Nebida, nella Sardegna sud-occidentale. Invia le date del viaggio o le tue domande sulla casa e sul soggiorno vicino alla costa. |
| `/garden-house` | Garden House is a sea-view stay coming soon on the south-west coast of Sardinia. Take a first look at the covered terrace, outdoor spaces and interiors. | Garden House è un soggiorno vista mare in arrivo sulla costa sud-occidentale della Sardegna. Scopri la terrazza coperta, gli spazi esterni e gli interni. |
| `/garden-house/gallery` | Browse real photographs of Garden House in Sardinia: the sea-view veranda, sheltered terrace and interiors of this coming-soon stay. | Guarda le fotografie di Garden House in Sardegna: la veranda vista mare, la terrazza riparata e gli interni di questo soggiorno in arrivo. |

## 4. Canonical strategy and social metadata

Each public route has one self-referencing canonical using only `https://sacorteantiga.com`. The root ends in `/`; other canonical paths have no trailing slash. Query strings and hashes are excluded. Switching language retains the same canonical because the languages share a route.

Open Graph title, description, type (`website`), URL, image, dimensions, image alt, site name and locale are supplied. Twitter/X uses `summary_large_image` with matching title, description, image and image alt. All canonical and social URLs are absolute production URLs.

Sa Corte Antiga routes use the existing real property image `/optimized/sa-corte-antiga/hero-sa-corte-antiga-1448.webp`. Only Garden House routes use `/optimized/garden-house/outsideviewgardenhouse-1086.webp`.

The production build writes `dist/index.html` plus `dist/<route>/index.html` for the other five routes. Each contains English metadata and JSON-LD directly in the HTML head, readable without JavaScript. React updates that head during navigation and language changes. Metadata is not dependent on a social crawler running JavaScript.

## 5. Robots

Source: `frontend/public/robots.txt`. Published path: `/robots.txt`.

```text
User-agent: *
Allow: /

Sitemap: https://sacorteantiga.com/sitemap.xml
```

No public routes, styles, scripts or images are blocked, and no private calendar/API URLs are exposed.

## 6. Sitemap

Source: `frontend/public/sitemap.xml`. Published path: `/sitemap.xml`.

Contains exactly the six requested public production URLs. No API paths, images, preview origins, language URLs or fabricated `lastmod` dates are included. Add any future public route to both the metadata map and sitemap; the build-artifact checker detects drift.

## 7. Structured data

Sa Corte Antiga uses `LodgingBusiness`, linked from the current `WebPage`, `CollectionPage` or `ContactPage` node. It includes the name, primary URL, requested telephone `+39 340 360 6054`, Nebida/Sardegna/IT postal locality, existing real image URLs and the three existing property listings in `sameAs`.

Only schema copies of listing URLs have tracking query parameters removed. Actual booking links are unchanged. No ratings, review counts, prices, street address, coordinates, amenities, awards, offers or availability were invented.

Garden House uses page-level `WebPage`/`CollectionPage` data with the approved coming-soon description. It does not claim an operational lodging business or booking availability.

Every emitted JSON-LD block parsed successfully. `LodgingBusiness` is factual general schema; this implementation does not claim eligibility for Google's VacationRental rich results.

## 8. Image alt text and headings

All meaningful page images already had alt text and explicit dimensions. Decorative booking-platform logos retain empty alt text. Six Garden House gallery descriptions were improved:

- `IMG20260913094650.jpg`: outdoor sink on the terrace.
- `IMG20260913094131.jpg`: television and cabinet in the living room.
- `IMG20250922084809.jpg`: kitchen counter and stove.
- `IMG20250813095341.jpg`: toilet, bidet and sink, correcting the utility-area description.
- `IMG20250730113053.jpg`: washing machine beside the bedroom window.
- `IMG20250730112427.jpg`: double bed, dresser and wardrobe, correcting the veranda description.

Italian equivalents were added. The existing duplicate `IMG20250730112427 (1).jpg` is the same bedroom photo; it remains in place because changing gallery imagery/layout was outside scope.

All six routes have one H1. Section H2s and calendar-month H3s already form a logical hierarchy, so heading markup and visible typography required no changes.

## 9. Language metadata

`html lang` is `en` or `it` according to the current language. Titles, descriptions, social metadata/locale, social image alt and page-schema `inLanguage` update together. The existing local-storage preference still persists. Static crawler HTML defaults to English.

## 10. Hreflang limitation

Both languages share the same URL and are selected in the browser. No fictitious `/it/` route or alternate hreflang mapping was added. Separate crawlable language URLs would be needed for independent language targeting; implementing those would change the requested route structure.

Reference: [Google's localized-page guidance](https://developers.google.com/search/docs/specialty/international/localized-versions).

## 11. Performance SEO

The homepage image preload's srcset now matches the actual hero image srcset. Previously it could preload a smaller variant that the rendered hero did not use, causing an extra download. The preload now also recognizes trailing-slash/case variants of valid hero routes.

Existing eager/high-priority hero loading, lazy below-the-fold images, explicit image dimensions, font preconnects, nonblocking font stylesheet and `display=swap` remain. No image quality, original asset, font or visual stylesheet was changed.

## 12. Validation and remaining limitations

Passed:

```text
cd frontend
npm run typecheck
npm run build
node scripts/check-seo.mjs
```

Built-browser checks passed on all six routes: direct navigation, refresh, English/Italian switching, heading counts, meaningful alt text, dimensions, metadata replacement and canonical consistency. JavaScript-disabled crawler checks passed for route-specific initial HTML. SPA navigation/back, unknown-route recovery, mobile overflow, robots/sitemap/icon delivery and all manifest image paths also passed. There are no source-controlled X-Robots-Tag restrictions or accidental noindex/nofollow directives on public routes.

Remaining limitations:

- Production was not deployed or reachable for live inspection from this environment. DNS/TLS, primary-host redirects, actual production response headers and Vercel route delivery must be verified after deployment. Project/dashboard-level preview or production indexing rules cannot be proven by local source checks.
- The page body remains the existing React SPA and requires JavaScript rendering; only metadata/JSON-LD is emitted statically. Full SSR/body prerendering was not introduced. See [Google's JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).
- Unknown routes now show a translated 404 state and receive runtime `noindex, follow`, no canonical and no structured data. The preserved SPA catch-all still returns HTTP 200 and initially serves the homepage HTML for unknown routes. A true HTTP 404 needs a hosting-level routing change; it is not falsely reported as implemented here.
- English and Italian cannot be independently targeted with hreflang while they share URLs.
- Search indexing, ranking, social cache refresh and rich-result eligibility are not guaranteed by valid metadata/schema.

## 13. Exact Google Search Console next steps

1. Deploy this frontend build to the production Vercel project with root directory `frontend` and output directory `dist`. Retain the existing production environment values and API/calendar configuration.
2. Verify all six HTTPS URLs return the intended pages on direct load and refresh. Inspect their initial HTML for unique metadata and self-referencing canonicals. Verify `/robots.txt`, `/sitemap.xml`, `/favicon.png` and `/apple-touch-icon.png`. Check production headers for unexpected `X-Robots-Tag: noindex` and confirm the primary host is `https://sacorteantiga.com`.
3. In Google Search Console, add a **Domain** property for `sacorteantiga.com`. Copy Google's actual issued TXT record into the DNS provider for the apex domain (usually host/name `@`; follow the provider's conventions). Keep that record in place, then click **Verify** after DNS propagation. No fake token or DNS change was added by this task.
4. Alternative: add a **URL-prefix** property for `https://sacorteantiga.com/`. Put Google's issued `<meta name="google-site-verification" content="REAL_TOKEN_FROM_GOOGLE">` in `frontend/index.html` inside `<head>`, immediately after `<!-- SEO:END -->` at the existing Search Console comment. Keep it outside the generated SEO markers so the build preserves it. Rebuild, deploy and verify. The example is documentation only; no placeholder verification tag is shipped.
5. Open **Sitemaps** for the verified property and submit `https://sacorteantiga.com/sitemap.xml`.
6. Use **URL Inspection** and **Test live URL** on the homepage and the other five routes. Confirm crawl access, rendered content and the declared canonical. Request indexing for the desired public pages once the live checks pass.
7. Monitor **Page indexing** and sitemap processing. Use [Schema.org Validator](https://validator.schema.org/) to inspect the live JSON-LD; Google's Rich Results Test may not offer a dedicated rich result for general LodgingBusiness markup.

Reference: [Google Search Console ownership verification](https://support.google.com/webmasters/answer/9008080).
