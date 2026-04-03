import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050505] text-[#e5e5e5] pt-16 pb-8 selection:bg-white selection:text-black">
      <div className="max-w-[1200px] mx-auto px-8 md:px-16">

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* Brand & Manifesto Section */}
          <div className="lg:col-span-6 space-y-8">
            <Link to="/">
              <h2 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-white hover:opacity-80 transition-opacity">
                Wardrobe X
              </h2>
            </Link>
            <p className="max-w-md text-lg text-gray-400 font-light leading-relaxed">
              Crafting a narrative of modern elegance. We believe in the power of
              intentional design and the beauty of the understated.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">

            {/* Shop Links */}
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Shop</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/collection" className="hover:text-white transition-colors">All Collections</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Support</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/my-returns" className="hover:text-white transition-colors">Returns</Link></li>
                <li><Link to="/myorders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Social</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:italic hover:translate-x-1 inline-block transition-all">Instagram</a></li>
                <li><a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:italic hover:translate-x-1 inline-block transition-all">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[10px] tracking-widest text-gray-500 uppercase">
            {/* Replace # with actual routes if you have Policy pages */}
            <Link to="/privacy&policy" className="hover:text-white transition-colors">Privacy Policy</Link>            
            <Link to="/terms&conditions" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-gray-500 text-[10px] tracking-widest uppercase">
            © {currentYear} Wardrobe X — Valsad, IN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;