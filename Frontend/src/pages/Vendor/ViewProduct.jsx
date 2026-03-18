import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import { Trash2, Edit, X, Plus, Package, Tag, Layers, CheckCircle, AlertCircle } from "lucide-react";
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
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Product Catalog</h2>
          <p className="text-slate-500 mt-1">Manage your listings, pricing, and product status</p>
        </div>
        <Link
          to="/seller/addproduct"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5"
        >
          <Plus size={20} strokeWidth={2.5} /> Add New Product
        </Link>
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
          <div className="bg-indigo-50 p-6 rounded-full mb-6">
            <Package size={56} className="text-indigo-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
          <p className="text-slate-500 font-medium mb-6 text-center max-w-sm">
            Your catalog is currently empty. Start adding products to showcase them to your customers.
          </p>
          <Link 
            to="/seller/addproduct" 
            className="flex items-center gap-2 text-indigo-600 font-semibold hover:text-indigo-700 bg-indigo-50 px-6 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={18} /> Add Your First Item
          </Link>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative"
          >
            {/* Status Badge */}
            <div className={`absolute top-4 right-4 z-10 flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md ${
              p.isApproved 
                ? "bg-emerald-100/90 text-emerald-700 border border-emerald-200" 
                : "bg-amber-100/90 text-amber-700 border border-amber-200"
            }`}>
              {p.isApproved ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {p.isApproved ? "Approved" : "Pending"}
            </div>

            {/* Image */}
            <div 
              className="relative h-56 cursor-pointer bg-slate-100 overflow-hidden"
              onClick={() => setSelectedProduct(p)}
            >
              <img
                src={p.image?.length ? `${BASE_URL}${p.image[0]}` : "https://via.placeholder.com/300"}
                alt={p.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-2 uppercase tracking-wider">
                <Tag size={12} /> {p.category}
              </div>
              <h3 className="font-bold text-slate-800 text-lg leading-tight truncate mb-2 cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => setSelectedProduct(p)}>
                {p.name}
              </h3>

              <div className="mt-auto pt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-medium mb-1">Price</p>
                  <span className="text-xl font-black text-slate-900">
                    ₹{p.price.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CARD ACTIONS */}
              <div className="flex gap-3 pt-5 mt-5 border-t border-slate-100">
                <Link
                  to={`/seller/editproduct/${p._id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-slate-200 hover:border-indigo-200"
                >
                  <Edit size={16} /> Edit
                </Link>
                <button 
                  onClick={() => handleDelete(p._id)}
                  className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 border border-slate-200 hover:border-red-200 transition-colors"
                  title="Delete Product"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]">

            {/* FLOATING CLOSE BUTTON */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-slate-100 text-slate-600 rounded-full backdrop-blur-md transition-colors shadow-sm"
            >
              <X size={20} strokeWidth={2.5} />
            </button>

            {/* MODAL IMAGE */}
            <div className="md:w-1/2 bg-slate-100 relative min-h-[300px] md:min-h-full">
              <img
                src={selectedProduct.image?.length ? `${BASE_URL}${selectedProduct.image[0]}` : "https://via.placeholder.com/600"}
                alt={selectedProduct.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            {/* MODAL DETAILS */}
            <div className="md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col">
              
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">
                <Tag size={14} /> {selectedProduct.category}
              </div>
              
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                {selectedProduct.name}
              </h2>
              
              <p className="text-3xl font-black text-slate-800 mb-6">
                ₹{selectedProduct.price.toLocaleString()}
              </p>

              <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Layers size={16} className="text-slate-400"/> Description
                </h4>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {selectedProduct.description || "No description provided for this product."}
                </p>
              </div>

              {/* 🔥 SIZES & INVENTORY */}
              <div className="mb-10">
                <h4 className="text-sm font-bold text-slate-900 mb-3">Available Sizes & Stock</h4>
                {selectedProduct.sizes?.length > 0 ? (
                  <div className="flex gap-2.5 flex-wrap">
                    {selectedProduct.sizes.map((s, i) => (
                      <div
                        key={i}
                        className={`flex flex-col items-center justify-center min-w-[4rem] px-3 py-2 rounded-xl border-2 ${
                          s.stock > 0
                            ? "bg-slate-50 border-slate-200 text-slate-700"
                            : "bg-red-50 border-red-100 text-red-500 opacity-75"
                        }`}
                      >
                        <span className="font-bold text-sm">{s.size}</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider mt-0.5">
                          {s.stock > 0 ? `${s.stock} Left` : "Out"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100 inline-block">
                    No sizing information available.
                  </p>
                )}
              </div>

              {/* MODAL ACTIONS */}
              <div className="mt-auto flex gap-3 pt-6 border-t border-slate-100">
                <Link 
                  to={`/seller/editproduct/${selectedProduct._id}`}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100 hover:shadow-lg"
                >
                  <Edit size={18} /> Edit Product
                </Link>
                <button 
                  onClick={() => handleDelete(selectedProduct._id)}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white rounded-xl font-bold transition-all border border-red-100 hover:border-red-500"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VendorViewProducts;