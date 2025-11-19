import React, { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api"; // Axios instance
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const Product = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [size, setSize] = useState("");
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // ✅ Get addToCart from context
  const { addToCart: addToCartContext } = useContext(ShopContext);

  // Fetch product details from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${productId}`);
        setProductData(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to fetch product data");
      }
    };
    fetchProduct();
  }, [productId]);

  if (!productData) return <div className="pt-24 text-center">Loading...</div>;

  const getImageUrl = (imagePath) => `http://localhost:3000${imagePath}`;

  // ✅ Updated Add to Cart handler
  const handleAddToCart = async () => {
    if (!size) {
      alert("Please select a size");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must login first!");
      navigate("/login"); // optional redirect
      return;
    }

    try {
      // ✅ Use global context method (refreshes Navbar count)
      await addToCartContext(productData._id, size, 1);
      toast.success("Product added to cart!");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("You must login first!");
        navigate("/login");
      } else {
        console.error("Error adding to cart:", err);
        toast.error("Failed to add product to cart");
      }
    }
  };

  return (
    <main className="pt-24 px-5">
      <div className="border-t-2 pt-10">
        <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 items-center">
          {/* Product Image */}
          <div className="w-full sm:w-1/2 flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6">
            <img
              src={productData.image}
              alt={productData.name}
              className="w-full max-h-[500px] object-contain rounded-lg"
            />
          </div>

          {/* Product Details */}
          <div className="w-full sm:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">{productData.name}</h2>
            <p className="text-gray-600 mb-4">{productData.description}</p>
            <p className="text-xl font-bold mb-6">₹{productData.price}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Select Size:</h3>
              <div className="flex gap-3 flex-wrap mb-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize((prev) => (prev === s ? "" : s))}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all ${
                      size === s
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-700 border-gray-300 hover:border-black"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!size && (
                <p className="text-xs text-red-500 mt-1">
                  Please select a size
                </p>
              )}
            </div>

            {/* Stock Info */}
            <p
              className={`text-sm mb-4 ${
                productData.stock > 0
                  ? "text-green-600"
                  : "text-red-500 font-medium"
              }`}
            >
              {productData.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={productData.stock === 0}
              className={`px-6 py-2 rounded-md text-white font-semibold transition ${
                productData.stock === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-600 hover:bg-yellow-700"
              }`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Product;
