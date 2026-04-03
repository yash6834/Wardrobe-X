import React, { createContext, useState, useEffect, useMemo, useCallback } from "react";
import api from "../api/api";
import { toast } from "react-toastify";
import { addToCartOffline, getOfflineCart, clearOfflineCartStore } from "../utils/offlineCart";
import { dbPromise } from "../db/db";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});

  const currency = "₹";
  const delivery_fee = 60;

  /* ================= PRODUCTS ================= */
  useEffect(() => {
    const loadProducts = async () => {
      const db = await dbPromise;

      // LOAD FROM DB FIRST FOR FAST RENDER
      const offlineProducts = await db.getAll("products");
      if (offlineProducts.length > 0) {
        setProducts(offlineProducts);
      }

      // THEN UPDATE FROM API
      if (navigator.onLine) {
        try {
          const res = await api.get("/api/product");
          const fetchedProducts = res.data.products || [];

          setProducts(fetchedProducts);

          const tx = db.transaction("products", "readwrite");
          const store = tx.objectStore("products");
          await store.clear();
          for (const p of fetchedProducts) {
            await store.put(p);
          }
          await tx.done;
        } catch (err) {
          console.log("API failed, sticking to offline product data");
        }
      }
    };

    loadProducts();
  }, []);

  /* ================= FETCH CART ================= */
  /* ================= FETCH CART ================= */
  const fetchCart = useCallback(async () => {
    const token = localStorage.getItem("token");

    // 🔥 NAYA HELPER: IndexedDB se offline cart nikalne ke liye
    const loadOfflineCart = async () => {
      const db = await dbPromise;
      const items = await db.getAll("cart");
      const formatted = {};

      items.forEach((item) => {
        if (!formatted[item.productId]) formatted[item.productId] = {};
        formatted[item.productId][item.size] = item.quantity;
      });

      setCartItems(formatted);
    };

    // 🔴 1. STRICT OFFLINE CHECK
    if (!navigator.onLine) {
      await loadOfflineCart();
      return;
    }

    // 🟡 2. GUEST CHECK
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || {};
      setCartItems(guestCart);
      return;
    }

    // 🟢 3. ONLINE API FETCH
    try {
      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const items = {};
      res.data.items.forEach((item) => {
        if (!item.product?._id) return;
        if (!items[item.product._id]) items[item.product._id] = {};
        items[item.product._id][item.size] = item.quantity;
      });

      setCartItems(items);
    } catch (err) {
      console.log("Live cart fetch failed (Offline). Loading local items...");
      await loadOfflineCart();
    }
  }, []);

  // This pushes IndexedDB items to the server when internet returns
  const syncOfflineCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // Don't sync to server if no user is logged in

    try {
      const offlineItems = await getOfflineCart();

      if (offlineItems.length > 0) {
        console.log("Syncing offline cart items to server...");

        // Push each item to the server
        for (const item of offlineItems) {
          await api.post(
            "/api/cart/add",
            { productId: item.productId, size: item.size, quantity: item.quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }

        // Clear local DB and refresh UI
        await clearOfflineCartStore();
        toast.success("Offline items synced to your account! ☁️");
        await fetchCart();
      }
    } catch (error) {
      console.error("Failed to sync offline cart", error);
    }
  }, [fetchCart]);

  // Listen for the browser coming back online
  useEffect(() => {
    window.addEventListener("online", syncOfflineCart);
    return () => window.removeEventListener("online", syncOfflineCart);
  }, [syncOfflineCart]);


  /* ================= ADD ================= */
  const addToCart = async (productId, size, quantity = 1) => {
    const token = localStorage.getItem("token");

    // 🔴 EXPLICITLY HANDLE OFFLINE FIRST
    if (!navigator.onLine) {
      await addToCartOffline({ productId, size, quantity });

      // Update UI Immediately
      setCartItems(prev => {
        const updated = { ...prev };
        if (!updated[productId]) updated[productId] = {};
        updated[productId][size] = (updated[productId][size] || 0) + quantity;
        return updated;
      });

      toast.success("Saved offline 📴");
      return;
    }

    // 🟢 HANDLE ONLINE
    try {
      await api.post(
        "/api/cart/add",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      toast.success("Added to cart");

    } catch (err) {
      // If network suddenly drops during request
      if (err.message === "Network Error" || !err.response) {
        await addToCartOffline({ productId, size, quantity });
        toast.warning("Network error. Saved offline.");
        fetchCart();
      } else {
        toast.error("Failed to add to cart");
      }
    }
  };

  /* ================= UPDATE ================= */
  const updateQuantity = async (productId, size, quantity) => {
    if (quantity < 1) return;
    const token = localStorage.getItem("token");

    if (!navigator.onLine) {
      const db = await dbPromise;
      const id = `${productId}-${size}`;
      const existing = await db.get("cart", id);

      if (existing) {
        existing.quantity = quantity;
        await db.put("cart", existing);
      }
      await fetchCart();
      return;
    }

    try {
      await api.put(
        "/api/cart/update",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
    } catch (error) {
      console.error("Failed to update", error);
    }
  };

  /* ================= REMOVE ================= */
  const removeFromCart = async (productId, size) => {
    const token = localStorage.getItem("token");

    if (!navigator.onLine) {
      const db = await dbPromise;
      await db.delete("cart", `${productId}-${size}`);
      await fetchCart();
      return;
    }

    try {
      await api.delete("/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId, size },
      });
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove", error);
    }
  };

  /* ================= INIT ================= */
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* ================= COUNT ================= */
  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce(
      (acc, sizes) =>
        acc + Object.values(sizes || {}).reduce((s, q) => s + q, 0),
      0
    );
  }, [cartItems]);

  return (
    <ShopContext.Provider
      value={{
        products,
        cartItems,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        currency,
        fetchCart,
        delivery_fee,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;