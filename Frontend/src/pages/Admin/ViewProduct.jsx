import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Package } from "lucide-react";
import api from "../../api/api";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      if (res.data.success && res.data.products) {
        setProducts(res.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(`/admin/products/${id}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((item) => item._id !== id));
        alert("Product deleted successfully!");
      } else {
        alert(res.data.message || "Failed to delete product!");
      }
    } catch (err) {
      console.error("Error deleting product:", err.response || err);
      alert("Error deleting product");
    }
  };

  const editProduct = (id) => {
    navigate(`/admin/product/edit/${id}`);
  };

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Package size={22} className="text-blue-600" />
          All Products
        </h2>
        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          + Add Product
        </button>
      </div>

      {/* Product Grid — ✅ 4 per row on large screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length === 0 ? (
          <p className="text-gray-500 col-span-full text-center py-10">
            No products found.
          </p>
        ) : (
          products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-300 overflow-hidden flex flex-col"
            >
              {/* Product Image */}
              <div className="relative w-full h-56 bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    item.image
                      ? `http://localhost:3000${item.image}`
                      : "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {item.name}
                </h3>
                <p className="text-gray-600 mt-1 flex-grow">
                  ₹{item.price.toLocaleString()}
                </p>

                {/* Action Buttons */}
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => editProduct(item._id)}
                    className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewProducts;
