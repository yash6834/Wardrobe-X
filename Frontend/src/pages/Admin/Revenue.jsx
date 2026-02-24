import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import {
  TrendingUp,
  Wallet,
  Percent,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

const Revenue = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [vendorEarnings, setVendorEarnings] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/orders");

      if (res.data.success) {
        const ordersData = res.data.orders || [];
        setOrders(ordersData);

        let revenue = 0;
        let commission = 0;
        let vendorTotal = 0;

        ordersData.forEach((order) => {
          revenue += order.totalAmount || 0;
          commission += order.commissionAmount || 0;
          vendorTotal += order.vendorEarning || 0;
        });

        setTotalRevenue(revenue);
        setTotalCommission(commission);
        setVendorEarnings(vendorTotal);
      }
    } catch (err) {
      setError("Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */
  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") return orders;
    return orders.filter((order) => order.orderStatus === filterStatus);
  }, [orders, filterStatus]);

  /* ================= PAYOUT LOGIC ================= */
  const vendorMap = {};
  orders.forEach((order) => {
    const isPayable =
      order.orderStatus === "delivered" &&
      order.settlementStatus === "pending" &&
      ["paid", "pending"].includes(order.paymentStatus);

    if (!isPayable) return;

    const vendorId =
      typeof order.vendor === "object"
        ? order.vendor._id
        : order.vendor;

    if (!vendorId) return;

    if (!vendorMap[vendorId]) {
      vendorMap[vendorId] = {
        vendorId,
        brandName:
          typeof order.vendor === "object"
            ? order.vendor.brandName
            : "Unknown Vendor",
        totalVendorEarning: 0,
      };
    }

    vendorMap[vendorId].totalVendorEarning += order.vendorEarning || 0;
  });

  const vendors = Object.values(vendorMap);

  const handlePayVendor = async (vendorId) => {
    const confirmPay = window.confirm(
      "Are you sure you want to settle this vendor?"
    );
    if (!confirmPay) return;

    try {
      await api.post(`/api/admin/payout/${vendorId}`);
      fetchRevenue();
      alert("Vendor paid successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Payout failed");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-zinc-50">
        <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
          Loading Finance Data...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-12">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
              Finance Dashboard
            </h1>
            <p className="text-zinc-500 font-medium mt-2">
              Monitor platform revenue, commissions and vendor settlements.
            </p>
          </div>

          <button
            onClick={fetchRevenue}
            className="flex items-center gap-2 bg-zinc-900 text-white px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition active:scale-95"
          >
            <ArrowUpRight size={14} />
            Refresh
          </button>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Gross Revenue"
            value={totalRevenue}
            icon={<TrendingUp size={20} />}
          />
          <StatCard
            label="Platform Fee"
            value={totalCommission}
            icon={<Percent size={20} />}
          />
          <StatCard
            label="Vendor Payouts"
            value={vendorEarnings}
            icon={<Wallet size={20} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ================= VENDOR PAYOUTS ================= */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">
              Pending Payouts
            </h3>

            {vendors.length === 0 ? (
              <div className="p-10 text-center bg-white rounded-2xl border border-zinc-200">
                <CheckCircle2
                  className="mx-auto text-zinc-300 mb-2"
                  size={32}
                />
                <p className="text-zinc-400 text-xs font-bold uppercase">
                  All Settled
                </p>
              </div>
            ) : (
              vendors.map((vendor) => (
                <div
                  key={vendor.vendorId}
                  className="bg-white border border-zinc-200 rounded-2xl p-6 hover:shadow-md transition"
                >
                  <div className="flex justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-zinc-900">
                        {vendor.brandName}
                      </h4>
                      <p className="text-xs text-zinc-400">
                        ID: {vendor.vendorId.slice(-6).toUpperCase()}
                      </p>
                    </div>
                    <CreditCard size={18} />
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase">
                        Amount Due
                      </p>
                      <p className="text-xl font-black text-zinc-900">
                        ₹{vendor.totalVendorEarning.toLocaleString()}
                      </p>
                    </div>

                    <button
                      onClick={() => handlePayVendor(vendor.vendorId)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase hover:bg-emerald-700 transition"
                    >
                      Pay Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ================= TABLE ================= */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black uppercase tracking-widest">
                Order Breakdown
              </h3>

              <div className="flex bg-zinc-200 p-1 rounded-xl">
                {["all", "pending", "delivered"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 text-xs font-bold uppercase rounded-lg ${
                      filterStatus === status
                        ? "bg-white shadow text-zinc-900"
                        : "text-zinc-500"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Gross</th>
                    <th className="px-6 py-4 text-right">Fee</th>
                    <th className="px-6 py-4 text-right">Net</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-t border-zinc-100 hover:bg-zinc-50"
                    >
                      <td className="px-6 py-4 font-bold">
                        #{order._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs rounded-full ${
                            order.orderStatus === "delivered"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        ₹{order.totalAmount}
                      </td>
                      <td className="px-6 py-4 text-right text-indigo-600">
                        ₹{order.commissionAmount}
                      </td>
                      <td className="px-6 py-4 text-right font-bold">
                        ₹{order.vendorEarning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================= STAT CARD ================= */
const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition">
    <div className="flex justify-between items-center mb-4">
      <div className="p-3 bg-zinc-100 rounded-xl">{icon}</div>
      <TrendingUp size={16} className="text-zinc-400" />
    </div>

    <p className="text-xs font-bold uppercase text-zinc-400 mb-1">
      {label}
    </p>
    <h2 className="text-3xl font-black text-zinc-900">
      ₹{value.toLocaleString()}
    </h2>
  </div>
);

export default Revenue;
