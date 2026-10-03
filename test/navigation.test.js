import test from "node:test";
import assert from "node:assert/strict";
import { shouldShowFloatingCart } from "../src/utils/navigation.js";

test("shows the floating cart only on browsing routes", () => {
  assert.equal(shouldShowFloatingCart("/"), true);
  assert.equal(shouldShowFloatingCart("/myorders"), true);
  assert.equal(shouldShowFloatingCart("/cart"), false);
  assert.equal(shouldShowFloatingCart("/order"), false);
  assert.equal(shouldShowFloatingCart("/verify"), false);
});
