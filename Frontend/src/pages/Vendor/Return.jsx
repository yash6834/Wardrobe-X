import { useEffect, useState } from "react";
import api from "../../api/api";
import { 
  CheckCircle, 
  XCircle, 
  Package, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  AlertCircle,
  ArrowUpRight
} from "lucide-react";

const BASE_URL = "http://localhost:3000";

const VendorReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendorReturns();
  }, []);

  const fetchVendorReturns = async () => {
    try {
      const res = await api.get("/api/returns/vendor", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const sorted = (res.data || []).sort((a, b) => {
        if (a.vendorStatus === "pending" && b.vendorStatus !== "pending") return -1;
        if (b.vendorStatus === "pending" && a.vendorStatus !== "pending") return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setReturns(sorted);
    } catch (err) {
      console.error("Failed to load vendor returns");
    } finally {
      setLoading(false);
    }
  };

  const actionHandler = async (id, action) => {
    const remark = prompt(
      action === "approved"
        ? "Approval remark (optional)"
        : "Reason for rejection"
    );

    if (action === "rejected" && !remark) {
      alert("Remark is required for rejection");
      return;
    }

    try {
      await api.put(
        `/api/returns/vendor/${id}`,
        { action, remark },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchVendorReturns();
    } catch (err) {
      alert("Failed to update return");
    }
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "pending": return "bg-orange-50 text-orange-700 border-orange-100 ring-orange-500/20";
      case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-100 ring-emerald-500/20";
      case "rejected": return "bg-rose-50 text-rose-700 border-rose-100 ring-rose-500/20";
      default: return "bg-slate-50 text-slate-700 border-slate-100 ring-slate-500/20";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-50"></div>
          <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading returns...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-24 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-600 h-2 w-8 rounded-full"></span>
              <span className="text-indigo-600 font-bold text-sm uppercase tracking-widest">Vendor Panel</span>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Return Requests
            </h2>
            <p className="text-slate-500 mt-2 text-lg">Manage customer satisfaction and inventory health.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-xl">
              {returns.length}
            </div>
            <div className="pr-4">
              <p className="text-xs font-bold text-slate-400 uppercase">Incoming</p>
              <p className="text-sm font-bold text-slate-700 tracking-tight">Total Tickets</p>
            </div>
          </div>
        </div>

        {returns.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No returns yet</h3>
            <p className="text-slate-500 mt-1 max-w-xs mx-auto">When customers request a return, they will appear here for your review.</p>
          </div>
        ) : (
          <div className="grid gap-8">
            {returns.map((r) => (
              <div
                key={r._id}
                className="group bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:border-indigo-200 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5"
              >
                {/* STATUS BAR */}
                <div className="px-8 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reference ID</span>
                      <span className="font-mono font-bold text-indigo-600 flex items-center gap-1">
                        #{r.orderId?._id?.slice(-6).toUpperCase()} <ArrowUpRight size={14}/>
                      </span>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Request Type</span>
                      <span className="font-bold text-slate-700 capitalize">{r.type}</span>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border ring-4 font-bold text-xs uppercase tracking-wider ${getStatusStyles(r.vendorStatus)}`}>
                    <span className={`h-2 w-2 rounded-full animate-pulse ${
                      r.vendorStatus === 'pending' ? 'bg-orange-500' : r.vendorStatus === 'approved' ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}></span>
                    {r.vendorStatus}
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid lg:grid-cols-12 gap-10">
                    
                    {/* PRODUCT COLUMN */}
                    <div className="lg:col-span-5">
                      <h4 className="text-xs font-black text-slate-400 uppercase mb-5 flex items-center gap-2 tracking-widest">
                        <Package size={16} className="text-indigo-500" /> Products Affected
                      </h4>
                      <div className="space-y-4">
                        {r.items.map((item, idx) => (
                          <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group-hover:bg-white group-hover:border-indigo-50 transition-colors">
                            <div className="relative">
                              <img
                                src={item.product?.image?.length ? `${BASE_URL}${item.product.image[0]}` : "/placeholder.png"}
                                alt={item.product?.name}
                                className="w-20 h-20 object-cover rounded-xl shadow-sm border border-white"
                                onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                              />
                              <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold h-6 w-6 flex items-center justify-center rounded-full border-2 border-white">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="flex flex-col justify-center">
                              <p className="font-bold text-slate-800 text-lg leading-tight">{item.product?.name}</p>
                              {item.size && (
                                <p className="text-sm mt-1 text-slate-500 font-medium">
                                  Variant: <span className="text-indigo-600">{item.size}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* DETAILS & TIMELINE COLUMN */}
                    <div className="lg:col-span-7 flex flex-col justify-between">
                      <div className="grid sm:grid-cols-2 gap-8">
                        {/* REASON */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                            <MessageSquare size={16} className="text-indigo-500" /> Customer Reason
                          </h4>
                          <div className="relative p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
                            <AlertCircle className="absolute top-4 right-4 text-orange-200" size={20} />
                            <p className="text-slate-700 italic leading-relaxed text-sm pr-6">
                              "{r.reason}"
                            </p>
                          </div>
                        </div>

                        {/* TIMELINE */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-black text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                            <Clock size={16} className="text-indigo-500" /> Activity Log
                          </h4>
                          <div className="relative pl-6 space-y-4 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {r.timeline?.slice(0, 3).map((t, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[24px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-300 group-hover:border-indigo-400 transition-colors"></div>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-tighter">
                                  {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-sm font-bold text-slate-700 capitalize">{t.status}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      {r.vendorStatus === "pending" ? (
                        <div className="flex flex-col sm:flex-row gap-4 mt-10">
                          <button
                            onClick={() => actionHandler(r._id, "approved")}
                            className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-200"
                          >
                            <CheckCircle size={20} /> Approve Return
                          </button>
                          <button
                            onClick={() => actionHandler(r._id, "rejected")}
                            className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-600 border-2 border-slate-100 hover:border-rose-200 font-bold py-4 rounded-2xl transition-all"
                          >
                            <XCircle size={20} /> Decline Request
                          </button>
                        </div>
                      ) : (
                        <div className="mt-10 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Resolution Handled</p>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorReturns;