import React, { useEffect, useState } from "react";
import api from "../../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-100",
    confirmed: "text-indigo-600 bg-indigo-50 border-indigo-100",
    shipped: "text-blue-600 bg-blue-50 border-blue-100",
    delivered: "text-emerald-600 bg-emerald-50 border-emerald-100",
    cancelled: "text-slate-500 bg-slate-100 border-slate-200",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in");
      const res = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please provide a cancellation reason");
      return;
    }
    try {
      await api.put(
        `/api/orders/cancel/${selectedOrderId}`,
        { reason: cancelReason },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === selectedOrderId
            ? {
                ...order,
                items: order.items.map((item) => ({ ...item, status: "cancelled" })),
              }
            : order
        )
      );
      setShowCancel(false);
      setCancelReason("");
      setSelectedOrderId(null);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Fetching your orders...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pt-28 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Order History</h2>
            <p className="text-slate-500 mt-2">Manage your recent orders and track deliveries.</p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-sm rounded-xl px-4 py-2.5 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => (window.location.href = "/my-returns")}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-slate-200"
            >
              Returns
            </button>
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-8">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <p className="text-slate-400">No orders found.</p>
            </div>
          ) : (
            orders
              .filter((o) => statusFilter === "all" || o.items.some((i) => i.status === statusFilter))
              .map((order) => (
                <div key={order._id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6 border-b border-slate-50 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Order Date</p>
                        <p className="text-sm font-bold text-slate-700">{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Order ID</p>
                        <p className="text-sm font-mono text-slate-600">#{order._id.slice(-8)}</p>
                      </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${statusColors[order.items[0]?.status] || "bg-gray-100"}`}>
                      {order.items[0]?.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-4">
                    {order.items.slice(0, 2).map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <img
                          src={item.product?.image?.length ? `http://localhost:3000${item.product.image[0]}` : "/placeholder.png"}
                          className="w-20 h-20 object-cover rounded-2xl border border-slate-100"
                          alt=""
                        />
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-slate-800 line-clamp-1">{item.product?.name}</h4>
                          <p className="text-sm text-slate-500 mt-1">Size: {item.size || "Standard"} • Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right flex flex-col justify-center">
                          <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-indigo-500 font-medium">+ {order.items.length - 2} more items</p>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 py-4 bg-white border-t border-slate-50 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-slate-400">Total Amount</p>
                      <p className="text-xl font-black text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => { setSelectedOrder(order); setShowDetails(true); }}
                      className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-6 py-2 rounded-xl transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>

      {/* RE-STYLED MODALS (Common Glass Overlay) */}
      {(showDetails || showCancel) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            
            {/* VIEW DETAILS MODAL */}
            {showDetails && selectedOrder && (
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Order Details</h3>
                  <button onClick={() => setShowDetails(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                </div>
                
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 rounded-2xl border border-slate-50 bg-slate-50/30">
                      <img src={item.product?.image?.length ? `http://localhost:3000${item.product.image[0]}` : "/placeholder.png"} className="w-14 h-14 rounded-xl object-cover" alt="" />
                      <div className="flex-1 text-sm">
                        <p className="font-bold text-slate-800">{item.product?.name}</p>
                        <p className="text-slate-500">Qty: {item.quantity} | {item.size}</p>
                        <p className={`text-[10px] font-bold mt-1 uppercase ${statusColors[item.status]?.split(' ')[0]}`}>{item.status}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-500 font-medium">Grand Total</span>
                    <span className="text-2xl font-black text-indigo-600">₹{selectedOrder.totalAmount}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {selectedOrder.items.every(i => i.status !== "delivered" && i.status !== "cancelled") && (
                      <button onClick={() => { setSelectedOrderId(selectedOrder._id); setShowDetails(false); setShowCancel(true); }}
                        className="w-full py-3 bg-red-50 text-red-600 font-bold rounded-2xl hover:bg-red-100 transition-colors">
                        Cancel Entire Order
                      </button>
                    )}
                    {selectedOrder.items.some(i => i.status === "delivered") && (
                      <button onClick={() => (window.location.href = `/return/${selectedOrder._id}`)}
                        className="w-full py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100">
                        Return / Exchange
                      </button>
                    )}
                    <button onClick={() => setShowDetails(false)} className="w-full py-3 text-slate-500 font-bold">Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* CANCEL MODAL */}
            {showCancel && (
              <div className="p-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Cancel Order</h3>
                <p className="text-slate-500 text-sm mb-6">Please let us know why you're cancelling so we can improve.</p>
                
                <textarea
                  rows={4}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none mb-6"
                  placeholder="Reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />

                <div className="flex gap-3">
                  <button onClick={() => setShowCancel(false)} className="flex-1 py-3 font-bold text-slate-500">Back</button>
                  <button onClick={submitCancel} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-2xl shadow-lg shadow-red-100">Confirm</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default MyOrders;