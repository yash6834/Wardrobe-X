import React, { useEffect, useState } from "react";
import { Truck, Package, RefreshCcw } from "lucide-react";
import api from "../../api/api";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusOptions = ["Pending", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You are not logged in.");

      const res = await api.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) setOrders(res.data.orders);
      else setOrders([]);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.message || "Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not logged in.");

      const res = await api.put(
        `/api/orders/update/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <RefreshCcw size={30} className="animate-spin mb-2 text-blue-500" />
        <p>Loading orders...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600 font-medium">
        <p>{error}</p>
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
        <Package size={64} className="text-gray-400 mb-3" />
        <p className="text-lg font-medium">No orders found yet.</p>
      </div>
    );

  return (
    <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Truck size={22} className="text-blue-600" />
          Customer Orders
        </h2>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* ✅ Now 4 boxes per row (responsive grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-gray-800">
                #{order._id.slice(-6).toUpperCase()}
              </p>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Shipped"
                    ? "bg-blue-100 text-blue-700"
                    : order.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="flex gap-3 items-center mb-3">
              <img
                src={
                  order.items?.[0]?.productId?.image
                    ? `http://localhost:3000${order.items[0].productId.image}`
                    : "https://via.placeholder.com/60x60?text=No+Image"
                }
                alt={order.items?.[0]?.productId?.name || "Product"}
                className="w-16 h-16 rounded-lg border object-contain"
              />
              <div>
                <p className="font-medium text-gray-800">
                  {order.customerName || "Guest"}
                </p>
                <p className="text-xs text-gray-500">{order.email}</p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mb-3 border-t border-gray-100 pt-2">
              <p className="text-sm text-gray-700 font-medium mb-1">
                Items Ordered:
              </p>
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {item.name} ({item.size || "—"})
                  </span>
                  <span className="text-gray-600">× {item.qty}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between mt-3">
              <p className="text-gray-800 font-semibold">
                ₹{order.totalAmount?.toLocaleString() || "0"}
              </p>
              <select
                className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewOrders;
