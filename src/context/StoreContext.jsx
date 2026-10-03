import React, { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../api/client";
import { fetchFoodPage, mergeFoodPages } from "../api/food";

export const StoreContext = createContext(null);

const LIMIT = 6;

const StoreContextProvider = ({ children }) => {
  const url = import.meta.env.VITE_API_URL;
  const [token, setToken] = useState("");
  const [cartItems, setCartItems] = useState({});
  const [cartFoodList, setCartFoodList] = useState([]);
  const [food_list, setFoodList] = useState([]);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [foodError, setFoodError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const loadCartData = useCallback(async (authToken) => {
    const response = await api.get("/api/cart/get", { headers: { token: authToken } });
    if (response.data.success) {
      setCartItems(response.data.cartData || {});
      setCartFoodList(response.data.items || []);
    }
  }, []);

  const addToCart = async (itemId) => {
    setCartItems((previous) => ({ ...previous, [itemId]: (previous[itemId] || 0) + 1 }));
    if (!token) return;
    await api.post("/api/cart/add", { itemId }, { headers: { token } });
    await loadCartData(token);
  };

  const removeFromCart = async (itemId) => {
    setCartItems((previous) => {
      const quantity = (previous[itemId] || 0) - 1;
      if (quantity <= 0) {
        const rest = { ...previous };
        delete rest[itemId];
        return rest;
      }
      return { ...previous, [itemId]: quantity };
    });
    if (!token) return;
    await api.post("/api/cart/remove", { itemId }, { headers: { token } });
    await loadCartData(token);
  };

  const selectCategory = useCallback((nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
    setFoodList([]);
    setHasMore(true);
    setFoodError("");
  }, []);

  const retryFoodList = useCallback(() => {
    setFoodError("");
    setReloadKey((value) => value + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadFood = async () => {
      setLoading(true);
      try {
        const data = await fetchFoodPage({ page, limit: LIMIT, category, signal: controller.signal });
        if (!data.success) throw new Error(data.message || "Unable to load the menu");
        setFoodList((previous) => (page === 1 ? data.data : mergeFoodPages(previous, data.data)));
        setHasMore(page * LIMIT < data.total);
      } catch (error) {
        if (error.code !== "ERR_CANCELED") setFoodError("Menu is unavailable. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadFood();
    return () => controller.abort();
  }, [category, page, reloadKey]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) loadCartData(token);
  }, [token, loadCartData]);

  const getTotalCartAmount = useCallback(() => (
    cartFoodList.reduce((total, item) => total + (cartItems[item._id] || 0) * item.price, 0)
  ), [cartFoodList, cartItems]);

  const contextValue = {
    food_list, cartFoodList, cartItems, setCartItems, addToCart, removeFromCart,
    getTotalCartAmount, url, token, setToken, category, selectCategory,
    page, setPage, hasMore, loading, foodError, retryFoodList,
  };

  return <StoreContext.Provider value={contextValue}>{children}</StoreContext.Provider>;
};

export default StoreContextProvider;
