# Homepage LCP-only pass

7 October 2026. This pass changes only homepage preload discovery. No image, component, animation, style, calendar, language, SEO, route or backend code was changed. Results are local production-build measurements, not a new result for the live site (supplied baseline: approximately 84 / LCP 3.6s).

## 1. Exact LCP element

Browser PerformanceObserver and Lighthouse confirm the mobile LCP element remains **`main > section.hero > picture > img.hero-image`**.

- Selected source: `/optimized/sa-corte-antiga/hero-sa-corte-antiga-phone-640.avif`.
- Intrinsic file dimensions: **640 × 753 pixels**.
- Format: **AVIF**, response MIME `image/avif`.
- At 390px/DPR 2: rendered **390 × 607.67 CSS pixels**.
- At 430px/DPR 2: rendered **430 × 607.67 CSS pixels**.
- Lighthouse's 412px/DPR 1.75 viewport also selects this source and identifies the hero as LCP.

## 2. Candidate before/after

**640px phone AVIF → same 640px phone AVIF.** Dedicated 480/640 variants were already present and correctly selected; the suspected unnecessary 1024px phone download was not reproduced.

The phone picture source uses 480/640 width candidates, `sizes="100vw"`, and `(max-width: 480px)`. WebP fallback, larger-screen candidates, eager loading, high fetch priority and async decoding are unchanged. No stronger compression or smaller image was introduced.

## 3. Transferred bytes before/after

Lighthouse network transfer: **129,617 → 129,617 bytes**. Encoded image body: **129,347 → 129,347 bytes** (126.3 KiB). Browser Resource Timing reports 129,647 bytes including its header accounting. There is no byte-saving claim for this pass.

## 4. Exact preload matching and discovery change

The previous preload was already using the correct responsive candidate rules, but an inline script created its link elements. The new preload links appear directly in the initial HTML immediately after the viewport meta tag, where the HTML preload scanner can discover them without executing JavaScript.

Both initial HTML and the React picture continue using the shared `homeHeroPreloads` / `homeHeroSources` definitions. Media, format, `imagesrcset` and `imagesizes` match exactly. Tests at 375/390/430/768/1440px confirmed one hero request and CDP priority **High**.

With JavaScript disabled, the browser still fetched exactly the correct hero asset even though React had not rendered an image. That directly verifies discovery does not depend on application startup, language state or animation initialization. Generated documents for the five other public routes do not inherit the homepage preload; their existing behavior remains.

## 5. Animation and paint audit

The image starts at opacity 1, has no opacity reveal, CSS animation, blur or filter, and is eager. Existing mobile CSS suppresses image scale transforms. The shade uses the existing static gradients; no measurable evidence justified changing their appearance. Header backdrop blur applies in its scrolled state, not the initial top-of-page state.

No hero animation was removed. React still creates the visible hero DOM after the main application module executes. The local trace showed the image completing before it was painted: observed element render delay was approximately 198ms before and 278ms after. These are trace timings, separate from simulated mobile Lighthouse timings. Motion's native scroll initialization remains part of startup, but the image is not deliberately hidden waiting for that animation. No individual startup operation is asserted to explain all render delay.

An equivalent three-point scroll range was also tested to avoid native ViewTimeline initialization. Motion output matched the original at all five widths and four scroll positions, but forced layout moved into the existing scroll tracker instead of disappearing (approximately 97ms in that trial); LCP was 2.85s. The experiment was reverted. The existing scroll animation implementation is retained, and those trial results are not the final build's results.

## 6. Competing requests

No competing request was deprioritized. Only the homepage hero image has an explicit `fetchpriority="high"` on the homepage. Essential application JS, first-screen CSS and fonts retain browser-assigned priorities because delaying those can also delay paint.

Availability remains absent from initial network work. Below-the-fold imagery retains lazy loading; in the observed local trace these image requests started after the hero transfer completed. There was no stale or duplicate homepage hero request. The stylesheet and font configuration were left unchanged.

## 7. Files changed

- `frontend/index.html`: static responsive-preload insertion block; remove JavaScript creation of homepage preload links. Existing language setup and other pages' preload behavior remain.
- `frontend/vite.config.ts`: generate responsive HTML links from the shared hero configuration and remove that block from other public route documents.
- `LCP-REPORT.md`: this report.

The generated main JS and CSS asset hashes are identical before/after. No image assets were changed or added.

## 8. Local Lighthouse results and QA

| Local simulated mobile metric | Before | After |
| --- | ---: | ---: |
| LCP | 2.49s | **2.58s** |
| FCP | 1.62s | 1.67s |
| Performance | 96 | 94 |
| TBT | 92ms | 171ms |
| CLS | 0.000681 | 0.000681 |

This pair of runs **does not demonstrate an LCP improvement**. The verified benefit is parser-native discovery without a JavaScript dependency. Local LCP is within the requested 2.5–3.0s range, but that must not be treated as a new live PageSpeed result or evidence that the production 3.6s has improved.

QA passed at **375, 390, 430, 768 and 1440px**:

- Identical before/after screenshot hashes at every width: no visual regression or image-quality change.
- Identical hero dimensions, object position and measured CLS; no grey gutter, horizontal overflow or observed flicker.
- One critical hero request, exact preload/source matching, no broken hero path.
- Parser-only discovery with JavaScript disabled.
- All six routes: direct visits, refreshes, EN/IT switching, canonical/metadata consistency and no-JavaScript crawler metadata checks.
- All existing image-manifest paths verified.
- `npm run typecheck`, `npm run build`, `node scripts/check-seo.mjs` and `git diff --check` passed.

Vite still emits its existing advisory about future native-config import requirements; the current build succeeds.

Evidence is under `C:/Users/freed/AppData/Local/Temp/sa-corte-pagespeed/`: `lcp-before-*`, `lcp-after-*`, and `lcp-preload-qa.json`. [Final 390px screenshot](C:/Users/freed/AppData/Local/Temp/sa-corte-pagespeed/lcp-after-390.png).

## 9. Further optimization limits

No additional low-risk source-selection or preload mismatch was found. The image itself is visible as soon as its React DOM exists. More compression/downscaling risks detail; a substantial reduction in startup-to-paint delay would likely require rendering the initial hero DOM in the HTML, changing application startup, or investigating production hosting/network timing. Those changes introduce architectural work beyond this LCP-only pass.

No deployment was performed. A live PageSpeed rerun after deployment is still needed to establish production impact.
