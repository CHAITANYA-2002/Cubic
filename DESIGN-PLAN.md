# CubicTech — Design Plan (for the implementing agent)

Goal: the public site must read as a **serious, technically excellent studio** — calm, premium,
consistent. Nothing should look "weird": no visual gimmicks, no element that draws attention to
itself instead of the content. Think *Linear, Vercel, Stripe Press, Basement Studio* restraint,
with CubicTech's own identity (near-black + warm gold + editorial serif).

Read before touching code: `HANDOFF.md`, `CLAUDE.md`/`AGENTS.md`, `client/src/index.css`,
`client/src/components/site/*`, `client/src/i18n/en/*`.

---

## 0. Hard constraints (do not break)

1. **All copy lives in `client/src/i18n/<locale>/*.ts`.** Never hard-code visible text in a
   component. If you add a key to `en`, add it to `hi`, `ar`, `de`, `fr` too (TypeScript fails
   otherwise). Translate properly; keep brand names in Latin script.
2. **Pages are prerendered** (`npm run build` → `script/prerender.ts`). Components must render on
   the server: no `window`/`document`/`localStorage` at render time (only inside `useEffect`),
   and content must be visible without JavaScript (no `opacity: 0` initial states that rely on JS).
3. **Arabic is RTL.** Use logical utilities (`ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`,
   `text-start`), never `left`/`right`/`ml`/`mr` for layout. Directional icons get `rtl:rotate-180`.
4. **No fabricated proof.** No fake logos, testimonials, client names, metrics, team photos, star
   ratings or "trusted by" strips. Testimonials come only from admin (`site.testimonials`).
   Product demos stay labelled as demos (`KindBadge`).
5. **Prices come only from `useOfferPrice` / `OfferPrice`** (admin-editable, multi-currency).
   Never type a price into copy.
6. Keep: accessibility (labels, focus rings, `aria-*`, 44px tap targets, AA contrast),
   no `console.log`, files under ~300 lines, `npx tsc --noEmit` clean, `npm run build` green.
7. Do not add heavy libraries (three.js, GSAP, Lottie, particle libs). framer-motion is allowed
   only in `/admin`. Public motion = CSS only.

---

## 1. Design principles

| Principle | What it means in practice |
|---|---|
| **Restraint** | One accent colour (gold), used sparingly: CTAs, eyebrow labels, one italic phrase per headline, small icons. Never gold body text or gold backgrounds on large areas. |
| **Hierarchy first** | Every section = eyebrow → headline → one-line lead → content → (optional) one action. Never two primary buttons side by side. |
| **Rhythm** | Same vertical spacing between all sections; same card radius, padding and border everywhere. |
| **Proof over decoration** | The visuals are real screenshots of live work, real prices, real process. Decoration is limited to the subtle grid and glow. |
| **Quiet motion** | Content fades up once on load (`.reveal`). Hover = border colour + 2px lift. Nothing loops, spins, follows the cursor or parallaxes. |

---

## 2. Design tokens (already in `client/src/index.css` — refine, don't replace)

**Colour**

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#0a0a0b` | page background |
| `--bg-subtle` | `#0e0e11` | alternating sections (`.section-subtle`) |
| `--surface` / `--surface-2` | `#131317` / `#19191e` | cards / popovers, cookie banner |
| `--line` / `--line-strong` | white 8% / 16% | all borders |
| `--t-primary` / `--t-secondary` / `--t-muted` | `#f4f4f5` / `#c4c4cb` / `#9a9aa3` | headings / body / meta |
| `--t-deco` | `#74747d` | non-essential only (numbers like `01`), never sentences |
| `--brand` | `#d6a77a` | accent (gold) |
| `--brand-soft` / `--brand-line` | gold 10% / 28% | icon tiles, accent borders |
| `--success` | `#5fd3a0` | check icons, "Client build" badge |

Rule: **max 3 text colours per section**. Body copy is `t-secondary`, never `t-muted`.

**Typography**

| Role | Font | Size (clamp) | Weight | Notes |
|---|---|---|---|---|
| Display 1 (h1) | Cormorant Garamond | 2.6 → 5rem | 600 | `.display-1`, line-height 1.02, max 3 lines desktop |
| Display 2 (section h2) | Cormorant Garamond | 2 → 3.1rem | 600 | `.display-2` |
| Accent phrase | same, *italic*, gold gradient | — | — | `<Headline>` splits automatically; **one** accent per headline |
| h3 / card title | Inter | 1.125–1.25rem | 600 | |
| Body / lead | Inter | 1rem / 1.05–1.2rem | 400 | line-height 1.7, max width ~65ch |
| Eyebrow `.label` | JetBrains Mono | 0.72rem, uppercase, 0.14em tracking | 500 | gold, with 24px rule before |
| Meta / chips | JetBrains Mono | 0.75rem | 400 | |

Hindi and Arabic: serif is swapped for Noto Sans Devanagari / IBM Plex Sans Arabic (already in
CSS via `:lang()`); no italics, no letter-spacing. Keep it that way.

**Spacing & shape**

- Container: `max-width 1200px`, gutter 20px mobile / 32px ≥768px (`.container-w`).
- Section padding: 72px mobile / 104px desktop (`.section-pad`). Never custom per section.
- Grid gap: 20px cards, 32–48px for text columns.
- Radius: 12px buttons/inputs (`0.6–0.75rem`), 16px cards, 20px feature/accent cards. Nothing else.
- Card padding: 24px mobile, 28–32px desktop.

**Elevation**: borders, not shadows. Only two shadows exist: browser-frame screenshots and the
gold glow on `.btn-primary` / `.card-hover:hover`.

---

## 3. Components (single source — reuse, don't fork)

| Component | File | Spec |
|---|---|---|
| Navbar | `components/site/Navbar.tsx` | 64px, sticky, translucent `--header-bg` + blur, 1px bottom line. Logo · 5 links · language/currency selects · one gold CTA. Mobile: full-width sheet, links 52px tall. |
| Footer | `components/site/Footer.tsx` | 4 columns → 1 on mobile. Contact links tappable (`mailto:`, `tel:`, WhatsApp). |
| Buttons | `.btn` + `.btn-primary` (gold, max **one** per view) / `.btn-outline` | height 44 / 50 (`.btn-lg`). Arrow icon only on primary. |
| Eyebrow | `.label` | always above a headline, never alone. |
| Headline | `<Headline text>` in `blocks.tsx` | gold italic on 2nd sentence / last phrase. Write copy so the accent lands on a meaningful phrase. |
| Card | `.card` (+ `.card-hover` when clickable) | icon tile 44px `--brand-soft`, title, 2-line text, footer row with price + arrow. |
| Accent card | `.card-accent` | only for: Diagnostic offer, service price box, final CTA. Max one per page. |
| BrowserFrame | `components/work/ProjectCard.tsx` | real screenshot, 16:10, host in mono pill. The main "image" style of the site. |
| Chip | `.chip` | tech stack, filters. |
| Step | `.step-dot` + title + text | process sections. |
| FAQ | `FaqList` (`<details>`) | keep native; style only. |
| Trust strip | `TrustStrip` | 6 items, icon tile + one line. |

---

## 4. Page-by-page plan

**Home** (`pages/Home.tsx`) — order and intent:
1. Hero: eyebrow · h1 (accent) · lead · primary + outline CTA · note · tech chips. Right: live
   project BrowserFrame (desktop only) with a small caption chip "Live — open it ↗".
   Improve: give the hero a fixed min-height (≈ 88vh desktop) so the fold is clean.
2. **New: proof bar** directly under hero — 3–4 *facts*, not metrics: "6 live builds to open",
   "Fixed price in writing", "5 languages · 4 currencies", "Reply within 1 working day".
   Mono numbers/keywords, thin dividers. (Add i18n keys.)
3. Services grid (6 cards, 3×2).
4. Selected work (3 ProjectCards) — alternate section background.
5. Why us (6 items, 3×2, gold top rule) + TrustStrip in a bordered panel.
6. Process (4 steps, horizontal on desktop with a connecting 1px line between dots).
7. Testimonials (hidden until real ones exist).
8. Pricing teaser (4 cards) + estimate note.
9. FAQ teaser (6 questions) — two-column.
10. Final CTA (`card-accent`).

**Services** — hero; trust strip; 6 alternating rows (text left / details right, swap on even
rows for rhythm); CTA. Each row: icon tile, name, short line, "From" price, timeline, outline
button "Service details".

**Service detail** (one template, 6 services) — hero with breadcrumb + price/timeline aside
(`card-accent`); "Is this for you?" / "What changes" two columns; deliverables 3×2 cards; process;
related live work; FAQ; CTA. Add a sticky in-page sub-nav on desktop (Overview · Included ·
Process · Work · FAQ) using anchor links.

**Work** — hero; sticky filter chips; alternating project features (screenshot / text). Add a
small "What to click first" mono label in the Try-this box. Keep demo labels honest.

**Pricing** — hero with currency note; Diagnostic `card-accent`; rate table (desktop table,
mobile stacked cards — already responsive); payment terms 2×2; "billed separately" list; CTA.
Improve: highlight the currency switcher right above the table (reuse `Preferences` currency
select) so foreign visitors find it.

**About** — hero; story + founder card + facts; principles; trust strip; CTA. No stock photos.
If the owner supplies a real photo later, it goes in the founder card only.

**FAQ** — sticky category nav (desktop) + grouped `<details>` lists + "still have a question".

**Contact** — two columns: form card (left) / direct contacts + "what happens next" (right).
On mobile, show direct contacts **first** (WhatsApp is the fastest path for Indian clients).

**404 / legal** — same layout system, no extra decoration.

---

## 5. Imagery & icons

- Images = only real screenshots in `client/public/images/work/`. Serve WebP at 1280px
  (and 640px `srcset`), `width`/`height` set, lazy below the fold.
- Icons = `lucide-react`, 18–20px, stroke 1.75, inside a 44px `--brand-soft` tile, gold.
- No stock photography, no illustrations, no 3D, no emoji.
- OG image: `client/public/og.png` (1200×630, dark/gold) — keep in sync with the hero headline.

---

## 6. Motion

- `.reveal` on hero blocks only (stagger 0 / 120ms). Respect `prefers-reduced-motion`.
- Hover: `.card-hover` lift 2px + gold border; buttons colour change. 150–250ms.
- Optional: CSS-only scroll-reveal using `animation-timeline: view()` behind
  `@supports`, so unsupported browsers just show content.
- Forbidden: custom cursors, cursor-follow glows, parallax, auto-playing carousels, marquees,
  typing effects, counters that animate numbers.

---

## 7. Responsive rules

| Breakpoint | Behaviour |
|---|---|
| < 640 | single column; buttons full width; hero image hidden; chips wrap; section padding 72px |
| 640–1023 | 2-column grids; nav collapses to menu |
| ≥ 1024 | full layouts; hero 2 columns; sticky sub-navs |

Test at 375, 768, 1024, 1440. No horizontal scroll anywhere (`scrollWidth === clientWidth`),
in English **and** Arabic.

---

## 8. Execution order (small, reviewable steps)

1. Tokens/typography polish in `index.css` (no new colours).
2. Home: hero min-height, proof bar (new i18n keys in all 5 locales), process connector line.
3. Service detail: sticky sub-nav + anchors.
4. Pricing: currency switcher above table.
5. Contact: mobile order (direct contacts first).
6. Images: convert work screenshots to WebP + `srcset`.
7. Full QA pass (section 9), then `npm run build` and `npm run deploy`.

Commit after each step (`feat:` / `fix:` / `style:` conventional messages).

---

## 9. Acceptance checklist (every page, every locale)

- [ ] One h1; headings in order; one gold accent phrase per headline.
- [ ] Max one gold primary button visible per viewport section.
- [ ] Body text `t-secondary` or brighter; contrast ≥ 4.5:1.
- [ ] Same section padding, card radius, card padding everywhere.
- [ ] No horizontal scroll at 375px (EN + AR); Arabic mirrors correctly.
- [ ] Works with JavaScript disabled (prerendered content visible).
- [ ] Keyboard: visible focus, mobile menu closes on Esc, skip link works.
- [ ] No hard-coded copy or prices; all 5 locales type-check.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO 100.
- [ ] `npx tsc --noEmit` clean, `npm run build` prints "Prerendered 80 pages".

## 10. Deploy

```bash
npm run deploy
```
(Already configured for Cloudflare Pages project `cubictech`; live at https://cubictech.pages.dev.)
