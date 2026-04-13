## Pass 2026-04-13-01
- Updated: `src/App.tsx`
- Added: `src/services/newsletter.ts`
- Added: `src/vite-env.d.ts`
- Updated: `.env.example`
- Updated: `README.md`
- Added: `docs/project_working_session/REPO_CONTEXT.md`
- Added: `docs/project_working_session/CURRENT_STEP.md`

Notes:
- Implemented real in-app informational pages for experience/client-care/footer links.
- Replaced multiple non-functional `href="#"` links with view-state navigation to dedicated pages.
- Wired newsletter submission to Supabase REST using env-driven setup with API key-first config.
- Added optional URL derivation from Supabase anon key issuer so only API key is required by default.
- Added URL/history sync for informational pages via `pushState`.
- Added duplicate-submit guards and disabled form controls for newsletter forms during pending requests.
- Tightened README SQL policy guidance for newsletter inserts (email format/source checks + lower(email) uniqueness index).

Verification:
- Ran `npm run lint` after changes.
- Result: pass (TypeScript no-emit check clean).
- Re-ran `npm run lint` after final safety fixes.
- Result: pass (TypeScript no-emit check clean).

Follow-up Improvements:
- Add database migration/seed docs for production-grade newsletter schema and anti-abuse controls.
- Consider extracting footer variants and info-page routing into separate frontend modules.

## Pass 2026-04-13-02
- Added: `src/components/BrandMark.tsx`
- Updated: `src/App.tsx`
- Updated: `src/views/admin/AdminLayout.tsx`
- Updated: `docs/project_working_session/REPO_CONTEXT.md`
- Updated: `docs/project_working_session/CURRENT_STEP.md`

Notes:
- Integrated uploaded brand logo from `pics/logo/image.png` via shared component.
- Replaced global customer top-nav icon with the uploaded logo.
- Added explicit logo rendering on login/register/forgot-password views.
- Updated admin shell branding so every admin page shows the uploaded logo.
- Kept existing typography and visual style while swapping icon marks to the provided image.

Verification:
- Ran `npm run lint`.
- Result: pass (TypeScript no-emit check clean).

Follow-up Improvements:
- Perform quick responsive QA (`npm run dev`) to fine-tune logo crop/size per viewport if desired.

## Pass 2026-04-13-03
- Updated: `src/components/BrandMark.tsx`
- Updated: `docs/project_working_session/REPO_CONTEXT.md`
- Updated: `docs/project_working_session/CURRENT_STEP.md`
- Updated: `docs/project_working_session/changes.md`

Notes:
- Corrected logo import path to existing repository asset location (`pics/logo/image.png`).
- Improved shared logo accessibility defaults for decorative placements (`alt=""` + `aria-hidden`).
- Switched shared logo loading behavior to lazy by default to reduce unnecessary eager image fetches.

Verification:
- Ran `npm run lint`.
- Result: pass (TypeScript no-emit check clean).

Follow-up Improvements:
- If needed, selectively set `loading="eager"` only on the single above-the-fold brand instance.
