import test from "node:test";
import assert from "node:assert/strict";
import { getCartFlightKeyframes } from "../src/utils/cartFlight.js";

test("flies a product thumbnail from its centre to the cart centre", () => {
  const keyframes = getCartFlightKeyframes(
    { left: 10, top: 20, width: 120, height: 80 },
    { left: 300, top: 500, width: 64, height: 64 },
  );

  assert.deepEqual(keyframes, [
    { transform: "translate(0, 0) scale(1)", opacity: 1 },
    { transform: "translate(262px, 472px) scale(0.25)", opacity: 0.2 },
  ]);
});
