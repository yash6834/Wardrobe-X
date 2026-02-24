import { useEffect, useState } from "react";
import api from "../../api/api";
import { CheckCircle, XCircle, Package, Clock, MessageSquare } from "lucide-react"; // Optional: lucide-react for icons

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

      // 1️⃣ Pending first
      if (a.vendorStatus === "pending" && b.vendorStatus !== "pending")
        return -1;
      if (b.vendorStatus === "pending" && a.vendorStatus !== "pending")
        return 1;

      // 2️⃣ Then by newest
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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-amber-100 text-amber-700 border-amber-200";
      case "approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "rejected": return "bg-rose-100 text-rose-700 border-rose-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        <p className="mt-4 text-gray-500 font-medium">Loading requests...</p>
      </div>
    );
  }

  return (
    <div className="pt-24 max-w-6xl mx-auto px-4 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Return Requests
          </h2>
          <p className="text-gray-500 mt-1">Manage and review product returns from your customers.</p>
        </div>
        <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100">
          <span className="text-indigo-700 font-semibold">{returns.length}</span>
          <span className="text-indigo-600 ml-2 text-sm">Total Requests</span>
        </div>
      </div>

      {returns.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <Package className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No return requests found.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {returns.map((r) => (
            <div
              key={r._id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* TOP BAR */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Order ID:</span>
                  <span className="font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    #{r.orderId?._id?.slice(-6).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type:</span>
                    <span className="text-sm font-semibold capitalize text-gray-700">{r.type}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border capitalize ${getStatusColor(r.vendorStatus)}`}>
                    {r.vendorStatus}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* LEFT: PRODUCTS */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
                      <Package size={14} /> Items for Return
                    </h4>
                    <div className="space-y-3">
                      {r.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                          <img
                            src={item.product?.image?.length ? `${BASE_URL}${item.product.image[0]}` : "/placeholder.png"}
                            alt={item.product?.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm bg-white"
                            onError={(e) => (e.currentTarget.src = "/placeholder.png")}
                          />
                          <div className="flex flex-col justify-center">
                            <p className="font-semibold text-gray-800 leading-tight">{item.product?.name}</p>
                            <div className="flex gap-3 mt-1 text-sm text-gray-500">
                              <span>Qty: <b className="text-gray-700">{item.quantity}</b></span>
                              {item.size && (
                                <span className="border-l pl-3">Size: <b className="text-gray-700">{item.size}</b></span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RIGHT: REASON & TIMELINE */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                        <MessageSquare size={14} /> Reason for request
                      </h4>
                      <p className="text-gray-700 bg-amber-50 p-4 rounded-xl border border-amber-100 italic text-sm">
                        "{r.reason}"
                      </p>

                      {r.timeline?.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                            <Clock size={14} /> Activity Timeline
                          </h4>
                          <div className="space-y-2 ml-2 border-l-2 border-gray-100 pl-4">
                            {r.timeline.map((t, i) => (
                              <div key={i} className="relative">
                                <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-gray-300 border-2 border-white"></div>
                                <p className="text-xs text-gray-600">
                                  <span className="font-bold capitalize text-gray-800">{t.status}</span>
                                  <span className="mx-2 text-gray-300">•</span>
                                  {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    {r.vendorStatus === "pending" && (
                      <div className="flex gap-3 mt-8">
                        <button
                          onClick={() => actionHandler(r._id, "approved")}
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-colors shadow-lg shadow-emerald-100"
                        >
                          <CheckCircle size={18} /> Approve
                        </button>
                        <button
                          onClick={() => actionHandler(r._id, "rejected")}
                          className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-600 border-2 border-rose-100 font-bold py-2.5 rounded-xl transition-all"
                        >
                          <XCircle size={18} /> Reject
                        </button>
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
  );
};

export default VendorReturns;