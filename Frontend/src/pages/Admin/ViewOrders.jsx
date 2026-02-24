import React, { useEffect, useState } from "react";
import { RefreshCcw, Package, ChevronRight, ShoppingBag, Clock, Tag } from "lucide-react";
import api from "../../api/api";

const BASE_URL = "http://localhost:3000";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyles = (status) => {
    const s = status?.toLowerCase();
    if (s === "delivered") return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (s === "shipped") return "bg-blue-50 text-blue-600 border-blue-100";
    if (s === "cancelled") return "bg-rose-50 text-rose-600 border-rose-100";
    return "bg-amber-50 text-amber-600 border-amber-100";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-medium animate-pulse">Fetching orders...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">Orders Feed</h1>
          <p className="text-zinc-500 font-medium mt-1">Monitor and manage customer transactions.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/admin/returns")}
            className="px-5 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 font-bold text-sm hover:bg-zinc-50 transition-all shadow-sm"
          >
            Manage Returns
          </button>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95
              ${loading ? "bg-zinc-400 text-white" : "bg-zinc-900 text-white hover:bg-zinc-800 shadow-zinc-200"}
            `}
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ORDERS LIST */}
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-zinc-200">
          <ShoppingBag className="mx-auto text-zinc-200 mb-4" size={48} />
          <h3 className="text-zinc-800 font-bold text-lg">No orders found</h3>
          <p className="text-zinc-400 text-sm">When customers shop, their orders will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="group bg-white rounded-[2rem] border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-zinc-200/40 transition-all duration-500 overflow-hidden"
            >
              {/* ORDER HEADER */}
              <div className="px-6 py-4 bg-zinc-50/50 border-b border-zinc-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-zinc-100 shadow-sm">
                    <Package size={18} className="text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-1">ID</p>
                    <p className="font-bold text-zinc-900 leading-none">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyles(order.orderStatus)}`}>
                  {order.orderStatus}
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className="p-6 space-y-4">
                {order.items.map((item) => {
                  const imageUrl = item.product?.image?.[0]
                    ? `${BASE_URL}${item.product.image[0]}`
                    : "/placeholder.png";

                  return (
                    <div key={item._id} className="flex items-center gap-5 group/item">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-zinc-900 truncate text-sm">
                          {item.product?.name || "Deleted Product"}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-zinc-100">
                            QTY: {item.quantity}
                          </span>
                          {item.size && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 bg-zinc-50 px-2 py-0.5 rounded uppercase tracking-tighter border border-zinc-100">
                              SIZE: {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="hidden sm:block text-right">
                         <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">Item Status</p>
                         <p className="text-xs font-bold text-zinc-500 capitalize">{item.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 bg-zinc-50/30 border-t border-zinc-50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-zinc-400 mr-2">Total Amount</span>
                    <span className="text-xl font-black text-zinc-900 tracking-tighter">
                    ₹{order.totalAmount.toLocaleString()}
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewOrders;