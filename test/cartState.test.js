import test from "node:test";
import assert from "node:assert/strict";
import { applyCartResponse, removeCartItem } from "../src/utils/cartState.js";

test("keeps locally known item details when a cart response omits items", () => {
  const previousItems = [{ _id: "pizza", name: "Pizza", price: 12 }];

  assert.deepEqual(
    applyCartResponse(previousItems, { cartData: { pizza: 2 } }),
    { cartItems: { pizza: 2 }, cartFoodList: previousItems },
  );
});

test("removes an item completely instead of decrementing its quantity", () => {
  assert.deepEqual(removeCartItem({ pizza: 3, salad: 1 }, "pizza"), { salad: 1 });
});
