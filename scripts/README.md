# Migration & Utility Scripts

This directory contains one-off transformation scripts used to refactor the main application code.

## Scripts Overview

- **remove_avatars.ts** — Removes user profile avatar UI elements from App.tsx
- **remove_avatars2.ts** — Additional avatar removal pass with different selectors
- **remove_avatars3.ts** — Third-pass avatar removal for edge cases
- **remove_links.ts / remove_links.js** — Strips external links from components
- **fix_navbars.ts** — Standardizes navigation bar styling and structure
- **standardize_headers.ts** — Unifies header component classes and styling
- **standardize_navs.ts** — Normalizes navigation element classes
- **unify_headers.ts** — Consolidates header component implementations

## Usage

These scripts execute direct transformations on `src/App.tsx`. They were typically run via:

```bash
npx tsx scripts/fix_navbars.ts
# or
node scripts/remove_links.js
```

**Note:** These are destructive operations. Ensure you have version control commits before running any of these scripts.

## Status

These scripts represent completed refactoring passes. May be archived or removed in future versions if their transformations have been permanently applied to the codebase.
