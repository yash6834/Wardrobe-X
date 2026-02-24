import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { validateCheckoutForm } from "../../validation";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Phone,
  ArrowLeft,
  Loader2
} from "lucide-react";
import api from "../../api/api";

const Checkout = () => {
  const { currency, delivery_fee, cartItems, products, fetchCart } = useContext(ShopContext);

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "cod",
  });

  const [errors, setErrors] = useState({});
  const [cartList, setCartList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCODModal, setShowCODModal] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

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
    if (u) {
      setFormData((prev) => ({ ...prev, name: u.name || "", email: u.email || "" }));
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/profile");
      setUser(res.data.user);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const list = [];
    for (const pid in cartItems) {
      for (const size in cartItems[pid]) {
        const qty = cartItems[pid][size];
        const product = products.find((p) => p._id === pid);
        if (product && qty > 0) {
          list.push({ product, size, qty });
        }
      }
    }
    setCartList(list);
    setLoading(false);
  }, [cartItems, products]);

  const activeMembership = user?.memberships?.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );
  const discountPercent = activeMembership?.discountPercent || 0;
  const subtotal = cartList.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const discountAmount = discountPercent > 0 ? (subtotal * discountPercent) / 100 : 0;
  const discountedSubtotal = subtotal - discountAmount;
  const shipping = discountedSubtotal > 0 ? delivery_fee : 0;
  const tax = discountedSubtotal * 0.02;
  const total = discountedSubtotal + shipping + tax;

  const shippingAddress = {
    address: formData.address,
    city: formData.city,
    state: formData.state,
    postalCode: formData.zip,
    phone: formData.phone,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
          size: i.size,
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
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        handler: async (response) => {
          await api.post("/api/orders/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderIds,
          });
          fetchCart();
          setShowSuccessModal(true);
        },
        theme: { color: "#000000" },
      });
      rzp.open();
    } catch {
      alert("Payment failed");
    }
  };

  const confirmCODOrder = async () => {
    try {
      setPlacingOrder(true);
      await api.post("/api/orders", {
        paymentMethod: "cod",
        shippingAddress,
        items: cartList.map((i) => ({
          productId: i.product._id,
          price: i.product.price,
          qty: i.qty,
          size: i.size,
        })),
      });
      fetchCart();
      setShowCODModal(false);
      setShowSuccessModal(true);
    } finally {
      setPlacingOrder(false);
    }
  };

  /* ================= NEW UI STYLES ================= */

  const inputClass = (field) =>
    `w-full bg-white border-b-2 transition-all duration-300 ${
      errors[field] ? "border-red-500" : "border-gray-200 focus:border-black"
    } py-3 text-sm outline-none placeholder:text-gray-400`;

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-gray-400" size={32} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#1a1a1a] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        
      

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-16">
          
          {/* LEFT: FORM FIELDS */}
          <div className="flex-1 space-y-12">
            
            {/* Shipping Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-black p-2 rounded-lg">
                  <Truck size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-medium italic">Shipping Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2">
                  <input
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClass("name")}
                  />
                  {errors.name && <p className="text-[10px] text-red-500 mt-1 uppercase tracking-tighter">{errors.name}</p>}
                </div>

                <div className="relative">
                  <input
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClass("phone")}
                  />
                  <Phone size={14} className="absolute right-0 top-4 text-gray-300" />
                </div>

                <input
                  placeholder="Email Address"
                  value={formData.email}
                  readOnly
                  className={`${inputClass("email")} bg-gray-50 cursor-not-allowed`}
                />

                <div className="md:col-span-2">
                  <input
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={inputClass("address")}
                  />
                </div>

                <input
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className={inputClass("city")}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className={inputClass("state")}
                  />
                  <input
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className={inputClass("zip")}
                  />
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-black p-2 rounded-lg">
                  <CreditCard size={18} className="text-white" />
                </div>
                <h3 className="text-lg font-medium italic">Payment Method</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-black bg-black/5' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <Banknote size={20} />
                    <span className="text-sm font-medium">Cash on Delivery</span>
                  </div>
                  <input
                    type="radio"
                    className="accent-black w-4 h-4"
                    checked={formData.paymentMethod === "cod"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "cod" })}
                  />
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-black bg-black/5' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} />
                    <span className="text-sm font-medium">Online Payment</span>
                  </div>
                  <input
                    type="radio"
                    className="accent-black w-4 h-4"
                    checked={formData.paymentMethod === "card"}
                    onChange={() => setFormData({ ...formData, paymentMethod: "card" })}
                  />
                </label>
              </div>
            </section>
          </div>

          {/* RIGHT: SUMMARY SIDEBAR */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white rounded-2xl p-8 shadow-xl shadow-black/5 border border-gray-100 sticky top-28">
              <h3 className="text-xl font-medium mb-6 italic tracking-tight border-b pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Subtotal</span>
                  <span className="text-black font-medium">{currency}{subtotal.toLocaleString()}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600 font-medium uppercase text-[10px] tracking-widest border border-green-200 px-2 py-0.5 rounded">Membership Discount (-{discountPercent}%)</span>
                    <span className="text-green-600 font-medium">-{currency}{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Shipping Fee</span>
                  <span className="text-black font-medium">{shipping === 0 ? "FREE" : `${currency}${shipping}`}</span>
                </div>

                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Estimated Tax (2%)</span>
                  <span className="text-black font-medium">{currency}{tax.toLocaleString()}</span>
                </div>

                <div className="pt-4 border-t-2 border-dashed border-gray-100 flex justify-between items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">Total Amount</p>
                    <p className="text-2xl font-bold tracking-tighter">{currency}{total.toLocaleString()}</p>
                  </div>
                  <ShieldCheck size={24} className="text-gray-300 mb-1" />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-zinc-800 transition-all active:scale-[0.98] shadow-lg shadow-black/10 flex items-center justify-center gap-2"
              >
                Complete Purchase
              </button>
              
              <p className="text-center text-[10px] text-gray-400 mt-4 px-4 uppercase tracking-widest leading-relaxed">
                By clicking "Complete Purchase", you agree to our terms and conditions.
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Thank You!</h3>
            <p className="text-gray-500 text-sm mb-8">Your order has been placed successfully and is being processed.</p>
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full bg-black text-white py-3 rounded-xl font-medium"
            >
              Return Home
            </button>
          </div>
        </div>
      )}

      {/* COD CONFIRMATION MODAL */}
      {showCODModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Banknote size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Confirm Order?</h3>
            <p className="text-gray-500 text-sm mb-8">You are opting for Cash on Delivery. Please confirm to finalize your order.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmCODOrder}
                disabled={placingOrder}
                className="w-full bg-black text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                {placingOrder && <Loader2 className="animate-spin" size={16} />}
                Place Order
              </button>
              <button
                onClick={() => setShowCODModal(false)}
                className="w-full bg-transparent text-gray-400 py-2 text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;