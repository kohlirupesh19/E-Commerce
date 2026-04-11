# S-08: Cross-Link Related Pages

## Implemented

1. Product detail now links back to relevant collections
- Added a brand-to-category mapping helper.
- Added `View matching collection` action in product detail.
- `Visit Store` now routes to a related category route instead of a dead anchor.

2. Product detail footer links now route to real app views
- Replaced several `href="#"` placeholders with internal `setView(...)` navigation.
- Connected footer actions to `home`, `order-tracking`, `checkout-review`, `shop`, `profile-help`, `my-orders`, and `profile`.

3. Product detail newsletter is now functional
- Replaced static field/action with validated submit behavior.
- Reused newsletter handler and status feedback.

## Outcome
- Cross-page connectivity is materially improved.
- Dead-end links were reduced in high-traffic product detail journeys.
- Users can continue meaningful flows from detail pages without getting stuck.

## File Updated
- src/App.tsx
