import test from "node:test";
import assert from "node:assert/strict";
import { createFoodListParams } from "../src/api/food.js";

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
