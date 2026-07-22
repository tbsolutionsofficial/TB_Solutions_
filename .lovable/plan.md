
# TB_Solutions — Phase 2 Frontend Build

Frontend-only. No backend, no auth, no DB. Mock data everywhere. Existing brand, palette, and typography preserved.

## Scope & delivery order

Given the volume, I'll ship it in **two staged commits inside this turn** so nothing is skipped but you can watch it come in:

### Stage A — Website enhancements
1. **Navigation** — remove wordmark, enlarge logo, new links (Domains, Projects, Gallery, Testimonials, About, Process, Contact) + "Get In Touch". Sticky glass, scroll-shrink, active indicator with animated underline.
2. **Custom cursor** — replace existing orange dot with a light-bulb cursor (SVG). Float easing, soft glow, hover states: buttons (glow+sparks+scale), cards (tilt+glow), links (pulse), inputs (pencil mode), CTAs (fire particles), images (bounce). Section-color reactive via `data-cursor` attributes.
3. **Hero** — keep layout; add head sway, chest+torch glow pulses, mouse+scroll parallax on robot; drone rotor spin & hover bob; orb fire particles; animated gradient rays; magnetic CTA buttons.
4. **Domain cards** — hover morphs card into animated banner (image, title, subtitle, CTA, particle bg). Click routes to `/domains/$slug`. Dedicated domain page template with Hero / Overview / Services / Projects / Gallery / Process / FAQ / Testimonials / Contact CTA. All content driven by a mock `domainsContent` map so 4+ slugs share one page.
5. **Process cards** — hover reveals animated process banner (image, title, description, motion accent).
6. **Gallery section** (new) — masonry grid, image+video support, category filter chips, lightbox with keyboard nav, lazy-load, glass cards.
7. **Testimonials section** (new) — auto-sliding marquee, pause on hover, avatar/name/company/stars/review/domain/date.
8. **Contact form** — replace toast with animation sequence: button morph → loading ring → orange energy ring → holographic robot → checkmark → success text → confetti. Uses react-hook-form + zod.
9. **Terms page** — `/terms`, markdown-rendered mock content, linked from footer.
10. **Editability posture** — every section pulls copy/images from `src/content/*.ts` mock modules so a future CMS can swap in fetched data with zero JSX change.

### Stage B — Admin panel (`/admin`)
- **Layout**: sidebar (desktop) + bottom nav (mobile), sticky header with dynamic title, email badge, notification bell.
- **Routes** under `/admin/`:
  `dashboard`, `projects`, `projects/new`, `projects/$id`, `gallery`, `testimonials`, `reviews`, `domains`, `domains/$id`, `domain-banners`, `process-banners`, `offers`, `contacts`, `content`, `media`, `terms`, `settings`.
- **Dashboard**: stat cards, recent contacts, pending reviews, recent projects, quick actions, mock chart (Recharts).
- **Projects**: DataTable with search / filter / pagination, @dnd-kit reorder, status badges. New/Edit form with every field listed (title, descriptions, category, domain, subdomain, tech stack, tags, images, videos, all URLs, PDF, case study, client info, dates, status, featured, sort, SEO fields).
- **Domains / Domain Banners / Process Banners**: CRUD UI + drag reorder + preview.
- **Gallery**: uploader stubs (mock), category/album/tag management, reorder, delete.
- **Testimonials / Reviews**: pending/approved/rejected tabs, approve/reject/edit/delete.
- **Contacts**: table + slide-over detail with reply buttons (mailto/wa.me) + unread highlight.
- **Offers**: card CRUD with discount/expiry/domain scoping and toggle.
- **Content CMS**: tabs for Hero, Navbar, Footer, About, Contact, Statistics, CTA, Social Links, Terms, Homepage — bound to same mock content store the site reads from.
- **Media Library**: folder tree, image/video grid, search, preview, "insert" affordance.
- **Settings**: Admin, Site, Business, Danger Zone (export button = downloads mock JSON).

### Reusable components (`src/components/admin/`)
Sidebar, Header, StatCard, DataTable, ImageUploader, VideoUploader, TagInput, DragList, Lightbox, SlideOver, ConfirmDialog, StarRating, Badge, Pagination, SearchBar, FilterBar, Tabs wrapper, RichEditor (contentEditable + toolbar mock).

## Technical notes

- Routing: TanStack file-based. New route files:
  `domains.tsx` (layout), `domains.index.tsx`, `domains.$slug.tsx`, `gallery.tsx`, `testimonials.tsx`, `terms.tsx`, `projects.tsx`, `projects.$id.tsx`, `_admin.tsx` layout, plus every admin subroute under `_admin.*`.
- Mock data in `src/content/` (site copy) and `src/mock/` (admin entities). Both use plain TS objects so a later server function can swap them out.
- Cursor: single global `<LightbulbCursor />` mounted in `__root.tsx`, listens for `data-cursor` on hovered element to pick variant. Existing `CursorGlow` removed.
- @dnd-kit for drag reorder; framer-motion for transitions; GSAP+ScrollTrigger for hero/banner morphs; Lenis stays.
- Accessibility: focus-visible rings, aria-labels on icon buttons, dialogs use shadcn primitives.
- No backend calls. Forms simulate latency with `setTimeout` and log payload to console.

## Out of scope (explicit)

- No Supabase / Lovable Cloud enablement.
- No auth screens (admin assumes logged in).
- No real uploads — uploader components accept files, preview via `URL.createObjectURL`, store in local state only.
- No email sending — contact form only animates + logs.

## Deliverable

At the end of the turn: a summary listing (1) website features, (2) new sections, (3) animations, (4) admin pages, (5) components, (6) CMS-ready areas, (7) backend tasks still needed, (8) folder structure, (9) recommended next phase.

Confirm and I'll build it end-to-end.
