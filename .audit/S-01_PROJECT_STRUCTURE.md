# S-01: Project Structure Audit

## Files in src/ Directory

### Pages/Components/Logic:
1. **App.tsx** - Monolithic application file containing:
   - All routes and view logic
   - All product data (hardcoded)
   - All components (NavBar, CategoryLayout, ProductDetail, Cart, Checkout, etc.)
   - Global state management (useState hooks)

2. **main.tsx** - React entry point
   - Renders App to #root

### Styling:
3. **index.css** - Global styles (Tailwind + custom)

## File Organization Summary:
- **No separate Pages folder** - all pages are conditional views in App.tsx
- **No Components folder** - all components inline in App.tsx
- **No Assets folder** - images sourced from Unsplash URLs (external) or Google Workspace URLs
- **No Data folder** - all product data hardcoded in App.tsx
- **No Utils folder** - utility logic embedded in App.tsx
- **No Routes file** - routing handled via conditional view state

## Total Lines: ~3400 lines in App.tsx

## Architecture Type: Monolithic Single-File App
