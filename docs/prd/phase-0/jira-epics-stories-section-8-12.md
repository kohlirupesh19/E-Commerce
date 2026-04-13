# Jira Epics and Stories (PRD Sections 8 and 12)

Date: 2026-04-13
Source: PRD for The Obsidian Curator production transformation

## Epic ECOM-PLATFORM-01: Customer and Admin Functional Requirements (Section 8)

### Story ECOM-PLATFORM-01-01 (CUS-01)
Summary: Implement account registration/login/logout/refresh/forgot/reset backend endpoints and wire frontend auth lifecycle.
Acceptance criteria:
- User can register, login, logout, refresh, request password reset, and reset password.
- All auth endpoints validate input and return typed error envelopes.
- Session/token lifecycle supports short-lived access tokens and rotating refresh tokens.

### Story ECOM-PLATFORM-01-02 (CUS-02, CUS-03)
Summary: Implement catalog browse/filter/search/PDP endpoints and bind route query state.
Acceptance criteria:
- Product list supports category, price, rating filters and search query params.
- PDP endpoint returns product media, variants, stock, reviews summary, and related products.
- Query params remain stable on refresh/back/forward navigation.

### Story ECOM-PLATFORM-01-03 (CUS-04, CUS-05, CUS-06)
Summary: Build persistent cart and checkout/payment intent flow.
Acceptance criteria:
- Cart add/update/remove persists server-side by user/session.
- Checkout address/payment/review validations run server-side.
- Payment intent and confirmation are idempotent; webhook reconciliation is implemented.

### Story ECOM-PLATFORM-01-04 (CUS-07, CUS-08)
Summary: Deliver order history/tracking and wishlist operations.
Acceptance criteria:
- Order history/tracking returns statuses, line items, totals, and shipment events.
- Wishlist add/remove and move-to-cart operations persist server-side.

### Story ECOM-PLATFORM-01-05 (CUS-09, CUS-10)
Summary: Remove placeholder legal links and complete responsive QA gates.
Acceptance criteria:
- Footer/legal placeholders route to real pages.
- Mobile/tablet/desktop QA for core journeys is documented and passing.

### Story ECOM-PLATFORM-01-06 (ADM-01, ADM-08)
Summary: Enforce admin RBAC and audit logging baseline.
Acceptance criteria:
- Admin routes deny unauthorized users.
- Sensitive admin actions write audit entries with actor, target, timestamp, and diff.

### Story ECOM-PLATFORM-01-07 (ADM-02)
Summary: Product management CRUD with variants/media/inventory fields.
Acceptance criteria:
- Admin can create, update, archive/unarchive products and variants.
- SKU uniqueness and publish-state constraints are enforced.

### Story ECOM-PLATFORM-01-08 (ADM-03)
Summary: Order operations and allowed status transitions.
Acceptance criteria:
- Admin order list supports filters/sort and detail view.
- Status changes enforce finite state transition rules.

### Story ECOM-PLATFORM-01-09 (ADM-04)
Summary: Customer management and profile timeline tooling.
Acceptance criteria:
- Admin can search customers and view profile, flags/status, and order history.
- Internal support notes are visible only to authorized roles.

### Story ECOM-PLATFORM-01-10 (ADM-05)
Summary: Coupon lifecycle and usage controls.
Acceptance criteria:
- Admin can create/update/expire coupons with rules and limits.
- Redemption limits and anti-abuse checks are enforced.

### Story ECOM-PLATFORM-01-11 (ADM-06, ADM-07)
Summary: Dashboard metrics and CSV export with permission checks.
Acceptance criteria:
- Dashboard KPI endpoints return backend-derived data.
- CSV export endpoints require proper permissions and emit audit events.

## Epic ECOM-PLATFORM-02: API Surface and Platform Capabilities (Section 12 + Section 8.3)

### Story ECOM-PLATFORM-02-01 (PLT-01)
Summary: Establish versioned API-first architecture and contract governance.
Acceptance criteria:
- `/api/v1/*` namespace is canonical for web consumption.
- OpenAPI 3.1 contract is versioned and published with CI validation.

### Story ECOM-PLATFORM-02-02 (PLT-02)
Summary: Implement durable PostgreSQL schema and migration workflow.
Acceptance criteria:
- Core entities from PRD section 11 exist with constraints.
- Migrations are deterministic and rollback strategy is documented.

### Story ECOM-PLATFORM-02-03 (PLT-03)
Summary: Add Redis caching/session/rate-limiting baseline.
Acceptance criteria:
- Rate limits are active on auth, checkout, coupon, and search endpoints.
- Session/cache key policies and TTLs are documented.

### Story ECOM-PLATFORM-02-04 (PLT-04)
Summary: Implement worker/event processing for payments and notifications.
Acceptance criteria:
- Worker consumes webhook/notification jobs with retry and DLQ strategy.
- Duplicate event handling is idempotent.

### Story ECOM-PLATFORM-02-05 (PLT-05)
Summary: Observability baseline before go-live.
Acceptance criteria:
- Structured logs, metrics, and traces are emitted from API and worker.
- Alert rules and on-call escalation for Sev-1 incidents are defined.

### Story ECOM-PLATFORM-02-06 (PLT-06)
Summary: Security baseline controls for OWASP risks.
Acceptance criteria:
- Input schema validation, authz checks, CSRF protection, and secure cookie settings are enforced.
- Webhook signatures, replay mitigation, and secret management are validated.

## API Endpoint Story Mapping (Section 12)

### Story ECOM-API-01: Public Auth APIs
Endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`

### Story ECOM-API-02: Catalog APIs
Endpoints:
- `GET /api/v1/categories`
- `GET /api/v1/products`
- `GET /api/v1/products/:id`
- `GET /api/v1/products/:id/related`

### Story ECOM-API-03: Cart and Checkout APIs
Endpoints:
- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PATCH /api/v1/cart/items/:itemId`
- `DELETE /api/v1/cart/items/:itemId`
- `POST /api/v1/checkout/quote`
- `POST /api/v1/checkout/intent`
- `POST /api/v1/checkout/confirm`

### Story ECOM-API-04: Orders, Wishlist, Profile APIs
Endpoints:
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `GET /api/v1/orders/:id/tracking`
- `GET /api/v1/wishlist`
- `POST /api/v1/wishlist/items`
- `DELETE /api/v1/wishlist/items/:itemId`
- `GET /api/v1/profile`
- `PATCH /api/v1/profile`
- `GET /api/v1/profile/addresses`
- `POST /api/v1/profile/addresses`

### Story ECOM-API-05: Admin APIs
Endpoints:
- `GET /api/v1/admin/dashboard/overview`
- `GET /api/v1/admin/products`
- `POST /api/v1/admin/products`
- `PATCH /api/v1/admin/products/:id`
- `GET /api/v1/admin/orders`
- `PATCH /api/v1/admin/orders/:id/status`
- `GET /api/v1/admin/customers`
- `GET /api/v1/admin/customers/:id`
- `PATCH /api/v1/admin/customers/:id`
- `GET /api/v1/admin/coupons`
- `POST /api/v1/admin/coupons`
- `PATCH /api/v1/admin/coupons/:id`
- `POST /api/v1/admin/coupons/:id/expire`

## Priority and Sequencing

1. ECOM-PLATFORM-02-01 and ECOM-PLATFORM-02-02
2. ECOM-API-01 and ECOM-API-02
3. ECOM-API-03 and ECOM-PLATFORM-02-04
4. ECOM-API-04 and ECOM-API-05
5. ECOM-PLATFORM-02-05 and ECOM-PLATFORM-02-06
