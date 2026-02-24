import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Wallet,
  BarChart3,
  Menu,
  LogOut,
  X,
  Undo2,
  Shield
} from "lucide-react";
import api from "../api/api";

const VendorSidebar = () => {
  const [open, setOpen] = useState(false);
  const [brandName, setBrandName] = useState("Loading...");
  const navigate = useNavigate();

  /* ================= FETCH BRAND ================= */
  useEffect(() => {
    const fetchVendorProfile = async () => {
      try {
        const res = await api.get("/api/vendor/profile");
        setBrandName(res.data.brandName || "My Store");
      } catch (err) {
        console.error("Vendor fetch failed:", err);
        setBrandName("My Store");
      }
    };

    fetchVendorProfile();
  }, []);

  const links = [
    { name: "Dashboard", path: "/seller", icon: <LayoutDashboard size={18} /> },
    { name: "Products", path: "/seller/products", icon: <Package size={18} /> },
    { name: "Orders", path: "/seller/orders", icon: <ShoppingBag size={18} /> },
    { name: "Returns", path: "/seller/returns", icon: <Undo2 size={18} /> },
    { name: "Payouts", path: "/seller/payouts", icon: <Wallet size={18} /> },
    { name: "Analytics", path: "/seller/analytics", icon: <BarChart3 size={18} /> },
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between 
      bg-[#0f172a] text-white px-4 py-3 shadow-lg">
        <h2 className="font-semibold truncate">{brandName}</h2>
        <button onClick={() => setOpen(true)}>
          <Menu size={22} />
        </button>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-72
        bg-gradient-to-b from-[#0f172a] via-[#0b1220] to-[#050b18]
        text-gray-400 shadow-2xl
        transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 flex flex-col`}
      >
        {/* HEADER */}
        <div className="px-6 py-8 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white truncate">
                {brandName}
              </h1>
              <p className="text-xs text-gray-500">
                Vendor Control Panel
              </p>
            </div>
          </div>
        </div>

        {/* MENU LABEL */}
        <p className="px-6 mt-6 mb-3 text-xs uppercase tracking-widest text-gray-500">
          Main Menu
        </p>

        {/* NAVIGATION */}
        <nav className="space-y-1 px-3 flex-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-white/5 text-white before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-indigo-500 before:rounded-r-full"
                    : "hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {link.icon}
              <span className="text-sm font-medium">
                {link.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* PROFILE CARD */}
        <div className="p-5">
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                {brandName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {brandName}
                </p>
                <p className="text-xs text-gray-500">
                  Vendor Account
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-sm transition text-white flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default VendorSidebar;
