# CubicTech Website — Handoff

**Repo:** `D:\Ck\Programming\github\Cubic` (origin: `github.com/CHAITANYA-2002/Cubic`)
**Branch:** `main` — currently **17 commits ahead of origin (not pushed)**
**Last commit:** `5aafff6` Merge remote-tracking branch 'premium/main'

Purpose: portfolio/showcase site to link from LinkedIn. Visitors browse the work; interested
people submit the contact form so the owner can see what they want.

---

## 1. Run locally

```bash
npm install
npm run dev          # http://localhost:5000  (serves API + client via Vite middleware)
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server (Express + Vite), port 5000 |
| `npm run check` | TypeScript typecheck |
| `npm run build` | Full build — client to `dist/public`, server to `dist/index.cjs` |
| `npm run build:static` | Client only (for static hosting) |
| `npm start` | Run the built server |

No database required. Without `DATABASE_URL` the app uses in-memory storage (see §4).

---

## 2. Stack

React 18 + TypeScript + Vite · wouter (routing) · Tailwind + shadcn/ui · framer-motion
Express (dev + prod server) · Drizzle ORM + Postgres (optional) · Zod validation

```
client/src/pages        route components
client/src/components   shared UI (Navbar, Footer, HeroBackdrop, AdvancedCursor, ...)
server/                 index.ts (bootstrap), routes.ts (API), storage.ts, db.ts
shared/                 schema.ts (Drizzle + Zod), routes.ts (typed API contract)
```

### Routes
`/` `/services` `/services/{web-development,ui-ux-design,web-applications,maintenance,ai-solutions,digital-marketing}`
`/work` `/insights` `/about` `/contact` `/admin` `/privacy` `/terms` `/cookies`

### Design system
Near-black `#0B0B0C` + rose-gold `#D6A77A`. Utility classes in `client/src/index.css`:
`container-w`, `section-pad`, `t-primary|secondary|muted|deco|ghost`, `glass`, `glass-card`,
`blob`, `btn-primary`, `btn-ghost`, `text-gradient`, `label`, `divider`, `aurora`.
Each service has a signature accent colour (blue / pink / cyan / violet / emerald / orange)
used on its Services-grid card **and** carried into its detail page hero + eyebrow label.

---

## 3. API

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/contact` | — | Zod-validated; creates lead, appends to `submissions.csv` |
| POST | `/api/newsletter` | — | Email capture (in-memory set) |
| POST | `/api/admin/login` | — | Body `{password}`; returns `{token}` |
| GET | `/api/admin/submissions` | `x-admin-token` | List leads |
| GET | `/api/admin/stats` | `x-admin-token` | Counts |
| PATCH | `/api/admin/submissions/:id` | `x-admin-token` | Update status/notes |
| DELETE | `/api/admin/submissions/:id` | `x-admin-token` | Delete lead |

Admin UI at `/admin` — search, status filter, CSV export. Password default `cubic@14412815`
(override with `ADMIN_PASSWORD`).

---

## 4. Where contact submissions go — READ THIS

Three possible destinations depending on configuration:

1. **Local file (default)** — leads and all Cubic OS data live in `data/cubic-os.json`
   (gitignored; override path with `CUBIC_DATA_FILE`). Survives restarts. Back it up from
   `/admin/settings` → Download backup.
2. **Postgres** — set `DATABASE_URL`: leads go to `consultation_requests` (Drizzle) and the
   Cubic OS document to one row in `cubic_os_documents` (table auto-created).
3. **Web3Forms (static hosting)** — set `VITE_WEB3FORMS_KEY` and the client posts submissions
   straight to Web3Forms, which **emails each one to the address the key is registered to**.
   No server needed. Implemented in `client/src/hooks/use-contact.ts`; falls back to the
   Express API when the key is absent.

Contact email throughout the site: **chaitanyakhurana10@gmail.com**

---

## 5. Environment variables

See `.env.example`. `.env*` is gitignored.

| Var | Needed for |
|---|---|
| `VITE_WEB3FORMS_KEY` | Static deploy — emails each submission (free key at web3forms.com) |
| `DATABASE_URL` | Persistent Postgres storage |
| `ADMIN_PASSWORD` | Admin login (**must be set on any public server**) |
| `CUBIC_DATA_FILE` | Optional path for the local Cubic OS data file |

---

## 6. Deployment — decision still open

The frontend is static-ready. The **backend is not serverless-compatible** as written
(in-memory state + writes `submissions.csv` to disk), so it will not work on Cloudflare Pages
or Vercel serverless without changes.

Options discussed with the owner (constraint: **zero cost**):

- **Vercel static + Web3Forms** — recommended for the LinkedIn use case. Instant load,
  nothing sleeps, every lead emailed. `vercel.json` is already committed
  (build `npm run build:static`, output `dist/public`, SPA rewrites, security headers,
  asset caching). Trade-off: `/admin` dashboard is non-functional (no backend).
- **Render + Postgres** — whole app runs unchanged, but the free tier sleeps after 15 min
  idle (~50 s cold start on first visit).
- **Supabase** for the database — works with existing code via `DATABASE_URL`, and leads are
  viewable in the Supabase table editor. Caveat: free projects pause after ~7 days idle.

Owner has not made the final call. Nothing is deployed yet.

---

## 7. Known state / gotchas

- **Unpushed:** local `main` is 17 commits ahead of `origin/main`. Push before deploying.
- **`submissions.csv`** is dirty in git — contains test rows from API verification. Safe to
  clear/discard.
- **`premium` git remote** points at `D:\Ck\Programming\Cubic-Technologies-Showcase`, an older
  local copy that was merged in (shared base `97ca6dd`). That folder is now redundant; keep it
  as backup or delete. Do not develop in both.
- **`.claude/launch.json` in the old folder** was edited to `npm --prefix D:/Ck/Programming/github/Cubic run dev`
  because the preview tool resolved launch config from the original session directory and kept
  starting the wrong copy. If the preview ever serves stale code, check which folder the served
  module paths point to.
- **Vite transform cache** (`node_modules/.vite`) can serve stale modules after a git merge —
  delete it and restart if edits don't appear.
- Bundle is ~790 kB (217 kB gzip), single chunk. Code-splitting not done; acceptable but
  improvable.

---

## 8. Verified working (last check)

TypeScript clean · production build passes · all 16 routes return 200 ·
`POST /api/contact` → 201 · admin login → 200, wrong password → 401 ·
cookie consent banner shows and persists choice · WhatsApp floating CTA present ·
custom cursor (dot + ring + aura + particle trail) tracks the mouse ·
no console errors · no horizontal overflow at 375 px on any page.

---

## 9. Suggested next steps

1. Decide hosting (§6), then push `main` to origin.
2. Get a free Web3Forms key, set `VITE_WEB3FORMS_KEY`, submit a real test, confirm the email lands.
3. Replace the Open Graph image (currently an Unsplash photo) with a screenshot of the site so
   the LinkedIn preview card shows actual work.
4. Fill in real social URLs in `client/src/components/Footer.tsx` (LinkedIn / Instagram /
   Dribbble are `#` placeholders).
5. Update `cubictech.in` to the real domain in `client/index.html` (canonical, OG url, JSON-LD)
   and `client/public/sitemap.xml`.
6. Owner asked for an admin panel that edits socials/email/phone/address site-wide. **Not built**
   — those values are hardcoded across ~8 files. Requires persistent storage plus a settings
   API, so it depends on the §6 hosting decision.

---

## 10. Cubic OS — the firm's internal system (`/admin`)

Login at `/admin` (password = `ADMIN_PASSWORD`; dev default only when `NODE_ENV` is not
production — in production login is disabled until it is set). Sessions are random tokens,
12 h expiry, 8 failed logins per IP per 15 min → 429.

| Tab | Does |
|---|---|
| Dashboard | Pipeline value (raw + weighted), won this month, active projects vs capacity 2, receivable / overdue / collected, follow-ups due, upcoming milestones, setup warnings |
| Inbox | Website enquiries. Email / WhatsApp shortcuts, status, **Qualify → deal** |
| Pipeline | Kanban Lead → Qualified → Discovery → Proposal → Negotiation → Won/Lost. **Mark won** creates the client + project |
| Clients | Billed / paid per client, private **portal link** (copy, preview, reset) |
| Projects | Milestones (date, amount, status), progress updates (client-visible or internal), one-click milestone invoice |
| Invoices & quotes | Numbered `CT-YYYY-NNN` / `CT-Q-YYYY-NNN`, GST none / IGST / CGST+SGST, Draft → Sent → Paid, quote → invoice, print / save as PDF |
| Settings | Legal name, GSTIN, PAN, address, UPI + bank details, prefix, payment terms, JSON backup |

Client portal: `/portal/<token>` — milestones, client-visible updates, non-draft quotes and
invoices with payment details. No login; the 48-char token is the secret, reset it from Clients.

Code: `shared/os.ts` (types, zod, invoice maths), `server/os/` (store, routes, dashboard),
`server/auth.ts`, `client/src/pages/os/`, `client/src/pages/Portal.tsx`,
`client/src/components/InvoiceDocument.tsx`. Public `/pricing` mirrors
`firm/playbooks/pricing.md` Part 2 — change both together.
