# Client Ops Console

A client, project, and invoice operations dashboard for agencies and consultancies — built on Next.js 16, GraphQL, and Prisma.

**Live demo:** [https://client-ops-console-web.vercel.app/login](https://client-ops-console-web.vercel.app/login)

## Overview

Client Ops Console is an internal ops tool for a services business (an agency, consultancy, or similar) to run day-to-day client work from one place: who the clients are, what's being billed, and what state every project is in. It's built as a realistic internal dashboard rather than a marketing site or demo toy — real relational data (Postgres via Prisma), a real GraphQL API with server-enforced permissions, three distinct user roles with actually-different capabilities, and an E2E test suite that exercises those permission boundaries rather than just the happy path.

It's designed for three kinds of users on the same team: **Admins** who manage the account and see who's on the team, **Managers** who do the day-to-day work of creating clients/projects/invoices and moving work through the pipeline, and **Viewers** (e.g. a client-facing exec or a stakeholder) who need visibility without the ability to change anything.

## Features

- **Clients** — list with search and status filtering (Active / Onboarding / Inactive), create via a validated form dialog, edit, and a detail page showing a client's account manager, projects, and invoices in one view.
- **Dashboard** — portfolio KPIs (total clients, total MRR, active clients, onboarding count) and two Recharts bar charts (clients by status, top 5 clients by MRR).
- **Projects** — a 4-column Kanban board (Not Started / In Progress / Review / Done) built on `@dnd-kit`, with drag-and-drop status changes that persist via a GraphQL mutation. Fully keyboard-operable, not just mouse-only — covered by a dedicated Playwright test using Tab/Space/Arrow keys.
- **Invoices** — list with status filtering (Pending / Paid / Overdue) and creation via a form dialog.
- **Auth & permissions** — Auth.js v5 credentials login (bcrypt-hashed passwords) with three roles — `ADMIN`, `MANAGER`, `VIEWER` — enforced independently at three layers (see Architecture below), not just hidden buttons in the UI.
- **Settings** — profile card for every user; a Team directory (all users and their roles) visible to Admins only, gated both client-side and at the GraphQL resolver.
- **Dark mode** — manual light/dark toggle, persisted to `localStorage`, with a `beforeInteractive` inline script in the root layout to avoid a flash of the wrong theme on load.

A couple of honest scope notes: there's no delete on any entity yet (Clients and Projects support create + update, Invoices currently support create + read only — see the GraphQL schema), and the Prisma schema already defines `Task` and `AuditLog` models for future work that aren't wired into the GraphQL API or UI yet.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server components for auth-gated layouts, file-based routing, and a built-in API route for the GraphQL endpoint — one deployable for frontend and API. |
| Language | TypeScript 5 | End-to-end type safety from Prisma models through GraphQL resolvers to React components. |
| Styling | Tailwind CSS 4 | Utility-first styling with first-class dark-mode variants, no separate CSS-in-JS runtime cost. |
| Components | shadcn/ui (`base-nova` style, on `@base-ui/react`) + `lucide-react` | Owns the component source directly (copied in, not an opaque dependency) so it can be customized freely; built on Base UI primitives for accessible dialogs/selects/dropdowns out of the box. |
| API layer | GraphQL — Apollo Server 5 + Apollo Client 4 | The client detail page needs a client's account manager, projects, and invoices in a single request — GraphQL lets that page ask for exactly that nested shape in one round trip instead of three separate REST calls. |
| ORM / DB | Prisma 6 + Neon (serverless Postgres) | The data is genuinely relational (clients → projects → invoices, users → owned projects) with real foreign keys and enums; Postgres models that directly instead of working around a document store like Firebase. Neon gives a serverless Postgres that fits a Vercel-style deployment without managing a server. |
| Auth | Auth.js (next-auth) v5, Credentials provider, `bcryptjs` | JWT-based sessions with a role claim baked in, so both the middleware and GraphQL resolvers can read the role without an extra DB round trip per request. |
| Drag-and-drop | `@dnd-kit/core` + `@dnd-kit/sortable` | Actively maintained, and ships a real keyboard sensor out of the box — `react-beautiful-dnd`, the older common choice, is archived/unmaintained and never had first-class keyboard support. |
| Forms | `react-hook-form` + `zod` v4 | Uncontrolled inputs for performance, schema-based validation shared between the shape of the form and the shape of the GraphQL input types. |
| Component docs | Storybook 10 (`@storybook/nextjs-vite`) | Isolated, documented views of the reusable pieces (see Testing below) independent of app routing/auth/data-fetching. |
| E2E testing | Playwright 1.63 across Chromium/Firefox/WebKit | Real browser automation for auth flows, drag-and-drop, and RBAC — the things unit tests can't meaningfully cover. |
| Accessibility testing | `@axe-core/playwright` | Automated a11y scanning wired directly into the same E2E suite, run on every page on every PR rather than as a separate manual pass. |

## Architecture

**Data flow:** Neon Postgres → Prisma (typed models + migrations) → GraphQL resolvers (`lib/graphql/resolvers.ts`, served from `app/api/graphql`) → Apollo Client (`lib/apollo-wrapper.tsx`) → React Server/Client Components.

The GraphQL API only exposes what the UI actually needs — `clients`, `client(id)`, `projects`, `invoices`, and an admin-only `users` query, plus five mutations (`createClient`, `updateClient`, `createProject`, `updateProjectStatus`, `createInvoice`). There's no generic CRUD passthrough to the database.

**Three-layer RBAC.** This is the part worth calling out specifically: authorization is checked independently in three places, and that's deliberate, not redundant code left over from refactoring:

1. **`proxy.ts`** — Next.js 16's renamed middleware entry point. Wraps Auth.js's `auth` and matches on the protected route prefixes (`/dashboard`, `/clients`, `/projects`, `/invoices`, `/settings`), redirecting unauthenticated requests to `/login` before a protected route is ever rendered.
2. **`app/(dashboard)/layout.tsx`** — an async Server Component that independently calls `auth()` again and redirects if there's no session, *before* rendering the sidebar or any page content.
3. **`lib/graphql/resolvers.ts`** — every mutation calls `requireEditor()` (blocks the `VIEWER` role) and the `users` query calls `requireAdmin()` (blocks everyone except `ADMIN`), so permissions are enforced at the data layer regardless of what the UI does or doesn't render.

Layers 1 and 2 checking the same thing looks redundant at first glance, but it's defense-in-depth against exactly the kind of bug that became [CVE-2025-29927](https://github.com/advisories/GHSA-f82v-jwr5-mffw) — a Next.js middleware-bypass vulnerability where a crafted request header could skip middleware's auth check entirely on vulnerable versions. A layout that independently re-verifies the session server-side still protects the route even if the middleware layer is ever bypassed by a framework bug, a misconfiguration, or a future regression. Layer 3 exists because the GraphQL endpoint is reachable directly — a client-only permission check is not a permission check.

## Testing

**Storybook** documents four reusable, non-trivial components in isolation: `DataTable`, `ProjectCard`, `StatCard`, and `StatusPill` (`components/custom/*.stories.tsx`). The default Storybook CLI scaffolding examples have been removed, leaving only the project's real components documented.

**Playwright** runs 18 end-to-end tests across Chromium, Firefox, and WebKit (54 total runs) in five spec files:
- `auth.spec.ts` — login, wrong-password handling, logout, and redirect-when-unauthenticated
- `rbac.spec.ts` — Viewers don't see Add Client / New Project / New Invoice buttons or the Settings Team card; Admins/Managers do
- `clients.spec.ts` — create a client, search for it, open its detail page
- `projects.spec.ts` — create a project and drag it between Kanban columns (mouse), plus a keyboard-only version using dnd-kit's keyboard sensor
- `accessibility.spec.ts` — `@axe-core/playwright` scans every page (login, dashboard, clients, client detail, projects, invoices, settings) and fails the build on any serious/critical violation (moderate/minor findings are logged, not blocking)

**52 of 54 pass.** The two known failures, left visible rather than hidden or deleted:
- **Chromium — "signing out and revisiting /dashboard redirects to /login again."** Fails consistently against a production build (`next start`) but passes against the dev server — a next-auth session-cookie-clearing quirk specific to running in production mode.
- **Firefox — the mouse-drag Kanban test.** The "In Progress" column has accumulated 36 test-created projects from repeated suite runs against the same database, making the column far taller than any viewport; the test computes its drop target from the column's full bounding box, which lands off-screen in Firefox. Chromium and WebKit tolerate the same off-screen coordinate more often than not. Root cause is test-data buildup and a browser-specific pointer-simulation difference, not the drag-and-drop feature itself — the keyboard-sensor version of the same interaction passes on all three browsers.

## Performance

A full audit and optimization pass against a real production build (Lighthouse + `@next/bundle-analyzer`, not the dev server) turned up two concrete, high-impact issues:

- **Apollo Client + the GraphQL runtime (~46KB gzipped) were loading on every route, including `/login`**, because the Apollo provider lived in the root layout. Every page that actually queries GraphQL already lives under the authenticated `(dashboard)` route group, so the provider was scoped down to `app/(dashboard)/layout.tsx` only. `/login`'s total JS payload dropped from 399KB to 338KB (−15%).
- **The Dashboard's Recharts bundle (~100KB gzipped, including its internal Redux Toolkit-based state store) was a static import**, blocking initial JS parsing before any chart data had even arrived. Switched to `next/dynamic` with `ssr: false` and a skeleton fallback — the chunk now starts loading roughly a second *after* first paint instead of before it.

A matching dynamic-import was attempted for the `@dnd-kit` Kanban board on Projects and then **deliberately reverted** — it broke real mouse-drag in Firefox specifically (dnd-kit's rect-measurement doesn't reliably settle when the whole `DndContext` mounts async instead of during hydration). Given dnd-kit's chunk is only ~16KB gzipped versus Recharts' ~100KB, the payoff didn't justify the cross-browser risk, so the Kanban board stays a static import. That's a trade-off decision, not an unfinished optimization.

## Accessibility

`@axe-core/playwright` is wired directly into the Playwright suite (see Testing above) rather than run as a one-off manual pass, so accessibility regressions get caught the same way functional ones do.

Fixes reflected in the current codebase: decorative status-indicator dots (`StatusPill`) are marked `aria-hidden="true"` so screen readers announce the status text once, not the dot and the text; icon-only buttons — the sidebar theme toggle and sign-out button — have explicit `aria-label`s (and their icons are `aria-hidden`); the login page is wrapped in a `<main>` landmark. Color contrast on the Clients/Invoices filter tabs and the client detail page's placeholder text was raised to meet WCAG AA (4.5:1) after an automated audit flagged both as insufficient.

The Projects Kanban board is fully keyboard-operable: Tab reaches a card, Space/Enter picks it up, arrow keys move it between columns, Space/Enter drops it — powered by `@dnd-kit`'s `KeyboardSensor`, and covered by its own Playwright test rather than just the mouse-drag path.

Lighthouse's own accessibility audit still flags a couple of moderate-severity items (color contrast and heading order on the Projects page) that don't rise to the "serious/critical" threshold the Playwright/axe gate enforces.

## Local setup

```bash
git clone https://github.com/UmarAbdullah2124/client-ops-console.git
cd client-ops-console
npm install
```

Create a `.env` with:

```
DATABASE_URL=   # Neon (or any Postgres) connection string — the only DB var Prisma actually reads
AUTH_SECRET=    # openssl rand -base64 32
```


Then:

```bash
npx prisma migrate dev   # create the schema
npx prisma db seed       # seeds 3 users — admin/manager/viewer @clientops.dev, password: password123
npm run dev              # http://localhost:3000
```

Other useful commands:

```bash
npm run storybook        # component docs, http://localhost:6006
npx playwright test      # full E2E suite (spins up its own dev server)
npm run build && npm run start   # production build — for a self-hosted (non-Vercel) start,
                                  # Auth.js requires AUTH_TRUST_HOST=true to be set
```