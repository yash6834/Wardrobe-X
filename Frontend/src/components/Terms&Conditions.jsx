import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const Terms = () => {
  // Automatically scroll to top when opening this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sections = [
    {
      id: "01",
      title: "General Conditions",
      content: (
        <>
          <p className="mb-6">
            We reserve the right to refuse service to anyone for any reason at any time. Your content (excluding credit card information) may be transferred unencrypted and involve:
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3"><span className="text-gray-300">—</span> Transmissions over various networks.</li>
            <li className="flex gap-3"><span className="text-gray-300">—</span> Technical adaptations to conform to connecting device requirements.</li>
          </ul>
          <p className="mt-6 font-medium text-gray-900 italic">
            Credit card information is always encrypted during transfer over networks.
          </p>
        </>
      ),
    },
    {
      id: "02",
      title: "Products & Services",
      content: (
        <>
          <p className="mb-6">
            Certain garments are available exclusively online. These may have limited quantities and are subject to return or exchange only according to our <span className="underline underline-offset-4 cursor-pointer">Return Policy</span>.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3"><span className="text-gray-300">—</span> We strive for absolute color accuracy; however, monitor displays may vary.</li>
            <li className="flex gap-3"><span className="text-gray-300">—</span> We reserve the right to limit sales to any person, region, or jurisdiction.</li>
          </ul>
        </>
      ),
    },
    {
      id: "03",
      title: "Pricing & Billing",
      content: (
        <>
          <p className="mb-6">
            Prices for our products are subject to change without notice. We reserve the right to modify or discontinue the Service at our discretion.
          </p>
          <ul className="space-y-4">
            <li className="flex gap-3"><span className="text-gray-300">—</span> You agree to provide current, complete, and accurate account information.</li>
            <li className="flex gap-3"><span className="text-gray-300">—</span> We may, in our sole discretion, limit or cancel quantities purchased per person.</li>
          </ul>
        </>
      ),
    },
    {
      id: "04",
      title: "Intellectual Property",
      content: (
        <p>
          All content published—including imagery, text, logos, and downloadable files—is the exclusive property of <span className="text-gray-900 font-medium">Wardrobe X</span>. Unauthorized reproduction, distribution, or mimicry of our brand assets is strictly prohibited and protected by international copyright laws.
        </p>
      ),
    },
  ];

  return (
    <div className="bg-white min-h-screen flex flex-col selection:bg-black selection:text-white">
      <Navbar />
      
      <main className="flex-grow pt-40 pb-24 px-6 md:px-12 lg:px-24 max-w-[1400px] mx-auto w-full">
        <article>
          {/* Header Section */}
          <header className="mb-32 text-center">
            <p className="text-[10px] tracking-[0.5em] text-gray-400 font-bold mb-6 uppercase">
              Legal & Terms
            </p>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-gray-900 mb-8 leading-tight">
              Terms & Conditions
            </h1>
            <div className="w-12 h-[1px] bg-gray-900 mx-auto mb-8"></div>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium">
              Effective Date: April 2026
            </p>
          </header>

          {/* Intro Section */}
          <div className="max-w-3xl mx-auto text-center mb-40">
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-relaxed">
              Welcome to <span className="text-gray-900 font-medium tracking-tight">Wardrobe X</span>. By accessing our platform, you agree to be bound by the following terms. We recommend reading them carefully before finalizing your curation.
            </p>
          </div>

          {/* Content Sections */}
          <div className="max-w-5xl mx-auto">
            {sections.map((section) => (
              <section key={section.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 py-20 border-t border-gray-100 first:border-t-0 group">
                <div className="md:col-span-4">
                  <h2 className="text-xs font-bold text-gray-400 group-hover:text-black uppercase tracking-[0.3em] md:sticky md:top-36 transition-all duration-300">
                    <span className="text-gray-200 group-hover:text-gray-400 mr-4 font-mono">{section.id}</span> 
                    {section.title}
                  </h2>
                </div>
                <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                  {section.content}
                </div>
              </section>
            ))}

            {/* Premium Contact Section (Black Card) */}
            <section className="grid grid-cols-1 md:grid-cols-12 gap-12 py-24 border-y border-gray-100 mb-20">
              <div className="md:col-span-4">
                <h2 className="text-xs font-bold text-gray-900 uppercase tracking-[0.3em] md:sticky md:top-36">
                  <span className="text-gray-300 mr-4 font-mono">05</span> 
                  Legal Contact
                </h2>
              </div>
              <div className="md:col-span-8">
                <p className="text-sm md:text-base text-gray-500 font-light leading-relaxed mb-12">
                  Inquiries regarding these Terms of Service should be directed to our legal department at the address below.
                </p>
                
                <div className="bg-[#050505] p-12 md:p-20 text-center group hover:bg-black transition-all duration-700 rounded-sm shadow-2xl">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-gray-500 font-bold mb-4 group-hover:text-white transition-colors">
                    Official Legal Channel
                  </p>
                  <a 
                    href="mailto:wardrobex@gmail.com" 
                    className="text-xl md:text-4xl font-serif italic tracking-wide text-white block transition-transform hover:scale-105"
                  >
                    wardrobex@gmail.com
                  </a>
                  <div className="mt-8 flex justify-center gap-4 opacity-20 group-hover:opacity-100 transition-opacity duration-700">
                     <div className="w-1 h-1 bg-white rounded-full"></div>
                     <div className="w-1 h-1 bg-white rounded-full"></div>
                     <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;