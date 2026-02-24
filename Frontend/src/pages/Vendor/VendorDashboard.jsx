import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Package,
  Clock,
  ShoppingBag,
  TrendingUp,
  ArrowUpRight,
  LayoutDashboard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const VendorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/vendor/dashboard")
      .then((res) => setStats(res.data.stats))
      .catch(() => alert("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stats) return null;

  const totalRevenue = stats.revenue.paid + stats.revenue.unpaid;

  const orderChartData = Object.entries(stats.ordersByStatus).map(([key, value]) => ({
    name: key,
    value,
  }));

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="p-4 md:p-8 bg-[#F9FAFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="text-indigo-600" />
            Vendor Dashboard
          </h1>
          <p className="text-gray-500 mt-1 font-medium">
            Store performance analytics and order monitoring.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-sm font-semibold text-gray-700">Live Updates</span>
          </div>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Products"
          value={stats.totalProducts}
          icon={<Package size={20} />}
          color="bg-blue-50 text-blue-600"
        />
        <KpiCard
          title="Pending Review"
          value={stats.pendingProducts}
          icon={<Clock size={20} />}
          color="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag size={20} />}
          color="bg-purple-50 text-purple-600"
        />
        <KpiCard
          title="Gross Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          icon={<TrendingUp size={20} />}
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ================= LEFT COLUMN: REVENUE & BREAKDOWN ================= */}
        <div className="lg:col-span-2 space-y-8">
          {/* REVENUE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueCard
              title="Settled Payments"
              amount={stats.revenue.paid}
              icon={<CheckCircle className="text-white/20" size={48} />}
              gradient="from-emerald-500 to-teal-600"
            />
            <RevenueCard
              title="Pending Settlement"
              amount={stats.revenue.unpaid}
              icon={<AlertCircle className="text-white/20" size={48} />}
              gradient="from-orange-400 to-rose-500"
            />
          </div>

          {/* STATUS BREAKDOWN LIST */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-800">Order Progress Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(stats.ordersByStatus).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <span className="capitalize font-semibold text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                      {key}
                    </span>
                    <span className="text-lg font-bold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: ANALYTICS CHART ================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="mb-6">
            <h3 className="font-bold text-gray-800 text-lg">Orders Status Distribution</h3>
            <p className="text-sm text-gray-400">Visual representation of fulfillment</p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderChartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  stroke="none"
                >
                  {orderChartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
             {orderChartData.map((entry, index) => (
               <div key={entry.name} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                   <span className="capitalize text-gray-600 font-medium">{entry.name}</span>
                 </div>
                 <span className="font-bold text-gray-800">{entry.value}</span>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const KpiCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <ArrowUpRight className="text-gray-300" size={18} />
    </div>
    <div className="mt-4">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const RevenueCard = ({ title, amount, gradient, icon }) => (
  <div className={`relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br ${gradient} shadow-lg shadow-indigo-100`}>
    <div className="relative z-10">
      <p className="text-sm font-medium text-white/80">{title}</p>
      <p className="text-3xl font-black mt-2 tracking-tight">
        ₹{amount.toLocaleString()}
      </p>
    </div>
    <div className="absolute right-[-10px] bottom-[-10px]">
      {icon}
    </div>
  </div>
);

export default VendorDashboard;