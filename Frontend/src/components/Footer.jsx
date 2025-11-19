import React from 'react';
import logo from '../assets/Images/logo.png';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 text-gray-700 mt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-10">

          {/* Left section - Logo + About */}
          <div className="sm:w-2/3">
            <img src={logo} className="w-44 h-16 object-contain mb-5" alt="Logo" />
            <p className="w-full md:w-2/3 text-gray-600">
              Discover the latest trends in fashion and shop your favorite styles
              with ease. Quality clothing, best prices, and fast delivery.
            </p>
          </div>

          {/* Middle section - Company Links */}
          <div className="sm:w-1/6">
            <p className="text-xl font-medium mb-5">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-600">
              <li>HOME</li>
              <li>ABOUT US</li>
              <li>DELIVERY</li>
            </ul>
          </div>

          {/* Right section - Get in Touch */}
          <div className="sm:w-1/3">
            <h3 className="text-lg font-semibold mb-3">GET IN TOUCH</h3>
            <ul className="flex flex-col gap-1 text-gray-600">
              <li>+91 8789655872</li>
              <li>wordobex2@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 border-t border-gray-300 pt-5">
          <p className="text-sm text-center text-gray-500">
            Copyright 2025 @ woredrobex.com - All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

