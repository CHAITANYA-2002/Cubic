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
cp .dev.vars.example .dev.vars      # set ADMIN_PASSWORD and a 32+ char SESSION_SECRET
npm run db:migrate:local            # creates the local D1 database (.wrangler/, gitignored)
npm run dev                         # http://localhost:5000 — Vite + the Hono API on local D1
```

| Script | Does |
|---|---|
| `npm run dev` | Vite on port 5000; `/api/*` served by `server/app.ts` (Hono) via `@hono/vite-dev-server` with wrangler's local D1 + `.dev.vars` |
| `npm run check` | TypeScript typecheck |
| `npm run build` / `build:static` | Client to `dist/public` |
| `npm run preview` | Build, then run the real Pages runtime locally (`wrangler pages dev`, port 8788) |
| `npm run db:migrate:local` / `db:migrate:remote` | Apply `migrations/*.sql` to the local / Cloudflare D1 database |
| `npm run deploy` | Build and `wrangler pages deploy` (needs `wrangler login`) |

---

## 2. Stack

React 18 + TypeScript + Vite · wouter (routing) · Tailwind + shadcn/ui · framer-motion
Hono on Cloudflare Pages Functions · Cloudflare D1 (SQLite) · Zod validation

```
client/src/pages        route components
client/src/components   shared UI (Navbar, Footer, HeroBackdrop, AdvancedCursor, ...)
server/                 app.ts (Hono API), routes/, os/, db/ (D1 mapping), security/, site/
functions/api/          Cloudflare Pages Functions entry ([[route]].ts → server/app.ts)
migrations/             D1 SQL migrations
shared/                 schema.ts, os.ts, site.ts (Zod), routes.ts (typed API contract)
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

Hono app in `server/` (entry `server/app.ts`), deployed as Cloudflare Pages Functions
(`functions/api/[[route]].ts`), data in Cloudflare D1 (`migrations/`).

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/api/contact` | — | Zod-validated, honeypot `botcheck`, 5/min per IP; stores the lead in D1 |
| POST | `/api/newsletter` | — | Unique email in D1, 5/min per IP |
| GET | `/api/site` | — | Site settings (defaults from `shared/site.ts` + admin overrides), cached 60 s |
| GET | `/api/geo` | — | `{ country, currency }` from Cloudflare geolocation |
| GET | `/api/portal/:token` | token | One client's projects, milestones and issued documents |
| POST | `/api/admin/login` | — | Body `{password}`; sets an HttpOnly signed session cookie (12 h). 5 failures / IP / 15 min → 429 |
| POST | `/api/admin/logout` | — | Clears the cookie |
| GET | `/api/admin/session` | cookie | 200 when signed in, else 401 |
| GET/PATCH/DELETE | `/api/admin/submissions[/:id]` | cookie | Leads |
| GET | `/api/admin/stats`, `/api/admin/subscribers` | cookie | Counts, newsletter list |
| PUT | `/api/admin/site` | cookie | Save site settings |
| * | `/api/os/*` | cookie | Cubic OS (see §10) |

There is no default password: admin login is disabled until `ADMIN_PASSWORD` and
`SESSION_SECRET` are set.

---

## 4. Where contact submissions go — READ THIS

Every submission is stored in D1 and shows in `/admin` → Inbox. If `VITE_WEB3FORMS_KEY` is set at
build time, the browser also sends it to Web3Forms, which emails it to the key's address. The two
are independent: the form succeeds if either accepts it. Back everything up from
`/admin/settings` → Download backup (JSON).

Contact email throughout the site: **chaitanyakhurana10@gmail.com** (editable in `/admin/site`).

---

## 5. Environment variables

| Var | Where | Needed for |
|---|---|---|
| `ADMIN_PASSWORD` | Pages secret / `.dev.vars` | Admin login |
| `SESSION_SECRET` | Pages secret / `.dev.vars` | Signing the admin cookie (32+ chars; rotating it signs everyone out) |
| `VITE_WEB3FORMS_KEY` | Pages build env var (optional) | Email copy of each enquiry |
| `DB` | `wrangler.toml` D1 binding | All data |

---

## 6. Deployment — Cloudflare Pages + D1 (free tier)

**Live:** https://cubictech.pages.dev (project `cubictech`, D1 `cubictech`, region APAC).
Already done: database created and migrated, Pages project created, `SESSION_SECRET` set.

| Task | Command |
|---|---|
| Set or change the admin password (prompts, then redeploys) | `npm run admin:password` |
| Deploy the current code | `npm run deploy` |
| Apply new DB migrations | `npm run db:migrate:remote` |

`npm run build` prerenders every page in all five languages; set `VITE_SITE_URL` before building
once a custom domain is attached so canonical, hreflang, sitemap and OG URLs use it.
Optional build-time `VITE_WEB3FORMS_KEY` emails each enquiry; without it leads are still saved
in D1 and shown in `/admin`.

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

Login at `/admin` (password = `ADMIN_PASSWORD`; disabled until it and `SESSION_SECRET` are set).
Sessions are HMAC-signed HttpOnly cookies, 12 h expiry, 5 failed logins per IP per 15 min → 429.

| Tab | Does |
|---|---|
| Dashboard | Pipeline value (raw + weighted), won this month, active projects vs capacity 2, receivable / overdue / collected, follow-ups due, upcoming milestones, setup warnings |
| Inbox | Website enquiries. Email / WhatsApp shortcuts, status, **Qualify → deal** |
| Pipeline | Kanban Lead → Qualified → Discovery → Proposal → Negotiation → Won/Lost. **Mark won** creates the client + project |
| Clients | Billed / paid per client, private **portal link** (copy, preview, reset) |
| Projects | Milestones (date, amount, status), progress updates (client-visible or internal), one-click milestone invoice |
| Invoices & quotes | Numbered `CT-YYYY-NNN` / `CT-Q-YYYY-NNN`, GST none / IGST / CGST+SGST, Draft → Sent → Paid, quote → invoice, print / save as PDF |
| Subscribers | Newsletter sign-ups, CSV export |
| Site | Public contact details, socials, accepting-projects flag, FX, rate card (INR/USD, EUR/AED preview), testimonials |
| Settings | Legal name, GSTIN, PAN, address, UPI + bank details, prefix, payment terms, JSON backup |

Client portal: `/portal/<token>` — milestones, client-visible updates, non-draft quotes and
invoices with payment details. No login; the 48-char token is the secret, reset it from Clients.

Code: `shared/os.ts` (types, zod, invoice maths), `server/os/` (routes, dashboard, numbering),
`server/routes/auth.ts`, `server/security/`, `client/src/pages/os/`, `client/src/pages/Portal.tsx`,
`client/src/components/InvoiceDocument.tsx`. Public `/pricing` mirrors
`firm/playbooks/pricing.md` Part 2 — change both together.

### 10.1 Workspace v2 — team, sales desk, calls, chatbot (migration `0002_workspace.sql`)

**Sign-in.** Owner: email blank (or the owner's email) + `ADMIN_PASSWORD`; the owner row is
created on first sign-in. Staff: their work email + their own password (PBKDF2, set by the owner
in Team). Sessions are `v2` signed cookies carrying user id + token version; deactivating someone,
changing their role or password signs them out everywhere. Old `v1` cookies are rejected.

| Role | Opens |
|---|---|
| Owner | Everything, including Team |
| Admin | Everything except Team |
| Sales | Dashboard, Tasks, Inbox, Pipeline, Calls, Chats, Clients — own records + unassigned |
| Delivery | Dashboard, Tasks, Clients, Projects, Calls |

Guards live in `server/app.ts` (`GUARDS`) and `shared/team.ts` (`can`); ownership checks in
`server/crm/access.ts`. The UI hides tabs but the server is the authority.

| Tab | Does |
|---|---|
| Tasks | Follow-ups with due date, priority, owner; overdue / today / upcoming |
| Inbox | Leads from the form, chatbot, call booking and manual entry; source, page, UTM, owner; detail with timeline (note / call / email / WhatsApp / meeting), follow-up task, qualify → deal |
| Pipeline | Owner per deal, owner filter, deal timeline |
| Calls | Calendar in IST, outcome notes (saved to the lead), move / reassign / .ics; availability and booking rules |
| Chats | Every chatbot conversation, review status, linked lead |
| Chatbot | Taught answers (knowledge base), on/off, daily caps, extra instructions, test box |
| Expenses | Spend by month and category, GST paid, CSV; dashboard shows cash profit |
| Team | Staff logins, roles, lead routing (least busy), who takes calls |
| My account | Name, email, password (staff), weekly hours |

**Lead routing.** New leads go to the active owner/admin/sales person with `takes_leads` and the
fewest open leads + open deals (`server/crm/assign.ts`). Toggle in Team.

**Call booking** (`/book`, 5 languages). Slots = each host's weekly IST hours, minus holidays,
notice period and other calls ± buffer (`server/booking/slots.ts`, unit-tested). A unique index
stops double booking. Visitors get a manage link `/book/manage/<token>` to add to calendar,
reschedule or cancel. Every booking creates or updates a lead.

**Chatbot.** Floating "Ask us anything" on every public page; the panel's code loads on click.
Answers come from Cloudflare Workers AI (`[ai]` binding, Llama 3.3 70B with an 8B fallback),
grounded only on the English site copy, live prices/contact from Site settings and the owner's
taught answers (`server/chat/`). Per-visitor and site-wide daily caps; over the cap or without
AI it answers from the best-matching FAQ / price list. Visitors can leave details; the lead gets
the transcript. Local `wrangler pages dev` cannot run the AI binding without a workers.dev
subdomain — comment out `[ai]` locally to test the fallback.

**Optional e-mail alerts.** Set Pages secrets `RESEND_API_KEY`, `MAIL_FROM` (a verified sender)
and `NOTIFY_EMAIL` to get new-lead / new-call mails and send booking confirmations. Without them
nothing is sent and everything else works.

Tests: `npm test` (vitest — slots, chatbot retrieval and fallback, passwords, sessions, roles).
