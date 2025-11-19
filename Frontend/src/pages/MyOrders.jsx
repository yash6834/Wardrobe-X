import React, { useEffect, useState } from "react";
import api from "../api/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const statusColors = {
    Pending: "bg-yellow-400",
    Shipped: "bg-blue-400",
    Delivered: "bg-green-500",
    Cancelled: "bg-red-500",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not logged in");

        const res = await api.get("/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <main className="pt-24 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-2">My Orders</h2>
        <p className="text-gray-500">Loading your orders...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="pt-24 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-2">My Orders</h2>
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (orders.length === 0) {
    return (
      <main className="pt-24 text-center min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold mb-2">My Orders</h2>
        <p className="text-gray-500">You haven't placed any orders yet.</p>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-10 text-center">My Orders</h2>

      <div className="space-y-6 max-w-5xl mx-auto">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-2xl p-6 bg-white shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-3 border-b pb-3 mb-4">
              <div>
                <p className="text-gray-600 text-sm">
                  Order ID: <span className="font-mono">{order._id}</span>
                </p>
                <p className="text-gray-500 text-xs">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    statusColors[order.status] || "bg-gray-400"
                  }`}
                ></span>
                <span className="font-semibold text-sm">{order.status}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm border-b pb-2 hover:bg-gray-50 transition rounded-lg px-2 py-1"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Size: {item.size} | Qty: {item.qty}
                    </p>
                  </div>
                  <p className="font-medium">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            {/* Order Summary & Tracking */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-4 sm:gap-0">
              <div className="space-y-1">
                <p className="text-gray-600 text-sm">
                  Total: <span className="font-semibold text-lg">₹{order.totalAmount}</span>
                </p>
                <p className="text-gray-500 text-xs sm:text-sm">
                  Payment: {order.paymentMethod?.toUpperCase()}
                </p>
              </div>

              {/* Tracking bar */}
              <div className="w-full sm:w-1/2">
                <p className="text-gray-600 text-xs mb-1">Track Status:</p>
                <div className="flex items-center gap-2 w-full h-2">
                  {["Pending", "Shipped", "Delivered"].map((step, idx) => {
                    const active =
                      ["Pending", "Shipped", "Delivered"].indexOf(order.status) >= idx;
                    return (
                      <div
                        key={step}
                        className={`flex-1 h-2 rounded-full transition-colors duration-300 ${
                          active ? statusColors[order.status] : "bg-gray-300"
                        }`}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MyOrders;
