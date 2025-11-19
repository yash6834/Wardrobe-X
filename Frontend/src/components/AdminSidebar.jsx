import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, PackagePlus, Eye, ShoppingBag } from "lucide-react";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.setItem("isLoggedIn", "false");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: <PackagePlus size={18} /> },
    { name: "Add Product", path: "/admin/add-product", icon: <PackagePlus size={18} /> },
    { name: "View Products", path: "/admin/view-products", icon: <Eye size={18} /> },
    { name: "Customer Orders", path: "/admin/view-orders", icon: <ShoppingBag size={18} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-200 flex flex-col shadow-xl sticky top-0 border-r border-gray-700">
      {/* Header */}
      <div className="p-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-center text-white tracking-wide">
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-6 flex flex-col gap-1 px-3">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "hover:bg-gray-700 hover:text-white text-gray-300"
              }`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-2 rounded-lg transition-all duration-200"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
