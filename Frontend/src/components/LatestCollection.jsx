import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "./../api/api";
import Title from "./Title";
import { CurrencyContext } from "../context/Currency";

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [user, setUser] = useState(null);

  const { currency } = useContext(CurrencyContext);

  // ✅ LIVE BACKEND
  const backendURL = "https://wardrobe-x.onrender.com";

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

  useEffect(() => {
    if (latestProducts.length > 0) {
      convertPrices(latestProducts);
    }
  }, [currency]);

  // ==============================
  // FETCH PRODUCTS
  // ==============================
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/product");

      console.log("📦 PRODUCT API RESPONSE:", res.data);

      if (res.data.success && res.data.products) {
        const products = res.data.products.slice(0, 8);

        console.log("🛍️ PRODUCTS:", products);

        // 🔥 DEBUG IMAGE DATA
        products.forEach((product) => {
          console.log("================================");
          console.log("Product:", product.name);
          console.log("Image from backend:", product.image);

          const image = Array.isArray(product.image)
            ? product.image[0]
            : product.image;

          console.log("Image selected:", image);

          if (image) {
            const finalURL =
              image.startsWith("http://") || image.startsWith("https://")
                ? image
                : `${backendURL}${image.startsWith("/") ? "" : "/"}${image}`;

            console.log("FINAL IMAGE URL:", finalURL);
          }
        });

        setLatestProducts(products);

        convertPrices(products);
      }
    } catch (err) {
      console.error("❌ Error fetching products:", err);
    }
  };

  // ==============================
  // PRICE CONVERSION
  // ==============================
  const convertPrices = async (products) => {
    const priceMap = {};

    for (let product of products) {
      try {
        if (currency === "INR") {
          priceMap[product._id] = product.price;
        } else {
          const res = await api.get(
            `/api/currency/convert?amount=${product.price}&currency=${currency}`
          );

          if (res.data.success) {
            priceMap[product._id] = Number(res.data.converted);
          }
        }
      } catch (error) {
        console.error("❌ Currency conversion error:", error);
        priceMap[product._id] = product.price;
      }
    }

    setConvertedPrices(priceMap);
  };

  // ==============================
  // FETCH USER
  // ==============================
  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/profile");

      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      setUser(null);
    }
  };

  // ==============================
  // MEMBERSHIP
  // ==============================
  const activeMembership = user?.memberships?.find(
    (m) => m.isActive && new Date(m.endDate) > new Date()
  );

  const discountPercent = activeMembership?.discountPercent || 0;

  // ==============================
  // CURRENCY SYMBOLS
  // ==============================
  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  // ==============================
  // IMAGE URL HELPER
  // ==============================
  const getImageURL = (image) => {
    if (!image) {
      return "https://via.placeholder.com/600x800";
    }

    // If backend already returns a complete URL
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }

    // Remove accidental leading slash and rebuild URL
    const cleanImage = image.startsWith("/")
      ? image
      : `/${image}`;

    return `${backendURL}${cleanImage}`;
  };

  return (
    <section className="py-24 px-6 md:px-16 bg-[#FDFDFD]">

      {/* ==============================
          HEADING
      ============================== */}
      <div className="max-w-4xl mx-auto text-center mb-20">

        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase border border-gray-200 rounded-sm">
          New Season
        </div>

        <Title text1="LATEST" text2="COLLECTIONS" />

        <p className="mt-6 text-gray-500 font-light leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
          A curated selection of our newest arrivals.
        </p>

      </div>

      {/* ==============================
          PRODUCTS
      ============================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">

        {latestProducts.map((item) => {

          const productImage = Array.isArray(item.image)
            ? item.image
            : [item.image];

          const imageURL = getImageURL(productImage[0]);

          const convertedPrice =
            convertedPrices[item._id] || item.price;

          const discountedPrice =
            convertedPrice -
            (convertedPrice * discountPercent) / 100;

          return (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group flex flex-col"
            >

              {/* ==============================
                  IMAGE
              ============================== */}
              <div className="relative aspect-[3/3] mb-5 overflow-hidden bg-gray-100 rounded-xl">

                <img
                  src={imageURL}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onLoad={() => {
                    console.log(
                      "✅ IMAGE LOADED:",
                      imageURL
                    );
                  }}
                  onError={(e) => {
                    console.error(
                      "❌ IMAGE FAILED:",
                      imageURL
                    );

                    e.currentTarget.src =
                      "https://via.placeholder.com/600x800";
                  }}
                />

                {/* Discount */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">

                  {discountPercent > 0 && (
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1">
                      -{discountPercent}%
                    </span>
                  )}

                </div>

              </div>

              {/* ==============================
                  PRODUCT INFO
              ============================== */}
              <div className="flex flex-col items-start px-1">

                <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  {item.name}
                </h3>

                <div className="flex items-baseline gap-2">

                  {discountPercent > 0 ? (
                    <>
                      <span className="text-sm sm:text-base font-bold text-black">
                        {currencySymbols[currency]}
                        {Math.round(discountedPrice)}
                      </span>

                      <span className="text-[11px] text-gray-400 line-through">
                        {currencySymbols[currency]}
                        {Math.round(convertedPrice)}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base font-bold text-black">
                      {currencySymbols[currency]}
                      {Math.round(convertedPrice)}
                    </span>
                  )}

                </div>

              </div>

            </Link>
          );
        })}

      </div>

      {/* ==============================
          BOTTOM
      ============================== */}
      <div className="mt-20 flex justify-center">

        <Link
          to="/collection"
          className="text-[11px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1"
        >
          View Full Catalog
        </Link>

      </div>

    </section>
  );
};

export default LatestCollection;