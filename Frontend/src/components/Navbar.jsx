import React, { useState, useEffect, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { cartCount } = useContext(ShopContext); // reactive cart count

  // Login state
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false); // update state immediately
    navigate("/"); // redirect to home
  };

  // Update login state if localStorage changes (cross-tab)
  useEffect(() => {
    const updateLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };
    window.addEventListener("storage", updateLogin);
    return () => window.removeEventListener("storage", updateLogin);
  }, []);

  // Menu items
  const menuItems = [
    { path: "/", label: "Home" },
    { path: "/collection", label: "Collection" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
    !isLoggedIn && { path: "/login", label: "Log In" },
  ].filter(Boolean);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-5 sm:px-10 py-5 flex items-center justify-between z-50">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Logo" className="w-44" />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex gap-6 text-lg text-gray-700 font-semibold">
        {menuItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end
            className={({ isActive }) =>
              `group flex flex-col items-center gap-1 transition-colors duration-300 ${
                isActive
                  ? "text-yellow-600 font-bold"
                  : "text-gray-700 hover:text-yellow-600"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}

        {/* Logout button */}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-yellow-600"
          >
            Log Out
          </button>
        )}
      </ul>

      {/* Right section: Cart and Profile */}
<div className="flex items-center gap-6">
  {/* Profile Dropdown - only if logged in */}
  {isLoggedIn && (
    <div className="group relative">
      <img
        src={assets.profile_icon}
        alt="Profile"
        className="w-5 cursor-pointer"
      />
      <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-3">
        <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
          <Link to="/myprofile">
            <p className="cursor-pointer hover:text-black">My Profile</p>
          </Link>
          <Link to="/myorders">
            <p className="cursor-pointer hover:text-black">Orders</p>
          </Link>
        </div>
      </div>
    </div>
  )}

  {/* Cart */}
  <Link to="/cart" className="relative">
    <img src={assets.cart_icon} alt="Cart" className="w-5" />
    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
        {cartCount}
      </span>
    )}
  </Link>
</div>


      {/* Mobile menu button */}
      <div className="sm:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="relative w-8 h-8 flex items-center justify-center group"
          aria-label="Open menu"
        >
          <span className="absolute top-2 w-6 h-[1px] bg-black transition-all duration-300 group-hover:top-1/2 group-hover:rotate-90" />
          <span className="absolute bottom-2 w-6 h-[1px] bg-black transition-all duration-300 group-hover:bottom-1/2" />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out sm:hidden z-50`}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>
        <ul className="flex flex-col items-start gap-6 p-6 mt-2 font-semibold">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              end
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive
                    ? "text-yellow-600 font-bold"
                    : "text-gray-700 hover:text-yellow-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="text-lg text-gray-700 hover:text-yellow-600"
            >
              Log Out
            </button>
          )}
        </ul>
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
