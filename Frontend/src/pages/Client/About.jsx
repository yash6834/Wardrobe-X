import React from 'react';
import Title from '../../components/Title';
import { assets } from '../../assets/frontend_assets/assets';
import { Link } from 'react-router-dom';
import PolicySection from '../../components/Policy';

const About = () => {
  return (
    <main className="bg-[#FAF9F6] min-h-screen text-stone-800 selection:bg-stone-800 selection:text-white font-sans">
      
      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-24 px-6 lg:px-16 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* Left Content - Editorial Spacing */}
        <div className="lg:w-1/2 space-y-8 z-10">
          <span className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-400">
            The Story
          </span>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-stone-900 leading-[1.1]">
            Redefining <br />
            <span className="font-serif italic text-stone-500">modern</span> elegance.
          </h1>
          <p className="text-lg text-stone-600 leading-relaxed max-w-md font-light">
            Wardrobe X isn't just about selling clothes. It’s an exploration of form, fabric, and the subtle art of dressing well. We curate the quiet confidence you wear to face the modern world.
          </p>
          
          <div className="pt-4">
            <Link 
              to="/collection" 
              className="inline-flex items-center justify-center px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white bg-stone-900 rounded-full hover:bg-stone-700 transition-colors duration-500"
            >
              Explore Collection
            </Link>
          </div>
        </div>

        {/* Right Image - Soft & Cinematic */}
        <div className="md:w-1/3 w-full relative">
          <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-300/50 aspect-[4/5] md:aspect-square lg:aspect-[4/5] group">
            <img
              className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
              src={assets.about_img}
              alt="Wardrobe X Editorial"
            />
            {/* Subtle overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 to-transparent"></div>
          </div>
          
          {/* Decorative floating element */}
          <div className="absolute -bottom-6 -left-6 md:-left-12 bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-stone-200/50 backdrop-blur-md">
            <p className="text-3xl font-serif italic text-stone-800">Est. 2024</p>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES - MINIMALIST CARDS --- */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-light text-stone-900">The Core Philosophy</h2>
            <p className="text-stone-500 font-light">No compromises. Just intentional design.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            
            {/* Value 1 */}
            <div className="text-center space-y-5 group">
              <div className="w-16 h-16 mx-auto border border-stone-200 rounded-full flex items-center justify-center text-xl text-stone-400 font-serif italic group-hover:bg-stone-50 group-hover:border-stone-300 transition-all duration-500">
                I
              </div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">The Vision</h4>
              <p className="text-sm text-stone-500 leading-relaxed font-light px-4">
                Redefining streetwear with a focus on luxury textures and minimalist silhouettes that outlast seasonal trends.
              </p>
            </div>

            {/* Value 2 */}
            <div className="text-center space-y-5 group">
              <div className="w-16 h-16 mx-auto border border-stone-200 rounded-full flex items-center justify-center text-xl text-stone-400 font-serif italic group-hover:bg-stone-50 group-hover:border-stone-300 transition-all duration-500">
                II
              </div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">Quality</h4>
              <p className="text-sm text-stone-500 leading-relaxed font-light px-4">
                Every garment is rigorously tested for durability, fit, and movement. We source only the finest fabrics.
              </p>
            </div>

            {/* Value 3 */}
            <div className="text-center space-y-5 group">
              <div className="w-16 h-16 mx-auto border border-stone-200 rounded-full flex items-center justify-center text-xl text-stone-400 font-serif italic group-hover:bg-stone-50 group-hover:border-stone-300 transition-all duration-500">
                III
              </div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-stone-900">Ethics</h4>
              <p className="text-sm text-stone-500 leading-relaxed font-light px-4">
                Sustainable practices sourced from top artisanal workshops. We believe in fair trade and environmental consciousness.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* --- SECONDARY CONTENT - CINEMATIC QUOTE --- */}
      <section className="py-32 px-6 bg-stone-900 text-center relative overflow-hidden">
        {/* Background ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-stone-700/30 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-3xl md:text-5xl font-serif italic leading-snug text-stone-200">
            "Fashion is the most powerful art there is. It's movement, design, and architecture all in one."
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-stone-600"></div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400 font-semibold">Wardrobe X</p>
            <div className="h-[1px] w-12 bg-stone-600"></div>
          </div>
        </div>
      </section>

      {/* --- POLICIES --- */}
      <div className="bg-[#FAF9F6]">
        <PolicySection />
      </div>
    </main>
  );
};

export default About;