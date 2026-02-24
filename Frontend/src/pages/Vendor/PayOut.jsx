import React, { useEffect, useState, useMemo } from "react";
import api from "../../api/api";
import { Wallet, TrendingUp, CalendarDays, CheckCircle2 } from "lucide-react";

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
      ? new Date(payouts[0].createdAt).toLocaleDateString()
      : "—";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-zinc-500 font-semibold text-sm">
            Loading payouts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= HEADER ================= */}
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
            Payout History
          </h1>
          <p className="text-zinc-500 mt-2">
            Track your earnings and completed settlements.
          </p>
        </div>

        {/* ================= SUMMARY CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SummaryCard
            label="Total Earned"
            value={`₹${totalEarned.toLocaleString()}`}
            icon={<Wallet size={20} />}
          />
          <SummaryCard
            label="Total Payouts"
            value={totalPayouts}
            icon={<TrendingUp size={20} />}
          />
          <SummaryCard
            label="Last Payout"
            value={lastPayoutDate}
            icon={<CalendarDays size={20} />}
          />
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-100 text-xs uppercase text-zinc-500">
                <tr>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Products Paid</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {payouts.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-16 text-center text-zinc-400"
                    >
                      <CheckCircle2
                        size={28}
                        className="mx-auto mb-3 text-zinc-300"
                      />
                      No payouts yet
                    </td>
                  </tr>
                ) : (
                  payouts.map((payout) => (
                    <tr
                      key={payout._id}
                      className="border-t border-zinc-100 hover:bg-zinc-50 transition"
                    >
                      {/* DATE */}
                      <td className="px-6 py-4">
                        {new Date(
                          payout.createdAt
                        ).toLocaleDateString()}
                      </td>

                      {/* AMOUNT */}
                      <td className="px-6 py-4 font-semibold text-zinc-900">
                        ₹{payout.amount.toLocaleString()}
                      </td>

                      {/* PRODUCTS */}
                      <td className="px-6 py-4 text-zinc-600">
                        {Array.isArray(payout.orders) &&
                        payout.orders.length > 0 ? (
                          <ul className="space-y-1">
                            {payout.orders.flatMap((order) =>
                              Array.isArray(order.items)
                                ? order.items.map((item) => (
                                    <li key={item._id}>
                                      {item.product?.name ||
                                        "Product"}{" "}
                                      × {item.quantity}
                                    </li>
                                  ))
                                : []
                            )}
                          </ul>
                        ) : (
                          <span className="text-zinc-400 italic">
                            Not available
                          </span>
                        )}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            payout.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {payout.status}
                        </span>
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

/* ================= SUMMARY CARD ================= */

const SummaryCard = ({ label, value, icon }) => {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-zinc-100 rounded-xl">
          {icon}
        </div>
      </div>
      <p className="text-xs uppercase text-zinc-400 font-semibold mb-1">
        {label}
      </p>
      <h2 className="text-2xl font-black text-zinc-900">
        {value}
      </h2>
    </div>
  );
};

export default VendorPayouts;
