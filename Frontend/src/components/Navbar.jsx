import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import logo from "../assets/Images/Men.png";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import { CurrencyContext } from "../context/Currency";

const Navbar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null); // Added ref for safer click-outside detection

  const { cartCount } = useContext(ShopContext);
  const { currency, setCurrency } = useContext(CurrencyContext);

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const [role, setRole] = useState(localStorage.getItem("userRole"));

  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= Sync Login State ================= */
  useEffect(() => {
    const updateLogin = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
      setRole(localStorage.getItem("userRole"));
    };

    // 'storage' only fires on cross-tab changes. 
    // 'authStateChanged' is a custom event to handle same-tab login/logout updates.
    window.addEventListener("storage", updateLogin);
    window.addEventListener("authStateChanged", updateLogin); 

    return () => {
      window.removeEventListener("storage", updateLogin);
      window.removeEventListener("authStateChanged", updateLogin);
    };
  }, []);

  /* ================= Close Dropdowns on Click Outside ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close profile dropdown
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      // Close mobile menu (excluding clicks on the hamburger button itself)
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= Logout ================= */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");

    setIsLoggedIn(false);
    setProfileOpen(false);
    setRole(null); // Clear the role state

    // Trigger custom event for other components on the same tab
    window.dispatchEvent(new Event("authStateChanged"));

    // Use React Router navigation instead of a full page reload
    navigate("/"); 
  };

  const menuItems = [
    { path: "/", label: t("home") },
    { path: "/collection", label: t("collection") },
    { path: "/about", label: t("about") },
    { path: "/contact", label: t("contact") },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Mobile Hamburger Icon */}
          <button
            ref={hamburgerRef}
            aria-label="Toggle Menu"
            className="md:hidden text-gray-700 hover:text-black transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="w-28 sm:w-40 hover:scale-105 transition-transform duration-300" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                className={({ isActive }) =>
                  `text-sm font-medium uppercase tracking-wide transition-all duration-300 ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                      : "text-gray-600 hover:text-black"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Tools */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Language */}
            <select
              value={i18n.language}
              onChange={(e) => {
                const lang = e.target.value;
                i18n.changeLanguage(lang);
                localStorage.setItem("language", lang);
              }}
              className="hidden sm:block bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer border-b border-transparent hover:border-gray-400 pb-1"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="gu">GU</option>
            </select>

            {/* Currency */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="hidden sm:block bg-transparent text-sm font-medium text-gray-600 outline-none cursor-pointer border-b border-transparent hover:border-gray-400 pb-1"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <img
                src={assets.profile_icon}
                alt="profile"
                className="w-5 hover:scale-110 transition-transform cursor-pointer opacity-80 hover:opacity-100"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {/* Profile Dropdown */}
              <div
                className={`absolute right-0 mt-4 w-56 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden transition-all duration-200 transform origin-top-right ${
                  profileOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                }`}
              >
                {!isLoggedIn ? (
                  <Link 
                    to="/login" 
                    onClick={() => setProfileOpen(false)}
                    className="block px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  >
                    {t("login_register")}
                  </Link>
                ) : (
                  <div className="py-2">
                    <Link 
                      to="/myprofile" 
                      onClick={() => setProfileOpen(false)}
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      {t("my_profile")}
                    </Link>
                    <Link 
                      to="/myorders" 
                      onClick={() => setProfileOpen(false)}
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                    >
                      {t("orders")}
                    </Link>

                    {role === "admin" && (
                      <Link 
                        to="/admin" 
                        onClick={() => setProfileOpen(false)}
                        className="block px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    {role === "seller" && (
                      <Link 
                        to="/seller" 
                        onClick={() => setProfileOpen(false)}
                        className="block px-5 py-2.5 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                      >
                        Vendor Dashboard
                      </Link>
                    )}

                    <hr className="my-1 border-gray-100" />
                    
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      {t("logout")}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Icon with Badge */}
            <Link to="/cart" className="relative group flex items-center">
              <svg className="w-6 h-6 text-gray-700 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold px-[5px] py-[1px] rounded-full shadow-sm group-hover:scale-110 transition-transform">
                  {cartCount}
                </span>
              )}
            </Link>

          </div>
        </div>
      </header>

      {/* Mobile Menu Slide-out Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile Menu Drawer */}
      <aside
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 w-64 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <img src={logo} alt="Logo" className="w-24" />
          <button aria-label="Close Menu" onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-black">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-4 p-6">
          {menuItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `text-base font-medium uppercase tracking-wide ${
                  isActive ? "text-blue-600" : "text-gray-700"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Settings (Language & Currency) */}
        <div className="mt-auto p-6 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Language</span>
            <select
              value={i18n.language}
              onChange={(e) => {
                const lang = e.target.value;
                i18n.changeLanguage(lang);
                localStorage.setItem("language", lang);
              }}
              className="bg-gray-50 border border-gray-200 text-sm rounded-md px-2 py-1 outline-none"
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="gu">GU</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Currency</span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-sm rounded-md px-2 py-1 outline-none"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navbar;