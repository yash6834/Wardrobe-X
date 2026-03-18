import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import { Wallet, TrendingUp, CalendarDays, CheckCircle2, Receipt, Clock, Package } from "lucide-react";

const VendorPayouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayouts();
  }, []);

  const fetchPayouts = async () => {
    try {
      const res = await api.get("/api/vendor/payouts");
      if (res.data.success) {
        setPayouts(res.data.payouts || []);
      }
    } catch (err) {
      console.error("Payout fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SUMMARY CALCULATIONS ================= */

  const totalEarned = useMemo(() => {
    return payouts.reduce((sum, payout) => sum + (payout.amount || 0), 0);
  }, [payouts]);

  const totalPayouts = payouts.length;

  const lastPayoutDate =
    payouts.length > 0
      ? new Date(payouts[0].createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })
      : "—";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-500 font-semibold text-sm animate-pulse">
            Fetching your payouts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Payout History
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Track your earnings, settlements, and payment statuses.
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            label="Total Earned"
            value={`₹${totalEarned.toLocaleString()}`}
            icon={<Wallet size={24} className="text-emerald-600" />}
            bgColor="bg-emerald-100"
          />
          <SummaryCard
            label="Total Payouts"
            value={totalPayouts}
            icon={<TrendingUp size={24} className="text-indigo-600" />}
            bgColor="bg-indigo-100"
          />
          <SummaryCard
            label="Last Payout"
            value={lastPayoutDate}
            icon={<CalendarDays size={24} className="text-violet-600" />}
            bgColor="bg-violet-100"
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-5">Date</th>
                  <th className="px-6 py-5">Amount</th>
                  <th className="px-6 py-5">Products Paid</th>
                  <th className="px-6 py-5">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-400">
                        <div className="bg-slate-50 p-4 rounded-full mb-4">
                          <Receipt size={40} className="text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-600 mb-1">No payouts yet</p>
                        <p className="text-sm">When you receive settlements, they will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr
                      key={payout._id}
                      className="hover:bg-slate-50/80 transition-colors duration-200 group"
                    >
                      {/* DATE */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5 text-slate-600 font-medium">
                          <CalendarDays size={16} className="text-slate-400" />
                          {new Date(payout.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                          ₹{payout.amount.toLocaleString()}
                        </span>
                      </td>

                      {/* PRODUCTS */}
                      <td className="px-6 py-4">
                        {Array.isArray(payout.orders) && payout.orders.length > 0 ? (
                          <div className="space-y-1.5 max-w-xs">
                            {payout.orders.flatMap((order) =>
                              Array.isArray(order.items)
                                ? order.items.map((item) => (
                                    <div key={item._id} className="flex items-start gap-2 text-sm bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                                      <Package size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                      <span className="text-slate-700 font-medium truncate">
                                        {item.product?.name || "Product"}
                                      </span>
                                      <span className="text-slate-400 ml-auto font-semibold">
                                        ×{item.quantity}
                                      </span>
                                    </div>
                                  ))
                                : []
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic font-medium px-2">
                            Not available
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full border ${
                          payout.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {payout.status === "completed" ? (
                            <CheckCircle2 size={14} />
                          ) : (
                            <Clock size={14} />
                          )}
                          <span className="capitalize">{payout.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ================= SUMMARY CARD COMPONENT ================= */

const SummaryCard = ({ label, value, icon, bgColor }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
      {/* Decorative background circle */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 transition-transform group-hover:scale-150 duration-500 ${bgColor}`}></div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${bgColor}`}>
            {icon}
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
            {label}
          </p>
          <h2 className="text-3xl font-black text-slate-900">
            {value}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default VendorPayouts;