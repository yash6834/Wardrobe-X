import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const Terms = () => {
  // Automatically scroll to top when opening this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      
      <main className="pt-32 pb-24 px-6 md:px-12 lg:px-24 max-w-[1200px] mx-auto">
        
        {/* Header Section */}
        <div className="mb-20 text-center mt-10">
          <p className="text-xs tracking-[0.3em] text-gray-400 font-bold mb-4 uppercase">
            Legal & Terms
          </p>
          <h1 className="text-4xl md:text-6xl font-serif italic tracking-tighter text-gray-900 mb-6">
            Terms & Conditions
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Last Updated: April 2026
          </p>
        </div>

        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center mb-24">
          <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
            Welcome to Wardrobe X. These Terms & Conditions outline the rules and regulations for the use of our website and the purchase of our garments. By accessing this website, we assume you accept these terms in full.
          </p>
        </div>

        {/* Content Sections - Editorial Two-Column Layout */}
        <div className="max-w-5xl mx-auto">
          
          {/* Section 1 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">01</span> 
                General Conditions
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-6">We reserve the right to refuse service to anyone for any reason at any time. You understand that your content (not including credit card information), may be transferred unencrypted and involve:</p>
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> Transmissions over various networks.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> Changes to conform and adapt to technical requirements of connecting networks or devices.</li>
              </ul>
              <p className="mt-6">Credit card information is always encrypted during transfer over networks.</p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">02</span> 
                Products & Services
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-6">
                Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> We have made every effort to display as accurately as possible the colors and images of our products.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> We cannot guarantee that your computer monitor's display of any color will be accurate.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> We reserve the right to limit the quantities of any products or services that we offer.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">03</span> 
                Pricing & Billing
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-6">
                Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice at any time.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> We reserve the right to refuse any order you place with us, or limit quantities purchased per person, per household, or per order.</li>
              </ul>
            </div>
          </section>

          {/* Section 4 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">04</span> 
                Intellectual Property
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p>
                All content published and made available on our site is the property of Wardrobe X and the site's creators. This includes, but is not limited to images, text, logos, documents, downloadable files and anything that contributes to the composition of our site. Unauthorized reproduction or use of these materials is strictly prohibited.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200 border-b">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">05</span> 
                Contact Information
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-8">
                Questions about the Terms of Service should be sent to us via our official legal contact channel below:
              </p>
              
              {/* Premium Contact Card */}
              <div className="bg-[#050505] text-white p-8 md:p-12 text-center group hover:bg-[#111] transition-colors">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-400 mb-2">Legal Enquiries</p>
                <a href="mailto:legal@wardrobex.com" className="text-lg md:text-2xl font-serif italic tracking-wide group-hover:text-gray-300 transition-colors">
                  wardrobex@gmail.com
                </a>
              </div>
              
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default Terms;