import React, { createContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = import.meta.env.VITE_API_URL;
  const [token, setToken] = React.useState("");
  const [cartItems, setCartItems] = React.useState([]);
  const [food_list, setFoodList] = React.useState([]);
  
  // Pagination State
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const limit = 6;

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      await axios.post(
        `${url}/api/cart/add`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (token) {
      await axios.post(
        `${url}/api/cart/remove`,
        { itemId },
        { headers: { token } }
      );
    }
  };

  const fetchFoodList = async (pageNum) => {
    try {
      setLoading(true);
      const res = await axios.get(`${url}/api/food/list?page=${pageNum}&limit=${limit}`);
      if (res.data.success) {
        if (pageNum === 1) {
          setFoodList(res.data.data);
        } else {
          setFoodList((prev) => [...prev, ...res.data.data]);
        }
        
        // Check if we have loaded all items
        // Since backend returns total, we can use it, or just check if returned data < limit
        if (res.data.data.length < limit || (res.data.total && (food_list.length + res.data.data.length >= res.data.total))) {
             // Logic check: if we just fetched, and current total (prev + new) >= total available, then no more.
             // Simpler check: if we got fewer items than limit, we are done.
             // Also if we got equal items but that was the last page.
             // Let's rely on data.length < limit first. 
             // BUT if total is exact multiple of limit, data.length == limit.
             // Better to use total if available.
             const currentTotalLoaded = pageNum === 1 ? res.data.data.length : food_list.length + res.data.data.length;
             if (res.data.total && currentTotalLoaded >= res.data.total) {
                setHasMore(false);
             } else if (res.data.data.length === 0) {
                 setHasMore(false);
             }
        }
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching food list");
    } finally {
      setLoading(false);
    }
  };

  const loadCartData = async (token) => {
    const res = await axios.get(`${url}/api/cart/get`, {
      headers: { token },
    });
    setCartItems(res.data.cartData);
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((foodItem) => foodItem._id === item);
        if (itemInfo) { // Added check because item might not be loaded yet or removed
            totalAmount += cartItems[item] * itemInfo.price;
        }
      }
    }
    return totalAmount;
  };

  // Effect to load data on page change
  useEffect(() => {
    fetchFoodList(page);
  }, [page]);

  useEffect(() => {
    async function loadData() {
      // fetchFoodList is now controlled by page state effect
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await loadCartData(localStorage.getItem("token"));
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    page,
    setPage,
    hasMore,
    loading
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
