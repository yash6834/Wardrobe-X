import { useEffect, useState } from "react";
import api from "../../api/api";

const MyReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= STATUS LABELS ================= */
  const statusLabels = {
    requested: "Request Submitted",

    vendor_approved: "Seller Approved",
    vendor_rejected: "Rejected by Seller",

    admin_approved: "Approved",
    admin_rejected: "Rejected",

    pickup_scheduled: "Pickup Scheduled",
    picked_up: "Picked Up",
    received: "Received at Warehouse",
    refund_completed: "Refund Completed",

    exchange_scheduled: "Exchange Scheduled",
    out_for_exchange: "Out for Exchange",
    exchange_completed: "Exchange Completed",
  };

  /* ================= STATUS COLORS ================= */
  const statusColors = {
    requested: "text-amber-600 bg-amber-50 border-amber-100",

    vendor_approved: "text-blue-600 bg-blue-50 border-blue-100",
    admin_approved: "text-blue-600 bg-blue-50 border-blue-100",

    vendor_rejected: "text-red-600 bg-red-50 border-red-100",
    admin_rejected: "text-red-600 bg-red-50 border-red-100",

    pickup_scheduled: "text-indigo-600 bg-indigo-50 border-indigo-100",
    picked_up: "text-indigo-600 bg-indigo-50 border-indigo-100",

    received: "text-indigo-600 bg-indigo-50 border-indigo-100",

    refund_completed: "text-emerald-600 bg-emerald-50 border-emerald-100",

    exchange_scheduled: "text-violet-600 bg-violet-50 border-violet-100",
    out_for_exchange: "text-orange-600 bg-orange-50 border-orange-100",
    exchange_completed: "text-emerald-600 bg-emerald-50 border-emerald-100",
  };

  const typeColors = {
    return: "text-rose-600 bg-rose-50 border-rose-100",
    exchange: "text-violet-600 bg-violet-50 border-violet-100",
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await api.get("/api/returns/my", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setReturns(res.data || []);
    } catch (err) {
      console.error("Failed to load returns");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#f8fafc]">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Loading return history...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            My Returns & Exchanges
          </h2>
          <p className="text-slate-500 mt-2">
            Track the status of your return requests and exchanges.
          </p>
        </div>

        {/* EMPTY STATE */}
        {returns.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <p className="text-slate-400">No return requests found.</p>
            <button
              onClick={() => (window.location.href = "/orders")}
              className="mt-4 text-indigo-600 font-bold hover:underline"
            >
              Go to Orders
            </button>
          </div>
        )}

        {/* RETURNS LIST */}
        <div className="space-y-6">
          {returns.map((r) => (
            <div
              key={r._id}
              className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              {/* CARD HEADER */}
              <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-50 flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
                      typeColors[r.type] || "bg-gray-100"
                    }`}
                  >
                    {r.type}
                  </span>

                  <span className="text-slate-300">|</span>

                  <span className="text-xs font-mono text-slate-400">
                    ID: {r._id.slice(-6)}
                  </span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
                    statusColors[r.status] || "bg-gray-100"
                  }`}
                >
                  {statusLabels[r.status] || r.status}
                </span>
              </div>

              {/* CARD BODY */}
              <div className="p-6">

                {/* 🔥 Exchange Banner */}
                {r.status === "out_for_exchange" && (
                  <div className="mb-6 bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-xl text-sm font-semibold">
                    🚚 Our delivery partner is arriving today to swap your item.
                    Please keep the old product ready.
                  </div>
                )}

                {/* Reason Section */}
                <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">
                    Reason
                  </p>
                  <p className="text-slate-700 font-medium">
                    {r.reason}
                  </p>
                </div>

                {/* Products Grid */}
                <div className="space-y-4">
                  {r.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <img
                        src={
                          item.product?.image?.length
                            ? `http://localhost:3000${item.product.image[0]}`
                            : "/placeholder.png"
                        }
                        alt={item.product?.name}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-100"
                        onError={(e) =>
                          (e.currentTarget.src = "/placeholder.png")
                        }
                      />

                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-sm">
                          {item.product?.name}
                        </p>

                        <p className="text-xs text-slate-500 mt-1">
                          Qty: {item.quantity}
                          {item.size && <span className="mx-1">•</span>}
                          {item.size && `Size: ${item.size}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIMELINE */}
              {r.timeline?.length > 0 && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-3">
                    Update History
                  </p>

                  <div className="flex flex-col gap-2">
                    {r.timeline.map((t, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              i === r.timeline.length - 1
                                ? "bg-indigo-500"
                                : "bg-slate-300"
                            }`}
                          ></div>

                          <span
                            className={`font-semibold ${
                              i === r.timeline.length - 1
                                ? "text-indigo-700"
                                : "text-slate-600"
                            }`}
                          >
                            {statusLabels[t.status] || t.status}
                          </span>
                        </div>

                        <span className="text-slate-400 font-medium">
                          {new Date(t.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default MyReturns;
