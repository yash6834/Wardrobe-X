import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { 
  Package, 
  User, 
  Mail, 
  Calendar, 
  Truck, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  ExternalLink,
  Clock,
  MapPin,
  Hash
} from "lucide-react";

const STATUS_OPTIONS = [
  "pending",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [confirmDelivery, setConfirmDelivery] = useState(null);

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetchVendorOrders();
  }, []);

  const fetchVendorOrders = async () => {
    try {
      const res = await api.get("/api/vendor/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
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

  const updateItemStatus = async (orderId, itemId, newStatus) => {
    try {
      setUpdating(true);
      const res = await api.put(
        `/api/vendor/orders/${orderId}/item/${itemId}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  items: order.items.map((item) =>
                    item._id === itemId ? { ...item, status: newStatus } : item
                  ),
                }
              : order
          )
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Syncing orders...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-[#FBFBFE] min-h-screen">
      {/* HEADER SECTION */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-100 rounded-lg">
               <Package className="text-indigo-600 w-5 h-5" />
            </div>
            <span className="text-indigo-600 font-bold text-sm tracking-widest uppercase">Operations</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            Fulfillment Center
          </h1>
          <p className="text-gray-500 mt-2 max-w-xl">
            Real-time order management. Track your product journey from confirmation to delivery.
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <div className="px-4 py-2 bg-gray-50 rounded-xl text-center">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Total Orders</p>
                <p className="text-lg font-black text-gray-900">{orders.length}</p>
            </div>
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-20 text-center border-2 border-dashed border-gray-200">
          <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="text-gray-300 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No active orders</h3>
          <p className="text-gray-500 mt-2">When customers buy your products, they'll appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            const hasCancelledItem = order.items.some(i => i.status === "cancelled");

            return (
              <div key={order._id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* ORDER HEADER */}
                <div className="bg-gray-50/80 px-6 py-5 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
                         <User size={18} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-tighter leading-none mb-1">Customer</p>
                        <span className="font-bold text-gray-800">{order.user?.name}</span>
                      </div>
                    </div>

                    <div className="hidden lg:block">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Contact</p>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Mail size={14} className="text-gray-400" />
                            {order.user?.email}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Order Date</p>
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono bg-white px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 flex items-center gap-1.5">
                      <Hash size={12} /> {order._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* ITEMS LIST */}
                <div className="divide-y divide-gray-100 px-6">
                  {order.items.map((item) => {
                    const productImage = item.product?.image?.[0]
                      ? `${BASE_URL}${item.product.image[0]}`
                      : "https://via.placeholder.com/150";

                    return (
                      <div key={item._id} className="py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="relative group">
                            <img 
                                src={productImage} 
                                alt="" 
                                className="w-24 h-24 rounded-2xl object-cover border border-gray-100 shadow-sm bg-gray-50 group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute -top-2 -right-2 bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-4 border-white">
                                {item.quantity}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 text-lg leading-tight mb-2">{item.product?.name}</h4>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-bold uppercase">Size: {item.size}</span>
                              <span className="text-[11px] bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 font-bold uppercase">SKU: {item._id.slice(-4)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:items-end gap-3">
                          {item.status === "delivered" ? (
                            <div className="inline-flex items-center gap-2 text-emerald-600 bg-emerald-50 px-5 py-2.5 rounded-2xl text-sm font-black border border-emerald-100 shadow-sm shadow-emerald-50">
                              <CheckCircle size={18} /> Order Delivered
                            </div>
                          ) : (
                            <div className="relative w-full md:w-auto">
                              <p className="text-[10px] uppercase font-black text-gray-400 mb-1.5 md:text-right px-1">Update Pipeline</p>
                              <div className="relative">
                                <select
                                    disabled={updating || item.status === "cancelled"}
                                    value={item.status}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      val === "delivered" 
                                        ? setConfirmDelivery({ orderId: order._id, itemId: item._id }) 
                                        : updateItemStatus(order._id, item._id, val);
                                    }}
                                    className={`appearance-none border-2 rounded-2xl pl-5 pr-12 py-3 text-sm font-bold focus:ring-4 focus:ring-indigo-100 outline-none transition-all cursor-pointer w-full md:w-56 ${
                                      item.status === "shipped" ? "text-blue-600 bg-blue-50 border-blue-100" :
                                      item.status === "cancelled" ? "text-red-600 bg-red-50 border-red-100" :
                                      item.status === "confirmed" ? "text-indigo-600 bg-indigo-50 border-indigo-100" :
                                      "text-amber-600 bg-amber-50 border-amber-100"
                                    }`}
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                    <Clock size={16} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="bg-gray-50/40 p-6 border-t border-gray-100">
                  {hasCancelledItem && order.cancelReason && (
                    <div className="mb-6 flex items-start gap-4 bg-red-50/50 p-4 rounded-2xl border border-red-100">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <AlertTriangle className="text-red-600 shrink-0" size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-red-700 uppercase tracking-wider mb-1">Cancellation Protocol Triggered</p>
                        <p className="text-sm text-red-800 font-medium leading-relaxed italic">"{order.cancelReason}"</p>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1 text-xs">
                            <Truck size={14} /> Standard Shipping
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center gap-1 text-xs">
                            <MapPin size={14} /> Residential Delivery
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-500 font-medium">Total Payout:</span>
                        <span className="text-2xl font-black text-gray-900 tracking-tight">
                            ₹{order.totalAmount.toLocaleString()}
                        </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL */}
      {confirmDelivery && (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-md flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-8 mx-auto rotate-3">
              <Truck className="text-emerald-600" size={40} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 text-center mb-3">Mark as Delivered?</h3>
            <p className="text-gray-500 text-center mb-10 leading-relaxed px-4">
              This will notify the customer and trigger the final settlement. Ensure the product has been physically handed over.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setConfirmDelivery(null)}
                className="flex-1 px-6 py-4 text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all border border-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  updateItemStatus(confirmDelivery.orderId, confirmDelivery.itemId, "delivered");
                  setConfirmDelivery(null);
                }}
                className="flex-1 px-6 py-4 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl shadow-xl shadow-indigo-200 transition-all hover:scale-[1.02] active:scale-95"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrders;