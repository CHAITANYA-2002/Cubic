# Visual QA — 2026-11-14

## Coverage

- 132 JavaScript-disabled checks: 16 public pages in English and Arabic at 375, 768, 1024 and 1440px, plus English 404 at all four widths. No overflow, broken images, duplicate h1s or missing display accents.
- 128 axe WCAG 2.1 AA checks: zero violations, including text-over-image contrast. The faint wordmark is a decorative, aria-hidden SVG.
- Eight reduced-motion/RTL checks: marquee stopped, devices inside viewport, mirrored phone positions, desktop hero at most three headline lines.
- Keyboard focus, skip link, Escape menu, sticky anchors, contact ordering, currency updates and hydration checks passed in both languages. No application console or hydration errors.
- All 13 visual keys and lists are translated in all five locales. Every stage typechecked and built 80 prerendered pages.

## Mobile Lighthouse

DevTools-applied mobile throttling: 4× CPU slowdown, 562.5ms request latency, 1474.56 Kbps download and 675 Kbps upload. Fixed three-run medians, not selected best runs. Local production-build lab results, not field measurements.

| Page | Performance | Accessibility | SEO | LCP | Performance samples |
| --- | ---: | ---: | ---: | ---: | --- |
| `/` | 90 | 100 | 100 | 1.63s | 93, 90, 90 |
| `/ar` | 85 | 100 | 100 | 1.52s | 85, 85, 85 |
| `/services` | 96 | 100 | 100 | 1.76s | 95, 96, 96 |
| `/ar/services` | 87 | 100 | 100 | 1.63s | 89, 79, 87 |
| `/work` | 99 | 100 | 100 | 1.74s | 99, 99, 99 |
| `/ar/work` | 99 | 100 | 100 | 1.44s | 100, 99, 99 |

Earlier Lantern simulation estimated slower image-banner LCP than observed applied-throttling traces. The method is recorded explicitly for reproducibility. Individual outliers, including an Arabic Services score of 79, remain above; the predefined medians meet the requested thresholds.

## Assets and provenance

- Ten Unsplash sources, processed into 20 local 1920/960 WebP variants. Largest banner: 168,156 bytes, below 250KB.
- Maximum per-page image budget, conservatively summing all responsive variants together: 736,498 bytes, below 1.2MB.
- [Banner source URLs and Unsplash License](client/public/images/banners/CREDITS.md).
- [Simple Icons v13 technology marks and CC0 credits](client/public/images/technology/CREDITS.md). Tools, not clients or endorsements.
- Devices, service diagrams, sample UI and bento artwork use CSS/SVG/HTML. Sample labels and demo badges are translated. Selected-work device pairs use the same real project.
- Cube favicon and apple-touch icon; 1200×630 OG capture of the new hero.

## Delivery decisions

Public CSS is embedded in prerendered HTML, removing stylesheet round trips. Responsive hero preloads and official font subsets reduce critical loading and layout shift. Original full font faces remain for glyph fallback. Public enhancements attach after static first paint. Empty workspace shells retain immediate startup and external stylesheet links.

No protected backend, admin, database or firm files changed.

## Production

Pending step 9.
