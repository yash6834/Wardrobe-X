import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../../context/ShopContext";
import { validateCheckoutForm } from "../../validation";
import { ShieldCheck, Truck, CreditCard, Banknote, CheckCircle2, Phone, Loader2, Lock, ChevronRight } from "lucide-react";
import api from "../../api/api";
import { CurrencyContext } from "../../context/Currency";

const Checkout = () => {
  const { delivery_fee, cartItems, products, fetchCart } = useContext(ShopContext);
  const { currency } = useContext(CurrencyContext);
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
    const priceMap = {};
    for (let item of cartList) {
      try {
        if (currency === "INR") priceMap[item.product._id] = item.product.price;
        else {
          const res = await api.get(`/api/currency/convert?amount=${item.product.price}&currency=${currency}`);
          if (res.data.success) priceMap[item.product._id] = Number(res.data.converted);
        }
      } catch { priceMap[item.product._id] = item.product.price; }
    }
    setConvertedPrices(priceMap);
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

  const shippingAddress = { address: formData.address, city: formData.city, state: formData.state, postalCode: formData.zip, phone: formData.phone };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors } = validateCheckoutForm(formData);
    setErrors(errors);
    if (!isValid || cartList.length === 0) return;
    if (formData.paymentMethod === "cod") { setShowCODModal(true); return; }
    try {
      const res = await api.post("/api/orders", {
        paymentMethod: "card", shippingAddress,
        items: cartList.map((i) => ({ productId: i.product._id, price: i.product.price, qty: i.qty, size: i.size })),
      });
      const { razorpay, orders } = res.data;
      const orderIds = orders.map((o) => o._id);
      const rzp = new window.Razorpay({
        key: razorpay.key, amount: razorpay.amount, currency: "INR", name: "Wardrobe X", order_id: razorpay.orderId,
        prefill: { name: formData.name, email: formData.email, contact: formData.phone },
        handler: async (response) => {
          await api.post("/api/orders/verify-payment", { razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, orderIds });
          fetchCart(); setShowSuccessModal(true);
        },
        theme: { color: "#000000" }
      });
      rzp.open();
    } catch (error) { alert("Payment failed"); }
  };

  const confirmCODOrder = async () => {
    try {
      setPlacingOrder(true);
      await api.post("/api/orders", { paymentMethod: "cod", shippingAddress, items: cartList.map((i) => ({ productId: i.product._id, price: i.product.price, qty: i.qty, size: i.size })) });
      fetchCart(); setShowCODModal(false); setShowSuccessModal(true);
    } finally { setPlacingOrder(false); }
  };

  /* ================= REFINED UI STYLES ================= */

  const inputClass = (field) =>
    `w-full bg-white border ${errors[field] ? "border-red-500" : "border-gray-200"} rounded-lg py-2.5 px-4 text-sm transition-all focus:ring-2 focus:ring-black/5 focus:border-black outline-none placeholder:text-gray-300`;

  const labelClass = "block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5 ml-0.5";

  if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-black" size={32} /></div>;

  return (
    <main className="h-screen bg-[#F8F9FA] text-[#1A1A1A] pt-16 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 h-[calc(100vh-80px)] py-4">
        
        {/* Breadcrumb Header */}
        <div className="flex items-center gap-2 mb-6 text-xs font-medium text-gray-400">
          <span>Cart</span> <ChevronRight size={12} /> <span className="text-black">Checkout</span> <ChevronRight size={12} /> <span className="opacity-50">Payment</span>
        </div>

        <form onSubmit={handleSubmit} className="flex gap-8 h-full items-start">
          
          {/* LEFT: INFORMATION PANELS */}
          <div className="flex-[1.8] flex flex-col gap-5 overflow-y-auto pr-2 max-h-full scrollbar-hide pb-10">
            
            {/* Shipping Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-black text-white p-2 rounded-lg"><Truck size={18} /></div>
                <h3 className="text-base font-bold tracking-tight">Shipping Details</h3>
              </div>

              <div className="grid grid-cols-6 gap-x-4 gap-y-5">
                <div className="col-span-4">
                  <label className={labelClass}>Recipient Name</label>
                  <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass("name")} placeholder="John Doe" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Phone Number</label>
                  <div className="relative">
                    <input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className={inputClass("phone")} placeholder="000-000-0000" />
                    <Phone size={14} className="absolute right-3 top-3 text-gray-300" />
                  </div>
                </div>
                <div className="col-span-6">
                  <label className={labelClass}>Residential Address</label>
                  <input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className={inputClass("address")} placeholder="Street, Apartment, Landmark" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>City</label>
                  <input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className={inputClass("city")} placeholder="City" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>State</label>
                  <input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} className={inputClass("state")} placeholder="State" />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Postal Code</label>
                  <input value={formData.zip} onChange={(e) => setFormData({ ...formData, zip: e.target.value })} className={inputClass("zip")} placeholder="Zip" />
                </div>
              </div>
            </div>

            {/* Payment Method Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-black text-white p-2 rounded-lg"><CreditCard size={18} /></div>
                <h3 className="text-base font-bold tracking-tight">Payment Method</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, paymentMethod: "cod" })} 
                  className={`group flex items-center p-4 border-2 rounded-xl transition-all ${formData.paymentMethod === 'cod' ? 'border-black bg-black/[0.01]' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`p-2.5 rounded-lg mr-4 transition-colors ${formData.paymentMethod === 'cod' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Banknote size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Pay on Delivery</p>
                    <p className="text-[10px] text-gray-400 font-medium">Cash or QR at your doorstep</p>
                  </div>
                </button>

                <button 
                  type="button" 
                  onClick={() => setFormData({ ...formData, paymentMethod: "card" })} 
                  className={`group flex items-center p-4 border-2 rounded-xl transition-all ${formData.paymentMethod === 'card' ? 'border-black bg-black/[0.01]' : 'border-gray-100 hover:border-gray-200'}`}
                >
                  <div className={`p-2.5 rounded-lg mr-4 transition-colors ${formData.paymentMethod === 'card' ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CreditCard size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold">Online Payment</p>
                    <p className="text-[10px] text-gray-400 font-medium">Cards, UPI, or Netbanking</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: PREMIUM SUMMARY PANEL */}
          <div className="flex-1 min-w-[360px] h-full pb-6">
            <div className="bg-[#0F172A] text-white p-8 rounded-[32px] h-full flex flex-col justify-between shadow-2xl shadow-blue-900/10">
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold tracking-tight">Summary</h3>
                  <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{cartList.length} Items</span>
                </div>

                <div className="space-y-5 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-white font-semibold">{currencySymbols[currency]}{subtotal.toFixed(2)}</span>
                  </div>
                  {discountPercent > 0 && (
                    <div className="flex justify-between items-center bg-emerald-500/10 p-3 rounded-lg text-emerald-400 border border-emerald-500/20">
                      <span className="text-[11px] font-bold uppercase">Membership Offer</span>
                      <span className="font-bold">-{currencySymbols[currency]}{discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Shipping Fee</span>
                    <span className="text-white font-semibold">{shipping === 0 ? "FREE" : `${currencySymbols[currency]}${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Tax (2%)</span>
                    <span className="text-white font-semibold">{currencySymbols[currency]}{tax.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <p className="text-[11px] text-slate-500 uppercase tracking-[0.2em] font-black mb-1">Total Payable</p>
                    <p className="text-4xl font-black tracking-tighter">{currencySymbols[currency]}{total.toFixed(2)}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                    <ShieldCheck size={22} className="text-slate-400" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-slate-100 text-black py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-3"
                >
                  Place Order <Lock size={16} />
                </button>
                
                <div className="mt-6 flex flex-wrap justify-center gap-4 opacity-30 grayscale contrast-200">
                  <div className="text-[9px] font-bold border border-white px-2 rounded tracking-tighter">VISA</div>
                  <div className="text-[9px] font-bold border border-white px-2 rounded tracking-tighter">MASTERCARD</div>
                  <div className="text-[9px] font-bold border border-white px-2 rounded tracking-tighter">RAZORPAY</div>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>

      {/* MODALS (STYLIZED) */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] p-12 max-w-sm w-full text-center shadow-2xl animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-black mb-2">Order Confirmed</h3>
            <p className="text-gray-500 text-sm mb-8">Thank you for shopping. Your order is now being processed.</p>
            <button onClick={() => (window.location.href = "/")} className="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-xl">Back to Store</button>
          </div>
        </div>
      )}

      {showCODModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center shadow-2xl">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Banknote size={32} className="text-black" />
            </div>
            <h3 className="text-xl font-bold mb-2 tracking-tight">Confirm COD Order?</h3>
            <p className="text-gray-500 text-sm mb-8">You'll pay the total amount at the time of delivery.</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmCODOrder} 
                disabled={placingOrder} 
                className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                {placingOrder ? <Loader2 className="animate-spin" size={18} /> : "Yes, Place Order"}
              </button>
              <button onClick={() => setShowCODModal(false)} className="text-gray-400 text-xs font-bold uppercase tracking-widest py-2 hover:text-black transition-colors">Go Back</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Checkout;