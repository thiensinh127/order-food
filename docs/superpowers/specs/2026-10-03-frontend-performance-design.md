# Frontend Performance Design

## Goal

Reduce the initial payload, make menu filtering and pagination server-driven,
keep cart details independent of the currently selected menu category, and make
network delays recoverable without duplicating write operations.

## Scope

- Remove unused local food-image imports from the frontend bundle.
- Convert retained frontend PNG UI assets to WebP where they are loaded by the
  application; backend-uploaded food images remain served by the backend.
- Request the selected category through the existing food-list API and reset
  pagination when that category changes.
- Extend the cart read API to return the food records for non-zero cart items.
- Use a shared Axios client with a 60-second timeout and one retry for GET
  requests only.
- Lazy-load non-home routes and remove all ESLint errors and warnings.

## API Contract

`GET /api/food/list?page=<positive integer>&limit=<positive integer>&category=<optional string>`
already returns `{ success, data, total, page, limit }`. The frontend sends the
category only when it is not `All`.

`GET /api/cart/get` will return:

```json
{
  "success": true,
  "cartData": { "foodId": 2 },
  "items": [{ "_id": "foodId", "name": "…", "price": 12, "image": "…" }]
}
```

`items` contains only records whose stored cart quantity is greater than zero.
The server remains the source of truth for the result, while the client applies
optimistic quantity changes and refetches the cart after a successful cart
write.

## Frontend Data Flow

The selected category resets `page` to 1, clears menu data, and requests a
fresh first page. Each successful page appends de-duplicated records and uses
`total` to decide whether more pages exist. The active request is aborted when
the category or page changes, so late responses cannot mix categories.

`food_list` represents the active menu only. `cartFoodList` represents the
cart’s resolved food records and drives the cart page and total calculation.

The shared API client retries a failed GET exactly once after a short delay. It
does not retry POST requests, avoiding duplicate cart writes or payment orders.
Timeout and final failure produce a user-facing toast with an actionable retry
path for menu loading.

## Asset and Loading Strategy

The local static `food_list` export and its 32 image imports are removed because
products are rendered from API data. Remaining UI images are converted to WebP
and import paths updated. The hero background remains one public WebP asset.

`Home` remains eager. `Cart`, `PlaceOrder`, `Verify`, and `MyOrders` load via
`React.lazy` inside a small `Suspense` fallback.

## Error Handling and Accessibility

Loading states reserve image space. Aborted requests are silent. Retry is only
available for read failures. Existing cart controls preserve their accessible
labels, and the flight animation continues to respect reduced-motion settings.

## Verification

- Native Node tests cover menu-query construction and cart-flight keyframes.
- Frontend: `npm test`, `npm run build`, and `npm run lint`.
- Backend: endpoint-level tests for category query and resolved cart items,
  plus its existing start/lint checks if present.
