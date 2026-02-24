import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import api from "../../api/api";

const Cart = () => {
  const [cartList, setCartList] = useState([]);
  const [user, setUser] = useState(null);
  const [currency] = useState("₹");
  const [deliveryFee] = useState(60);
  const navigate = useNavigate();

  /* ================= LOGIC (UNTOUCHED) ================= */
  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, []);

  const activeMembership = user?.memberships?.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );
  const discountPercent = activeMembership?.discountPercent || 0;
  const subtotal = cartList.reduce((acc, item) => {
    if (!item.product || item.product.price == null) return acc;
    return acc + item.product.price * item.qty;
  }, 0);
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const shippingFee = discountedSubtotal > 0 ? deliveryFee : 0;
  const total = discountedSubtotal + shippingFee;

  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    if (!token) {
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

  /* ================= NEW RENDER UI ================= */
  if (cartList.length === 0) {
    return (
      <main className="pt-32 px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-6 bg-gray-50 rounded-full mb-6">
          <ShoppingBag size={48} className="text-gray-300" strokeWidth={1} />
        </div>
        <h2 className="text-2xl font-light tracking-tight mb-2">Your Shopping Bag is empty</h2>
        <p className="text-gray-500 text-sm mb-8">Items remained in your bag for 30 days.</p>
        <button 
          onClick={() => navigate("/collection")}
          className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all"
        >
          Continue Shopping
        </button>
      </main>
    );
  }

  return (
    <main className="pt-28 pb-20 bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <header className="mb-12">
          <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2">Shopping Bag</h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            {cartList.length} {cartList.length === 1 ? 'Item' : 'Items'}
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Left: Product List */}
          <div className="flex-1 w-full space-y-8">
            {cartList.map(({ product, size, qty }) => (
              <div
                key={`${product._id}-${size}`}
                className="flex gap-6 pb-8 border-b border-gray-100 group"
              >
                {/* Image */}
                <div className="w-24 h-32 md:w-32 md:h-40 bg-[#F6F6F6] overflow-hidden">
                  <img
                    src={`http://localhost:3000${product.image}`}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-sm md:text-base font-medium text-gray-900 uppercase tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm font-semibold">
                      {currency}{(product.price * qty).toLocaleString()}
                    </p>
                  </div>
                  
                  <p className="text-[11px] text-gray-400 uppercase tracking-widest font-bold mb-4">
                    Size: {size}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200">
                      <button
                        onClick={() => handleUpdateQuantity(product._id, size, qty - 1)}
                        disabled={qty === 1}
                        className="p-2 text-gray-400 hover:text-black disabled:opacity-30 transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{qty}</span>
                      <button
                        onClick={() => handleUpdateQuantity(product._id, size, qty + 1)}
                        className="p-2 text-gray-400 hover:text-black transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* Remove Action */}
                    <button
                      onClick={() => handleRemove(product._id, size)}
                      className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-red-500 font-bold uppercase tracking-widest transition-colors"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="w-full lg:w-[380px] bg-[#FAFAFA] p-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-gray-900 border-b border-gray-200 pb-4">
              Order Summary
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-gray-600 font-light">
                <span>Subtotal</span>
                <span>{currency}{subtotal.toLocaleString()}</span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span className="flex items-center gap-1">
                    Member Discount
                    <span className="text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">-{discountPercent}%</span>
                  </span>
                  <span>−{currency}{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600 font-light">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? "FREE" : `${currency}${shippingFee}`}</span>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-200">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-black uppercase tracking-widest">Total</span>
                  <div className="text-right">
                    <p className="text-2xl font-medium leading-none">
                      {currency}{total.toLocaleString()}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">Including Taxes</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-10 py-5 bg-black text-white text-[11px] font-black uppercase tracking-[0.3em] hover:bg-gray-900 transition-all shadow-xl shadow-black/5"
            >
              Proceed to Checkout
            </button>
            
            <p className="text-[10px] text-center text-gray-400 mt-6 leading-relaxed font-light">
              Secure Checkout • 30-Day Easy Returns
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;