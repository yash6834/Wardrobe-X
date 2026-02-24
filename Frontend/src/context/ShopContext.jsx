import React, { createContext, useState, useEffect, useMemo } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
const [notifications, setNotifications] = useState([]);

  const currency = "₹";
  const delivery_fee = 60;

  /* ================= PRODUCTS ================= */
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

useEffect(() => {
  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await api.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data || []);
    } catch (err) {
      console.error("Notification fetch failed");
    }
  };

  fetchNotifications();
}, []);

useEffect(() => {
  notifications.forEach((n) => {
    if (n.type === "refund" && !n.read) {
      toast.success(n.message, {
        position: "top-center",
        autoClose: 6000,
      });

      api.put(`/api/notifications/${n._id}/read`);
    }
  });
}, [notifications]);


  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || {};
      setCartItems(guestCart);
      return;
    }

    try {
      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = {};

      res.data.items.forEach((item) => {
        if (!item.product || !item.product._id) return;

        const productId = item.product._id;
        if (!items[productId]) items[productId] = {};
        items[productId][item.size] = item.quantity;
      });

      setCartItems(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (productId, size, quantity = 1) => {
    const token = localStorage.getItem("token");

    if (token) {
      await api.post(
        "/api/cart/add",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart(); // 🔥 auto refresh
    } else {
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || {};
      if (!guestCart[productId]) guestCart[productId] = {};
      guestCart[productId][size] =
        (guestCart[productId][size] || 0) + quantity;

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }
  };

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = async (productId, size, quantity) => {
    if (quantity < 1) return;

    const token = localStorage.getItem("token");

    if (token) {
      await api.put(
        "/api/cart/update",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } else {
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || {};
      if (!guestCart[productId]) return;
      guestCart[productId][size] = quantity;
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }
  };

  /* ================= REMOVE FROM CART ================= */
  const removeFromCart = async (productId, size) => {
    const token = localStorage.getItem("token");

    if (token) {
      await api.delete("/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId, size },
      });
      fetchCart();
    } else {
      const guestCart =
        JSON.parse(localStorage.getItem("guestCart")) || {};
      if (!guestCart[productId]) return;

      delete guestCart[productId][size];
      if (Object.keys(guestCart[productId]).length === 0) {
        delete guestCart[productId];
      }

      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCartItems(guestCart);
    }
  };

  /* ================= CLEAR CART (AFTER ORDER) ================= */
  const clearCart = () => {
    localStorage.removeItem("guestCart");
    setCartItems({});
  };

  /* ================= AUTO LOAD CART ================= */
  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= CART COUNT (AUTO REACTIVE) ================= */
  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce(
      (acc, sizes) =>
        acc + Object.values(sizes).reduce((s, q) => s + q, 0),
      0
    );
  }, [cartItems]);

  /* ================= CONTEXT VALUE ================= */
  const value = {
    products,
    cartItems,
    cartCount,
    fetchCart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    currency,
    delivery_fee,
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
