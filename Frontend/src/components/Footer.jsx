import React from 'react';
import logo from '../assets/Images/logo.png';
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#0a0a0a] text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-b border-white/10 pb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-6">
            <img 
              src={logo} 
              className="w-48 h-auto invert brightness-200" 
              alt="Wardrobe X" 
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              The definitive destination for contemporary fashion. We blend 
              timeless aesthetics with modern functionality to redefine your 
              sartorial experience.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <FaFacebookF />, link: "#" },
                { icon: <FaInstagram />, link: "#" },
                { icon: <FaTwitter />, link: "#" },
                { icon: <FaLinkedinIn />, link: "#" }
              ].map((social, index) => (
                <a 
                  key={index}
                  href={social.link} 
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-white hover:text-black transition-all duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-white">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors duration-200">New Arrivals</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors duration-200">Our Story</Link></li>
              <li><Link to="/delivery" className="hover:text-white transition-colors duration-200">Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors duration-200">Support Center</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4">
            <h4 className="text-sm font-bold uppercase tracking-widest mb-8 text-white">
              The Studio
            </h4>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter mb-1 group-hover:text-white transition-colors">Support Email</p>
                <p className="text-sm text-gray-300">wordobex2@gmail.com</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter mb-1 group-hover:text-white transition-colors">Client Services</p>
                <p className="text-sm text-gray-300">+91 8789655872</p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-[10px] uppercase text-gray-500 font-bold tracking-tighter mb-1 group-hover:text-white transition-colors">Headquarters</p>
                <p className="text-sm text-gray-300">Wardrobe X HQ, Mumbai, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-[11px] tracking-wide uppercase">
            © {currentYear} Wardrobe X — All Rights Reserved.
          </p>
          
          <div className="flex gap-8">
            <a href="#" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-widest font-medium transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-widest font-medium transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-widest font-medium transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;