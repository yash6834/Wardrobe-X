import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  User,
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
      const res = await api.put(url, body);
      toast.success(res.data?.message || "Status updated");
      fetchReturns();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
      return false;
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
                  {["status", "vendorStatus", "adminStatus"].map((key) => (
                    <div key={key}>
                      <p className="text-[10px] uppercase text-zinc-400 mb-2">
                        {key.replace("Status", "")}
                      </p>
                      <span
                        className={`px-4 py-2 rounded-xl border text-xs font-black uppercase ${getStatusBadge(
                          r[key]
                        )}`}
                      >
                        {r[key]?.replaceAll("_", " ")}
                      </span>
                    </div>
                  ))}
                </div>

                {/* ACTIONS */}
                {/* ACTIONS */}
<div className="p-8 lg:w-[260px] bg-zinc-50 border-l flex flex-col gap-3">

  {/* Schedule Pickup */}
  {r.status === "vendor_approved" && (
    <button
      onClick={() =>
        action(`/api/returns/admin/${r._id}/pickup`, {
          pickupDate: new Date(),
        })
      }
      className="bg-indigo-600 text-white py-3 rounded-xl text-xs font-black uppercase"
    >
      Schedule Pickup
    </button>
  )}

  {/* Mark Picked Up */}
  {r.status === "pickup_scheduled" && (
    <button
      onClick={() =>
        action(`/api/returns/admin/${r._id}/picked-up`)
      }
      className="bg-blue-600 text-white py-3 rounded-xl text-xs font-black uppercase"
    >
      Mark Picked Up
    </button>
  )}

  {/* Mark Received */}
  {r.status === "picked_up" && (
    <button
      onClick={() =>
        action(`/api/returns/admin/${r._id}/received`)
      }
      className="bg-purple-600 text-white py-3 rounded-xl text-xs font-black uppercase"
    >
      Mark Received
    </button>
  )}

  {/* Refund */}
  {r.type === "return" &&
    r.status === "received" &&
    r.refundStatus === "not_started" && (
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
            <h3 className="text-2xl font-black mb-4">Disburse Refund</h3>

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
                  const amount = Number(refundAmount);

                  if (!amount || amount <= 0) {
                    toast.error("Enter valid refund amount");
                    return;
                  }

                  if (
                    amount >
                    (selectedReturn.orderId?.totalAmount || 0)
                  ) {
                    toast.error("Refund exceeds paid amount");
                    return;
                  }

                  const success = await action(
                    `/api/returns/admin/${selectedReturn._id}/refund`,
                    { refundAmount: amount }
                  );

                  if (success) {
                    setShowRefundModal(false);
                    setSelectedReturn(null);
                  }
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