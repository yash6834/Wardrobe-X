import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { 
  Users, Mail, Phone, Building2, Search, Filter, X, 
  ShieldCheck, Eye, Ban, CheckCircle, PauseCircle, Loader2, AlertTriangle
} from "lucide-react";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  
  // NEW: State for our custom confirmation pop-up
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/vendor/admin/vendors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setVendors(res.data.vendors);
    } catch (error) {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  // NEW: Triggers the pop-up instead of the browser alert
  const initiateAction = (vendorId, action) => {
    setConfirmAction({ vendorId, action });
  };

  // UPDATED: Actually executes the API call after confirmation
  const executeAction = async () => {
    if (!confirmAction) return;
    const { vendorId, action } = confirmAction;

    try {
      setConfirmAction(null); // Close modal immediately
      setActionLoading(vendorId); // Show loading spinner on the row

      await api.put(`/api/admin/vendor/${vendorId}/${action}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      toast.success(`Vendor ${action}d successfully`);
      fetchVendors();
    } catch (error) {
      toast.error("Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredVendors = vendors.filter(v => {
    const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          v.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeVendorsCount = vendors.filter(v => v.status === "active").length;

  // Helper function to dynamically style the confirmation modal
  const getActionStyles = (action) => {
    switch(action) {
      case 'suspend': return { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200', btn: 'bg-yellow-600 hover:bg-yellow-700', icon: <PauseCircle size={28} className="text-yellow-600" /> };
      case 'deactivate': return { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', btn: 'bg-red-600 hover:bg-red-700', icon: <Ban size={28} className="text-red-600" /> };
      case 'reactivate': return { color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200', btn: 'bg-green-600 hover:bg-green-700', icon: <CheckCircle size={28} className="text-green-600" /> };
      default: return { color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200', btn: 'bg-indigo-600', icon: <AlertTriangle size={28} className="text-indigo-600" /> };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8 font-sans">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                    <Users size={24} />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Vendor Directory</h2>
            </div>
            <p className="text-zinc-500 font-medium pl-14">Manage and monitor your marketplace partners.</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm border border-zinc-200">
            <div className="px-5 py-1 border-r border-zinc-100">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Vendors</p>
              <p className="text-2xl font-black text-zinc-800">{vendors.length}</p>
            </div>
            <div className="px-5 py-1">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Partners</p>
              <p className="text-2xl font-black text-indigo-600">{activeVendorsCount}</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-3 rounded-2xl shadow-sm border border-zinc-200">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or brand..."
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-full sm:w-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-zinc-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-9 pr-10 py-2.5 bg-zinc-50 border border-transparent rounded-xl text-sm font-semibold text-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all appearance-none"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="deactivated">Deactivated</option>
            </select>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/40 overflow-hidden">
          {loading ? (
            <div className="p-24 text-center">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
              <p className="text-zinc-500 font-bold tracking-tight animate-pulse">Syncing with database...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-zinc-200">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">No results found</h3>
              <p className="text-zinc-500 mt-1 text-sm">Try adjusting your search keywords or filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-100">
                    <th className="px-8 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Vendor Identity</th>
                    <th className="px-6 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Business Brand</th>
                    <th className="px-6 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Communication</th>
                    <th className="px-6 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[11px] font-black text-zinc-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredVendors.map((v) => (
                    <tr key={v._id} className="group hover:bg-indigo-50/30 transition-all duration-200">
                      
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                            {v.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{v.name}</p>
                            <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5 tracking-tighter">ID: {v._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-700 font-bold text-xs">
                          <Building2 size={14} className="text-zinc-400" />
                          {v.brandName || "Generic Vendor"}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-zinc-600 font-semibold">
                            <Mail size={13} className="text-indigo-400" />
                            {v.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 font-semibold">
                            <Phone size={13} className="text-indigo-400" />
                            {v.phone}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase font-black tracking-wider border
                          ${v.status === "active" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${v.status === "suspended" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${v.status === "deactivated" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        `}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 
                            ${v.status === "active" && "bg-green-500"}
                            ${v.status === "suspended" && "bg-yellow-500"}
                            ${v.status === "deactivated" && "bg-red-500"}
                          `}></span>
                          {v.status}
                        </span>
                      </td>

                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actionLoading === v._id ? (
                             <div className="p-2"><Loader2 size={18} className="animate-spin text-indigo-500" /></div>
                          ) : (
                            <>
                              <button
                                onClick={() => { setSelectedVendor(v); setShowModal(true); }}
                                title="View Profile"
                                className="p-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                              >
                                <Eye size={16} />
                              </button>

                              {v.status !== 'active' && (
                                <button
                                  onClick={() => initiateAction(v._id, "reactivate")}
                                  title="Activate Vendor"
                                  className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}

                              {v.status !== 'suspended' && (
                                <button
                                  onClick={() => initiateAction(v._id, "suspend")}
                                  title="Suspend Vendor"
                                  className="p-2 text-yellow-600 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
                                >
                                  <PauseCircle size={16} />
                                </button>
                              )}

                              {v.status !== 'deactivated' && (
                                <button
                                  onClick={() => initiateAction(v._id, "deactivate")}
                                  title="Deactivate Vendor"
                                  className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <Ban size={16} />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========================================= */}
        {/* 1. CONFIRMATION ACTION MODAL (NEW)        */}
        {/* ========================================= */}
        {confirmAction && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
              onClick={() => setConfirmAction(null)}
            ></div>

            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-200 p-6 text-center">
              
              <div className={`mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center ${getActionStyles(confirmAction.action).bg} border ${getActionStyles(confirmAction.action).border}`}>
                {getActionStyles(confirmAction.action).icon}
              </div>
              
              <h3 className="text-xl font-black text-zinc-900 tracking-tight mb-2 capitalize">
                {confirmAction.action === 'reactivate' ? 'Activate' : confirmAction.action} Vendor?
              </h3>
              
              <p className="text-sm text-zinc-500 font-medium mb-8">
                Are you sure you want to proceed? This will change the vendor's access rights and visibility in the marketplace.
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setConfirmAction(null)}
                  className="flex-1 px-4 py-3 bg-zinc-100 text-zinc-700 font-bold rounded-xl hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={executeAction}
                  className={`flex-1 px-4 py-3 text-white font-bold rounded-xl transition-colors ${getActionStyles(confirmAction.action).btn}`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================= */}
        {/* 2. VENDOR PROFILE MODAL                   */}
        {/* ========================================= */}
        {showModal && selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm transition-opacity"
                onClick={() => setShowModal(false)}
            ></div>

            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-indigo-600 p-8 text-white relative">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={18} />
                </button>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-white/20">
                    <ShieldCheck size={28} className="text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Vendor Details</h3>
                <p className="text-indigo-200 text-xs font-bold uppercase tracking-widest mt-1">Marketplace Partner</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Full Name</p>
                        <p className="font-bold text-zinc-900 text-sm">{selectedVendor.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Brand Name</p>
                        <p className="font-bold text-indigo-600 text-sm">{selectedVendor.brandName || "N/A"}</p>
                    </div>
                </div>

                <div className="h-px bg-zinc-100 w-full"></div>

                <div className="space-y-3">
                    <div className="flex items-center gap-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500"><Mail size={16}/></div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase">Email Address</p>
                            <p className="text-sm font-bold text-zinc-900">{selectedVendor.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500"><Phone size={16}/></div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase">Contact Number</p>
                            <p className="text-sm font-bold text-zinc-900">{selectedVendor.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase mb-1.5">System UUID</p>
                    <p className="text-[11px] font-mono text-zinc-500 break-all bg-zinc-100 p-2.5 rounded-lg border border-zinc-200">{selectedVendor._id}</p>
                </div>

                <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-zinc-900 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all shadow-md shadow-zinc-200"
                >
                    Close Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendor;