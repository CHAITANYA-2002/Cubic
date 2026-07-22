# CUBICTECH WEBSITE — COMPLETE PROFESSIONAL REVAMP & AUDIT

## PROJECT OVERVIEW
You are revamping a multi-page business website for "Cubic Technologies" — a reputed software development firm that builds products end-to-end (Web Development, AI Solutions, UI/UX Design, Digital Marketing, Web Applications, Maintenance). The current site looks generic and amateur. You must transform it into a premium, Fortune-500-grade professional website that convinces visitors this is a serious, established company — NOT a college experiment.

## CURRENT PROJECT STRUCTURE (from dependency graph)
- Stack: React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Express backend + PostgreSQL (Drizzle ORM)
- Client: `client/src/` — pages, components, hooks, lib
- Server: `server/` — Express routes, storage, db, static, vite
- Shared: `shared/` — schema.ts, routes.ts
- UI Components: `client/src/components/ui/` — 30+ shadcn components (accordion, alert-dialog, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, input-otp, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, switch, table, tabs, textarea, toast, toaster, toggle, toggle-group, tooltip)
- Pages: Home, About, Contact, Services (main), Services sub-pages (AI Solutions, Digital Marketing, Maintenance, UI/UX Design, Web Applications, Web Development), Not Found
- Components: AdvancedCursor, ContactForm, CursorGlow, Footer, HeroObject, MouseTracker, Navbar, PageHeader, PageTransition, Particles, ScrollToTop, ServiceCard, ServiceDetailTemplate, ThemeProvider
- Hooks: use-contact, use-mobile, use-toast
- Server features: Contact form submission, CSV export, consultation request storage

## PHASE 1: BUG AUDIT & CODE CLEANUP

### 1.1 Remove Dead/Unused Code
- Audit ALL imports across every file. Remove any unused imports, variables, functions, or components.
- Check for console.log statements, debug code, and commented-out blocks — DELETE them.
- Remove `debug_cwd.ts`, `copy_images.ts`, `test_drive.txt` if they serve no production purpose.
- Verify `script/build.ts` is actually needed or if Vite handles builds natively.
- Check if `client/public/images/placeholder.txt` is referenced anywhere — remove if not.
- Audit the `attached_assets/` folder — remove any pasted text files that are not part of the deployed site.

### 1.2 Fix File Structure
- Ensure consistent naming: ALL components use PascalCase, ALL hooks use camelCase with `use` prefix.
- Move any misplaced files to correct directories.
- Ensure `tsconfig.json` paths (`@shared/*`) resolve correctly.
- Verify `components.json` (shadcn config) is properly configured and all UI components are registered.
- Check that `tailwind.config.ts` includes all custom colors, fonts, and animations used.

### 1.3 Performance Audit
- Check for unnecessary re-renders in React components (missing `useMemo`, `useCallback`).
- Ensure images are lazy-loaded where possible.
- Verify the Particles and CursorGlow effects don't tank performance on low-end devices — add `prefers-reduced-motion` support.
- Check bundle size — tree-shake unused shadcn components if possible.

### 1.4 Fix All Console Errors
- Run the dev server and fix EVERY warning/error in the browser console and terminal.
- Fix any TypeScript strict-mode errors.
- Ensure all `key` props in lists are unique and stable.

---

## PHASE 2: PROFESSIONAL DESIGN SYSTEM

### 2.1 Establish a Premium Design Language
Create a cohesive design system that screams "established enterprise":

**Color Palette (sophisticated, not flashy):**
- Primary: Deep Navy `#0A1628` (trust, professionalism)
- Secondary: Electric Blue `#2563EB` (tech, innovation)
- Accent: Warm Gold `#D4AF37` (premium, quality)
- Neutral: Slate Gray `#64748B` (sophistication)
- Background: Off-White `#FAFBFC` / Dark `#0F172A`
- Success: Emerald `#10B981`
- Error: Rose `#F43F5E`

**Typography:**
- Headlines: Inter or Geist (bold, tight tracking)
- Body: Inter or system-ui
- Font sizes with clear hierarchy: Display (48-64px), H1 (36-48px), H2 (28-32px), H3 (20-24px), Body (16px), Small (14px), Caption (12px)
- Line heights: Headlines 1.1, Body 1.6

**Spacing:**
- Base unit: 4px
- Section padding: 80-120px vertical
- Container max-width: 1280px centered
- Consistent 8px grid system

**Shadows & Borders:**
- Subtle shadows for cards: `0 4px 24px rgba(0,0,0,0.06)`
- Border radius: 8px for cards, 12px for buttons, full for pills
- 1px borders with low-opacity grays

### 2.2 Replace Generic Visual Effects
- **REMOVE** the gimmicky `AdvancedCursor` and `CursorGlow` — they look amateur on a business site.
- **REMOVE** excessive `Particles` — replace with a subtle, professional animated gradient background or geometric pattern.
- **KEEP** `PageTransition` but make it subtle (fade + slight translateY, 300ms max).
- **REPLACE** `MouseTracker` / `TiltCard` with clean, static cards with subtle hover lift.

### 2.3 Professional Animations Only
- Use Framer Motion for entrance animations (fade-up, staggered reveals).
- All animations must be: subtle, purposeful, and respect `prefers-reduced-motion`.
- NO bouncing, NO excessive scaling, NO rotating elements.
- Scroll-triggered reveals using Intersection Observer or Framer Motion's `whileInView`.

---

## PHASE 3: PAGE-BY-PAGE REVAMP

### 3.1 HOME PAGE — The Money Page
Structure:
1. **Hero Section** (full viewport height):
   - Bold headline: "We Build Products That Scale"
   - Subheadline: "End-to-end software development for ambitious companies. From idea to launch, we deliver."
   - TWO CTAs side by side: "Start Your Project" (primary, gold) + "View Our Work" (secondary, outlined)
   - Background: Subtle animated mesh gradient or geometric pattern (NOT particles)
   - Professional hero image or 3D abstract tech visual (use a high-quality Unsplash image or abstract SVG)

2. **Trusted By / Social Proof** (logos of clients — use placeholder logos with "Trusted by industry leaders" text):
   - Horizontal scrolling logo strip
   - 6-8 placeholder company logos (grayscale, hover to color)

3. **Services Overview** (3x2 grid or horizontal scroll on mobile):
   - 6 service cards with ICON (Lucide), title, 2-line description, "Learn More →" link
   - Cards: Web Development, AI Solutions, UI/UX Design, Digital Marketing, Web Applications, Maintenance
   - Hover: subtle lift + shadow increase

4. **Why Choose Us** (split layout: left text, right image/stats):
   - Stats: "50+ Products Shipped", "98% Client Retention", "5+ Years Experience", "24/7 Support"
   - Each stat with a number counter animation on scroll
   - Supporting text about methodology, quality, communication

5. **Featured Projects / Case Studies** (3 cards):
   - Each card: project image, client name, tech stack tags, brief outcome description
   - "View Case Study" button
   - Use realistic project names and descriptions (NOT "Project 1")

6. **Testimonials** (carousel or 3-column grid):
   - 3-4 testimonials with: quote, client photo (placeholder avatar), name, title, company
   - Star ratings
   - Clean card design with subtle border

7. **CTA Banner** (full-width, primary color):
   - "Ready to Build Something Great?"
   - "Schedule a Free Consultation" button
   - Background: subtle pattern or gradient overlay

8. **Footer** (comprehensive):
   - 4 columns: Company (logo + tagline + brief about), Services (6 links), Company (About, Careers, Blog, Contact), Legal (Privacy, Terms, Cookies)
   - Newsletter signup (email input + button)
   - Social icons (LinkedIn, Twitter/X, GitHub, Dribbble)
   - Copyright + "Made with precision by Cubic Technologies"

### 3.2 ABOUT PAGE
- Hero: "The Team Behind the Tech" with team photo or abstract visual
- Company Story: 2-3 paragraphs about founding, mission, values
- Team Grid: 4-6 team members with photos (use placeholder avatars), names, roles, LinkedIn icons
- Values Section: 4 values with icons (Innovation, Quality, Transparency, Partnership)
- Stats bar: same as homepage
- CTA: "Join Our Team" (careers) + "Work With Us"

### 3.3 SERVICES MAIN PAGE
- Hero: "Services Built for Scale"
- Intro paragraph about end-to-end capabilities
- 6 detailed service cards (larger than homepage):
  - Each with: icon, title, detailed description (3-4 sentences), key features list (4-5 bullets), technologies used (tag pills), "Get a Quote" CTA button
  - Services:
    1. **Web Development**: "Custom websites and web apps built with React, Next.js, Node.js. From landing pages to complex dashboards, we craft performant, SEO-friendly solutions." Features: Responsive Design, SEO Optimization, Performance Tuning, CMS Integration, API Development. Tech: React, Next.js, TypeScript, Tailwind, Node.js.
    2. **AI Solutions**: "Intelligent automation and machine learning integrations that transform your business operations." Features: Chatbot Development, Predictive Analytics, NLP Integration, Computer Vision, AI Consulting. Tech: Python, TensorFlow, OpenAI, LangChain, Vector DBs.
    3. **UI/UX Design**: "User-centered design that converts visitors into customers. Research-driven interfaces that look stunning and work flawlessly." Features: User Research, Wireframing, Prototyping, Design Systems, Usability Testing. Tech: Figma, Adobe XD, Sketch, Principle.
    4. **Digital Marketing**: "Data-driven strategies that grow your online presence and convert leads into revenue." Features: SEO Strategy, Content Marketing, PPC Campaigns, Social Media, Analytics. Tech: Google Analytics, SEMrush, HubSpot, Mailchimp.
    5. **Web Applications**: "Scalable SaaS platforms and internal tools built for real-world business challenges." Features: Real-time Sync, Role-based Access, Cloud Architecture, Microservices, CI/CD. Tech: React, PostgreSQL, AWS, Docker, Kubernetes.
    6. **Maintenance & Support**: "Keep your digital products running at peak performance with our proactive maintenance plans." Features: 24/7 Monitoring, Security Updates, Performance Audits, Bug Fixes, Backup Management. Tech: Sentry, Datadog, AWS CloudWatch.

### 3.4 SERVICE DETAIL PAGES (6 individual pages)
Each service page must be a COMPLETE landing page, not a generic template:
- Hero specific to the service
- "What We Build" — list of specific products/deliverables for THIS service (NOT generic)
- Process Section: 4-5 step workflow (Discovery → Design → Development → Testing → Launch)
- Case Study / Example: "Recent Project" section with realistic project details
- Pricing indicator: "Starting from $X" (or "Custom pricing based on scope")
- FAQ accordion (5-6 questions specific to that service)
- CTA: "Get a Free Quote" form or button

### 3.5 CONTACT PAGE
- Hero: "Let's Build Something Together"
- Two-column layout:
  - LEFT: Contact form (Name, Email, Company, Service Interest [dropdown], Budget Range [dropdown], Message [textarea])
  - RIGHT: Contact info (Email, Phone, Address), Business hours, Map placeholder, Social links
- Form validation with Zod schema (already exists — extend it)
- Success toast on submission
- "We typically respond within 24 hours" reassurance text

---

## PHASE 4: NEW PAGES TO CREATE

### 4.1 ADMIN DASHBOARD (`/admin`)
Create a protected admin page with:
- **Login gate**: Simple password protection (store hash in env or hardcode for now)
- **Dashboard Overview**:
  - Total consultation requests (count)
  - Recent submissions table (sortable, paginated)
  - Export to CSV button (reuse existing CSV logic)
  - Filter by date range, service type
- **Contact Submissions Table**:
  - Columns: Name, Email, Company, Service, Budget, Message, Date, Status (New, Contacted, Closed)
  - Actions: View details, Mark as contacted, Delete
  - Search functionality
- Use shadcn Table, Dialog, Badge, Button, Input, Select components
- Route: `/admin` — protected by auth check

### 4.2 TERMS OF SERVICE PAGE (`/terms`)
Professional legal page:
- Last updated date
- Sections: Introduction, Use of Service, Intellectual Property, User Responsibilities, Limitation of Liability, Governing Law, Changes to Terms, Contact Information
- Clean typography, readable line length (max-w-3xl)

### 4.3 PRIVACY POLICY PAGE (`/privacy`)
- Last updated date
- Sections: Information We Collect, How We Use Information, Data Sharing, Cookies, Data Security, Your Rights (GDPR/CCPA), Third-Party Services, Children's Privacy, Changes to Policy, Contact
- Cookie consent banner component (floating bottom, dismissible)

### 4.4 COOKIE POLICY PAGE (`/cookies`)
- What cookies we use (Necessary, Analytics, Marketing)
- How to manage cookies
- Link to privacy policy

### 4.5 CAREERS PAGE (`/careers`) — Optional but recommended
- "Join the Team" hero
- Open positions list (3-4 realistic roles: Senior React Dev, UI/UX Designer, AI Engineer, Digital Marketing Specialist)
- Each with: title, location, type (Full-time/Remote), brief description, "Apply" button
- Culture section with team photos/illustrations

---

## PHASE 5: NAVIGATION & GLOBAL ELEMENTS

### 5.1 Navbar (Sticky, Blur Backdrop)
- Logo left (text "Cubic" + icon or custom SVG logo)
- Center links: Home, Services (dropdown with 6 items), About, Contact
- Right: "Get a Quote" CTA button (gold, prominent)
- On scroll: add glassmorphism background (`backdrop-blur-md bg-white/80`)
- Mobile: hamburger menu with slide-in drawer

### 5.2 Footer (Comprehensive)
- 4-column grid as specified in Phase 3.1
- Newsletter: email input + "Subscribe" button
- Social icons: LinkedIn, Twitter/X, GitHub, Dribbble
- Copyright: `© 2026 Cubic Technologies. All rights reserved.`
- Links: Privacy, Terms, Cookies, Sitemap

### 5.3 Scroll-to-Top Button
- Appears after scrolling 400px
- Smooth scroll behavior
- Subtle, matches design system

### 5.4 Page Loading State
- Skeleton loaders for content sections
- Or subtle pulse animation while data loads

---

## PHASE 6: CONTENT & COPYWRITING

### 6.1 Replace ALL Generic Placeholder Text
- NO "Lorem ipsum" anywhere
- NO "Project 1", "Service 1" naming
- ALL text must be specific, benefit-driven, and professional
- Use realistic: company names, project descriptions, testimonial quotes, team names

### 6.2 Product/Project Names (Examples — customize):
- "NovaStream" — Real-time analytics dashboard for a fintech client
- "MediConnect" — Healthcare appointment platform with AI triage
- "RetailFlow" — Inventory management system with predictive restocking
- "EduSphere" — E-learning platform with adaptive AI tutoring

### 6.3 Testimonials (Realistic):
- "Cubic Technologies transformed our outdated platform into a modern, scalable solution. Their attention to detail is unmatched." — Sarah Chen, CTO, TechFlow Inc.
- "The AI integration they built increased our operational efficiency by 40%. Truly exceptional work." — Marcus Johnson, COO, DataDrive
- "Professional, communicative, and delivered on time. Our go-to development partner." — Priya Sharma, Founder, StartupLab

---

## PHASE 7: TECHNICAL REQUIREMENTS

### 7.1 Routing
- Ensure ALL routes work: `/`, `/about`, `/contact`, `/services`, `/services/web-development`, `/services/ai-solutions`, `/services/ui-ux-design`, `/services/digital-marketing`, `/services/web-applications`, `/services/maintenance`, `/admin`, `/terms`, `/privacy`, `/cookies`, `/careers`, `*`
- Update `App.tsx` router with new routes
- Add route-level code splitting with React.lazy() for performance

### 7.2 SEO
- Add `react-helmet-async` for page titles and meta descriptions
- Each page has unique: `&lt;title&gt;`, `&lt;meta name="description"&gt;`, `&lt;meta name="keywords"&gt;`
- Add Open Graph tags for social sharing
- Semantic HTML: proper `&lt;header&gt;`, `&lt;main&gt;`, `&lt;section&gt;`, `&lt;article&gt;`, `&lt;footer&gt;` usage
- Add structured data JSON-LD for Organization and LocalBusiness

### 7.3 Accessibility
- All images have descriptive `alt` text
- Color contrast meets WCAG AA (4.5:1 for text)
- Keyboard navigation works for all interactive elements
- Focus states visible and styled
- ARIA labels where needed
- Skip-to-content link

### 7.4 Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Test: iPhone SE, iPhone 14, iPad, Laptop, Desktop
- Touch targets minimum 44x44px
- Horizontal scroll NEVER occurs

---

## PHASE 8: ASSETS & IMAGES

### 8.1 Image Strategy
- Use high-quality Unsplash images for: hero backgrounds, team photos, project screenshots
- All images: WebP format where possible, lazy-loaded, with fallback
- Placeholder strategy: use `https://images.unsplash.com/` URLs for now, replace with actual assets later
- Icons: Lucide React ONLY (consistent, lightweight)
- NO emojis as icons — use Lucide

### 8.2 Logo
- Create a simple SVG logo: geometric cube/hexagon + "Cubic" text
- Favicon: 32x32 and 180x180 PNG/SVG
- Logo should work on both light and dark backgrounds

---

## PHASE 9: BACKEND UPDATES

### 9.1 Extend Schema
Add to `shared/schema.ts`:
- `newsletterSubscriptions` table (email, subscribedAt)
- `contactSubmissions` table (extend existing consultationRequests with: status, notes, assignedTo)

### 9.2 Admin API Endpoints
- `GET /api/admin/submissions` — list all (protected)
- `PATCH /api/admin/submissions/:id` — update status
- `DELETE /api/admin/submissions/:id` — delete
- `GET /api/admin/stats` — dashboard counts
- Add simple middleware auth check for `/api/admin/*` routes

### 9.3 Newsletter Endpoint
- `POST /api/newsletter` — store email, return success

---

## PHASE 10: FINAL CHECKLIST

Before marking complete, verify:
- [ ] Zero console errors/warnings
- [ ] Zero TypeScript errors (`npm run check` passes)
- [ ] All routes render correctly
- [ ] Mobile responsive on all breakpoints
- [ ] All forms validate and submit correctly
- [ ] Admin page is protected
- [ ] SEO meta tags present on all pages
- [ ] Accessibility audit passes (WAVE or Lighthouse)
- [ ] Performance: Lighthouse score &gt; 90
- [ ] All text is professional, specific, and typo-free
- [ ] No placeholder "Lorem ipsum" or generic content remains
- [ ] Cookie banner displays on first visit
- [ ] All legal pages linked in footer
- [ ] CTA buttons present on every page
- [ ] Contact/Quote button accessible from every page

---

## IMPLEMENTATION NOTES

1. Work file by file. Start with the design system (colors, typography in Tailwind config + CSS variables), then global components (Navbar, Footer), then pages.
2. Use existing shadcn/ui components extensively — they are already installed.
3. Keep the existing project structure. Don't reorganize folders unless necessary.
4. The `client/src/components/ui/` folder has 30+ components — USE them. Don't rebuild what exists.
5. For new pages, create: `client/src/pages/Terms.tsx`, `client/src/pages/Privacy.tsx`, `client/src/pages/Cookies.tsx`, `client/src/pages/Careers.tsx`, `client/src/pages/Admin.tsx`
6. Update `client/src/App.tsx` to add new routes.
7. Update `server/routes.ts` to add admin and newsletter endpoints.
8. The existing `use-toast.ts` hook is perfect for form success/error notifications — use it.
9. Framer Motion is already a dependency — use `motion` components for animations.
10. Keep bundle size in mind — lazy load heavy pages.

---

## DELIVERABLE
A complete, production-ready, professional business website that:
- Looks like it was built by a top-tier design agency
- Has zero bugs, zero console errors, zero unused code
- Converts visitors into leads with strategic CTAs
- Has proper legal coverage (Terms, Privacy, Cookies)
- Has an admin dashboard to manage leads
- Performs excellently (fast, responsive, accessible)
- Could be shown to Fortune 500 clients without embarrassment

DO NOT deliver a generic template. Deliver a UNIQUE, PREMIUM, ESTABLISHED-FIRM website.