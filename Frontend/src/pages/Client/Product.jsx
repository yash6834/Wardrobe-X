import React, { useEffect, useState, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../api/api";
import { ShopContext } from "../../context/ShopContext";
import { CurrencyContext } from "../../context/Currency";
import { toast } from "react-toastify";
import RecommendedProducts from "../../components/RecommendedProducts";
import AlsoBought from "../../components/AlsoBought";

import {
  Truck,
  RefreshCcw,
  ShieldCheck,
  Star,
  ChevronRight
} from "lucide-react";

const Product = () => {

  const { t } = useTranslation();

  const navigate = useNavigate();
  const { productId } = useParams();
  const hasTracked = useRef(false);

  const [productData, setProductData] = useState(null);
  const [user, setUser] = useState(null);
  const [size, setSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [convertedPrice, setConvertedPrice] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { currency } = useContext(CurrencyContext);
  const { addToCart: addToCartContext } = useContext(ShopContext);

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await api.get(`/api/product/${productId}`);

        if (!res.data?.success) throw new Error("Invalid product");

        setProductData(res.data);

        if (res.data.image?.length > 0) {
          setSelectedImage(res.data.image[0]);
        }

      } catch (err) {
        toast.error("Failed to fetch product");
      }

    };

    fetchProduct();

  }, [productId]);

  /* ================= TRACK VIEW ================= */

  useEffect(() => {

    if (hasTracked.current) return;

    const trackView = async () => {

      const token = localStorage.getItem("token");
      if (!token) return;

      try {

        await api.post("/api/activity/track", {
          productId,
          action: "view"
        });

        hasTracked.current = true;

      } catch {}

    };

    trackView();

  }, []);

  /* ================= FETCH USER ================= */

  useEffect(() => {

    const fetchUser = async () => {

      try {
        const res = await api.get("/api/users/user");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }

    };

    fetchUser();

  }, []);

  /* ================= CURRENCY CONVERSION ================= */

  useEffect(() => {

    const convertCurrency = async () => {

      if (!productData) return;

      try {

        if (currency === "INR") {
          setConvertedPrice(productData.price);
        } else {

          const res = await api.get(
            `/api/currency/convert?amount=${productData.price}&currency=${currency}`
          );

          if (res.data.success) {
            setConvertedPrice(Number(res.data.converted));
          }

        }

      } catch {
        setConvertedPrice(productData.price);
      }

    };

    convertCurrency();

  }, [currency, productData]);

  /* ================= LOADING ================= */

  if (!productData) {

    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
      </div>
    );

  }

  /* ================= PRICING ================= */

  const activeMembership = user?.memberships?.find(
    (m) => m.isActive && new Date(m.endDate) > new Date()
  );

  const discountPercent = activeMembership?.discountPercent || 0;

  const originalPrice = convertedPrice || productData.price;

  const finalPrice =
    discountPercent > 0
      ? Math.round(originalPrice - (originalPrice * discountPercent) / 100)
      : originalPrice;

  const selectedSizeStock =
    size && productData.sizes
      ? productData.sizes.find((s) => s.size === size)?.stock ?? 0
      : 0;

  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {

    if (!size) {
      toast.warning(t("select_size"));
      return;
    }

    if (selectedSizeStock <= 0) {
      toast.error(t("out_of_stock"));
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.info(t("login_first"));
      navigate("/login");
      return;
    }

    try {

      await addToCartContext(productData._id, size, 1);

      toast.success(t("added_to_bag"));

    } catch {

      toast.error(t("failed"));

    }

  };

  return (

    <div className="bg-white min-h-screen">

      {/* ================= BREADCRUMB ================= */}

      <nav className="pt-28 px-6 md:px-16 lg:px-24 flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">

        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:text-black"
        >
          {t("home")}
        </span>

        <ChevronRight size={10} />

        <span
          onClick={() => navigate("/collection")}
          className="cursor-pointer hover:text-black"
        >
          {t("collection")}
        </span>

        <ChevronRight size={10} />

        <span className="text-black font-semibold">
          {productData.name}
        </span>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-12">

        <div className="flex flex-col lg:flex-row gap-16">


          {/* ================= IMAGE ================= */}

          <div className="w-full lg:w-[40%] flex gap-6">

            <div className="flex flex-col gap-3">

              {productData.image?.slice(0, 5).map((img, index) => (

                <img
                  key={index}
                  src={img}
                  alt=""
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-24 object-cover cursor-pointer rounded-md border
                  ${selectedImage === img ? "border-black" : "border-gray-200"}`}
                />

              ))}

            </div>


            <div className="flex-1">

              <div className="border rounded-lg bg-gray-50">

                <img
                  src={selectedImage}
                  alt={productData.name}
                  className="w-full object-contain max-h-[65vh]"
                />

              </div>

            </div>

          </div>


          {/* ================= PRODUCT INFO ================= */}

          <div className="w-full lg:w-[40%]">

            <div className="flex items-center gap-1 text-yellow-500 mb-4">

              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="currentColor" />
              ))}

            </div>


            <h1 className="text-4xl font-semibold mb-4">
              {productData.name}
            </h1>


            {/* PRICE */}

            <div className="flex items-end gap-4 mb-6">

              <p className="text-3xl font-bold">

                {currencySymbols[currency]}
                {finalPrice}

              </p>

              {discountPercent > 0 && (

                <p className="text-lg text-gray-400 line-through">

                  {currencySymbols[currency]}
                  {originalPrice}

                </p>

              )}

            </div>


            <p className="text-sm text-gray-600 mb-8">
              {productData.description}
            </p>


            {/* SIZE */}

            <div className="grid grid-cols-4 gap-3 mb-8">

              {productData.sizes.map((s) => (

                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSize(s.size)}
                  className={`h-12 border
                  ${size === s.size ? "bg-black text-white" : ""}
                  ${s.stock === 0 ? "opacity-40" : ""}`}
                >
                  {s.size}
                </button>
                

              ))}

            </div>

            {size && (
  <p className="text-sm text-gray-500 mb-4">
    {selectedSizeStock > 0
      ? `${selectedSizeStock} items left`
      : "Out of stock"}
  </p>
)}


            {/* ADD TO CART */}

            <div className="flex justify-between items-center mb-4">
  <p className="text-sm font-medium">Select Size</p>

  <button
    onClick={() => setShowSizeGuide(true)}
    className="text-xs underline text-gray-500 hover:text-black"
  >
    Size Guide
  </button>
</div>

           <button
  onClick={handleAddToCart}
  disabled={size && selectedSizeStock === 0}
  className={`w-full py-4 font-bold ${
    size && selectedSizeStock === 0
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-black text-white"
  }`}
>
  {!size
    ? "Select Size"
    : selectedSizeStock === 0
    ? "Out of stock"
    : "Add to Cart"}
</button>


            {/* BENEFITS */}

            <div className="mt-10 space-y-4 text-sm text-gray-700">

              <div className="flex items-center gap-3">
                <Truck size={18} />
                <span>{t("express_shipping")}</span>
              </div>

              <div className="flex items-center gap-3">
                <RefreshCcw size={18} />
                <span>{t("easy_returns")}</span>
              </div>

              <div className="flex items-center gap-3">
                <ShieldCheck size={18} />
                <span>{t("authentic_product")}</span>
              </div>

            </div>

          </div>

        </div>
        {showSizeGuide && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative">

      {/* CLOSE */}
      <button
        onClick={() => setShowSizeGuide(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-lg font-semibold mb-4">
        Size Guide
      </h2>

      {/* SIZE TABLE */}
      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Size</th>
            <th className="p-2 border">Chest (in)</th>
            <th className="p-2 border">Length (in)</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td className="p-2 border text-center">S</td>
            <td className="p-2 border text-center">36-38</td>
            <td className="p-2 border text-center">26</td>
          </tr>
          <tr>
            <td className="p-2 border text-center">M</td>
            <td className="p-2 border text-center">38-40</td>
            <td className="p-2 border text-center">27</td>
          </tr>
          <tr>
            <td className="p-2 border text-center">L</td>
            <td className="p-2 border text-center">40-42</td>
            <td className="p-2 border text-center">28</td>
          </tr>
          <tr>
            <td className="p-2 border text-center">XL</td>
            <td className="p-2 border text-center">42-44</td>
            <td className="p-2 border text-center">29</td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>
)}

      </main>

      <RecommendedProducts productId={productId} />
      <AlsoBought productId={productId} />

    </div>
  );

};

export default Product;