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
  User,
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
    { name: "Fraud Logs", path: "/admin/froud", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <>
      {/* --- MOBILE TOP BAR --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 z-50 flex items-center justify-between px-4">
        
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
            <ShieldCheck size={20} />
          </div>
          <span className="text-white font-bold">Admin</span>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/admin/profile")}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
          >
            <User size={18} />
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-400 hover:text-white"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 flex flex-col border-r border-slate-800
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:sticky lg:h-screen`}
      >

        {/* 🔥 TOP AREA WITH PROFILE ICON */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center justify-between">

            {/* LOGO */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-white font-bold">Admin</h1>
              </div>
            </div>

            {/* PROFILE ICON */}
            <button
              onClick={() => navigate("/admin/profile")}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition"
            >
              <User size={18} />
            </button>

          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 flex flex-col gap-1 px-4 mt-4 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-900 hover:text-white"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}

          {/* CMS */}
          <div className="mt-4">
            <button
              onClick={() => setCmsOpen(!cmsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-400 hover:bg-slate-900 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <Layout size={18} />
                CMS
              </div>
              <ChevronDown size={16} />
            </button>

            {cmsOpen && (
              <NavLink
                to="/admin/cms/banners"
                className="ml-8 text-sm text-slate-400 hover:text-indigo-400"
              >
                Banners
              </NavLink>
            )}
          </div>
        </nav>

        {/* FOOTER */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="lg:hidden h-16" />
    </>
  );
};

export default AdminSidebar;