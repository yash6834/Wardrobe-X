import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import api from "../../api/api";
import { CurrencyContext } from "../../context/Currency";

const Cart = () => {

  const [cartList, setCartList] = useState([]);
  const [user, setUser] = useState(null);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [deliveryFee] = useState(60);
  const [convertedShippingFee, setConvertedShippingFee] = useState(deliveryFee);

  const navigate = useNavigate();
  const { currency } = useContext(CurrencyContext);

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  /* ================= FETCH CART ================= */

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


  /* ================= FETCH USER ================= */

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


  /* ================= CONVERT PRICES ================= */

  const convertPrices = async () => {

    const priceMap = {};

    for (let item of cartList) {

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

    }

    setConvertedPrices(priceMap);

  };


  useEffect(() => {

    if (cartList.length > 0) {
      convertPrices();
    }

  }, [currency, cartList]);

  useEffect(() => {
  const convertShipping = async () => {
    try {
      if (currency === "INR") {
        setConvertedShippingFee(deliveryFee);
      } else {
        const res = await api.get(
          `/api/currency/convert?amount=${deliveryFee}&currency=${currency}`
        );

        if (res.data.success) {
          setConvertedShippingFee(Number(res.data.converted));
        }
      }
    } catch (error) {
      setConvertedShippingFee(deliveryFee);
    }
  };

  convertShipping();
}, [currency]);


  /* ================= MEMBERSHIP ================= */

  const activeMembership = user?.memberships?.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );

  const discountPercent = activeMembership?.discountPercent || 0;


  /* ================= TOTAL CALCULATION ================= */

  const subtotal = cartList.reduce((acc, item) => {

    const price =
      convertedPrices[item.product._id] || item.product.price;

    return acc + price * item.qty;

  }, 0);


  const discountAmount =
    discountPercent > 0
      ? (subtotal * discountPercent) / 100
      : 0;


  const discountedSubtotal = subtotal - discountAmount;


    const shippingFee = discountedSubtotal > 0 ? convertedShippingFee : 0;


  const total =
    discountedSubtotal + shippingFee;


  /* ================= ACTIONS ================= */

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


  /* ================= EMPTY CART ================= */

  if (cartList.length === 0) {

    return (
      <main className="pt-32 px-6 flex flex-col items-center justify-center min-h-[60vh] text-center">

        <div className="p-6 bg-gray-50 rounded-full mb-6">
          <ShoppingBag size={48} className="text-gray-300" strokeWidth={1} />
        </div>

        <h2 className="text-2xl font-light tracking-tight mb-2">
          Your Shopping Bag is empty
        </h2>

        <p className="text-gray-500 text-sm mb-8">
          Items remained in your bag for 30 days.
        </p>

        <button
          onClick={() => navigate("/collection")}
          className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest"
        >
          Continue Shopping
        </button>

      </main>
    );

  }


  /* ================= UI ================= */

  return (
    <main className="pt-28 pb-20 bg-white min-h-screen">

      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">

        <header className="mb-12">
          <h2 className="text-3xl font-light tracking-tight text-gray-900 mb-2">
            Shopping Bag
          </h2>

          <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
            {cartList.length} {cartList.length === 1 ? "Item" : "Items"}
          </p>
        </header>


        <div className="flex flex-col lg:flex-row gap-16 items-start">


          {/* ================= PRODUCTS ================= */}

          <div className="flex-1 w-full space-y-8">

            {cartList.map(({ product, size, qty }) => {

              const price =
                convertedPrices[product._id] || product.price;

              return (

                <div
                  key={`${product._id}-${size}`}
                  className="flex gap-6 pb-8 border-b border-gray-100"
                >

                  <div className="w-24 h-32 md:w-32 md:h-40 bg-[#F6F6F6]">

                    <img
                      src={
                        product.image?.length
                          ? `http://localhost:3000${product.image[0]}`
                          : "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />

                  </div>


                  <div className="flex-1 flex flex-col">

                    <div className="flex justify-between items-start mb-1">

                      <h3 className="text-sm md:text-base font-medium uppercase">
                        {product.name}
                      </h3>

                      <p className="text-sm font-semibold">
                        {currencySymbols[currency]}
                        {(price * qty).toLocaleString()}
                      </p>

                    </div>

                    <p className="text-[11px] text-gray-400 uppercase mb-4">
                      Size: {size}
                    </p>


                    <div className="mt-auto flex items-center justify-between">

                      <div className="flex items-center border border-gray-200">

                        <button
                          onClick={() =>
                            handleUpdateQuantity(product._id, size, qty - 1)
                          }
                          disabled={qty === 1}
                          className="p-2"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="w-8 text-center text-xs font-bold">
                          {qty}
                        </span>

                        <button
                          onClick={() =>
                            handleUpdateQuantity(product._id, size, qty + 1)
                          }
                          className="p-2"
                        >
                          <Plus size={14} />
                        </button>

                      </div>


                      <button
                        onClick={() => handleRemove(product._id, size)}
                        className="flex items-center gap-1 text-[10px] text-gray-300 hover:text-red-500 uppercase"
                      >
                        <Trash2 size={12} />
                        Remove
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>


          {/* ================= SUMMARY ================= */}

          <div className="w-full lg:w-[380px] bg-[#FAFAFA] p-8">

            <h3 className="text-xs font-black uppercase mb-8">
              Order Summary
            </h3>


            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {currencySymbols[currency]}
                  {subtotal.toLocaleString()}
                </span>
              </div>


              {discountPercent > 0 && (

                <div className="flex justify-between text-emerald-600">

                  <span>
                    Member Discount (-{discountPercent}%)
                  </span>

                  <span>
                    -{currencySymbols[currency]}
                    {discountAmount.toLocaleString()}
                  </span>

                </div>

              )}


              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
{shippingFee === 0 ? "FREE" : `${currencySymbols[currency]}${shippingFee}`}
</span>
              </div>


              <div className="pt-6 border-t border-gray-200">

                <div className="flex justify-between items-end">

                  <span className="text-xs uppercase font-black">
                    Total
                  </span>

                  <div className="text-right">

                    <p className="text-2xl font-medium">
                      {currencySymbols[currency]}
                      {total.toLocaleString()}
                    </p>

                    <p className="text-[10px] text-gray-400 uppercase">
                      Including Taxes
                    </p>

                  </div>

                </div>

              </div>

            </div>


            <button
              onClick={handleCheckout}
              className="w-full mt-10 py-5 bg-black text-white text-[11px] uppercase"
            >
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </main>
  );

};

export default Cart;