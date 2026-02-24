import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  User,
  CheckCircle2,
  Truck,
  PackageCheck,
  Banknote,
  ShieldCheck,
  Hash,
} from "lucide-react";
import { toast } from "react-toastify";

const ReturnsAdmin = () => {
  const [returns, setReturns] = useState([]);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [refundAmount, setRefundAmount] = useState("");

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = async () => {
    try {
      const res = await api.get("/api/returns/admin");
      setReturns(res.data || []);
    } catch (err) {
      toast.error("Failed to load return requests");
    }
  };

  const action = async (url, body = {}) => {
    try {
      await api.put(url, body);
      toast.success("Status updated");
      fetchReturns();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();

    if (s?.includes("approved") || s === "exchange_completed")
      return "bg-emerald-50 text-emerald-700 border-emerald-200/50";

    if (
      s?.includes("pending") ||
      s === "picked_up" ||
      s === "pickup_scheduled" ||
      s === "exchange_scheduled" ||
      s === "out_for_exchange"
    )
      return "bg-amber-50 text-amber-700 border-amber-200/50";

    if (s?.includes("rejected"))
      return "bg-rose-50 text-rose-700 border-rose-200/50";

    return "bg-zinc-50 text-zinc-600 border-zinc-200";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-10 bg-[#FAFAFA] min-h-screen">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-zinc-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
            <ShieldCheck size={12} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Admin Control Panel
            </span>
          </div>
          <h2 className="text-5xl font-black text-zinc-900 tracking-tighter">
            Reverse Logistics
          </h2>
          <p className="text-zinc-500 font-medium text-lg">
            Return & Exchange Management
          </p>
        </div>

        <div className="bg-zinc-900 text-white p-4 rounded-3xl shadow-xl flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span className="text-xs font-black uppercase tracking-[0.2em]">
            Live Queue
          </span>
        </div>
      </div>

      {/* RETURNS LIST */}
      <div className="space-y-6">
        {returns.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-zinc-200">
            <PackageCheck size={32} className="mx-auto text-zinc-300 mb-4" />
            <p className="text-zinc-400 font-bold uppercase tracking-widest">
              No Active Return Tickets
            </p>
          </div>
        ) : (
          returns.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-[2.5rem] border border-zinc-200 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row">

                {/* CUSTOMER */}
                <div className="p-8 lg:w-[300px] bg-zinc-50 border-r">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase text-zinc-400">
                        Customer
                      </p>
                      <p className="font-bold text-lg">
                        {r.userId?.name || "Anonymous"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-zinc-400">
                    <Hash size={12} />
                    <span className="text-[10px] font-bold">
                      {r._id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* STATUS */}
                <div className="flex-1 p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-[10px] uppercase text-zinc-400 mb-2">
                      Ticket
                    </p>
                    <span
                      className={`px-4 py-2 rounded-xl border text-xs font-black uppercase ${getStatusBadge(
                        r.status
                      )}`}
                    >
                      {r.status.replaceAll("_", " ")}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-zinc-400 mb-2">
                      Vendor
                    </p>
                    <span
                      className={`px-4 py-2 rounded-xl border text-xs font-black uppercase ${getStatusBadge(
                        r.vendorStatus
                      )}`}
                    >
                      {r.vendorStatus}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-zinc-400 mb-2">
                      Admin
                    </p>
                    <span
                      className={`px-4 py-2 rounded-xl border text-xs font-black uppercase ${getStatusBadge(
                        r.adminStatus
                      )}`}
                    >
                      {r.adminStatus}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="p-8 lg:w-[260px] bg-zinc-50 border-l flex flex-col gap-3">

                  {/* ADMIN APPROVAL */}
                  {r.vendorStatus === "approved" &&
                    r.adminStatus === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            action(`/api/returns/admin/${r._id}`, {
                              action: "approved",
                            })
                          }
                          className="bg-emerald-600 text-white py-3 rounded-xl text-xs font-black uppercase"
                        >
                          <CheckCircle2 size={14} className="inline mr-2" />
                          Authorize
                        </button>

                        <button
                          onClick={() =>
                            action(`/api/returns/admin/${r._id}`, {
                              action: "rejected",
                            })
                          }
                          className="border border-rose-200 text-rose-600 py-3 rounded-xl text-xs font-black uppercase"
                        >
                          Reject
                        </button>
                      </>
                    )}

                  {/* RETURN FLOW */}
                  {r.type === "return" &&
                    r.status === "pickup_scheduled" && (
                      <button
                        onClick={() =>
                          action(`/api/returns/admin/${r._id}/picked-up`)
                        }
                        className="bg-zinc-900 text-white py-3 rounded-xl text-xs font-black uppercase"
                      >
                        <Truck size={14} className="inline mr-2" />
                        Mark Picked Up
                      </button>
                    )}

                  {r.type === "return" &&
                    r.status === "picked_up" && (
                      <button
                        onClick={() =>
                          action(`/api/returns/admin/${r._id}/received`)
                        }
                        className="bg-indigo-600 text-white py-3 rounded-xl text-xs font-black uppercase"
                      >
                        <PackageCheck size={14} className="inline mr-2" />
                        Confirm Receipt
                      </button>
                    )}

                  {r.type === "return" &&
                    r.status === "received" &&
                    r.refundStatus !== "completed" && (
                      <button
                        onClick={() => {
                          setSelectedReturn(r);
                          setRefundAmount("");
                          setShowRefundModal(true);
                        }}
                        className="bg-amber-500 text-white py-3 rounded-xl text-xs font-black uppercase"
                      >
                        <Banknote size={14} className="inline mr-2" />
                        Disburse Refund
                      </button>
                    )}

                  {/* EXCHANGE FLOW */}
                  {r.type === "exchange" &&
                    r.status === "exchange_scheduled" && (
                      <button
                        onClick={() =>
                          action(`/api/returns/admin/${r._id}/out-for-exchange`)
                        }
                        className="bg-orange-600 text-white py-3 rounded-xl text-xs font-black uppercase"
                      >
                        <Truck size={14} className="inline mr-2" />
                        Start Exchange
                      </button>
                    )}

                  {r.type === "exchange" &&
                    r.status === "out_for_exchange" && (
                      <button
                        onClick={() =>
                          action(`/api/returns/admin/${r._id}/exchange-complete`)
                        }
                        className="bg-emerald-600 text-white py-3 rounded-xl text-xs font-black uppercase"
                      >
                        <PackageCheck size={14} className="inline mr-2" />
                        Complete Exchange
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* REFUND MODAL */}
      {showRefundModal && selectedReturn && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-black mb-2">Disburse Refund</h3>

            <div className="mb-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                Total Paid
              </p>
              <div className="px-4 py-3 rounded-xl bg-zinc-50 border font-black">
                ₹{selectedReturn.orderId?.totalAmount?.toLocaleString()}
              </div>
            </div>

            <input
              type="number"
              value={refundAmount}
              max={selectedReturn.orderId?.totalAmount}
              onChange={(e) => setRefundAmount(e.target.value)}
              placeholder="Refund amount (₹)"
              className="w-full px-4 py-3 rounded-xl border mb-6"
            />

            <div className="flex gap-4">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 border py-3 rounded-xl font-bold"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await action(
                    `/api/returns/admin/${selectedReturn._id}/refund`,
                    { refundAmount }
                  );
                  setShowRefundModal(false);
                  setSelectedReturn(null);
                }}
                className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-black"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsAdmin;
