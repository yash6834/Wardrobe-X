import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { 
  Check, 
  X, 
  Clock, 
  User, 
  Mail, 
  Tag, 
  ShieldAlert, 
  ExternalLink 
} from "lucide-react";

const BASE_URL = "http://localhost:3000";

const PendingApprovals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPendingProducts = async () => {
    try {
      const res = await api.get("/api/admin/products/pending", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setProducts(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch pending products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const handleAction = async (id, isApproved) => {
    try {
      await api.put(
        `/api/admin/products/${id}/approve`,
        { isApproved },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(isApproved ? "Product approved" : "Product rejected");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium tracking-tight">Loading approval queue...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6 md:p-8 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            Approval Queue
          </h1>
          <p className="text-zinc-500 font-medium mt-1">Reviewing vendor submissions for quality assurance.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-2xl text-xs font-bold tracking-wide">
          <Clock size={14} className="animate-pulse" />
          {products.length} REQUESTS PENDING
        </div>
      </div>

      {/* PRODUCT LIST */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
          <div className="w-16 h-16 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={32} />
          </div>
          <h3 className="text-zinc-900 font-bold text-xl tracking-tight">All Clear!</h3>
          <p className="text-zinc-500 mt-1">No pending products require your attention right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 transition-all duration-500 overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">
                
                {/* IMAGE SECTION */}
                <div className="lg:w-[320px] h-[240px] lg:h-auto relative overflow-hidden bg-zinc-50">
                  <img
                    src={`${BASE_URL}${product.image?.[0]}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full border border-zinc-200 shadow-sm">
                    <p className="text-[10px] font-black text-zinc-900 tracking-tighter uppercase">Preview</p>
                  </div>
                </div>

                {/* DETAILS SECTION */}
                <div className="flex-1 p-8 flex flex-col md:flex-row gap-8 justify-between">
                  
                  {/* PRODUCT INFO */}
                  <div className="flex-1 space-y-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded uppercase tracking-widest">
                                {product.category}
                            </span>
                            <span className="text-zinc-300">•</span>
                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                {product.subCategory}
                            </span>
                        </div>
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tight leading-tight">
                        {product.name}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-400">Listed Price:</span>
                      <span className="text-2xl font-black text-zinc-900 tracking-tighter">₹{product.price.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* VENDOR DOSSIER */}
                  {product.vendor && (
                    <div className="bg-zinc-50 rounded-2xl p-5 border border-zinc-100 min-w-[280px]">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <User size={12} /> Submitting Vendor
                      </p>
                      <div className="space-y-3">
                        <p className="text-sm font-bold text-zinc-900 flex items-center justify-between">
                            {product.vendor.brandName || product.vendor.name}
                            <ExternalLink size={14} className="text-zinc-300 cursor-pointer hover:text-zinc-900 transition-colors" />
                        </p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                            <Mail size={14} className="text-zinc-400" />
                            {product.vendor.email}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="flex flex-row md:flex-col gap-3 justify-center min-w-[140px]">
                    <button
                      onClick={() => handleAction(product._id, true)}
                      className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-emerald-600 py-3 rounded-xl text-sm font-bold shadow-lg shadow-zinc-200 transition-all hover:-translate-y-1"
                    >
                      <Check size={18} /> Approve
                    </button>

                    <button
                      onClick={() => handleAction(product._id, false)}
                      className="flex-1 flex items-center justify-center gap-2 bg-white text-zinc-500 border border-zinc-200 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 py-3 rounded-xl text-sm font-bold transition-all"
                    >
                      <X size={18} /> Reject
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;