import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Users,
  ShoppingCart,
  Package,
  Clock,
  IndianRupee,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
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

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [statsRes, ordersRes, monthlyRes, pendingRes] =
          await Promise.all([
            api.get("/api/admin/dashboard/stats"),
            api.get("/api/admin/dashboard/orders-by-date"),
            api.get("/api/admin/dashboard/monthly-sales"),
            api.get("/api/admin/products/pending"),
          ]);

        setStats(statsRes.data.stats);
        setOrdersByDate(ordersRes.data);
        setMonthlySales(monthlyRes.data);
        setPendingCount(pendingRes.data.length);
      } catch (err) {
        console.log(err);
      }
    };

    loadDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[1500px] mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-zinc-500 text-sm">
            Monitor store performance and activity
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          LIVE DATA
        </div>
      </div>

      {/* STAT CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <Card
          icon={<Users size={20} />}
          title="Users"
          value={stats.totalUsers}
          color="bg-blue-50 text-blue-600"
        />

        <Card
          icon={<ShoppingCart size={20} />}
          title="Orders"
          value={stats.totalOrders}
          color="bg-purple-50 text-purple-600"
        />

        <Card
          icon={<Package size={20} />}
          title="Products"
          value={stats.totalProducts}
          color="bg-orange-50 text-orange-600"
        />

        <Card
          icon={<Clock size={20} />}
          title="Pending Products"
          value={pendingCount}
          color="bg-amber-50 text-amber-600"
        />

        

      </div>

      {/* CHARTS */}

      <div className="grid lg:grid-cols-2 gap-6">

        {/* ORDERS TREND */}

        <ChartCard
          title="Orders Trend"
          subtitle="Daily orders activity"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ordersByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                fill="#6366f130"
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* SALES */}

        <ChartCard
          title="Monthly Revenue"
          subtitle="Revenue generated per month"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </div>

      {/* ALERT */}

      {pendingCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">

            <AlertTriangle className="text-amber-600" />

            <div>
              <h4 className="font-semibold">
                {pendingCount} Products Waiting Approval
              </h4>

              <p className="text-sm text-zinc-500">
                Review seller products before they appear in the store
              </p>
            </div>
          </div>

          <button
            onClick={() => (window.location.href = "/admin/pending")}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm"
          >
            Review
          </button>
        </div>
      )}
    </div>
  );
};

const Card = ({ icon, title, value, color }) => (
  <div className="bg-white border rounded-xl p-5 flex justify-between items-center shadow-sm hover:shadow-md transition">

    <div>
      <p className="text-sm text-zinc-500">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>

    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>

  </div>
);

const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white border rounded-xl p-6 shadow-sm">

    <div className="mb-4">
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-zinc-500">{subtitle}</p>
    </div>

    {children}

  </div>
);

export default DashBoard;