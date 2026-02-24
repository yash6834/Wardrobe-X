import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/api";
import { ShopContext } from "../../context/ShopContext";
import { toast } from "react-toastify";
import {
  ShoppingBag,
  Truck,
  RefreshCcw,
  ShieldCheck,
  Star,
  ChevronRight
} from "lucide-react";
import RecommendedProducts from "../../components/RecommendedProducts";
import AlsoBought from "../../components/AlsoBought";

const Product = () => {

  const navigate = useNavigate();
  const { productId } = useParams();

  const [productData, setProductData] = useState(null);
  const [user, setUser] = useState(null);
  const [size, setSize] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const { addToCart: addToCartContext } = useContext(ShopContext);


  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {

    const fetchProduct = async () => {

      try {

        const res = await api.get(`/api/product/${productId}`);

        if (!res.data?.success)
          throw new Error("Invalid product response");

        setProductData(res.data);

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

  const originalPrice = productData.price;

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

      <nav className="pt-28 px-6 md:px-16 lg:px-24 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-400">

        <span
          onClick={() => navigate("/")}
          className="cursor-pointer hover:text-black"
        >
          Home
        </span>

        <ChevronRight size={10} />

        <span
          onClick={() => navigate("/collection")}
          className="cursor-pointer hover:text-black"
        >
          Collection
        </span>

        <ChevronRight size={10} />

        <span className="text-black font-bold">
          {productData.name}
        </span>

      </nav>


      {/* ================= MAIN ================= */}

      <main className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 py-10">

        <div className="flex flex-col lg:flex-row gap-16">


          {/* ================= IMAGE ================= */}

          <div className="w-full lg:w-[40%]">

            <div className="relative">

              <div className="overflow-hidden border bg-[#FAFAFA]">

                <img
                  src={productData.image?.[0]}
                  alt={productData.name}
                  className="w-full h-auto object-contain max-h-[65vh]"
                />

              </div>

              {discountPercent > 0 && (

                <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-bold px-4 py-2 uppercase">

                  Member Offer

                </div>

              )}

            </div>

          </div>


          {/* ================= INFO ================= */}

          <div className="w-full lg:w-[40%]">


            {/* Rating */}

            <div className="flex items-center gap-1 text-yellow-500 mb-4">

              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} fill="currentColor"/>
              ))}

              <span className="text-[10px] text-gray-400 ml-2">

                (4.8 Reviews)

              </span>

            </div>


            {/* Name */}

            <h1 className="text-4xl font-light mb-4">

              {productData.name}

            </h1>


            {/* Price */}

            <div className="flex items-end gap-4 mb-6">

              <p className="text-3xl font-medium">

                ₹{finalPrice}

              </p>

              {discountPercent > 0 && (

                <p className="text-xl text-gray-300 line-through">

                  ₹{originalPrice}

                </p>

              )}

            </div>


            {/* Description */}

            <p className="text-sm text-gray-600 mb-8">

              {productData.description}

            </p>


            {/* Size Guide Button */}

            <div className="flex justify-between mb-4">

              <h4 className="text-xs font-bold">

                Select Size

              </h4>

              <button
                onClick={() =>
                  setShowSizeGuide(true)
                }
                className="text-xs border-b"
              >
                Size Guide
              </button>

            </div>


            {/* Sizes */}

            <div className="grid grid-cols-4 gap-3 mb-8">

              {productData.sizes.map((s) => (

                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() =>
                    setSize(s.size)
                  }
                  className={`
                    h-12 border
                    ${
                      size === s.size
                        ? "bg-black text-white"
                        : "bg-white"
                    }
                  `}
                >

                  {s.size}

                </button>

              ))}

            </div>


            {/* Add to Cart */}

            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-black text-white"
            >

              Add to Shopping Bag

            </button>


            {/* Benefits */}

            <div className="mt-10 space-y-4">

              <div className="flex gap-3">

                <Truck size={18}/>
                Express Shipping

              </div>

              <div className="flex gap-3">

                <RefreshCcw size={18}/>
                Easy Returns

              </div>

              <div className="flex gap-3">

                <ShieldCheck size={18}/>
                Authentic Product

              </div>

            </div>

          </div>

        </div>

      </main>
      {/* ================= RECOMMENDED PRODUCTS ================= */}

    <RecommendedProducts />



      {/* ================= SIZE GUIDE MODAL ================= */}

      {showSizeGuide && (

        <div
          onClick={() =>
            setShowSizeGuide(false)
          }
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        >

          <div
            onClick={(e) =>
              e.stopPropagation()
            }
            className="bg-white p-6 rounded-xl w-[90%] max-w-md"
          >

            <div className="flex justify-between mb-4">

              <h3 className="font-bold">
                Size Guide
              </h3>

              <button
                onClick={() =>
                  setShowSizeGuide(false)
                }
              >
                ✕
              </button>

            </div>


            <table className="w-full border">

              <thead>

                <tr className="bg-gray-100">

                  <th className="p-2 border">
                    Size
                  </th>

                  <th className="p-2 border">
                    Chest
                  </th>

                  <th className="p-2 border">
                    Waist
                  </th>

                </tr>

              </thead>

              <tbody>

                <tr>
                  <td className="p-2 border">
                    S
                  </td>
                  <td className="p-2 border">
                    36-38
                  </td>
                  <td className="p-2 border">
                    30-32
                  </td>
                </tr>

                <tr>
                  <td className="p-2 border">
                    M
                  </td>
                  <td className="p-2 border">
                    38-40
                  </td>
                  <td className="p-2 border">
                    32-34
                  </td>
                </tr>

                <tr>
                  <td className="p-2 border">
                    L
                  </td>
                  <td className="p-2 border">
                    40-42
                  </td>
                  <td className="p-2 border">
                    34-36
                  </td>
                </tr>

                <tr>
                  <td className="p-2 border">
                    XL
                  </td>
                  <td className="p-2 border">
                    42-44
                  </td>
                  <td className="p-2 border">
                    36-38
                  </td>
                </tr>

              </tbody>

            </table>

          </div>

        </div>

      )}


    </div>

  );

};

export default Product;