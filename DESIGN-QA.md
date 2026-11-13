# Public design QA — 2026-11-14

Production build tested in Chrome. Mobile Lighthouse uses its default mobile profile, Pages-style extensionless URLs and gzip. These are local lab results, not field measurements.

- 132 JavaScript-disabled checks: all 16 public pages in English and Arabic at 375, 768, 1024 and 1440px, plus the English 404 at all four widths. No horizontal overflow, missing images, duplicate h1s, missing display accents or competing primary buttons in the checked views.
- 128 axe WCAG 2.1 AA checks: every public page in both languages at all four widths; zero violations, including text contrast. Off-screen rendering was expanded for full-page accessibility and image inspection.
- Keyboard and interaction checks passed in both languages: visible focus, skip link focuses main, menu closes on Escape, five sticky anchors clear the header, direct contacts precede the form on mobile and preserve desktop order, and switching currency changes rate values.
- No application console, uncaught runtime or hydration errors in the targeted checks. Local API 404s from static hosting were excluded; the application correctly uses its defaults.
- 16 currency-formatting comparisons passed across all four currencies. All 12 WebP sources have the requested widths; source image aspect ratios are preserved.
- TypeScript is clean. Every step built successfully with `Prerendered 80 pages across 5 languages.`

## Lighthouse

Final is the initial passing run, or the median of three follow-up runs for a flagged route. Initial failures remain visible below. Both Work pages were measured again after the mobile image and final spacing changes.

| Route | Initial performance | Final performance | Accessibility | SEO |
| --- | ---: | ---: | ---: | ---: |
| `/` | 94 | 94 | 100 | 100 |
| `/ar` | 98 | 98 | 100 | 100 |
| `/services` | 99 | 99 | 100 | 100 |
| `/ar/services` | 95 | 95 | 100 | 100 |
| `/services/web-development` | 99 | 99 | 100 | 100 |
| `/ar/services/web-development` | 100 | 100 | 100 | 100 |
| `/work` | 88 | 98 | 100 | 100 |
| `/ar/work` | 86 | 90 | 100 | 100 |
| `/pricing` | 88 | 91 | 100 | 100 |
| `/ar/pricing` | 94 | 94 | 100 | 100 |
| `/contact` | 91 | 91 | 100 | 100 |
| `/ar/contact` | 100 | 100 | 100 | 100 |
| `/about` | 100 | 100 | 100 | 100 |
| `/ar/about` | 95 | 95 | 100 | 100 |
| `/faq` | 98 | 98 | 100 | 100 |
| `/ar/faq` | 99 | 99 | 100 | 100 |
| `/terms` | 99 | 99 | 100 | 100 |
| `/ar/terms` | 99 | 99 | 100 | 100 |
| `/privacy` | 97 | 97 | 100 | 100 |
| `/ar/privacy` | 94 | 94 | 100 | 100 |
| `/cookies` | 100 | 100 | 100 | 100 |
| `/ar/cookies` | 94 | 94 | 100 | 100 |
| `/services/web-applications` | 100 | 100 | 100 | 100 |
| `/ar/services/web-applications` | 92 | 92 | 100 | 100 |
| `/services/ai-solutions` | 82 | 93 | 100 | 100 |
| `/ar/services/ai-solutions` | 99 | 99 | 100 | 100 |
| `/services/digital-marketing` | 84 | 97 | 100 | 100 |
| `/ar/services/digital-marketing` | 94 | 94 | 100 | 100 |
| `/services/ui-ux-design` | 99 | 99 | 100 | 100 |
| `/ar/services/ui-ux-design` | 98 | 98 | 100 | 100 |
| `/services/maintenance` | 100 | 100 | 100 | 100 |
| `/ar/services/maintenance` | 98 | 98 | 100 | 100 |

Follow-up performance samples:
- `/work`: 98, 98, 98.
- `/ar/work`: 93, 90, 90.
- `/pricing`: 84, 91, 92.
- `/services/ai-solutions`: 93, 99, 93.
- `/services/digital-marketing`: 97, 97, 97.

## Implementation decisions

- Existing governing-English legal policies remain in English with the existing localized language notice. Their copy now lives in `i18n/en`; privacy processor copy reflects self-hosted fonts. All new interface keys have proper translations in all five locales.
- Services without related examples link to the full portfolio at their Work anchor rather than implying a service-specific client build.
- Original JPEGs remain as source assets; the public screenshot component serves WebP, with a 640px mobile source and responsive desktop sources.
- Shared tokens moved to a small imported stylesheet to keep `index.css` below 300 lines. No palette colours were added.
- Public HTML hydrates instead of being replaced; entry motion keeps content visible, and native CSS defers off-screen layout without requiring JavaScript.

## Live deployment

Deployment succeeded via `npm run deploy` to Cloudflare Pages project `cubictech`. Deployed application revision: `a4ed1cc`; deployment: https://15640560.cubictech.pages.dev.

| Production route | HTTP | New design and current CSS |
| --- | ---: | --- |
| `/` | 200 | Confirmed |
| `/ar` | 200 | Confirmed |
| `/pricing` | 200 | Confirmed |
| `/work` | 200 | Confirmed |
| `/contact` | 200 | Confirmed |

Current stylesheet: `/assets/index-BVhk-kO9.css`. Font CSS and both screenshot sizes also returned 200.

Production browser checks passed in English and Arabic: keyboard focus, skip link, sticky anchors, mobile/desktop contact order, currency updates, and no application console or hydration errors.

The application commit is pushed to `origin/feat/cubic-os`. Final TypeScript and 80-page build checks also passed after deployment.

No unresolved acceptance failures in the requested local checks.
