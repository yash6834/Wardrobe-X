import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Trash2, Edit, X, Plus, Package, Tag, Layers } from "lucide-react";
import { toast } from "react-toastify";

const VendorViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const BASE_URL = "http://localhost:3000";

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/vendor/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      });
      setProducts(res.data);
    } catch (error) {
      toast.error("Failed to load products");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/api/vendor/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      });
      toast.success("Product deleted successfully");
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Product Catalog</h2>
          <p className="text-sm text-gray-500">Manage your listings and product status</p>
        </div>
        <Link
          to="/seller/addproduct"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-md shadow-indigo-100"
        >
          <Plus size={20} /> Add New Product
        </Link>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <Package size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">No products added yet</p>
          <Link to="/seller/addproduct" className="text-indigo-600 text-sm mt-2 hover:underline">
            Click here to list your first item
          </Link>
        </div>
      )}

      {/* ================= PRODUCT GRID ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative"
          >
            {/* Status Badge */}
            <div className={`absolute top-3 right-3 z-10 text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full shadow-sm ${
              p.isApproved ? "bg-emerald-500 text-white" : "bg-amber-400 text-white"
            }`}>
              {p.isApproved ? "Approved" : "Pending"}
            </div>

            {/* Image Section */}
            <div 
              className="relative h-48 overflow-hidden cursor-pointer bg-gray-50"
              onClick={() => setSelectedProduct(p)}
            >
              <img
                src={p.image?.length ? `${BASE_URL}${p.image[0]}` : "https://via.placeholder.com/300"}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs font-bold bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-sm">View Details</span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
              <h3 className="font-bold text-gray-800 truncate mb-1">{p.name}</h3>
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-black text-indigo-600">₹{p.price.toLocaleString()}</span>
                <span className="text-[11px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 flex items-center gap-1">
                  <Layers size={10} /> {p.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-50">
                <Link
                  to={`/seller/editproduct/${p._id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-50 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 py-2 rounded-lg text-xs font-bold transition-colors border border-gray-100"
                >
                  <Edit size={14} /> Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MODAL ================= */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors z-10"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col md:flex-row">
              {/* Modal Image */}
              <div className="md:w-1/2 bg-gray-50 p-6 flex items-center justify-center">
                <img
                  src={selectedProduct.image?.length ? `${BASE_URL}${selectedProduct.image[0]}` : "https://via.placeholder.com/300"}
                  alt={selectedProduct.name}
                  className="max-h-72 w-full object-contain drop-shadow-2xl"
                />
              </div>

              {/* Modal Info */}
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-2">
                   <Tag size={14} className="text-indigo-500" />
                   <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest">{selectedProduct.subCategory}</span>
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                  {selectedProduct.name}
                </h2>
                <p className="text-3xl font-light text-gray-400 mb-6">₹{selectedProduct.price.toLocaleString()}</p>
                
                <div className="mb-8">
                  <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedProduct.description || "No detailed description provided for this item."}
                  </p>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex gap-3 pt-6 border-t border-gray-100">
                  <Link
                    to={`/seller/editproduct/${selectedProduct._id}`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all"
                  >
                    <Edit size={18} /> Edit Product
                  </Link>
                  <button
                    onClick={() => handleDelete(selectedProduct._id)}
                    className="px-4 py-3 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorViewProducts;