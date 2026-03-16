import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import {
  RefreshCcw,
  Check,
  ChevronRight,
  Activity,
  ArrowRight,
  Wallet,
  TrendingUp,
  PieChart,
  ShieldCheck
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

  const vendors = useMemo(() => {
    const vendorMap = {};
    orders.forEach((order) => {
      const isPayable =
        order.orderStatus === "delivered" &&
        order.settlementStatus === "pending";
      if (!isPayable) return;
      const vendorId =
        typeof order.vendor === "object" ? order.vendor._id : order.vendor;
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

  const handlePayVendor = async (vendor) => {
    try {
      setSettlingVendor(vendor.vendorId);
      const orderRes = await api.post("/api/payment/create-order", {
        amount: vendor.totalVendorEarning,
      });
      const order = orderRes.data;
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: "Wardrobe X",
        description: `Vendor payout - ${vendor.brandName}`,
        handler: async function () {
          await api.post(`/api/admin/payout/${vendor.vendorId}`);
          setPopupMessage("Payout successful");
          fetchRevenue();
        },
        theme: { color: "#2563EB" }, // Updated to match the new blue UI theme
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setPopupMessage("Payment failed");
    } finally {
      setSettlingVendor(null);
    }
    setTimeout(() => setPopupMessage(""), 3000);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Financial Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage platform revenue, margins, and vendor payouts.
            </p>
          </div>
          <button
            onClick={fetchRevenue}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
          >
            <RefreshCcw
              size={16}
              className="text-slate-500 group-hover:rotate-180 transition-transform duration-500"
            />
            Sync Ledger
          </button>
        </header>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Processed"
            value={totalRevenue}
            icon={<TrendingUp size={24} className="text-blue-600" />}
            bgClass="bg-blue-50"
          />
          <MetricCard
            title="Platform Margin"
            value={totalCommission}
            icon={<PieChart size={24} className="text-emerald-600" />}
            bgClass="bg-emerald-50"
            highlight
          />
          <MetricCard
            title="Vendor Liability"
            value={vendorEarnings}
            icon={<Wallet size={24} className="text-amber-600" />}
            bgClass="bg-amber-50"
          />
        </div>

        {/* CONTENT SPLIT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: ACTIVITY SNAPSHOT */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" />
                Activity Snapshot
              </h3>
              <div className="space-y-4">
                <SnapshotItem
                  label="Total Global Orders"
                  value={orders.length}
                />
                <SnapshotItem
                  label="Successfully Finalized"
                  value={orders.filter((o) => o.orderStatus === "delivered").length}
                />
                <SnapshotItem
                  label="Currently In Progress"
                  value={orders.filter((o) => o.orderStatus === "pending").length}
                />
              </div>
            </div>

            <div className="flex items-start gap-3 p-5 bg-slate-100 rounded-2xl border border-slate-200 text-sm text-slate-600">
              <ShieldCheck size={20} className="text-slate-500 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                All platform transfers are secured via SSL encryption and
                authenticated through the Razorpay API.
              </p>
            </div>
          </div>

          {/* RIGHT: VENDOR PAYOUT LIST */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-base font-semibold text-slate-900">
                  Pending Settlements
                </h3>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                  {vendors.length} Awaiting
                </span>
              </div>

              <div className="p-6">
                {vendors.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                      <Check size={32} className="text-emerald-500" />
                    </div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">
                      Treasury is Balanced
                    </h4>
                    <p className="text-slate-500 text-sm max-w-sm">
                      All vendor partner payouts have been successfully
                      processed. There are no pending settlements.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {vendors.map((vendor) => (
                      <div
                        key={vendor.vendorId}
                        className="group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                            {vendor.brandName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900">
                              {vendor.brandName}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Approved for payout
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end gap-6">
                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-0.5">Amount</p>
                            <span className="text-lg font-bold text-slate-900">
                              ₹{vendor.totalVendorEarning.toLocaleString()}
                            </span>
                          </div>
                          <button
                            disabled={settlingVendor === vendor.vendorId}
                            onClick={() => setConfirmVendor(vendor)}
                            className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            title="Process Payout"
                          >
                            {settlingVendor === vendor.vendorId ? (
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                              <ChevronRight size={20} />
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      {popupMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-fade-in-up">
          <Check size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{popupMessage}</span>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmVendor && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Confirm Transfer
            </h3>
            <p className="text-slate-600 text-sm mb-8 leading-relaxed">
              You are about to release{" "}
              <span className="font-bold text-slate-900">
                ₹{confirmVendor.totalVendorEarning.toLocaleString()}
              </span>{" "}
              to the vendor account associated with{" "}
              <span className="font-bold text-slate-900">
                {confirmVendor.brandName}
              </span>
              .
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmVendor(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handlePayVendor(confirmVendor);
                  setConfirmVendor(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                Approve <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* --- SUBCOMPONENTS --- */

const MetricCard = ({ title, value, icon, bgClass, highlight }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${bgClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h2 className={`text-2xl font-bold ${highlight ? "text-emerald-600" : "text-slate-900"}`}>
        ₹{value.toLocaleString()}
      </h2>
    </div>
  </div>
);

const SnapshotItem = ({ label, value }) => (
  <div className="flex justify-between items-center pb-4 border-b border-slate-100 last:border-0 last:pb-0">
    <p className="text-sm text-slate-600">{label}</p>
    <p className="text-base font-bold text-slate-900">{value}</p>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
    <div className="w-10 h-10 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
    <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
      Loading Dashboard
    </p>
  </div>
);

export default Revenue;