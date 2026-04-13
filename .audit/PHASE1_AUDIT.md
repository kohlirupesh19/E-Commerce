# Phase 1 Audit - The Obsidian Curator

Date: 2026-04-13
Scope audited in full:
- src/App.tsx
- src/views/admin/AdminDashboard.tsx
- src/views/admin/AdminProducts.tsx
- src/views/admin/AdminOrders.tsx
- src/views/admin/AdminCustomers.tsx
- src/views/admin/AdminCustomerProfile.tsx
- src/views/admin/AdminCoupons.tsx
- src/views/admin/AdminLayout.tsx
- package.json
- vite.config.ts

## 1) Forms Inventory

### Auth and account forms in App.tsx
- Login form (`view === 'login'`):
  - Fields present: `email`, `password`, `rememberMe`.
  - Submit handler: `handleLogin` (currently just `setView('home')`).
- Register form (`view === 'register'`):
  - Fields present: `name`, `email`, `phone`, `password`, `confirmPassword`, `agreeTerms`.
  - Submit handler: `handleRegister` (currently just `setView('home')`).
- Forgot password (`view === 'forgot-password'`):
  - Field present: `email`.
  - Submit handler: `handleForgotIdentify` (currently just `setView('login')`).
  - Gap: 3-step OTP flow (identify -> verify -> reset) is not implemented; only step-1 UI is functional.

### Checkout forms in App.tsx
- Checkout address (`view === 'checkout-address'`):
  - Inputs present in UI: full name, phone, pincode, address type, address line, city, state.
  - Gap: not wired to state DTO nor API; values are not persisted.
- Checkout payment (`view === 'checkout-payment'`):
  - Methods present in UI: card, UPI, netbanking, wallet, COD.
  - Card fields present: number, expiry, cvv, holder name.
  - Gap: no backend call, no payment tokenization, no Razorpay invocation.
- Checkout review (`view === 'checkout-review'`):
  - Terms checkbox present (`agreeTerms`) and finalize button.
  - Gap: finalize simulates timeout and local navigation; no order/payment verification API.

### Profile and miscellaneous forms in App.tsx
- Profile update form (`view === 'profile'`):
  - Fields present: full name, email, phone, DOB, gender selector.
  - Save button present (`Save Manifest`).
  - Gap: no API calls.
- Password change (`view === 'profile-security'`):
  - Fields present: current password, new password.
  - Button present (`Update Credentials`).
  - Gap: no API calls.
- Newsletter subscription:
  - Global footer form and additional page-specific footer forms present.
  - Local handlers: `submitNewsletter` and `handleNewsletterSubmit`.
  - Gap: local success message only, no `/api/newsletter/subscribe` call.
- Delivery pincode estimator (`view === 'product-detail'`):
  - Input + check button present.
  - Gap: static text only, no API.
- Cart coupon form (`view === 'cart'`):
  - Input + Apply button present.
  - Gap: no coupon validation API.
- New address form:
  - UI card and button in `profile-addresses` and `checkout-address` are present.
  - Gap: no create-address API submission.
- Product reviews:
  - Reviews tab/read button present in product-detail.
  - Gap: no review submission form and no reviews API integration.

### Admin forms in src/views/admin
- Admin product create/edit: UI buttons and editable controls are present in AdminProducts.
  - Gap: no bound form model, no CRUD API calls.
- Admin coupon create/edit: UI button/table present in AdminCoupons.
  - Gap: no CRUD API calls.
- Admin orders status update: quick status select + save button present in AdminOrders.
  - Gap: no PATCH API call.
- Admin customer role update: not implemented in current admin customer views.

## 2) Action Buttons and Current Behavior

### Implemented as UI-only navigation or local state
- Shop/category CTAs (`Shop Now`, category cards): navigate to `shop` or category views.
- `Add to Shopping Bag`: pushes item into local `cartItems` and navigates cart.
- `Immediate Acquisition`: visual button only; no logic.
- Wishlist heart actions: local `wishlistItems` add/remove only.
- `Move to Cart` from wishlist: local move logic only.
- Quantity +/- in cart: local `cartItems` quantity mutation only.
- Remove from cart: local removal only.
- `Apply` coupon: no-op UI.
- `Proceed to Checkout`: navigates to `checkout-address`.
- `Save & Continue` (address): navigates to `checkout-payment`.
- `Continue to Review` (payment): navigates to `checkout-review`.
- `Finalize Acquisition`: local loading simulation then navigates to `checkout-success` and clears local cart.
- `Track Order`: navigates to `order-tracking`.
- `Download Invoice`: button exists, no API.
- `Reorder`/`Return`: buttons exist, no API.
- Logout/Sign out in dropdown: sets view to login only.
- `Save Manifest`: button exists, no API.
- `Update Credentials`: button exists, no API.
- `Share Link`: button exists, no API.
- `Read All Reviews`: button exists, no API.
- `Acquire Selection` (bundle): button exists, no API.
- `Quick View`: navigates/selects product in local state.
- `View matching collection`/`Visit Store`: navigates using local category mapping.

### Admin actions currently static
- Create/edit/delete product buttons exist; no CRUD requests.
- Update order status controls exist; no request.
- Coupon management buttons exist; no request.
- Customer profile/admin role actions not wired.

## 3) Hardcoded Frontend State That Must Move To API

- `cartItems` local `useState` seeded with hardcoded items.
- `wishlistItems` local `useState` seeded with hardcoded items.
- `selectedProduct` entirely local.
- Product arrays all hardcoded in App.tsx:
  - `timepieceProducts`, `jewelryProducts`, `cameraProducts`, `electronicsProducts`, `leatherProducts`, `fashionProducts`, `footwearProducts`, `homeProducts`, `beautyProducts`, `sportsProducts`, `booksProducts`, `toysProducts`, `groceryProducts`, `mobileProducts`.
- Profile identity hardcoded (e.g., `Alexander Vance` in dropdown/profile).
- My orders cards hardcoded sample data.
- Admin dashboards/tables/charts entirely static in all admin views.

## 4) Routes Requiring Guards (Current vs Required)

### Required guarded routes (not currently enforced)
- Customer auth-guarded: cart, checkout-address, checkout-payment, checkout-review, checkout-success, order-tracking, my-orders, profile, profile-addresses, profile-payments, profile-notifications, profile-security, profile-help, wishlist.
- Admin auth+role guarded: admin-dashboard, admin-products, admin-orders, admin-customers, admin-customer-profile, admin-coupons.

### Current state
- There is no `isAuthenticated` state, token model, or role check in App.tsx routing.
- Admin views render based solely on `view` value.

## 5) Current Auth State Summary

- `handleLogin`, `handleRegister`, and `handleForgotIdentify` only navigate via `setView`.
- No API requests, no JWT, no refresh cookie/session restore.
- Profile dropdown and profile identity fields are hardcoded.

## 6) Frontend stack/config notes

- Frontend stack confirmed: React 19 + TypeScript + Vite + Tailwind + Motion + Lucide.
- App entry and routing are single-file view switching in App.tsx.
- `package.json` includes frontend + some server-side JS deps but no backend Java integration.
- `vite.config.ts` is frontend-only build config.

## 7) Audit Conclusion

- The current app is a high-fidelity UI prototype.
- Functional backend integration is currently absent across auth, catalog, cart, checkout, orders, profile, notifications, newsletter, and admin domains.
- Next implementation priority is backend foundation + auth + product/cart/order flows, then frontend API client/context migration and guard enforcement.
