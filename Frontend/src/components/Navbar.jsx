import React, { useState, useEffect, useContext, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import logo from "../assets/Images/Men.png";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../context/ShopContext";
import { CurrencyContext } from "../context/Currency"; 

const Navbar = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const profileRef = useRef(null);

  const { cartCount } = useContext(ShopContext);
  const { currency, setCurrency } = useContext(CurrencyContext); 

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

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
    };

    window.addEventListener("storage", updateLogin);
    return () => window.removeEventListener("storage", updateLogin);
  }, []);

  /* ================= Close Profile on Outside Click ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ================= Logout ================= */
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");

    setIsLoggedIn(false);
    setProfileOpen(false);

    window.location.href = "/";
  };

  const menuItems = [
    { path: "/", label: t("home") },
    { path: "/collection", label: t("collection") },
    { path: "/about", label: t("about") },
    { path: "/contact", label: t("contact") },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-md py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="w-28 sm:w-48 object-contain"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                end
                className={({ isActive }) =>
                  `group relative text-xs tracking-[0.25em] uppercase font-medium transition duration-300 ${
                    isActive
                      ? "text-black"
                      : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {item.label}
                <span className="absolute left-0 -bottom-2 h-[1px] w-full bg-black scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
              </NavLink>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-6">

            {/* Language Switcher */}
            <select
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="text-xs border border-gray-300 px-2 py-1 rounded-md bg-white"
              defaultValue={i18n.language}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
              <option value="gu">GU</option>
            </select>

            {/* Currency Switcher */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs border border-gray-300 px-2 py-1 rounded-md bg-white"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>

            {/* Profile */}
            <div className="relative" ref={profileRef}>
              <img
                src={assets.profile_icon}
                alt="Profile"
                className="w-5 cursor-pointer opacity-70 hover:opacity-100 transition"
                onClick={() => setProfileOpen(!profileOpen)}
              />

              {profileOpen && (
                <div className="absolute right-0 mt-4 w-48 bg-white border shadow-xl rounded-md overflow-hidden">

                  {!isLoggedIn ? (
                    <Link
                      to="/login"
                      onClick={() => setProfileOpen(false)}
                      className="block px-5 py-3 text-xs uppercase tracking-widest hover:bg-gray-50"
                    >
                      {t("login_register")}
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/myprofile"
                        onClick={() => setProfileOpen(false)}
                        className="block px-5 py-3 text-xs uppercase tracking-widest hover:bg-gray-50"
                      >
                        {t("my_profile")}
                      </Link>

                      <Link
                        to="/myorders"
                        onClick={() => setProfileOpen(false)}
                        className="block px-5 py-3 text-xs uppercase tracking-widest hover:bg-gray-50"
                      >
                        {t("orders")}
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-5 py-3 text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 font-semibold"
                      >
                        {t("logout")}
                      </button>
                    </>
                  )}

                </div>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                alt="Cart"
                className="w-5 opacity-70 hover:opacity-100 transition"
              />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden flex flex-col gap-1.5"
            >
              <span className="w-6 h-[1.5px] bg-black"></span>
              <span className="w-4 h-[1.5px] bg-black self-end"></span>
            </button>

          </div>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-[300px] bg-white z-[60] shadow-2xl transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-8">

          <button
            onClick={() => setIsOpen(false)}
            className="mb-12 text-gray-400 flex items-center gap-2 uppercase tracking-widest text-xs"
          >
            <span className="text-xl">✕</span> {t("close")}
          </button>

          <nav className="flex flex-col gap-8">
            {menuItems.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-light text-gray-800 hover:pl-2 transition-all duration-300"
              >
                {item.label}
              </NavLink>
            ))}

            {!isLoggedIn && (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-2xl font-light text-yellow-600"
              >
                {t("login")}
              </Link>
            )}
          </nav>

        </div>
      </aside>

      {/* ================= OVERLAY ================= */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navbar;