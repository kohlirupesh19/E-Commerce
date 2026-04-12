# Fixes and Findings

## Fixed

1. Homepage category navigation was inconsistent.
   - Error: the top homepage category bar opened `category-*` pages, while the lower `Curated Categories` grid sent only Timepieces to a category page and sent the other cards to the unfiltered boutique.
   - Fix: added a shared `shopCategoryOptions` list and wired both homepage category areas to open the boutique with the selected category applied.

2. The boutique did not have a real category filter.
   - Error: the boutique filtered only by search, price, rating, and sort, so category clicks could not apply a category.
   - Fix: added `selectedShopCategory`, category metadata on boutique products, and category-aware filtering.

3. The boutique category list missed Leather.
   - Error: `category-leather` existed as a view, but Leather was not present in the shared homepage/top category choices.
   - Fix: added Leather to the shared category options and included leather products in the boutique catalog filter.

4. Boutique applied filters were hard-coded.
   - Error: the boutique always showed static `Watchmaking` and `Newest` chips, and `Watchmaking` redirected to the Timepieces category page.
   - Fix: replaced those chips with live category/search/price/rating/sort chips that can be cleared in place.

5. Shop `Clear All` did not clear every filter.
   - Error: clearing shop filters reset price, rating, sort, and search, but it had no category state to clear.
   - Fix: added `clearShopFilters()` so category, price, rating, sort, and search reset together.

6. Category-page product links opened the wrong detail state.
   - Error: `Quick View` and product-name clicks on category pages called `setView('product-detail')` without setting the clicked product.
   - Fix: added `openProductDetail()` and passed product/category context from category cards into the detail page.

7. Product detail collection links bypassed the boutique filter.
   - Error: `View matching collection` and `Visit Store` used brand-only routing to category pages. This could misclassify brands that span categories.
   - Fix: those actions now open the boutique with the selected product's category filter, falling back to brand matching only when category metadata is missing.

8. Boutique product data was too narrow for category filtering.
   - Error: the boutique used a six-item hand-built list with a duplicate `The Midnight Chrono`, so many category filters would have no matching products.
   - Fix: the boutique now derives its catalog from the category product arrays and attaches rating/review/category metadata.

## Still Odd / Follow-Up

1. There are 61 placeholder `href="#"` links across `src/App.tsx` and admin views. These should become real navigation targets or buttons with explicit actions.
2. `src/App.tsx` has a likely bad Unsplash URL for `Limited Edition Teddy Bear`: `https://images.unsplash.com/photo-1590080876/teddy-bear...`.
3. Some controls are still mostly visual/no-op, including `Explore Deals`, `Availability`, and some `Apply Filters` buttons outside the fixed shop category flow.
4. Several mapped UI lists still use array indexes as React keys. Stable IDs would be safer if those lists ever reorder or mutate.

## Verification

- `npm run lint` passes.
- `npm run build` passes.
- Browser smoke test passes for both homepage category entry points: top category bar and lower `Curated Categories` grid open the boutique with the selected category chip applied.
