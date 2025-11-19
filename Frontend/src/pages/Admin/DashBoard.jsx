// src/Pages/Admin/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Users, ShoppingBag, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
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

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
  });

  const [ordersByDate, setOrdersByDate] = useState([]);
  const [ordersByMonth, setOrdersByMonth] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, ordersRes, productsRes, ordersDateRes, monthlyRes] =
          await Promise.all([
            api.get("/admin/users-count"),
            api.get("/admin/orders-count"),
            api.get("/admin/products-count"),
            api.get("/admin/orders-by-date"),
            api.get("/admin/monthly-sales"),
          ]);

        setStats({
          totalUsers: usersRes.data.count,
          totalOrders: ordersRes.data.count,
          totalProducts: productsRes.data.count,
        });

        setOrdersByDate(ordersDateRes.data);
        setOrdersByMonth(monthlyRes.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const statBoxes = [
    {
      title: "Registered Users",
      value: stats.totalUsers,
      icon: <Users size={28} />,
      color: "bg-blue-600",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: <ShoppingBag size={28} />,
      color: "bg-green-600",
      onClick: () => navigate("/admin/view-orders"),
    },
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: <Package size={28} />,
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-center text-gray-800">
        Admin Dashboard
      </h1>

      {/* Stat Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {statBoxes.map((box, index) => (
          <div
            key={index}
            onClick={box.onClick}
            className={`flex items-center gap-4 p-6 rounded-xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer ${box.color} text-white`}
          >
            <div className="p-4 rounded-full bg-white/25 flex items-center justify-center">
              {box.icon}
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide">
                {box.title}
              </h3>
              <p className="text-2xl font-bold mt-1">{box.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sales by Date (Line Chart) */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Sales by Date
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={ordersByDate}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" tick={{ fill: "#4b5563" }} />
            <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.5rem",
                border: "none",
              }}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Sales by Month (Bar Chart) */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Monthly Sales
        </h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={ordersByMonth}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" tick={{ fill: "#4b5563" }} />
            <YAxis allowDecimals={false} tick={{ fill: "#4b5563" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#f9fafb",
                borderRadius: "0.5rem",
                border: "none",
              }}
            />
            <Bar
              dataKey="total"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
