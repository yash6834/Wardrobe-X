import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { RefreshCw, ShieldAlert, User, Monitor, Globe, Calendar } from "lucide-react";

const FraudLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/fraud-logs");
      setLogs(res.data.logs || []);
    } catch (err) {
      console.error("Fraud logs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskStyle = (score) => {
    if (score >= 80) return "bg-rose-50 text-rose-600 border-rose-100";
    if (score >= 50) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-emerald-50 text-emerald-600 border-emerald-100";
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return "Critical";
    if (score >= 50) return "Elevated";
    return "Low Risk";
  };

  return (
    <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="text-rose-500" size={24} />
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Security Intelligence
              </h2>
            </div>
            <p className="text-slate-500 text-sm font-medium">
              Real-time monitoring of suspicious system activities.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            {loading ? "Syncing..." : "Refresh Logs"}
          </button>
        </div>

        {/* DATA TABLE CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">User Identity</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Violation</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Network (IP)</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">System Source</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Risk Assessment</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Timestamp</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan="6" className="px-6 py-6 bg-slate-50/20"></td>
                    </tr>
                  ))
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-20">
                      <div className="flex flex-col items-center opacity-40">
                        <ShieldAlert size={48} className="mb-2" />
                        <p className="font-bold text-slate-500">No security threats detected</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* USER */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:shadow-sm transition-all">
                            <User size={14} />
                          </div>
                          <span className="font-bold text-slate-700 text-sm">
                            {log.userId?.name || log.userName || "Guest Account"}
                          </span>
                        </div>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-rose-500 bg-rose-50/50 px-2.5 py-1 rounded-md border border-rose-100/50 capitalize">
                          {log.action?.replace(/-/g, ' ')}
                        </span>
                      </td>

                      {/* IP */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500">
                          <Globe size={13} className="opacity-50" />
                          <span className="text-xs font-mono font-medium">{log.ipAddress}</span>
                        </div>
                      </td>

                      {/* DEVICE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-500 max-w-[180px]">
                          <Monitor size={13} className="opacity-50 shrink-0" />
                          <span className="text-[11px] font-medium truncate italic" title={log.device}>
                            {log.device || "Unknown Hardware"}
                          </span>
                        </div>
                      </td>

                      {/* RISK SCORE */}
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-wider ${getRiskStyle(log.riskScore)}`}>
                          <span className={`w-1.5 h-1.5 rounded-full fill-current ${log.riskScore >= 80 ? "animate-pulse" : ""}`} style={{backgroundColor: 'currentColor'}} />
                          {getRiskLabel(log.riskScore)} ({log.riskScore || 0})
                        </div>
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-bold text-slate-700">
                            {new Date(log.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">
                            {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* FOOTER INFO */}
          <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-100 flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            <span>Security Feed Active</span>
            <span>Total Records: {logs.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FraudLogs;