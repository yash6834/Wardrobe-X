import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { Users, Mail, Phone, Building2, Search, Filter, X, ExternalLink, ShieldCheck } from "lucide-react";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchVendors = async () => {
    try {
      const res = await api.get("/api/vendor/admin/vendors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });
      setVendors(res.data);
    } catch (error) {
      toast.error("Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProfile = (vendor) => {
    setSelectedVendor(vendor);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-lg text-white">
                    <Users size={24} />
                </div>
                <h2 className="text-3xl font-black text-zinc-900 tracking-tight">Vendor Directory</h2>
            </div>
            <p className="text-zinc-500 font-medium pl-11">Manage and monitor your marketplace partners.</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-zinc-100">
            <div className="px-6 py-2">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Partners</p>
              <p className="text-2xl font-black text-indigo-600">{vendors.length}</p>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-zinc-100">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by name or brand..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-zinc-900 text-white font-bold text-sm rounded-xl hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-200 transition-all active:scale-95">
            <Filter size={16} />
            Advanced Filters
          </button>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white rounded-3xl border border-zinc-200/60 shadow-xl shadow-zinc-200/40 overflow-hidden">
          {loading ? (
            <div className="p-24 text-center">
              <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-zinc-500 font-bold tracking-tight animate-pulse">Syncing with database...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-24 text-center">
              <div className="w-20 h-20 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-zinc-200">
                <Users size={40} />
              </div>
              <h3 className="text-xl font-bold text-zinc-900">No results found</h3>
              <p className="text-zinc-500 mt-1">Try adjusting your search keywords.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-100">
                    <th className="px-8 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Vendor Identity</th>
                    <th className="px-6 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Business Brand</th>
                    <th className="px-6 py-5 text-[11px] font-black text-zinc-500 uppercase tracking-widest">Communication</th>
                    <th className="px-8 py-5 text-right text-[11px] font-black text-zinc-500 uppercase tracking-widest">Management</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredVendors.map((v) => (
                    <tr key={v._id} className="group hover:bg-indigo-50/30 transition-all duration-200">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-110 transition-transform">
                            {v.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{v.name}</p>
                            <p className="text-[10px] text-zinc-400 font-bold font-mono mt-0.5 tracking-tighter">ID: {v._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-100 rounded-lg text-zinc-700 font-bold text-xs">
                          <Building2 size={14} className="text-zinc-500" />
                          {v.brandName || "Generic Vendor"}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs text-zinc-600 font-semibold">
                            <Mail size={14} className="text-indigo-400" />
                            {v.email}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-zinc-600 font-semibold">
                            <Phone size={14} className="text-indigo-400" />
                            {v.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button
                          onClick={() => handleViewProfile(v)}
                          className="inline-flex items-center gap-2 text-[11px] font-black text-white bg-indigo-600 px-5 py-2.5 rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all uppercase tracking-wider"
                        >
                          View Profile
                          <ExternalLink size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL SECTION */}
        {showModal && selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm transition-opacity"
                onClick={() => setShowModal(false)}
            ></div>

            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-zinc-100">
              {/* Modal Header */}
              <div className="bg-zinc-900 p-8 text-white relative">
                <button 
                    onClick={() => setShowModal(false)}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20">
                    <ShieldCheck size={32} className="text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Vendor Details</h3>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mt-1">Official Marketplace Partner</p>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Full Name</p>
                        <p className="font-bold text-zinc-900">{selectedVendor.name}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Brand Name</p>
                        <p className="font-bold text-indigo-600">{selectedVendor.brandName || "N/A"}</p>
                    </div>
                </div>

                <div className="h-px bg-zinc-100 w-full"></div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500"><Mail size={18}/></div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase">Email Address</p>
                            <p className="text-sm font-bold text-zinc-900">{selectedVendor.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 p-3 bg-zinc-50 rounded-2xl border border-zinc-100">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-500"><Phone size={18}/></div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase">Contact Number</p>
                            <p className="text-sm font-bold text-zinc-900">{selectedVendor.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-2">
                    <p className="text-[10px] font-black text-zinc-300 uppercase mb-1">System UUID</p>
                    <p className="text-[11px] font-mono text-zinc-400 break-all bg-zinc-50 p-2 rounded-lg">{selectedVendor._id}</p>
                </div>

                <button
                    onClick={() => setShowModal(false)}
                    className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200"
                >
                    Dismiss Profile
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