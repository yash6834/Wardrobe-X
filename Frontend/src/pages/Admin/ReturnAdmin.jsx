import { useEffect, useState } from "react";
import api from "../../api/api";
import {
  User,
  PackageCheck,
  Banknote,
  ShieldCheck,
  Hash,
  Truck,
  RotateCcw,
  ArrowRightLeft,
  Calendar,
  X,
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
    if (s?.includes("approved") || s === "exchange_completed" || s === "completed")
      return "bg-emerald-50 text-emerald-600 border-emerald-100 ring-emerald-500/10";
    if (s?.includes("pending") || s?.includes("scheduled") || s?.includes("out"))
      return "bg-indigo-50 text-indigo-600 border-indigo-100 ring-indigo-500/10";
    if (s?.includes("rejected") || s?.includes("failed"))
      return "bg-rose-50 text-rose-600 border-rose-100 ring-rose-500/10";
    return "bg-slate-50 text-slate-500 border-slate-200";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* TOP HEADER */}
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-[0.2em]">
              <ShieldCheck size={16} />
              Core Infrastructure
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Reverse Logistics <span className="text-indigo-600">.</span>
            </h1>
            <p className="text-slate-500 font-medium">Manage returns, exchanges, and financial disbursements.</p>
          </div>
          
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            
            <div>
              <p className="text-2xl font-black text-slate-900 leading-none">{returns.length}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Active Tickets</p>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT */}
        <div className="grid gap-6">
          {returns.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 p-6 rounded-full mb-4">
                <PackageCheck size={40} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Queue is empty</h3>
              <p className="text-slate-500 text-sm">All return requests have been processed.</p>
            </div>
          ) : (
            returns.map((r) => (
              <div
                key={r._id}
                className="group bg-white rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex flex-col xl:flex-row">
                  
                  {/* LEFT: TICKET INFO */}
                  <div className="p-6 xl:w-72 bg-slate-50/50 border-b xl:border-b-0 xl:border-r border-slate-100">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-600">
                        <User size={20} />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Requester</p>
                        <p className="font-bold text-slate-900 truncate">{r.userId?.name || "Guest User"}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Ticket ID</span>
                        <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          #{r._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Request Type</span>
                        <span className={`font-bold flex items-center gap-1 ${r.type === 'exchange' ? 'text-orange-600' : 'text-blue-600'}`}>
                          {r.type === 'exchange' ? <ArrowRightLeft size={12}/> : <RotateCcw size={12}/>}
                          {r.type.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* MIDDLE: STATUS GRID */}
                  <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-3 gap-8 items-center bg-white">
                    {[
                      { label: "Internal Flow", key: "status" },
                      { label: "Vendor Response", key: "vendorStatus" },
                      { label: "Admin Status", key: "adminStatus" }
                    ].map((item) => (
                      <div key={item.key} className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{item.label}</p>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-[11px] font-bold uppercase ring-2 ring-offset-1 ${getStatusBadge(r[item.key])}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current mr-2 animate-pulse" />
                          {r[item.key]?.replaceAll("_", " ")}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* RIGHT: ACTION HUB */}
                  <div className="p-6 xl:w-80 bg-slate-50/50 xl:border-l border-slate-100 flex flex-col justify-center gap-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Available Operations</p>
                    
                    {/* LOGISTICS ACTIONS */}
                    {r.status === "vendor_approved" && (
                      <button
                        onClick={() => action(`/api/returns/admin/${r._id}/pickup`, { pickupDate: new Date() })}
                        className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200"
                      >
                        <Calendar size={14} /> Schedule Pickup
                      </button>
                    )}

                    {r.status === "pickup_scheduled" && (
                      <button
                        onClick={() => action(`/api/returns/admin/${r._id}/picked-up`)}
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-xs font-bold transition-all"
                      >
                        <Truck size={14} /> Confirm Pick-Up
                      </button>
                    )}

                    {r.status === "picked_up" && (
                      <button
                        onClick={() => action(`/api/returns/admin/${r._id}/received`)}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-xs font-bold transition-all"
                      >
                        <PackageCheck size={14} /> Mark as Received
                      </button>
                    )}

                    {/* EXCHANGE SPECIFIC */}
                    {r.type === "exchange" && (
                      <div className="space-y-2">
                        {r.status === "received" && (
                          <button onClick={() => action(`/api/returns/admin/${r._id}/exchange-schedule`)} className="w-full bg-violet-600 text-white py-3 rounded-xl text-xs font-bold">Schedule Exchange</button>
                        )}
                        {r.status === "exchange_scheduled" && (
                          <button onClick={() => action(`/api/returns/admin/${r._id}/out-for-exchange`)} className="w-full bg-orange-600 text-white py-3 rounded-xl text-xs font-bold">Dispatch Replacement</button>
                        )}
                        {r.status === "out_for_exchange" && (
                          <button onClick={() => action(`/api/returns/admin/${r._id}/exchange-complete`)} className="w-full bg-emerald-600 text-white py-3 rounded-xl text-xs font-bold">Mark Delivered</button>
                        )}
                      </div>
                    )}

                    {/* REFUND SPECIFIC */}
                    {r.type === "return" && r.status === "received" && r.refundStatus === "not_started" && (
                      <button
                        onClick={() => { setSelectedReturn(r); setRefundAmount(""); setShowRefundModal(true); }}
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-amber-100"
                      >
                        <Banknote size={14} /> Disburse Refund
                      </button>
                    )}

                    {/* NO ACTIONS LABEL */}
                    {!["vendor_approved", "pickup_scheduled", "picked_up", "received", "exchange_scheduled", "out_for_exchange"].includes(r.status) && (
                      <div className="py-3 px-4 border border-dashed border-slate-300 rounded-xl text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase italic">Waiting for update</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* REFUND MODAL - GLASSMORPHISM */}
      {showRefundModal && selectedReturn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRefundModal(false)} />
          <div className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-white">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Financial Refund</h3>
                <button onClick={() => setShowRefundModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl mb-6 border border-slate-100">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Maximum Eligible</p>
                <p className="text-3xl font-black text-slate-900">₹{selectedReturn.orderId?.totalAmount?.toLocaleString()}</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 ml-1">Refund Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-4 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-bold text-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <button onClick={() => setShowRefundModal(false)} className="py-4 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const amount = Number(refundAmount);
                    if (!amount || amount <= 0) return toast.error("Enter valid amount");
                    if (amount > (selectedReturn.orderId?.totalAmount || 0)) return toast.error("Exceeds total paid");
                    
                    const success = await action(`/api/returns/admin/${selectedReturn._id}/refund`, { refundAmount: amount });
                    if (success) { setShowRefundModal(false); setSelectedReturn(null); }
                  }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-xl font-black transition-all shadow-lg shadow-indigo-200"
                >
                  Confirm Disburse
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReturnsAdmin;