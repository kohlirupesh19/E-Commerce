# Route Migration: View-State SPA to URL-Routed App

Date: 2026-04-13
Scope: Phase 0 planning artifact for PRD execution

## Current Routing Baseline

The current app relies on client-side view state (`view`) as the primary route source of truth, with only admin URL hydration implemented.

Primary anchors in current implementation:
- `View` union and route surface: `src/App.tsx:16`
- route state source: `src/App.tsx:694`
- path hydration handler (`window.location.pathname`): `src/App.tsx:698-700`
- admin-only path handling list: `src/App.tsx:700`
- popstate wiring: `src/App.tsx:706-708`
- admin render gate: `src/App.tsx:978`
- admin branch switch: `src/App.tsx:982`

Major view render anchors in the current switch-style render tree:
- cart: `src/App.tsx:992`
- checkout-address: `src/App.tsx:1242`
- checkout-payment: `src/App.tsx:1480`
- checkout-review: `src/App.tsx:1807`
- checkout-success: `src/App.tsx:2052`
- order-tracking: `src/App.tsx:2261`
- my-orders: `src/App.tsx:2522`
- wishlist: `src/App.tsx:2756`
- profile: `src/App.tsx:2838`
- home: `src/App.tsx:3409`
- product-detail: `src/App.tsx:3741`
- shop: `src/App.tsx:4123`
- login/register/forgot-password: `src/App.tsx:4433`, `src/App.tsx:4648`, `src/App.tsx:4866`

Admin route checks in tests already rely on path-based entry:
- `tests/admin.spec.ts:5`
- `tests/admin.spec.ts:10`
- `tests/admin.spec.ts:15`
- `tests/admin.spec.ts:20`
- `tests/admin.spec.ts:25`
- `tests/admin.spec.ts:30`

## Target Route Map (PRD-Aligned)

### Public customer routes
- `home` -> `/`
- `shop` -> `/shop`
- `category-*` -> `/shop/:category`
- `product-detail` -> `/product/:slug`
- `cart` -> `/cart`
- `checkout-address` -> `/checkout/address`
- `checkout-payment` -> `/checkout/payment`
- `checkout-review` -> `/checkout/review`
- `checkout-success` -> `/order/confirmation`
- `order-tracking` -> `/order-tracking/:id`
- `my-orders` -> `/my-orders`
- `wishlist` -> `/wishlist`
- `profile` -> `/profile`
- `profile-addresses` -> `/profile/addresses`
- `profile-payments` -> `/profile/payments`
- `profile-notifications` -> `/profile/notifications`
- `profile-security` -> `/profile/security`
- `profile-help` -> `/profile/help`
- `login` -> `/login`
- `register` -> `/register`
- `forgot-password` -> `/forgot-password`

### Admin routes
- `admin-dashboard` -> `/admin/dashboard`
- `admin-products` -> `/admin/products`
- `admin-orders` -> `/admin/orders`
- `admin-customers` -> `/admin/customers`
- `admin-customer-profile` -> `/admin/customers/:id`
- `admin-coupons` -> `/admin/coupons`

## Migration Strategy

1. Introduce router provider and route table while preserving existing `view` state rendering during transition.
2. Add bidirectional sync layer:
   - URL -> view for all routes (not just admin).
   - view -> URL for in-app navigation calls.
3. Migrate one bounded section at a time:
   - first auth and top-level public pages,
   - then catalog/PDP/cart,
   - then checkout/order/profile,
   - finally admin path normalization (`/admin/*` tree).
4. Remove direct `setView` calls from shared navigation components once route handlers own navigation.
5. Keep legacy view parser behind a temporary compatibility flag until all deep links and tests pass.

## Exit Conditions for Route Migration

- All PRD page mapping paths resolve directly via URL without boot-time redirection hacks.
- Deep link reload works on every in-scope customer/admin route.
- Existing admin path smoke checks are updated to `/admin/*` paths and pass.
- `setView` is no longer a cross-app navigation primitive.
