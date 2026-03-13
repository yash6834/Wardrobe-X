import React from 'react';
import { FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050505] text-[#e5e5e5] pt-10 pb-8 selection:bg-white selection:text-black">
      <div className="max-w-[] mx-auto px-8 md:px-16">
        
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Brand & Manifesto Section */}
          <div className="lg:col-span-6 space-y-10">
            <h2 className="text-4xl md:text-5xl font-serif italic tracking-tighter text-white">
              Wardrobe X
            </h2>
            <p className="max-w-md text-lg text-gray-400 font-light leading-relaxed">
              Crafting a narrative of modern elegance. We believe in the power of 
              intentional design and the beauty of the understated.
            </p>
            
            
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Collections</h4>
              <ul className="space-y-3 text-sm font-light">
                {['New Arrivals', 'Essentials', 'Archive'].map(item => (
                  <li key={item}><Link to="#" className="hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">The Studio</h4>
              <ul className="space-y-3 text-sm font-light">
                {['Our Story', 'Sustainability', 'Journal'].map(item => (
                  <li key={item}><Link to="#" className="hover:text-white transition-colors">{item}</Link></li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-bold">Social</h4>
              <ul className="space-y-3 text-sm font-light">
                <li><a href="#" className="hover:italic hover:translate-x-1 inline-block transition-all">Instagram</a></li>
                <li><a href="#" className="hover:italic hover:translate-x-1 inline-block transition-all">Twitter</a></li>
                <li><a href="#" className="hover:italic hover:translate-x-1 inline-block transition-all">LinkedIn</a></li>
              </ul>
            </div>
          </div>
        </div>

       

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[10px] tracking-widest text-gray-600 uppercase">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          <p className="text-gray-600 text-[10px] tracking-widest uppercase">
            © {currentYear} — Mumbai, IN
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;