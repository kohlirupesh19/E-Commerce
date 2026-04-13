# Repo Context

## Project Name
The Obsidian Curator - premium e-commerce SPA with staged backend and worker services.

## Architecture Overview
- Frontend: React + TypeScript in `src/App.tsx` using a view-state router (`View` union and `setView`).
- Backend: Express API scaffold and domain routes under `services/api`.
- Worker: BullMQ/Redis scaffold under `services/worker`.
- Docs: PRD and implementation notes under `docs/prd` and this `docs/project_working_session` folder.

## Key Dependencies
| Package | Purpose |
|---------|---------|
| react | UI rendering |
| motion | UI transitions |
| lucide-react | iconography |
| vite | frontend build and dev server |
| express | backend APIs |
| @prisma/client | DB client for backend services |

## Environment
- Language/runtime: Node.js + TypeScript
- Package manager: npm
- Frontend typecheck command: `npm run lint`
- API test command: `npm --prefix services/api test`

## Current UX Routing Pattern
- No full router package is used.
- UI navigation is controlled by `view` values in `src/App.tsx`.
- URL hydration supports admin routes and selected informational routes via `window.location.pathname` mapping.
- Informational page navigation now uses `history.pushState` so these pages become URL-shareable and browser back/forward friendly.

## New Informational Pages (2026-04-13)
- Added informational view pages:
  - `private-suite`
  - `authenticity-guarantee`
  - `boutique-locations`
  - `client-care`
  - `shipping-etiquette`
  - `terms-of-service`
  - `curator-concierge`
- Footer and legal links across major views now route to these pages instead of `href="#"` placeholders.

## Newsletter Integration (Supabase)
- Frontend newsletter submit now posts directly to Supabase REST using:
  - `VITE_SUPABASE_API_KEY` (required)
  - `VITE_SUPABASE_URL` (optional; derived from key issuer if absent)
- Integration utility is in `src/services/newsletter.ts`.
- Required client env types are declared in `src/vite-env.d.ts`.
- Submission flow includes client-side email normalization (`trim().toLowerCase()`), duplicate-submit guards, and disabled submit controls while pending.

## Brand Asset Integration (2026-04-13)
- Shared logo component added at `src/components/BrandMark.tsx`, sourcing the asset from `pics/logo/image.png`.
- Logo is now rendered in:
  - global customer top navigation (`TopNavBar` in `src/App.tsx`),
  - auth pages (login/register/forgot-password branding blocks in `src/App.tsx`),
  - admin shell (`src/views/admin/AdminLayout.tsx`).
- This ensures each primary page family (customer, auth, admin) displays the uploaded brand logo.

## Assumptions & Constraints
- Supabase table and insert policy for `newsletter_subscribers` must exist for writes to succeed.
- Existing app remains primarily monolithic in `src/App.tsx`; refactoring into smaller feature modules is still pending.
