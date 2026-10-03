# Frontend Performance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce frontend payload and make menu/category/cart data reliable during pagination and slow API responses.

**Architecture:** The active food menu remains separate from resolved cart food records. A shared Axios client handles read timeouts/retry while write requests remain single-shot. The existing backend list endpoint receives the selected category; the cart read endpoint adds resolved food records.

**Tech Stack:** React 19, Vite 6, Axios, Express 5, Mongoose 8, Node built-in test runner.

**Spec:** `docs/superpowers/specs/2026-10-03-frontend-performance-design.md`

## Global Constraints

- Do not add dependencies; use native Node tests, browser APIs, Axios, React, and existing build tooling.
- Keep `VITE_API_URL` environment-based; do not hard-code backend URLs.
- Retry only idempotent GET operations exactly once; never retry cart writes, authentication, or payment requests.
- Preserve `prefers-reduced-motion` behavior for cart animation.
- Backend work is in `/Applications/Code/food/backend` on its own Git branch; frontend work is in this repository.

## Review Focus

- Category changes during an in-flight request must not append stale items from the previous category.
- A cart item outside the active category must still render and contribute to the total.
- A backend timeout must show a retryable menu error instead of leaving perpetual skeletons.
- A failed POST must never be automatically replayed.
- Empty or malformed pagination metadata must stop loading safely rather than loop indefinitely.

---

### Task 1: Remove unused local food assets and convert retained UI images

**Files:**
- Modify: `src/assets/assets.js`
- Modify: `src/components/Header/Header.css`
- Modify: imports that reference converted UI images
- Create: retained `.webp` counterparts under `src/assets/` and `public/`
- Delete: unused local `src/assets/food_*.png` files and superseded PNG UI assets

**Interfaces:**
- Consumes: API-owned `image` filenames rendered as `${VITE_API_URL}/images/${image}`.
- Produces: `assets` and `menu_list` with unchanged property names and WebP URLs.

- [ ] **Step 1: Measure the existing emitted asset set**

Run: `npm run build && find dist/assets -type f -print0 | xargs -0 stat -f '%z %N' | sort -nr | head -20`

Expected: static local food images and the duplicated hero asset appear in output.

- [ ] **Step 2: Convert only retained UI images to WebP**

Use macOS `sips` to create WebP copies for the logo, icons, menu thumbnails, app badges, and hero background; keep dimensions and update imports/background URL.

- [ ] **Step 3: Remove the static `food_list` export and all its food-image imports**

Keep only the `assets` and `menu_list` exports used by frontend components. Remove source food PNGs after confirming no imports remain with `rg 'food_[0-9]+' src`.

- [ ] **Step 4: Build and compare payload**

Run: `npm run build`

Expected: no `food_*.png` files are emitted by the frontend build and the hero is emitted once.

- [ ] **Step 5: Commit**

```bash
git add src/assets public src/components/Header/Header.css
git commit -m "perf: remove unused food assets"
```

### Task 2: Add safe API read helpers and tests

**Files:**
- Create: `src/api/client.js`
- Create: `src/api/food.js`
- Create: `test/foodApi.test.js`
- Modify: `package.json` only if a test command needs expansion

**Interfaces:**
- Produces: `createFoodListParams({ page, limit, category }): URLSearchParams` and `getWithRetry(request, signal): Promise<ResponseData>`.
- Consumes: `VITE_API_URL`; an Axios instance with 60,000 ms timeout.

- [ ] **Step 1: Write a failing unit test for category query construction**

```js
assert.equal(createFoodListParams({ page: 1, limit: 6, category: "All" }).toString(), "page=1&limit=6");
assert.equal(createFoodListParams({ page: 2, limit: 6, category: "Salad" }).toString(), "page=2&limit=6&category=Salad");
```

- [ ] **Step 2: Run the test and verify it fails because the helper is absent**

Run: `npm test -- test/foodApi.test.js`

Expected: FAIL with missing module or missing export.

- [ ] **Step 3: Implement the minimal API client and query helper**

Use Axios `signal` support. Retry a GET once only when the failure is neither an abort nor a client-side 4xx response.

- [ ] **Step 4: Run the targeted test and complete suite**

Run: `npm test`

Expected: PASS with both food-query and cart-flight tests.

- [ ] **Step 5: Commit**

```bash
git add src/api test package.json
git commit -m "feat: add resilient API read client"
```

### Task 3: Return resolved cart items from the backend

**Files:**
- Modify: `/Applications/Code/food/backend/controllers/cartController.js`
- Create: `/Applications/Code/food/backend/test/cartController.test.js`
- Modify: `/Applications/Code/food/backend/package.json`

**Interfaces:**
- Produces: `GET /api/cart/get` response `{ success, cartData, items }`.
- Consumes: authenticated user cart map and `foodModel` documents.

- [ ] **Step 1: Write a failing controller test for a cart containing an item outside the active menu**

The test asserts that an entry with quantity `2` returns its resolved food record in `items`, while entries with quantity `0` do not.

- [ ] **Step 2: Run the backend test and verify it fails against the current `{ cartData }` response**

Run: `npm test -- test/cartController.test.js`

Expected: FAIL because `items` is absent.

- [ ] **Step 3: Implement `getCart` resolved-item query**

Import `foodModel`, select IDs whose quantity is greater than zero, query them with `$in`, and return `items` with `cartData`. Return an empty array when the cart is empty.

- [ ] **Step 4: Run backend tests**

Run: `npm test`

Expected: PASS; no database write is made by the read endpoint.

- [ ] **Step 5: Commit in backend repository**

```bash
git -C /Applications/Code/food/backend add controllers/cartController.js test package.json
git -C /Applications/Code/food/backend commit -m "feat: include cart item details"
```

### Task 4: Separate active menu state from cart state

**Files:**
- Modify: `src/context/StoreContext.jsx`
- Modify: `src/components/FoodDisplay/FoodDisplay.jsx`
- Modify: `src/components/ExploreMenu/ExploreMenu.jsx`
- Modify: `src/pages/Home/Home.jsx`
- Modify: `src/pages/Cart/Cart.jsx`
- Modify: `src/pages/PlaceOrder/PlaceOrder.jsx`

**Interfaces:**
- Consumes: `getWithRetry`, `createFoodListParams`, and cart response `items`.
- Produces: context values `food_list`, `cartFoodList`, `retryFoodList`, `loading`, `error`, `hasMore`, `setCategory`-driven reset behavior.

- [ ] **Step 1: Write a failing test for appending a new page without duplicate IDs**

Use literal first-page and second-page fixtures where one ID repeats; assert the merged result retains each ID once and preserves first-page order.

- [ ] **Step 2: Run the test and verify it fails because the merge helper is absent**

Run: `npm test -- test/foodApi.test.js`

Expected: FAIL with missing merge helper.

- [ ] **Step 3: Implement abortable category-aware fetching**

Reset `page`, `food_list`, and `hasMore` on category change. Abort prior GET requests in effect cleanup. On success, merge de-duplicated results; on failure show a retry control unless the request was aborted.

- [ ] **Step 4: Drive cart display and totals from `cartFoodList`**

Load resolved items on authentication and after confirmed cart mutations. Use those items in Cart and PlaceOrder, never the active menu list.

- [ ] **Step 5: Run frontend tests and build**

Run: `npm test && npm run build`

Expected: PASS; build completes with current routes.

- [ ] **Step 6: Commit**

```bash
git add src/context src/components/FoodDisplay src/components/ExploreMenu src/pages/Home src/pages/Cart src/pages/PlaceOrder test
git commit -m "feat: make menu filtering and cart data independent"
```

### Task 5: Lazy-load secondary routes and clear lint findings

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/context/StoreContext.jsx` and, if needed, create a standalone context definition module
- Modify: `src/pages/MyOrders/MyOrders.jsx`
- Modify: `src/pages/PlaceOrder/PlaceOrder.jsx`
- Modify: `src/pages/verify/Verify.jsx`
- Modify: `src/components/FoodDisplay/FoodDisplay.jsx`

**Interfaces:**
- Produces: eagerly loaded Home and lazily loaded Cart, PlaceOrder, Verify, MyOrders inside `Suspense`.
- Produces: no ESLint errors or warnings.

- [ ] **Step 1: Write a failing source-level route-loading test only if React runtime testing remains dependency-free**

If it requires a DOM test library not already installed, skip this test and verify via production build chunk output; do not add a test framework solely for route splitting.

- [ ] **Step 2: Replace secondary static page imports with `lazy()`**

Add a minimal accessible loading fallback inside `Suspense`; keep `Home` eager.

- [ ] **Step 3: Fix hooks and unused-variable lint errors at their source**

Use stable callbacks or correct dependency arrays, remove unused `setSearchParams`, and separate the context declaration if required by fast-refresh linting.

- [ ] **Step 4: Verify chunks, lint, tests, and build**

Run: `npm test && npm run lint && npm run build`

Expected: all tests pass, ESLint reports zero findings, and secondary page code is in separate build chunks.

- [ ] **Step 5: Commit**

```bash
git add src/App.jsx src/context src/pages src/components/FoodDisplay
git commit -m "perf: lazy load routes and clean lint"
```

### Task 6: End-to-end verification and deployment handoff

**Files:**
- Modify: deployment environment configuration only as needed; no secrets committed

**Interfaces:**
- Consumes: deployed backend with resolved-cart endpoint and frontend `VITE_API_URL`.

- [ ] **Step 1: Start backend and frontend locally with configured environment values**

Run: `npm run dev` in each repository.

Expected: category switching, pagination, cart totals, and retry UI operate against the local stack.

- [ ] **Step 2: Test the slow/failure read path**

Temporarily block the food-list request in browser devtools; assert skeletons end in an error state and retry restores products. Confirm a cart POST is issued only once.

- [ ] **Step 3: Run final automated verification**

Run: `npm test && npm run lint && npm run build` in frontend; `npm test` in backend.

Expected: all commands exit 0.

- [ ] **Step 4: Commit only documentation/configuration that belongs in version control**

Do not commit `.env` files or production credentials.
