import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Users,
  ShoppingBag,
  Package,
  Clock,
  ArrowUpRight,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const DashBoard = () => {
  const [stats, setStats] = useState(null);
  const [ordersByDate, setOrdersByDate] = useState([]);
  const [monthlySales, setMonthlySales] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, ordersDateRes, monthlyRes, pendingProductsRes] =
          await Promise.all([
            api.get("/api/admin/dashboard/stats"),
            api.get("/api/admin/dashboard/orders-by-date"),
            api.get("/api/admin/dashboard/monthly-sales"),
            api.get("/api/admin/products/pending"),
          ]);

        setStats(statsRes.data.stats);
        setOrdersByDate(ordersDateRes.data);
        setMonthlySales(monthlyRes.data);
        setPendingCount(pendingProductsRes.data.length);
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };
    loadDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium tracking-tight">Syncing data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 p-2 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-zinc-900 tracking-tight">
            Overview
          </h1>
          <p className="text-zinc-500 mt-1 font-medium">
            Real-time analytics and platform performance.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-zinc-100 text-zinc-600 px-3 py-1.5 rounded-full border border-zinc-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          SYSTEM LIVE
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users size={20} />}
          trend="+12%"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag size={20} />}
          trend="+5.4%"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={20} />}
        />
        <StatCard
          title="Pending Approvals"
          value={pendingCount}
          icon={<Clock size={20} />}
          danger={pendingCount > 0}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Orders by Date (60% width) */}
        <div className="lg:col-span-3">
          <ChartCard title="Order Velocity" subtitle="Daily transaction volume">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={ordersByDate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} 
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0f172a"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#0f172a", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, shadow: '0 0 10px rgba(0,0,0,0.2)' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Monthly Sales (40% width) */}
        <div className="lg:col-span-2">
          <ChartCard title="Revenue Growth" subtitle="Monthly performance metrics">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar
                  dataKey="total"
                  fill="#6366f1"
                  radius={[6, 6, 6, 6]}
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>

      {/* ALERTS SECTION */}
      {pendingCount > 0 && (
        <div className="bg-white border-2 border-amber-100 rounded-[2rem] p-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 className="font-bold text-zinc-900 text-lg">Action Required</h3>
              <p className="text-zinc-500 text-sm">
                There are <span className="font-bold text-amber-600">{pendingCount} products</span> awaiting your review.
              </p>
            </div>
          </div>
          <button 
            onClick={() => window.location.href='/admin/pending'}
            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
          >
            Review Now
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= REFINED COMPONENTS ================= */

const StatCard = ({ title, value, icon, danger, trend }) => (
  <div className={`relative overflow-hidden bg-white border border-zinc-100 rounded-[2rem] p-6 shadow-sm transition-all hover:shadow-md`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${danger ? "bg-rose-50 text-rose-600" : "bg-zinc-50 text-zinc-900"}`}>
        {icon}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight size={12} />
          {trend}
        </div>
      )}
    </div>
    <div>
      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{title}</p>
      <p className="text-3xl font-black text-zinc-900 mt-1 tracking-tight">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-sm h-full">
    <div className="mb-8">
      <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{title}</h3>
      <p className="text-sm text-zinc-400 font-medium">{subtitle}</p>
    </div>
    {children}
  </div>
);

export default DashBoard;