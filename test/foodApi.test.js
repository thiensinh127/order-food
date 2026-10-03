import test from "node:test";
import assert from "node:assert/strict";
import { createFoodListParams, mergeFoodPages } from "../src/api/food.js";

test("omits the All category from a food-list query", () => {
  assert.equal(
    createFoodListParams({ page: 1, limit: 6, category: "All" }).toString(),
    "page=1&limit=6",
  );
});

test("includes a selected category in a food-list query", () => {
  assert.equal(
    createFoodListParams({ page: 2, limit: 6, category: "Salad" }).toString(),
    "page=2&limit=6&category=Salad",
  );
});

test("keeps the first occurrence when pages contain duplicate food IDs", () => {
  assert.deepEqual(
    mergeFoodPages(
      [{ _id: "first" }, { _id: "shared" }],
      [{ _id: "shared" }, { _id: "last" }],
    ),
    [{ _id: "first" }, { _id: "shared" }, { _id: "last" }],
  );
});
