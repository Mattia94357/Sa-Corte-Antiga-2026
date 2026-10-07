# Final targeted production-build PageSpeed pass

7 October 2026. Changes are local and have not been deployed. The supplied live mobile baseline is 81 / FCP 2.9s / LCP 3.8s / TBT 0ms / CLS 0. The measurements below use the local production build and Lighthouse 13.4.1, so they are not replacement Google PageSpeed scores.

## 1. Phone hero candidate before and after

Before, the tested 375/390/430px DPR 2 phones selected `hero-sa-corte-antiga-1024.avif` (1024 × 768). After, they select `hero-sa-corte-antiga-phone-640.avif` (640 × 753). Lighthouse's 412px DPR 1.75 viewport also selects the new 640px asset.

The dedicated phone source uses `sizes="100vw"` and 480/640 width candidates. Its preload receives exactly the same media, format, sizes and source-set configuration. There was one hero request at every required QA width. Eager loading, high fetch priority and async decoding remain.

The phone files trim horizontally invisible pixels from the existing photograph: source rectangle x=252, y=0, width=923, height=1086. This preserves the original 48% horizontal object position because `(1448 - 923) × .48 = 252`. The remaining rectangle still covers by height throughout the <=480px source's supported range. Full-height detail is retained: the new 640px file has 753 vertical pixels versus the previous 768. Encoder quality remains AVIF 75, rather than increasing compression to chase a score.

The displayed crop, 48% 54% object position, overlay, text, height and layout are unchanged. Tablet and desktop sources remain unchanged. Mobile WebP fallback variants use the same source rectangle. Larger screens keep the existing full photograph.

## 2. Hero bytes

| Phone hero | Before | After | Saved |
| --- | ---: | ---: | ---: |
| Actual downloaded AVIF | 173,661 bytes / 169.6 KiB | 129,347 bytes / 126.3 KiB | **44,314 bytes / 43.3 KiB / 25.5%** |

Added derivatives under `frontend/public/optimized/sa-corte-antiga/`:

| Asset | Dimensions | Bytes |
| --- | --- | ---: |
| `hero-sa-corte-antiga-phone-480.avif` | 480 × 565 | 85,492 |
| `hero-sa-corte-antiga-phone-640.avif` | 640 × 753 | 129,347 |
| `hero-sa-corte-antiga-phone-480.webp` | 480 × 565 | 105,664 |
| `hero-sa-corte-antiga-phone-640.webp` | 640 × 753 | 168,938 |

## 3. Availability removed from critical startup

Yes. The baseline Lighthouse network log included `/api/availability`; the final initial-load log contains no availability request. At each required QA width, a one-second startup check recorded zero requests before the calendar was approached. Local baseline availability returned a proxy 502, so these timings do not reproduce the live API's 2.1 seconds. Functional API success/error behavior was tested with representative intercepted responses.

## 4. Deferred calendar loading

The calendar observes its existing shell with `IntersectionObserver`, `rootMargin: '800px 0px'`, threshold 0. The first intersection disconnects the observer and starts the existing availability service. A ref holds the promise to avoid duplicate requests when effects are reattached. Scrolling away/back and switching language do not refetch; navigating away and mounting a new calendar can start a new request.

The state stays `loading` until the real response resolves, preserving disabled unknown dates. Existing blocked-range expansion, safe range selection, guest limits and error handling are unchanged. Held-response tests confirmed zero selectable dates before resolution and correct blocked dates afterward. The request began while the shell was still outside the visible viewport. The 800px lead normally provides preparation time, but a rapid jump or slow API can still show the existing safe loading state; completion before arrival is not guaranteed.

## 5. CSS retained intentionally

The only local render-blocking resource was `/assets/index-CBdXcy9g.css`, 10,582 transfer bytes, with an estimated 181ms before / 154ms after opportunity. Its contents and loading configuration are unchanged. The live estimate supplied by the user is approximately 11.9 KiB / 320ms.

Google Fonts CSS already loads through `media="print"` plus onload, uses `display=swap`, and has Google Fonts/gstatic preconnects. There is no unused external stylesheet or incorrect duplicate CSS preload to remove. The small main stylesheet defines first-screen layout and typography. Deferring it or adding a critical-CSS system would introduce disproportionate complexity and unstyled-content/layout-shift risk. No font, typography or stylesheet changes were made.

## 6. Additional image delivery

The exact other images flagged in the local before/after Lighthouse audits were the barbecue 640px WebP (81,908 bytes) and garden seating 640px WebP (65,342 bytes). Both already select appropriate existing mobile dimensions. Conservative AVIF trials were larger (87,123 and 69,209 bytes), so they were discarded and no secondary image changes were kept.

Additional secondary image savings: **0 bytes**. Total actual image savings in this final pass: **44,314 bytes**, all from the hero. The local image-delivery estimate falls from 159,770 to 118,155 bytes; further compression was intentionally left to preserve detail. The user's live 213 KiB estimate is not treated as an achieved byte reduction.

## 7. Forced reflow and unused JS

Confirmed dominant reflow source: Motion's native `new ViewTimeline(...)` during `useScroll` initialization, identified from the audit's source location in the built bundle. The local total was about 78ms before / 72ms after; the supplied live value is about 47ms. No reflow code was changed and the measured difference is not claimed as a fix. Removing this cost would require changing the established scroll animation implementation.

Secondary routes are already lazily loaded and Motion already uses the smaller feature set from the previous pass. No obvious unused import justified another JS change. Initial JS changes only by the small observer/source configuration overhead (131.24 → 131.43 kB gzip). No animation, routing or large React refactor was performed.

## 8. Files changed in this pass

- `frontend/src/components/Calendar.tsx`: viewport-triggered loading and one stored request.
- `frontend/src/constants/homeImageDelivery.ts`: dedicated phone picture sources and matching preload.
- `frontend/src/pages/Home.tsx`: render the shared source list.
- Four phone hero image files listed above.
- `PAGESPEED-FINAL.md`: this report.

No backend, iCal parser, booking links, approved text, CSS, fonts, translations, SEO or route changes.

## 9. Updated local Lighthouse and QA

| Local mobile metric | Immediately before this pass | After |
| --- | ---: | ---: |
| Performance | 93 | 93 |
| FCP | 1.70s | 1.64s |
| LCP | 2.69s | 2.91s |
| TBT | 183ms | 141ms |
| Speed Index | 2.10s | 1.83s |
| CLS | 0.000681 | 0.000681 |

The score stayed at 93. FCP, TBT and Speed Index improved in this pair of local runs; LCP did not. No claim is made that the live site has reached 90+, or that the supplied live 0ms TBT was reproduced locally. The final local desktop audit scored **100**, FCP 0.40s, LCP 0.70s, TBT 14ms.

QA passed at **375, 390, 430, 768 and 1440px**: real image decoding, no broken paths, one hero request, no horizontal overflow, unchanged hero box/object position, unchanged measured CLS, and no observed flicker. Mobile before/after screenshots were visually compared for composition and sharpness. The desktop before/after screenshots are pixel-identical (same SHA-256).

Functional checks passed calendar prefetch timing, disabled dates during a held response, one request across repeated scrolling/language changes, blocked dates and ranges, available date selection, month controls, guest limits 1–6, error handling, unchanged booking links, English/Italian switching and persistence, mobile navigation, and reduced-motion behavior. All six routes passed direct visits, refreshes, language/SEO checks and no-JavaScript metadata checks.

Passed `npm run typecheck`, `npm run build`, `node scripts/check-seo.mjs`, and `git diff --check`. Vite retains its existing advisory about future native-config import requirements; the current build succeeds.

Evidence: `C:/Users/freed/AppData/Local/Temp/sa-corte-pagespeed/production-before-*`, `production-after-*`, `production-functional-qa.json`, and `desktop-lighthouse.json`. [Final mobile screenshot](C:/Users/freed/AppData/Local/Temp/sa-corte-pagespeed/production-after-390.png).

A deployed Google PageSpeed rerun is still needed to measure the effect against the supplied live baseline.
