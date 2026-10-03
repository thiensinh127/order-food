import test from "node:test";
import assert from "node:assert/strict";
import { createOrderPayload } from "../src/utils/orderPayload.js";

test("creates an immutable payment payload from cart items with a positive quantity", () => {
  const items = [
    { _id: "pizza", name: "Pizza", price: 12 },
    { _id: "salad", name: "Salad", price: 8 },
  ];
  const address = { firstName: "Linh" };

  assert.deepEqual(
    createOrderPayload({ items, cartItems: { pizza: 2, salad: 0 }, address, subtotal: 24 }),
    {
      address,
      items: [{ _id: "pizza", name: "Pizza", price: 12, quantity: 2 }],
      amount: 26,
    },
  );
  assert.deepEqual(items[0], { _id: "pizza", name: "Pizza", price: 12 });
});
