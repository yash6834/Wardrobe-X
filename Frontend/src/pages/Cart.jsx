import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import api from "../api/api";

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const [currency] = useState("₹");
  const [deliveryFee] = useState(60);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 🔥 Filter out invalid/null product items
      const items = res.data.items
        .filter((item) => item.product !== null)
        .map((item) => ({
          product: item.product,
          size: item.size,
          qty: item.quantity,
        }));

      setCartList(items);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔥 Safe subtotal calculation
  const subtotal = cartList.reduce((acc, item) => {
    if (!item.product || item.product.price == null) return acc;
    return acc + item.product.price * item.qty;
  }, 0);

  const shippingFee = subtotal > 0 ? deliveryFee : 0;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      alert("You must log in first!");
      navigate("/login");
    } else {
      navigate("/placeorder");
    }
  };

  const handleRemove = async (productId, size) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete("/api/cart/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId, size },
      });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuantity = async (productId, size, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem("token");
      await api.put(
        "/api/cart/update",
        { productId, size, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (cartList.length === 0) {
    return (
      <main className="pt-24 px-5 text-center">
        <h2 className="text-3xl font-semibold mb-4">Your Cart</h2>
        <p className="text-gray-600">Your cart is empty.</p>
      </main>
    );
  }

  return (
    <main className="pt-24 px-5 md:px-20 pb-10">
      <h2 className="text-3xl font-semibold mb-8 text-center">Your Cart</h2>

      <div className="flex flex-col gap-6">
        {cartList
          .filter((item) => item.product) // 🔥 Skip null products in UI
          .map(({ product, size, qty }) => (
            <div
              key={`${product._id}-${size}`}
              className="flex flex-col md:flex-row justify-between items-center border p-4 rounded-xl shadow bg-white hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4 w-full md:w-2/3">
                <img
                  src={`http://localhost:3000${product.image}`}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex flex-col flex-1">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-500">Size: {size}</p>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(product._id, size, qty - 1)
                        }
                        disabled={qty === 1}
                        className={`px-3 py-1 ${
                          qty === 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={qty}
                        onChange={(e) =>
                          handleUpdateQuantity(
                            product._id,
                            size,
                            Number(e.target.value)
                          )
                        }
                        className="w-12 text-center border-l border-r py-1"
                      />
                      <button
                        onClick={() =>
                          handleUpdateQuantity(product._id, size, qty + 1)
                        }
                        className="px-3 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(product._id, size)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 font-semibold text-lg">
                {currency}
                {(product.price * qty).toFixed(2)}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-10 max-w-md ml-auto p-6 bg-white border rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

        <div className="flex justify-between py-2 border-b">
          <span>Subtotal</span>
          <span>
            {currency}
            {subtotal.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-2 border-b">
          <span>Shipping Fee</span>
          <span>
            {currency}
            {shippingFee.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between py-3 text-xl font-bold border-t mt-2">
          <span>Total</span>
          <span>
            {currency}
            {total.toFixed(2)}
          </span>
        </div>

        <button
          onClick={handleCheckout}
          className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
};

export default Cart;
