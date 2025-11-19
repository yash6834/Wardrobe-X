import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { validateCheckoutForm } from "../validation";
import api from "../api/api";
import { Navigate } from "react-router-dom";


const Checkout = () => {
  const { currency, delivery_fee, cartItems, products, fetchCart } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    paymentMethod: "cod",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    upiId: "",
  });

  const [errors, setErrors] = useState({});
  const [cartList, setCartList] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Auto-fill name and email from logged-in user (localStorage)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, []);

  // Build cart list from cartItems & products
  useEffect(() => {
    const list = [];
    for (const productId in cartItems) {
      for (const size in cartItems[productId]) {
        const qty = cartItems[productId][size] || 0;
        const product = products.find((p) => p._id === productId);
        if (!product || qty <= 0) continue;
        list.push({ product, size, qty });
      }
    }
    setCartList(list);
    setLoading(false);
  }, [cartItems, products]);

  const subtotal = cartList.reduce((acc, item) => acc + item.product.price * item.qty, 0);
  const shippingFee = subtotal > 0 ? delivery_fee : 0;
  const totalAmount = subtotal + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateCheckoutForm(formData);
    setErrors(errors);
    if (!isValid) return;

    if (cartList.length === 0) {
      alert("🛒 Your cart is empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User not logged in!");

      const orderData = {
        customerName: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        paymentMethod: formData.paymentMethod,
        totalAmount,
        items: cartList.map((item) => ({
          productId: item.product._id,
          name: item.product.name,
          price: item.product.price,
          qty: item.qty,
          size: item.size,
        })),
      };

      const res = await api.post("/api/orders", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        alert("✅ Order placed successfully!");
        setFormData((prev) => ({
          ...prev,
          address: "",
          city: "",
          state: "",
          zip: "",
          phone: "",
          paymentMethod: "cod",
          cardName: "",
          cardNumber: "",
          expiry: "",
          cvv: "",
          upiId: "",
        }));
        fetchCart();
       ;
      }
      
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || err.message || "❌ Failed to place order");
    }
    
  };

  if (loading)
    return (
      <main className="pt-24 px-5 text-center">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
        <p>Loading your cart...</p>
      </main>
    );

  if (cartList.length === 0)
    return (
      <main className="pt-24 px-5 text-center">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>
        <p>Your cart is empty.</p>
      </main>
    );

  const inputClass = (field) =>
    `w-full border rounded px-3 py-2 ${
      errors[field] ? "border-red-500" : "border-gray-300"
    } focus:outline-none focus:ring-2 focus:ring-blue-400`;

  return (
    <main className="pt-24 px-5 pb-16">
      <h2 className="text-2xl font-semibold mb-6 text-center">Checkout</h2>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        {/* LEFT: Billing Details */}
        <div className="space-y-4 border p-6 rounded-xl shadow-md bg-white">
          <h3 className="text-lg font-medium mb-4">Billing Details</h3>
          {["name", "email", "address", "city", "state", "zip", "phone"].map((field) => (
            <div key={field}>
              <input
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={formData[field]}
                onChange={handleChange}
                readOnly={field === "email"} // 👈 make email read-only
                className={`${inputClass(field)} ${
                  field === "email" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}
        </div>

        {/* RIGHT: Payment & Summary */}
        <div className="space-y-6">
          {/* Payment Method */}
          <div className="border p-6 rounded-xl shadow-md bg-white space-y-4">
            <h3 className="text-lg font-medium mb-2">Payment Method</h3>
            {["cod", "card", "upi"].map((method) => (
              <label key={method} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={formData.paymentMethod === method}
                  onChange={handleChange}
                />
                {method === "cod"
                  ? "Cash on Delivery"
                  : method === "card"
                  ? "Card Payment"
                  : "UPI"}
              </label>
            ))}

            {formData.paymentMethod === "card" && (
              <div className="space-y-2 mt-2">
                {["cardName", "cardNumber", "expiry", "cvv"].map((field) => (
                  <input
                    key={field}
                    name={field}
                    placeholder={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className={inputClass(field)}
                  />
                ))}
              </div>
            )}

            {formData.paymentMethod === "upi" && (
              <div>
                <input
                  name="upiId"
                  placeholder="UPI ID"
                  value={formData.upiId}
                  onChange={handleChange}
                  className={inputClass("upiId")}
                />
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border p-6 rounded-xl shadow-md bg-white space-y-4">
            <h3 className="text-lg font-medium mb-2">Order Summary</h3>
            {cartList.map((item) => (
              <div key={item.product._id + item.size} className="flex justify-between text-sm">
                <span>
                  {item.product.name} (Size: {item.size}) x {item.qty}
                </span>
                <span>
                  {currency}
                  {(item.product.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}

            <div className="flex justify-between border-t pt-2 mt-2">
              <span>Subtotal</span>
              <span>
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span>
                {currency}
                {shippingFee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
              <span>Total</span>
              <span>
                {currency}
                {totalAmount.toFixed(2)}
              </span>
            </div>

            <button 
              type="submit"
              className="px-32 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Place Order
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default Checkout;
