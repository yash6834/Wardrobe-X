import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import {
  TrendingUp,
  Wallet,
  Percent,
  ArrowUpRight,
  CreditCard,
  CheckCircle2,
  BarChart3,
} from "lucide-react";

const Revenue = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [settlingVendor, setSettlingVendor] = useState(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);
  const [vendorEarnings, setVendorEarnings] = useState(0);

  const [popupMessage, setPopupMessage] = useState("");
  const [confirmVendor, setConfirmVendor] = useState(null);

  useEffect(() => {
    fetchRevenue();
  }, []);

  const fetchRevenue = async () => {
    try {

      setLoading(true);

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

    } catch (error) {

      console.error("Revenue fetch error:", error);

    } finally {

      setLoading(false);

    }
  };

  /* ================= VENDOR PAYOUT LOGIC ================= */

  const vendors = useMemo(() => {

    const vendorMap = {};

    orders.forEach((order) => {

      const isPayable =
        order.orderStatus === "delivered" &&
        order.settlementStatus === "pending";

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

    return Object.values(vendorMap);

  }, [orders]);

  /* ================= PAY VENDOR ================= */

  const handlePayVendor = async (vendor) => {

    try {

      setSettlingVendor(vendor.vendorId);

      /* 1️⃣ create razorpay order */

      const orderRes = await api.post("/api/payment/create-order", {
        amount: vendor.totalVendorEarning,
      });

      const order = orderRes.data;

      /* 2️⃣ open razorpay checkout */

      const options = {

        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "Wardrobe X",
        description: `Vendor payout - ${vendor.brandName}`,

        handler: async function () {

          /* 3️⃣ mark payout after success */

          await api.post(`/api/admin/payout/${vendor.vendorId}`);

          setPopupMessage("Vendor payout completed!");

          fetchRevenue();

        },

        theme: {
          color: "#111",
        },

      };

      const rzp = new window.Razorpay(options);

      rzp.open();

    } catch (error) {

      console.error(error);

      setPopupMessage("Payment failed");

    } finally {

      setSettlingVendor(null);

    }

    setTimeout(() => setPopupMessage(""), 2000);

  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">

      <div className="max-w-7xl mx-auto p-8 space-y-12">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-4xl font-black tracking-tight text-zinc-900">
              Revenue Analytics
            </h1>

            <p className="text-zinc-500 mt-2">
              Overview of platform financial performance
            </p>

          </div>

          <button
            onClick={fetchRevenue}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl text-sm font-bold hover:scale-105 transition"
          >

            <ArrowUpRight size={16} />

            Refresh

          </button>

        </div>

        {/* SUMMARY CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <ModernCard
            label="Total Revenue"
            value={totalRevenue}
            icon={<TrendingUp size={22} />}
            color="emerald"
          />

          <ModernCard
            label="Platform Earnings"
            value={totalCommission}
            icon={<Percent size={22} />}
            color="indigo"
          />

          <ModernCard
            label="Vendor Payouts"
            value={vendorEarnings}
            icon={<Wallet size={22} />}
            color="orange"
          />

        </div>

        {/* PERFORMANCE SNAPSHOT */}

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-zinc-200">

          <div className="flex items-center gap-3 mb-6">

            <BarChart3 className="text-zinc-700" />

            <h3 className="font-bold text-lg">
              Performance Snapshot
            </h3>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">

            <Snapshot label="Total Orders" value={orders.length} />

            <Snapshot
              label="Delivered Orders"
              value={orders.filter((o) => o.orderStatus === "delivered").length}
            />

            <Snapshot
              label="Pending Orders"
              value={orders.filter((o) => o.orderStatus === "pending").length}
            />

          </div>

        </div>

        {/* VENDOR SETTLEMENTS */}

        <div>

          <h2 className="text-xl font-black mb-6">
            Pending Vendor Settlements
          </h2>

          {vendors.length === 0 ? (

            <div className="bg-white p-10 rounded-3xl text-center border border-zinc-200">

              <CheckCircle2
                size={40}
                className="mx-auto text-emerald-500 mb-3"
              />

              <p className="font-bold text-zinc-700">
                All vendors are settled 🎉
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 gap-6">

              {vendors.map((vendor) => (

                <div
                  key={vendor.vendorId}
                  className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm hover:shadow-md transition"
                >

                  <div className="flex justify-between items-center mb-4">

                    <h4 className="font-bold text-zinc-900">
                      {vendor.brandName}
                    </h4>

                    <CreditCard size={18} />

                  </div>

                  <p className="text-2xl font-black mb-4">
                    ₹{vendor.totalVendorEarning.toLocaleString()}
                  </p>

                  <button
                    disabled={settlingVendor === vendor.vendorId}
                    onClick={() => setConfirmVendor(vendor)}
                    className="w-full bg-emerald-600 text-white py-3 rounded-2xl font-bold hover:bg-emerald-700 transition disabled:opacity-60"
                  >

                    {settlingVendor === vendor.vendorId
                      ? "Processing..."
                      : "Settle Now"}

                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

      {/* SUCCESS POPUP */}

      {popupMessage && (
        <div className="fixed top-6 right-6 bg-black text-white px-6 py-3 rounded-2xl shadow-lg">
          {popupMessage}
        </div>
      )}

      {/* CONFIRMATION MODAL */}

      {confirmVendor && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white p-8 rounded-3xl w-[360px] text-center shadow-xl">

            <h3 className="text-xl font-bold mb-3">
              Confirm Vendor Payment
            </h3>

            <p className="text-zinc-600 mb-6">

              Pay <span className="font-bold">
                {confirmVendor.brandName}
              </span>

              <br />

              ₹{confirmVendor.totalVendorEarning.toLocaleString()} ?

            </p>

            <div className="flex gap-4">

              <button
                onClick={() => setConfirmVendor(null)}
                className="flex-1 border border-zinc-300 py-2 rounded-xl font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  handlePayVendor(confirmVendor);
                  setConfirmVendor(null);
                }}
                className="flex-1 bg-emerald-600 text-white py-2 rounded-xl font-semibold hover:bg-emerald-700"
              >
                Confirm
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

/* ================= MODERN CARD ================= */

const ModernCard = ({ label, value, icon, color }) => {

  const colors = {
    emerald: "from-emerald-500 to-emerald-600",
    indigo: "from-indigo-500 to-indigo-600",
    orange: "from-orange-500 to-orange-600",
  };

  return (

    <div
      className={`bg-gradient-to-br ${colors[color]} text-white p-8 rounded-3xl shadow-lg`}
    >

      <div className="flex justify-between items-center mb-4">
        {icon}
      </div>

      <p className="text-sm opacity-80 mb-1">
        {label}
      </p>

      <h2 className="text-3xl font-black">
        ₹{value.toLocaleString()}
      </h2>

    </div>

  );

};

const Snapshot = ({ label, value }) => (

  <div>

    <p className="text-3xl font-black text-zinc-900">
      {value}
    </p>

    <p className="text-sm text-zinc-500 mt-1">
      {label}
    </p>

  </div>

);

export default Revenue;