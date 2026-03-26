import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Users,
  ShoppingCart,
  Package,
  Clock,
  IndianRupee, // Available if you want to add a Revenue card later
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";

const DashBoard = () => {
  const [stats, setStats] = useState(null);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, ordersRes, monthlyRes, pendingRes, recentRes] = await Promise.all([
          api.get("/api/admin/dashboard/stats"),
          api.get("/api/admin/dashboard/orders-by-date"),
          api.get("/api/admin/dashboard/monthly-sales"),
          api.get("/api/admin/products/pending"),
          api.get("/api/admin/orders/recent"),

        ]);

        setStats(statsRes.data.stats);
        setOrdersByDate(ordersRes.data);
        setMonthlySales(monthlyRes.data);
        setPendingCount(pendingRes.data.length);
        setRecentOrders(recentRes.data); // ✅ correct
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);



  // SKELETON LOADER
  if (!stats) {
    return (
      <div className="p-6 md:p-8 space-y-8 max-w-[1500px] mx-auto min-h-screen bg-slate-50/50">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-2xl animate-pulse"></div>
          ))}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="h-[400px] bg-slate-200 rounded-2xl animate-pulse"></div>
          <div className="h-[400px] bg-slate-200 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8">
      <div className="max-w-[1500px] mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-500 mt-1">
              Monitor your store's performance and pending actions.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full shadow-sm border border-emerald-200">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            LIVE DATA
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            icon={<Users size={24} strokeWidth={2.5} />}
            title="Total Users"
            value={stats.totalUsers}
            bgColor="bg-blue-100"
            iconColor="text-blue-600"
          />

          <Card
            icon={<ShoppingCart size={24} strokeWidth={2.5} />}
            title="Total Orders"
            value={stats.totalOrders}
            bgColor="bg-purple-100"
            iconColor="text-purple-600"
          />

          <Card
            icon={<Package size={24} strokeWidth={2.5} />}
            title="Active Products"
            value={stats.totalProducts}
            bgColor="bg-orange-100"
            iconColor="text-orange-600"
          />
          


        </div>

        {/* ACTION ALERT - Moved up for better visibility */}
        {pendingCount > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertTriangle className="text-amber-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-lg">
                  {pendingCount} Products Awaiting Approval
                </h4>
                <p className="text-sm text-amber-700/80 mt-0.5">
                  Review new seller submissions before they go live on the platform.
                </p>
              </div>
            </div>

            <button
              onClick={() => (window.location.href = "/admin/pending")}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm whitespace-nowrap"
            >
              Review Now
              <ArrowRight size={16} />
            </button>
          </div>
        )}





        {/* CHARTS */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ORDERS TREND */}
          <ChartCard
            title="Orders Trend"
            subtitle="Daily activity over the last 30 days"
            icon={<TrendingUp size={18} className="text-indigo-500" />}
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={ordersByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* SALES */}
          <ChartCard
            title="Monthly Revenue"
            subtitle="Total revenue generated per month"
            icon={<IndianRupee size={18} className="text-emerald-500" />}
          >
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar
                  dataKey="total"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border">
          <h3 className="text-lg font-bold mb-4">Recent Orders</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 border-b">
                  <th className="py-2">Order ID</th>
                  <th>User</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-slate-50">

                      {/* ORDER ID */}
                      <td className="py-3 font-medium text-slate-700">
                        #{order._id.slice(-6)}
                      </td>

                      {/* USER */}
                      <td className="py-3">
                        {order.user?.name || "Guest"}
                      </td>

                      {/* AMOUNT */}
                      <td className="py-3 font-semibold text-slate-800">
                        ₹{order.totalAmount.toFixed(2)}
                      </td>

                      {/* STATUS */}
                      <td className="py-3">
  <span
    className={`px-2 py-1 rounded text-xs font-medium ${
      (order.orderStatus || "pending") === "delivered"
        ? "bg-green-200 text-green-600"
        : (order.orderStatus || "pending") === "shipped"
        ? "bg-blue-200 text-blue-600"
        : (order.orderStatus || "pending") === "cancelled"
        ? "bg-red-200 text-red-600"
        : "bg-yellow-200 text-yellow-600  "
    }`}
  >
    {order.orderStatus || "pending"}
  </span>
</td>

                      {/* DATE */}
                      <td className="py-3 text-slate-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-slate-400">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Extracted UI Components
const Card = ({ icon, title, value, bgColor, iconColor }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h2 className="text-3xl font-bold text-slate-800">{value}</h2>
      </div>
      <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
        {icon}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, icon, children }) => (
  <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
    <div className="mb-6 flex items-center gap-3">
      <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-800 text-lg leading-tight">{title}</h3>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export default DashBoard;