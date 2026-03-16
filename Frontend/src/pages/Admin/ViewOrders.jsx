import React, { useEffect, useState } from "react";
import { 
  RefreshCcw, 
  Package, 
  ShoppingBag, 
  Clock, 
  ArrowLeftRight, 
  ChevronRight 
} from "lucide-react";
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
    if (s === "delivered") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "shipped") return "bg-blue-100 text-blue-700 border-blue-200";
    if (s === "cancelled") return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  // SKELETON LOADER
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-8 bg-slate-50/50 min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Orders Feed</h1>
          <p className="text-slate-500 mt-1">
            Monitor and manage customer transactions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => (window.location.href = "/admin/returns")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeftRight size={16} className="text-slate-500" />
            Manage Returns
          </button>
          
          <button
            onClick={fetchOrders}
            disabled={loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm active:scale-95
              ${loading ? "bg-slate-400 text-white" : "bg-slate-900 text-white hover:bg-slate-800"}
            `}
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ORDERS LIST */}
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <ShoppingBag className="text-slate-400" size={40} />
          </div>
          <h3 className="text-slate-900 font-bold text-xl mb-1">No orders yet</h3>
          <p className="text-slate-500 text-sm">When customers shop, their incoming orders will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
            >
              
              {/* ORDER HEADER */}
              <div className="px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                    <Package size={20} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Order ID</p>
                    <p className="font-bold text-slate-800 leading-none">#{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${getStatusStyles(order.orderStatus)}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></div>
                  {order.orderStatus}
                </div>
              </div>

              {/* ITEMS SECTION */}
              <div className="p-6 space-y-5">
                {order.items.map((item) => {
                  const imageUrl = item.product?.image?.[0]
                    ? `${BASE_URL}${item.product.image[0]}`
                    : "/placeholder.png";

                  return (
                    <div key={item._id} className="flex items-start sm:items-center gap-4 group/item">
                      
                      {/* Product Image */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={item.product?.name || "Product image"}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.png";
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-slate-900 truncate text-base mb-1">
                          {item.product?.name || "Deleted Product"}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                            Qty: {item.quantity}
                          </span>
                          {item.size && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                              Size: {item.size}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Item Status (Desktop) */}
                      <div className="hidden sm:flex flex-col items-end">
                         <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Item Status</p>
                         <p className="text-sm font-semibold text-slate-700 capitalize bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                           {item.status}
                         </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FOOTER */}
              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center mt-auto">
                <div className="flex items-center gap-2 text-slate-500">
                  <Clock size={16} />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {new Date(order.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                      ₹{order.totalAmount?.toLocaleString() || '0'}
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