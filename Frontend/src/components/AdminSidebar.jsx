import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  Package,
  Clock,
  ShoppingBag,
  IndianRupee,
  Crown,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Layout,
  User,
  Settings,
  Bell,
  ExternalLink
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    window.dispatchEvent(new Event("storage"));
    navigate("/", { replace: true });
  };

  const menuGroups = [
    {
      label: "Overview",
      items: [
        { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
        { name: "Revenue", path: "/admin/revenue", icon: <IndianRupee size={18} /> },
      ]
    },
    {
      label: "Inventory",
      items: [
        { name: "Vendors", path: "/admin/vendor", icon: <Users size={18} /> },
        { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
        { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} /> },
      ]
    },
    {
      label: "Security & Plans",
      items: [
        { name: "Approvals", path: "/admin/pending", icon: <Clock size={18} /> },
        { name: "Memberships", path: "/admin/membership-plans", icon: <Crown size={18} /> },
        { name: "Fraud Logs", path: "/admin/froud", icon: <ShieldCheck size={18} /> },
      ]
    }
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </div>
          <span className="text-white font-bold tracking-tight">Admin</span>
        </div>

        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/profile")} className="text-slate-400">
            <User size={20} />
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:h-screen border-r border-slate-800/50`}
      >
        
        {/* --- PROFILE HEADER SECTION --- */}
        <div className="p-6">
          <div 
            onClick={() => navigate("/admin/profile")}
            className="group flex items-center gap-4 p-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-indigo-500/50 transition-all cursor-pointer"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <User size={24} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#0f172a] rounded-full"></div>
            </div>
            <div className="flex-1 overflow-hidden">
              <h2 className="text-sm font-bold text-white truncate group-hover:text-indigo-400 transition-colors">Admin User</h2>
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">Super Control</p>
            </div>
            <ExternalLink size={14} className="text-slate-600 group-hover:text-indigo-400" />
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
          {menuGroups.map((group) => (
            <div key={group.label}>
              <h3 className="px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-3">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/admin"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive 
                          ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20" 
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                      }`
                    }
                  >
                    <span className={location.pathname === item.path ? "text-indigo-400" : "text-slate-500"}>
                        {item.icon}
                    </span>
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* CMS DROPDOWN */}
          <div>
            <h3 className="px-4 text-[10px] font-extrabold text-slate-500 uppercase tracking-[0.2em] mb-3">Customization</h3>
            <button
              onClick={() => setCmsOpen(!cmsOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-slate-400 hover:bg-slate-800/50 rounded-xl transition-all"
            >
              <div className="flex items-center gap-3 font-semibold text-sm">
                <Layout size={18} className="text-slate-500" />
                CMS Manager
              </div>
              <ChevronDown size={14} className={`transition-transform ${cmsOpen ? "rotate-180" : ""}`} />
            </button>

            {cmsOpen && (
              <div className="mt-2 ml-4 pl-4 border-l-2 border-slate-800 space-y-4">
                <NavLink to="/admin/cms/banners" className="block text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                  • Home Banners
                </NavLink>
                
              </div>
            )}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-4 bg-slate-900/50 border-t border-slate-800/50">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-500 py-3 rounded-xl transition-all duration-200 border border-slate-700 hover:border-red-500/50"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold uppercase tracking-tight">Log Out</span>
          </button>
        </div>
      </aside>

      <div className="lg:hidden h-16" />
    </>
  );
};

export default AdminSidebar;