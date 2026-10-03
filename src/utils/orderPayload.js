export const createOrderPayload = ({ items, cartItems, address, subtotal }) => ({
  address,
  items: items
    .filter((item) => cartItems[item._id] > 0)
    .map((item) => ({ ...item, quantity: cartItems[item._id] })),
  amount: subtotal + (subtotal === 0 ? 0 : 2),
});
