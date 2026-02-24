import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  FileText,
  Layout
} from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [cmsOpen, setCmsOpen] = useState(false); // CMS dropdown state

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.setItem("isLoggedIn", "false");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Vendors", path: "/admin/vendor", icon: <Users size={20} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={20} /> },
    { name: "Pending Approvals", path: "/admin/pending", icon: <Clock size={20} /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
    { name: "Revenue", path: "/admin/revenue", icon: <IndianRupee size={20} /> },
    { name: "Membership Plans", path: "/admin/membership-plans", icon: <Crown size={20} /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* === MOBILE TRIGGER BUTTON === */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-950 text-white rounded-lg border border-slate-800 shadow-xl"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 text-slate-400 flex flex-col border-r border-slate-800 
        transition-transform duration-300 ease-in-out font-sans
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen
      `}>

        {/* === HEADER === */}
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide">
              Admin Panel
            </h1>
            <p className="text-xs text-slate-500 font-medium">Master Control</p>
          </div>
        </div>

        {/* === NAVIGATION === */}
        <nav className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 mt-2">
            Main Menu
          </p>

          {/* Existing Menu Items */}
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400 shadow-sm"
                    : "hover:bg-slate-900 hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 bg-indigo-500 rounded-r-full" />
                  )}
                  <span className={`transition-colors ${isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm tracking-wide">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* ===== CMS DROPDOWN ===== */}
          <div>
            <button
              onClick={() => setCmsOpen(!cmsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-900 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <Layout size={20} className="text-slate-500" />
                <span className="text-sm tracking-wide">CMS</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${cmsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {cmsOpen && (
              <div className="ml-8 mt-1 flex flex-col gap-1">
                <NavLink
                  to="/admin/cms/banners"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-900 text-sm"
                >
                  <Image size={16} /> Banners
                </NavLink>

                
              </div>
            )}
          </div>

        </nav>

        {/* === FOOTER === */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-900 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              
              
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 text-slate-300 text-sm font-medium py-2.5 rounded-xl transition-all group"
            >
              <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
