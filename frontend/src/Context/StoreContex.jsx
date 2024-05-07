import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
// import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [food_list, setFood_list] = useState([]);

  const addToCart = async (id) => {
    try {
      if (!cartItems[id]) {
        setCartItems((prev) => ({ ...prev, [id]: 1 }));
        toast.success("Added to cart");
      } else {
        setCartItems((prev) => ({ ...prev, [id]: prev[id] + 1 }));
        toast.success("Added to cart");
      }
      if (token) {
        await axios.post(
          url + "/api/cart/add",
          { id },
          {
            headers: {
              Accept: "application/form-data",
              "auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      setCartItems((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      toast.error("Removed from cart");
      if (token) {
        await axios.post(
          url + "/api/cart/remove",
          { id },
          {
            headers: {
              Accept: "application/form-data",
              "auth-token": token,
              "Content-Type": "application/json",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error removing item to cart:", error);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFood_list(response.data.data);
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  const loadCartData = async (token) => {
    try {
      console.log(token);
      const response = await axios.get(url + "/api/cart/get", {
        headers: {
          Accept: "application/form-data",
          "auth-token": token,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      setCartItems(response.data.cartData);
    } catch (error) {
      console.error("Error loading cart data:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        await fetchFoodList();
        if (localStorage.getItem("token")) {
          setToken(localStorage.getItem("token"));
          await loadCartData(localStorage.getItem("token"));
        }
      } catch (error) {
        console.error("Error loading data:", error);
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
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
