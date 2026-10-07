# Targeted homepage mobile performance pass

Validated locally against the production build on 7 October 2026. These results are local Lighthouse 13.4.1 measurements, not a new Google PageSpeed result for the deployed site. The supplied live baseline (78, FCP 2.9s, LCP 4.6s, TBT 30ms) uses a different environment.

| Local simulated mobile metric | Before | Final |
| --- | ---: | ---: |
| Performance | 81 | 91 |
| FCP | 1.77s | 1.68s |
| LCP | 4.59s | 2.74s |
| TBT | 158ms | 244ms |
| Speed Index | 1.80s | 1.93s |
| CLS | 0.000681 | 0.000681 |

LCP improved substantially; TBT and Speed Index did not improve in the final audit. Startup work and Motion's native scroll initialization remain. No claim is made that the live site's 30ms TBT or desktop score was reproduced by this mobile audit.

The final local **desktop** audit scored **100**, with FCP 0.46s, LCP 0.73s and TBT 27ms. This is a local check, not an update to the supplied live desktop score of 99.

## 1. Actual LCP element

Both a browser `PerformanceObserver` and Lighthouse identified the mobile LCP element as `img.hero-image`, inside the homepage hero. At 390px width, DPR 2, viewport height 844px, its rendered box was **390 × 607.67 CSS pixels**. It uses `object-fit: cover` and `object-position: 48% 54%`.

Before: `/optimized/sa-corte-antiga/hero-sa-corte-antiga-1448.webp`, intrinsic **1448 × 1086**, **357,144 bytes** (348.8 KiB), WebP. The source photograph is `/images/HERO sa corte antiga.jpeg`, also 1448 × 1086, 376,385 bytes. The browser was downloading the WebP, not that JPEG.

After, on the tested 375/390/430px DPR 2 phones: `/optimized/sa-corte-antiga/hero-sa-corte-antiga-1024.avif`, intrinsic **1024 × 768**, **173,661 bytes** (169.6 KiB). At desktop width 1440px the LCP observation was the heading; the desktop hero still uses the original 1448px WebP.

## 2. Hero delivery and size

The phone hero saves **183,483 bytes / 179.2 KiB / 51.4%** compared with the actual previous download. The photograph, aspect ratio, crop, object position, overlay, height and copy styling are retained. No crop-specific image transformation was applied.

The hero remains `loading="eager"`, `fetchpriority="high"`, with `decoding="async"`. The preload and picture source share their `srcset`, `sizes`, format and media rules from `homeImageDelivery.ts`; a production HTML transform embeds the same configuration into the early preload script. The previous homepage preload, which declared only the 1448px candidate, was removed. There was exactly **one hero network request** at every tested width.

Final sizes: `(max-width: 767px) max(100vw, 440px), (max-width: 1024px) 1100px, 100vw`. The minimum is deliberate: the tall cover crop needs more detail than a simple viewport-width calculation suggests. A smaller 768px choice was rejected for narrow retina phones after visual review. Tablets retain their previous effective resolution. AVIF is limited to widths up to 1024px; desktop continues using WebP. Browsers without AVIF support use the WebP `img` source, without fetching an unsupported AVIF preload.

Responsive preloads follow the matching source-set approach described in [web.dev's responsive preload guidance](https://web.dev/articles/preload-responsive-images).

## 3. Image formats and variants added

All added files are derivatives of real existing photographs, generated without changing their crop. Paths below are relative to `frontend/public/optimized/sa-corte-antiga/`.

| Added asset | Dimensions | Bytes |
| --- | --- | ---: |
| `hero-sa-corte-antiga-480.avif` | 480 × 360 | 52,462 |
| `hero-sa-corte-antiga-768.avif` | 768 × 576 | 114,487 |
| `hero-sa-corte-antiga-1024.avif` | 1024 × 768 | 173,661 |
| `hero-sa-corte-antiga-1448.avif` | 1448 × 1086 | 278,929 |
| `hero-sa-corte-antiga-768.webp` | 768 × 576 | 146,998 |
| `hero-sa-corte-antiga-1024.webp` | 1024 × 768 | 227,812 |
| `img-20240113-wa0007-768.webp` | 768 × 576 | 146,758 |
| `img-20240113-wa0009-640.webp` | 640 × 480 | 65,342 |

AVIF quality 75, effort 6; hero WebP quality 88; barbecue WebP quality 90; garden seating WebP quality 78. Originals and existing larger variants remain available. A 1920px hero was not generated because the source is only 1448px wide.

## 4. Exact flagged images and bytes saved

The baseline audit flagged these three images, with combined estimated savings of 461,002 bytes (450.2 KiB). The final audit still estimates 159,770 bytes (156.0 KiB) of possible additional compression; that is an estimate, not a quality requirement.

| Image actually downloaded in mobile Lighthouse | Before | Final | Actual byte reduction |
| --- | ---: | ---: | ---: |
| Hero: 1448px WebP → 1024px AVIF | 357,144 | 173,661 | 183,483 |
| Barbecue: 1280px WebP → existing 640px WebP | 259,432 | 81,908 | 177,524 |
| Garden seating: 640px JPEG → 640px WebP | 73,894 | 65,342 | 8,552 |
| Total | 690,470 | 320,911 | **369,559 / 360.9 KiB** |

The barbecue image rendered about 330 × 247 CSS pixels in Lighthouse's 412px DPR 1.75 viewport, approximately 577 × 433 physical pixels. Its former `90vw` sizes declaration unnecessarily crossed the 640px candidate threshold. The new phone `80vw` declaration matches its layout; tablet uses `calc(100vw - 72px)` and desktop uses `84vw`. A 768px intermediate variant avoids the previous jump from 640 to 1280 on tablets. The garden seating source is only 640 × 480; no artificial upscale was added. Its displayed box in the 390px test was 390 × 292.5 CSS pixels.

Below-the-fold homepage images retain lazy loading, async decoding, and intrinsic width/height metadata. Existing layout reserves their space. Only the three flagged photographs were optimized.

## 5. Render-blocking resources

The exact baseline blocker was `/assets/index-D6zCZ_xh.css`, 10,584 transfer bytes, with a 155ms estimated opportunity. The final stylesheet is `/assets/index-CBdXcy9g.css`, approximately the same size. It remains blocking because it defines the first screen's layout and typography. Deferring it would risk a flash of unstyled content and layout shift; no huge CSS inlining or critical-CSS tooling was introduced.

Google Fonts CSS already uses the `media="print"`/onload strategy, Google Fonts and gstatic preconnects, and `display=swap`. Used font families and weights remain unchanged. No additional synchronous resources or font preloads were added. No claim is made that the 150ms blocking opportunity was eliminated.

## 6. Animation and forced reflow fixes

With a valid availability response, the calendar's unknown → ready class change transitioned all four border colors on each future day. On the test date this reproduced 100 border-color transitions on 25 current-month dates, consistent with the supplied 26-element diagnostic on a different date. The confirmed offending `border-color` transition was replaced with `opacity`; final colors, dimensions and date behavior are unchanged. After readiness, recorded transitions were opacity rather than border colors. Existing user-interaction background/text-color transitions remain.

Motion uses its lighter `m` components with synchronous `LazyMotion`/`domAnimation`, preserving the existing hero parallax, reveals, timings and menu fades. `MotionConfig reducedMotion="user"` and an explicit hero reduced-motion check prevent hero scale/translation when that preference is enabled. [Motion's reduced-motion configuration](https://motion.dev/docs/react-motion-config) documents this behavior.

The header's confirmed duplicate synchronous `getBoundingClientRect()` read was removed; its existing `IntersectionObserver` supplies visibility. Scroll handling remains passive and requestAnimationFrame-throttled.

The dominant baseline reflow was Motion's native `ViewTimeline` initialization (~68.5ms of ~70.6ms total). It remains in the final audit (~136ms of ~138ms in that run). This cost was not claimed as fixed, and the scroll animation system was not rewritten. There were no repeated header geometry reads in the scroll handler.

## 7. Unused JS and long tasks

Gallery, Contact, Why, Garden House and Garden House Gallery now use React route-level lazy imports. Home and its critical content remain eager. Network QA confirmed that secondary route chunks were absent from homepage startup and loaded when navigating to them. Route paths and metadata behavior are unchanged.

The build's entry JS decreased from **465.86 kB / 146.46 kB gzip** to **409.03 kB / 131.24 kB gzip**: roughly **15.2 kB less compressed initial JS**. Lighthouse's estimated unused JS decreased from 74,351 to 58,668 bytes. The combination of route splitting and the smaller Motion feature set avoids unused route and gesture/layout features.

The supplied live report's two tasks cannot be mapped exactly without its trace. The local baseline instead recorded six long tasks: main bundle startup (largest 282ms, others 99/69/65ms), document work (79ms), and unattributable work (114ms). The final audit recorded seven; its largest main-bundle task was 473ms. Trace attribution identifies bundle initialization and native Motion scroll layout work, but does not establish an individual React component as the sole cause. There is no claim that long tasks or TBT improved. Calendar/iCal logic was deliberately preserved.

## 8. Files changed

- `frontend/index.html`: replace mismatched homepage preload with shared responsive configuration.
- `frontend/vite.config.ts`: inject that configuration into development and production HTML.
- `frontend/src/constants/homeImageDelivery.ts` (new): shared hero source and preload definitions.
- `frontend/src/constants/optimizedImages.json`: register focused real-photo variants.
- `frontend/src/pages/Home.tsx`: responsive picture, async decoding, reduced-motion hero transforms, accurate barbecue sizes.
- `frontend/src/components/Header.tsx`: lighter Motion import and remove duplicate layout read.
- `frontend/src/components/Reveal.tsx`: lighter Motion import.
- `frontend/src/main.tsx`: synchronous smaller Motion feature set and reduced-motion preference.
- `frontend/src/App.tsx`: secondary route lazy imports.
- `frontend/src/styles/global.css`: calendar readiness transition property only.
- `frontend/tsconfig.node.json`: type-check the shared build-time image definitions and JSON manifest.
- Eight image assets listed in section 3.
- `PAGESPEED.md`: this report.

No changes to approved text, hero layout styles, SEO metadata, translations, booking URLs, calendar selection code, availability service, iCal parser or backend.

## 9. QA and intentional limits

Passed TypeScript (`npm run typecheck`), production build (`npm run build`), and `node scripts/check-seo.mjs`. Vite emits an advisory about a future native config loader's extension/import-attribute requirements; the current build succeeds.

Browser QA at **375, 390, 430, 768 and 1440px** passed: every homepage image requested and decoded, no broken paths, one hero request, no horizontal overflow, unchanged hero boxes/crops, no grey gutters or observed hero flicker. Each width's measured CLS was identical before/after; the tiny existing font/layout shift remains, rather than claiming exact zero. The 1440px desktop before/after screenshots have identical SHA-256 hashes.

Functional QA passed guest limits 1–6, month controls, available date selection, blocked dates and ranges, unchanged booking links, availability-error handling, English/Italian switching and persistence, mobile menu navigation, browser back, and reduced-motion hero transforms. All six routes passed direct visits, refreshes, metadata checks and language switching; crawler HTML checks also passed. Availability success/error tests used intercepted representative API responses; the live Airbnb feed was not revalidated by these frontend tests.

Intentionally retained: desktop hero, essential blocking CSS, existing typography/font hosting, Motion's native scroll implementation, calendar/backend code, and remaining compression opportunities where a further reduction risks image detail. No synthetic 1920px upscale, blanket image conversion, global animation removal, new dependencies, or deployment was performed.

Local audit JSON, trace, network observations, functional results and screenshots are saved under `C:/Users/freed/AppData/Local/Temp/sa-corte-pagespeed/` (`before-*`, `verified-*`, `functional-qa.json`, `after-animations.json`). A live PageSpeed run after deployment is still needed to compare against the supplied live 78/99 scores.
