export const applyCartResponse = (previousItems, response) => ({
  cartItems: response.cartData || {},
  cartFoodList: Array.isArray(response.items) ? response.items : previousItems,
});

export const removeCartItem = (cartItems, itemId) => {
  const nextItems = { ...cartItems };
  delete nextItems[itemId];
  return nextItems;
};
