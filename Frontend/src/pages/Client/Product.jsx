import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const navigate = useNavigate();
  const { productId } = useParams();

  const [productData, setProductData] = useState(null);
  const [user, setUser] = useState(null);
  const [size, setSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const [convertedPrice, setConvertedPrice] = useState(null);

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

        if (!res.data?.success)
          throw new Error("Invalid product response");

        setProductData(res.data);

        if (res.data.image?.length > 0) {
          setSelectedImage(res.data.image[0]);
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product");
      }
    };

    fetchProduct();

  }, [productId]);


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
        }

        else {

          const res = await api.get(
            `/api/currency/convert?amount=${productData.price}&currency=${currency}`
          );

          if (res.data.success) {
            setConvertedPrice(Number(res.data.converted));
          }

        }

      } catch (error) {
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
    (m) =>
      m.isActive === true &&
      new Date(m.endDate) > new Date()
  );

  const discountPercent =
    activeMembership?.discountPercent || 0;

  const originalPrice =
    convertedPrice || productData.price;

  const finalPrice =
    discountPercent > 0
      ? Math.round(
          originalPrice -
          (originalPrice * discountPercent) / 100
        )
      : originalPrice;


  const selectedSizeStock =
    size && productData.sizes
      ? productData.sizes.find(
          (s) => s.size === size
        )?.stock ?? 0
      : 0;


  /* ================= ADD TO CART ================= */

  const handleAddToCart = async () => {

    if (!size) {
      toast.warning("Select size");
      return;
    }

    if (selectedSizeStock <= 0) {
      toast.error("Out of stock");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      toast.info("Login first");
      navigate("/login");
      return;
    }

    try {

      await addToCartContext(
        productData._id,
        size,
        1
      );

      toast.success("Added to Bag");

    } catch {

      toast.error("Failed");

    }

  };


 return (
  <div className="bg-white min-h-screen">

    {/* ================= BREADCRUMB ================= */}

    <nav className="pt-28 px-6 md:px-16 lg:px-24 flex items-center gap-2 text-[11px] uppercase tracking-widest text-gray-400">

      <span
        onClick={() => navigate("/")}
        className="cursor-pointer hover:text-black hover:underline"
      >
        Home
      </span>

      <ChevronRight size={10} />

      <span
        onClick={() => navigate("/collection")}
        className="cursor-pointer hover:text-black hover:underline"
      >
        Collection
      </span>

      <ChevronRight size={10} />

      <span className="text-black font-semibold">
        {productData.name}
      </span>

    </nav>


    {/* ================= MAIN ================= */}

    <main className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-12">

      <div className="flex flex-col lg:flex-row gap-16">


        {/* ================= IMAGE GALLERY ================= */}

        <div className="w-full lg:w-[40%] flex gap-6">

          <div className="flex flex-col gap-3">

            {productData.image?.slice(0, 5).map((img, index) => (

              <img
                key={index}
                src={img}
                alt=""
                onClick={() => setSelectedImage(img)}
                className={`w-20 h-24 object-cover cursor-pointer rounded-md border
                ${selectedImage === img ? "border-black" : "border-gray-200"}
                `}
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

            <p className="text-3xl font-bold text-gray-900">

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
                ${s.stock === 0 ? "opacity-40" : ""}
                `}
              >
                {s.size}
              </button>

            ))}

          </div>


          <button
            onClick={handleAddToCart}
            className="w-full py-4 bg-black text-white font-bold"
          >
            Add to Shopping Bag
          </button>


          {/* BENEFITS */}

          <div className="mt-10 space-y-4 text-sm text-gray-700">

            <div className="flex items-center gap-3">
              <Truck size={18} />
              <span>Express Shipping</span>
            </div>

            <div className="flex items-center gap-3">
              <RefreshCcw size={18} />
              <span>Easy Returns</span>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck size={18} />
              <span>Authentic Product</span>
            </div>

          </div>

        </div>

      </div>

    </main>


    <RecommendedProducts productId={productId} />
    <AlsoBought productId={productId} />

  </div>
);

};

export default Product;