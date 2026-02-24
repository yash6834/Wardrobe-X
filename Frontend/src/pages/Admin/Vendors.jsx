import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { toast } from "react-toastify";
import { Users, Mail, Phone, Building2, Search, Filter } from "lucide-react";

const Vendor = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter logic for search
  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto p-6 space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight">Vendors</h2>
          <p className="text-zinc-500 font-medium mt-1">Manage and monitor your marketplace partners.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white border border-zinc-200 rounded-2xl px-4 py-6 shadow-sm flex items-center gap-4 min-w-[200px]">
             <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                <Users size={24} />
             </div>
             <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total Active</p>
                <p className="text-2xl font-black text-zinc-900">{vendors.length}</p>
             </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or brand..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-zinc-100 text-zinc-600 font-bold text-sm rounded-2xl hover:bg-zinc-200 transition-all">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-[2.5rem] border border-zinc-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-zinc-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-zinc-500 font-medium tracking-tight">Retrieving vendor directory...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="p-20 text-center">
            <div className="w-16 h-16 bg-zinc-50 text-zinc-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <p className="text-zinc-500 font-bold italic">No vendors found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-8 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Vendor Info</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Brand</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Contact Details</th>
                  <th className="px-8 py-5 text-right text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredVendors.map((v) => (
                  <tr key={v._id} className="group hover:bg-zinc-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-zinc-200">
                          {v.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-zinc-900">{v.name}</p>
                          <p className="text-[11px] text-zinc-400 font-medium">Vendor ID: {v._id.slice(-6).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-zinc-700 font-semibold text-sm">
                        <Building2 size={16} className="text-zinc-400" />
                        {v.brandName || <span className="text-zinc-300 font-normal italic">No Brand</span>}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                          <Mail size={14} className="text-zinc-300" />
                          {v.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                          <Phone size={14} className="text-zinc-300" />
                          {v.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-all uppercase tracking-tighter">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendor;