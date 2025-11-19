import React, { createContext, useState, useEffect } from "react";
import api from "../api/api";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const currency = "₹";
  const delivery_fee = 60;

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/product");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  // Fetch cart from backend
const fetchCart = async () => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = {};

      res.data.items.forEach((item) => {
        // 🔥 Skip invalid/broken items
        if (!item.product || !item.product._id) return;

        const productId = item.product._id;

        if (!items[productId]) items[productId] = {};
        items[productId][item.size] = item.quantity;
      });

      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  } else {
    // Guest cart
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {};
    setCartItems(guestCart);
  }
};



  // Calculate cart count whenever cartItems change
  useEffect(() => {
    const count = Object.values(cartItems).reduce((acc, sizes) => {
      return acc + Object.values(sizes).reduce((a, q) => a + q, 0);
    }, 0);
    setCartCount(count);
  }, [cartItems]);

  // Fetch cart once on mount
  useEffect(() => {
    fetchCart();
  }, []);

  // Add product to cart
const addToCart = async (productId, size, quantity = 1) => {
  const token = localStorage.getItem("token");

  if (token) {
    // Logged-in: use backend
    try {
      await api.post(
        "/api/cart/add",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // refresh cart and count
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  } else {
    // Guest: store in localStorage
    const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {};
    if (!guestCart[productId]) guestCart[productId] = {};
    guestCart[productId][size] = (guestCart[productId][size] || 0) + quantity;
    localStorage.setItem("guestCart", JSON.stringify(guestCart));
    setCartItems(guestCart); // update state to refresh Navbar count
  }
};




  const value = {
    products,
    cartItems,
    setCartItems,
    cartCount,
    fetchCart, // expose fetchCart so components can refresh it
    currency,
    delivery_fee,
    addToCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
