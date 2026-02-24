import React from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';
import PolicySection from '../../components/Policy';

const About = () => {
  return (
    <main className="bg-white min-h-screen selection:bg-black selection:text-white">
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          
          {/* Left Content */}
          <div className="md:w-3/5 z-10 order-2 md:order-1">
            <h1 className="text-4xl lg:text-5xl font-black text-black tracking-tighter leading-[0.8] mb-8">
              ABOUT <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-200">
                WARDROBE X
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-800 font-medium max-w-xl leading-tight mb-10">
              We aren't just selling clothes. We are curating the armor you wear to face the modern world. 
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/collection" className="bg-black text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white hover:text-black border border-black transition-all duration-500 shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                Shop the drop
              </Link>
            </div>
          </div>

          {/* Right Image - Overlapping Aesthetic */}
          <div className="md:w-2/5 relative order-1 md:order-2">
            <div className="relative z-10 p-4 bg-white border border-gray-100 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700">
              <img
                className="w-full grayscale hover:grayscale-0 transition-all duration-700"
                src={assets.about_img}
                alt="Brand Identity"
              />
            </div>
            {/* Abstract Background Shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gray-100 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES - BRUTALIST GRID --- */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border border-white/20">
            
            <div className="p-12 border-b md:border-b-0 md:border-r border-white/20 group hover:bg-white hover:text-black transition-colors duration-500">
              <p className="text-4xl font-black mb-6 italic opacity-20 group-hover:opacity-100 transition-opacity">01</p>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">The Vision</h4>
              <p className="text-sm text-gray-400 group-hover:text-black leading-relaxed">Redefining streetwear with a focus on luxury textures and minimalist silhouettes.</p>
            </div>

            <div className="p-12 border-b md:border-b-0 md:border-r border-white/20 group hover:bg-white hover:text-black transition-colors duration-500">
              <p className="text-4xl font-black mb-6 italic opacity-20 group-hover:opacity-100 transition-opacity">02</p>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Quality</h4>
              <p className="text-sm text-gray-400 group-hover:text-black leading-relaxed">Every garment is tested for durability, fit, and movement. No compromises.</p>
            </div>

            <div className="p-12 border-b md:border-b-0 md:border-r border-white/20 group hover:bg-white hover:text-black transition-colors duration-500">
              <p className="text-4xl font-black mb-6 italic opacity-20 group-hover:opacity-100 transition-opacity">03</p>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Ethics</h4>
              <p className="text-sm text-gray-400 group-hover:text-black leading-relaxed">Sustainable practices sourced from India’s finest artisanal workshops.</p>
            </div>

            <div className="p-12 group hover:bg-white hover:text-black transition-colors duration-500">
              <p className="text-4xl font-black mb-6 italic opacity-20 group-hover:opacity-100 transition-opacity">04</p>
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] mb-4">Delivery</h4>
              <p className="text-sm text-gray-400 group-hover:text-black leading-relaxed">Fast, global, and tracked. We ensure your style reaches you instantly.</p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECONDARY CONTENT --- */}
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <p className="text-2xl md:text-4xl font-light text-gray-400 leading-tight">
          "Fashion is the most powerful art there is. It's movement, design, and architecture all in one. 
          <span className="text-black font-bold"> Wardrobe X</span> is our contribution to that art."
        </p>
      </section>

      {/* --- POLICIES --- */}
      <div className="border-t border-gray-100">
        <PolicySection />
      </div>
    </main>
  );
};

export default About;