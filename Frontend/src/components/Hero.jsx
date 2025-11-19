import React from 'react';
import { assets } from '../assets/frontend_assets/assets';
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="flex flex-col sm:flex-row border-b border-gray-300 rounded-lg ">
      {/* Left side */}
      <div className="w-full sm:w-2/3 flex items-center justify-center py-10 sm:py-0 px-6">
        <div className="text-gray-800 space-y-6 max-w-xl">
          {/* Small heading */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-[2px] bg-gray-800"></span>
            <p className="font-medium text-sm md:text-base">OUR BESTSELLER</p>
          </div>

          {/* Main heading */}
          <h1 className="text-3xl lg:text-5xl font-extrabold leading-tight">
            Latest Arrivals
          </h1>

          {/* CTA */}
          <div className="flex items-center gap-4 mt-4">
            <Link
              to="/collection"
              className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
            >
              Shop Now
            </Link>
            <span className="w-10 h-[1px] bg-gray-800"></span>
          </div>
        </div>
      </div>

      {/* Right side */}
<div className="w-full sm:w-1/3 flex justify-start items-center p-0">
  <img
    className="w-80 sm:w-96 object-cover rounded-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500"
    src={assets.hero_img}
    alt="Hero"
  />
</div>




    </section>
  );
};

export default Hero;
