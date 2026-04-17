import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // ✅ ADDED
import { ShopContext } from "../../context/ShopContext";
import { validateCheckoutForm } from "../../validation";
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, Phone, Loader2, Lock, ChevronRight, MapPin, ShoppingBag } from "lucide-react";
import api from "../../api/api";
import { CurrencyContext } from "../../context/Currency";
import { dbPromise } from "../../db/db";


const Checkout = () => {
  const { delivery_fee, cartItems, products, fetchCart } = useContext(ShopContext);
  const { currency } = useContext(CurrencyContext);
  const location = useLocation(); // ✅ ADDED

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "", email: "", address: "", city: "", state: "", zip: "", phone: "", paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});
  const [cartList, setCartList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCODModal, setShowCODModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [convertedShippingFee, setConvertedShippingFee] = useState(delivery_fee);

  const currencySymbols = { INR: "₹", USD: "$", EUR: "€" };

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  /* ================= AUTO REFRESH LOGIC ================= */

  // ✅ Refresh when route changes (user comes back to checkout)
  useEffect(() => {
    fetchCart();
  }, [location.pathname]);

  // ✅ Refresh when tab is focused
  useEffect(() => {
    const handleFocus = () => {
      fetchCart();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  /* ================= LOGIC (UNCHANGED) ================= */

  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    fetchUser();
    const u = JSON.parse(localStorage.getItem("user"));
    if (u) setFormData((prev) => ({ ...prev, name: u.name || "", email: u.email || "" }));
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data.user);
    } catch { setUser(null); }
  };

  const convertPrices = async () => {
    try {
      const priceMap = {};

      await Promise.all(
        cartList.map(async (item) => {
          try {
            if (currency === "INR") {
              priceMap[item.product._id] = item.product.price;
            } else {
              const res = await api.get(
                `/api/currency/convert?amount=${item.product.price}&currency=${currency}`
              );

              if (res.data.success) {
                priceMap[item.product._id] = Number(res.data.converted);
              }
            }
          } catch {
            priceMap[item.product._id] = item.product.price;
          }
        })
      );

      setConvertedPrices(priceMap);

    } catch (err) {
      console.log("Conversion error", err);
    }
  };

  const convertShipping = async () => {
    try {
      if (currency === "INR") setConvertedShippingFee(delivery_fee);
      else {
        const res = await api.get(`/api/currency/convert?amount=${delivery_fee}&currency=${currency}`);
        if (res.data.success) setConvertedShippingFee(Number(res.data.converted));
      }
    } catch { setConvertedShippingFee(delivery_fee); }
  };

  useEffect(() => {
    const list = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        const qty = cartItems[pid][size];
        const product = products.find((p) => p._id === pid);
        if (product && qty > 0) list.push({ product, size, qty });
      }
    }
    setCartList(list);
    setLoading(false);
  }, [cartItems, products]);

  useEffect(() => {
    if (cartList.length > 0) convertPrices();
    convertShipping();
  }, [currency, cartList]);

  const activeMembership = user?.memberships?.find((m) => m.isActive === true && new Date(m.endDate) > new Date());
  const discountPercent = activeMembership?.discountPercent || 0;

  const subtotal = cartList.reduce((acc, item) => {
    const price = convertedPrices[item.product._id] || item.product.price;
    return acc + price * item.qty;
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = discountedSubtotal > 0 ? convertedShippingFee : 0;
  const tax = discountedSubtotal * 0.02;
  const total = discountedSubtotal + shipping + tax;

  const shippingAddress = {
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postalCode: formData.zip,
    phone: formData.phone
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isOnline) {
      alert("You are offline. Please connect to internet to place order 🚫");
      return;
    }

    const { isValid, errors } = validateCheckoutForm(formData);
    setErrors(errors);

    if (!isValid || cartList.length === 0) return;

    if (formData.paymentMethod === "cod") {
      setShowCODModal(true);
      return;
    }

    try {
      const res = await api.post("/api/orders", {
        paymentMethod: "card",
        shippingAddress,
        items: cartList.map((i) => ({
          productId: i.product._id,
          price: i.product.price,
          qty: i.qty,
          size: i.size
        })),
      });

      const { razorpay, orders } = res.data;
      const orderIds = orders.map((o) => o._id);

      const rzp = new window.Razorpay({
        key: razorpay.key,
        amount: razorpay.amount,
        currency: "INR",
        name: "Wardrobe X",
        order_id: razorpay.orderId,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        handler: async (response) => {
          await api.post("/api/orders/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderIds
          });

          fetchCart();
          setShowSuccessModal(true);
        },
        theme: { color: "#000000" }
      });

      rzp.open();
    } catch (error) {
      alert("Payment failed");
    }
  };

  const confirmCODOrder = async () => {

    if (!navigator.onLine) {
      alert("You are offline. Cannot place order 🚫");
      return;
    }
    try {
      setPlacingOrder(true);

      await api.post("/api/orders", {
        paymentMethod: "cod",
        shippingAddress,
        items: cartList.map((i) => ({
          productId: i.product._id,
          price: Number(i.product.price),
          qty: Number(i.qty),
          size: i.size?.trim().toUpperCase(),
        }))
      });

      fetchCart();
      setShowCODModal(false);
      setShowSuccessModal(true);

    } catch (err) {
      console.log("🔥 BACKEND ERROR:", err.response?.data);
      alert(err.response?.data?.message);
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ================= UI (UNCHANGED BELOW) ================= */

  const inputClass = (field) =>
    `w-full bg-white border ${errors[field] ? "border-red-500" : "border-gray-200"} rounded-xl py-3 px-4 text-sm`;

  const labelClass =
    "block text-[10px] font-bold uppercase tracking-[0.1em] text-gray-500 mb-2 ml-1";

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }


return (
  <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 lg:py-12">
    <div className="max-w-7xl mx-auto px-6 lg:px-10">

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start"
      >

        {/* LEFT */}
        <div className="w-full lg:flex-[1.8] flex flex-col gap-8 order-2 lg:order-1">

          {/* DELIVERY CARD */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="bg-gray-100 p-2 rounded-lg">
                <MapPin size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Delivery Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-5">

              <div className="md:col-span-4">
                <label className={labelClass}>Recipient Name</label>
                <input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass()}
                  placeholder="Full Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Phone Number</label>
                <div className="relative">
                  <input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={inputClass()}
                    placeholder="Phone Number"
                  />
                  <Phone
                    size={16}
                    className="absolute right-4 top-3.5 text-gray-400"
                  />
                </div>
              </div>

              <div className="md:col-span-6">
                <label className={labelClass}>Address</label>
                <input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className={inputClass()}
                  placeholder="Street, Apartment, Landmark"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>City</label>
                <input
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className={inputClass()}
                  placeholder="City"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>State</label>
                <input
                  value={formData.state}
                  onChange={(e) =>
                    setFormData({ ...formData, state: e.target.value })
                  }
                  className={inputClass()}
                  placeholder="State"
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Postal Code</label>
                <input
                  value={formData.zip}
                  onChange={(e) =>
                    setFormData({ ...formData, zip: e.target.value })
                  }
                  className={inputClass()}
                  placeholder="Zip Code"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.05)]">

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="bg-gray-100 p-2 rounded-lg">
                <CreditCard size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Payment Method
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* COD */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "cod" })
                }
                className={`flex items-center p-4 rounded-xl border transition-all active:scale-[0.97]
                ${
                  formData.paymentMethod === "cod"
                    ? "bg-black text-white border-black shadow-md"
                    : "border-gray-200 hover:border-black hover:bg-gray-50"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg mr-4 ${
                    formData.paymentMethod === "cod"
                      ? "bg-white text-black"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Banknote size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Pay on Delivery</p>
                  <p className="text-xs opacity-70">
                    Cash or QR at your doorstep
                  </p>
                </div>
              </button>

              {/* ONLINE */}
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: "card" })
                }
                className={`flex items-center p-4 rounded-xl border transition-all active:scale-[0.97]
                ${
                  formData.paymentMethod === "card"
                    ? "bg-black text-white border-black shadow-md"
                    : "border-gray-200 hover:border-black hover:bg-gray-50"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg mr-4 ${
                    formData.paymentMethod === "card"
                      ? "bg-white text-black"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <CreditCard size={20} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Online Payment</p>
                  <p className="text-xs opacity-70">
                    UPI, Cards, Netbanking
                  </p>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="w-full lg:flex-1 lg:sticky lg:top-8 order-1 lg:order-2">
          <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl border border-gray-200 shadow-lg">

            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
              <h3 className="text-lg font-bold">Order Summary</h3>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-bold">
                {cartList.length} Items
              </span>
            </div>

            <div className="space-y-4 text-sm mb-6">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

            </div>

            <div className="border-t pt-6">

              <p className="text-xs text-gray-500">Total</p>
              <p className="text-4xl font-extrabold tracking-tight mb-6">
                ₹{total.toFixed(2)}
              </p>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-black text-white font-bold hover:bg-gray-900 active:scale-[0.97] shadow-lg hover:shadow-xl transition-all"
              >
                Place Order
              </button>

            </div>
          </div>
        </div>

      </form>
    </div>
  </main>
);
};

export default Checkout;