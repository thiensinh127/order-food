import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("defers offscreen food-image work", async () => {
  const component = await readFile(new URL("../src/components/FoodItem/FoodItem.jsx", import.meta.url), "utf8");

  assert.match(component, /loading="lazy"/);
  assert.match(component, /decoding="async"/);
});
