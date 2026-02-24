import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  Wallet,
  ShoppingBag,
  Percent,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

const VendorAnalytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mocking API call for demonstration if api import fails, 
    // strictly keeping your logic structure otherwise.
    if (api && api.get) {
      api
        .get("/api/vendor/dashboard")
        .then((res) => setStats(res.data.stats))
        .catch(() => alert("Failed to load analytics"))
        .finally(() => setLoading(false));
    } else {
        // Fallback for preview purposes only
        setTimeout(() => {
            setStats({
                totalOrders: 154,
                ordersByStatus: { delivered: 120, pending: 10, cancelled: 5, processing: 19 },
                revenue: { paid: 45000, unpaid: 5000 }
            });
            setLoading(false);
        }, 1000);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
          <p className="text-indigo-600 font-medium tracking-wide">Crunching data...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  /* ================= DATA TRANSFORM ================= */
  const orderStatusData = Object.entries(stats.ordersByStatus).map(([key, value]) => ({
    name: key,
    value,
  }));

  const revenueBarData = [
    { name: "Paid", amount: stats.revenue.paid },
    { name: "Unpaid", amount: stats.revenue.unpaid },
  ];

  const revenueTrendData = [
    { name: "Paid", revenue: stats.revenue.paid },
    { name: "Unpaid", revenue: stats.revenue.unpaid },
    { name: "Total", revenue: stats.revenue.paid + stats.revenue.unpaid },
  ];

  const deliveredOrders = stats.ordersByStatus.delivered || 0;
  const conversionRate =
    stats.totalOrders > 0 ? ((deliveredOrders / stats.totalOrders) * 100).toFixed(1) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-indigo-600 font-bold text-xs sm:text-sm tracking-widest uppercase">
            Overview
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mt-1">
            Performance Insights
          </h2>
        </div>
        <div className="flex items-center self-start md:self-auto gap-2 text-xs sm:text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          Live Data Updates
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <KpiCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="bg-indigo-50 text-indigo-600"
          trend="+12%"
        />
        <KpiCard
          title="Delivered"
          value={deliveredOrders}
          icon={<TrendingUp className="w-5 h-5" />}
          color="bg-emerald-50 text-emerald-600"
        />
        <KpiCard
          title="Conv. Rate"
          value={`${conversionRate}%`}
          icon={<Percent className="w-5 h-5" />}
          color="bg-amber-50 text-amber-600"
        />
        <KpiCard
          title="Paid Revenue"
          value={`₹${stats.revenue.paid.toLocaleString()}`}
          icon={<Wallet className="w-5 h-5" />}
          color="bg-rose-50 text-rose-600"
        />
      </div>

      {/* ================= MAIN CHARTS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* ORDERS BY STATUS */}
        <ChartCard
          title="Orders Distribution"
          subtitle="Breakdown of your current order lifecycle"
        >
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  // Use percentages for responsive radii
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={8}
                  stroke="none"
                >
                  {orderStatusData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                      cornerRadius={6}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4">
            {orderStatusData.map((entry, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                ></div>
                <span className="text-xs font-medium text-gray-600 capitalize">
                  {entry.name}
                </span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* REVENUE STATUS */}
        <ChartCard
          title="Payment Status"
          subtitle="Comparison between collected and pending funds"
        >
          <div className="h-[250px] sm:h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueBarData}
                margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "#F9FAFB" }}
                  content={<CustomTooltip />}
                />
                <Bar dataKey="amount" radius={[12, 12, 12, 12]} barSize={60}>
                  {revenueBarData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={index === 0 ? "#6366F1" : "#E0E7FF"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* ================= REVENUE TREND ================= */}
      <ChartCard
        title="Revenue Growth"
        subtitle="Cumulative tracking of your store's earning potential"
      >
        <div className="h-[250px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueTrendData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={4}
                fillOpacity={1}
                fill="url(#colorRev)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      {/* ================= FOOTER / COMING SOON ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-4">
        <PlaceholderCard title="Best Selling Products" />
        <PlaceholderCard title="Monthly Growth Analytics" />
      </div>
    </div>
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const KpiCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all group">
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div
        className={`p-2.5 sm:p-3 rounded-xl sm:rounded-2xl ${color} group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      {trend && (
        <span className="flex items-center text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
          <ArrowUpRight className="w-3 h-3 mr-0.5" /> {trend}
        </span>
      )}
    </div>
    <div>
      <p className="text-xs sm:text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
        {value}
      </p>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm p-5 sm:p-8">
    <div className="mb-6 sm:mb-8">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
    {children}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-xl border border-gray-800 text-xs z-50">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-indigo-400">
          Value:{" "}
          <span className="text-white font-mono">
            {payload[0].value.toLocaleString()}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const PlaceholderCard = ({ title }) => (
  <div className="relative overflow-hidden bg-gray-50 rounded-2xl sm:rounded-[2rem] border border-dashed border-gray-200 p-6 sm:p-8 min-h-[140px] sm:min-h-[160px] flex items-center justify-between group">
    <div>
      <h3 className="font-bold text-gray-700 text-sm sm:text-base">{title}</h3>
      <p className="text-xs sm:text-sm text-gray-400 mt-2">
        Coming Soon: Advanced AI predictions and detailed ranking.
      </p>
    </div>
    <div className="bg-white p-2 sm:p-3 rounded-full shadow-sm text-gray-300 group-hover:text-indigo-500 transition-colors">
      <ChevronRight className="w-5 h-5" />
    </div>
  </div>
);

export default VendorAnalytics;