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
  Image,
  Layout,
  ExternalLink
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false);

  // Close sidebar automatically when route changes on mobile
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("token");
    localStorage.setItem("isLoggedIn", "false");
    window.dispatchEvent(new Event("storage"));
    navigate("/", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
    { name: "Vendors", path: "/admin/vendor", icon: <Users size={18} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
    { name: "Approvals", path: "/admin/pending", icon: <Clock size={18} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} /> },
    { name: "Revenue", path: "/admin/revenue", icon: <IndianRupee size={18} /> },
    { name: "Memberships", path: "/admin/membership-plans", icon: <Crown size={18} /> },
    { name: "Fraud Logs", path: "/admin/froud", icon: <ShieldCheck size={18} /> }
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-white font-bold tracking-tight">Admin Console</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-400 hover:text-white transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 flex flex-col border-r border-slate-800 shadow-2xl
        transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      `}
      >
        {/* LOGO AREA */}
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-white font-black text-xl tracking-tight leading-none">
                PANEL<span className="text-indigo-500">.</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1.5">
                Management v2.0
              </p>
            </div>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 flex flex-col gap-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="px-4 mb-4 mt-2">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Main Navigation
            </span>
          </div>

          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) => `
                group flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                }
              `}
            >
              <span className="transition-transform group-hover:scale-110">
                {item.icon}
              </span>
              {item.name}
            </NavLink>
          ))}

          {/* CMS DROPDOWN */}
          <div className="mt-4">
            <button
              onClick={() => setCmsOpen(!cmsOpen)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all
                ${cmsOpen ? "text-slate-100 bg-slate-900/50" : "text-slate-400 hover:bg-slate-900"}
              `}
            >
              <div className="flex items-center gap-3.5">
                <Layout size={18} />
                <span>CMS Management</span>
              </div>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${cmsOpen ? "rotate-180 text-indigo-400" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                cmsOpen ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
              }`}
            >
              <NavLink
                to="/admin/cms/banners"
                className="flex items-center gap-3 ml-9 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/5 transition-all"
              >
                <Image size={14} /> Banners
              </NavLink>
            </div>
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-4 mt-auto">
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-4 border border-slate-800/50">
            <div className="flex items-center gap-3 mb-4 px-1">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                AD
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold">Main Admin</span>
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-tighter italic">
                  ● Verified Session
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full group flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-bold py-3 rounded-xl transition-all duration-300"
            >
              <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out Securely
            </button>
          </div>
        </div>
      </aside>

      {/* Spacing for mobile content so it doesn't hide under the header */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default AdminSidebar;