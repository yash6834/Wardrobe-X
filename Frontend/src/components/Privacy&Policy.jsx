import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "./Footer";

const PrivacyPolicy = () => {
  // Automatically scroll to top when opening this page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 1. FIXED: Defined the sections array that was missing
  const sections = [
    {
      id: "01",
      title: "Information We Collect",
      content: (
        <>
          <p className="mb-6">We may collect the following types of information when you interact with our brand:</p>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start"><span className="text-gray-300 font-serif">—</span> <div><strong className="text-gray-900 font-medium">Personal Information:</strong> Name, email, phone number, and delivery address.</div></li>
            <li className="flex gap-3 items-start"><span className="text-gray-300 font-serif">—</span> <div><strong className="text-gray-900 font-medium">Account Data:</strong> Login credentials, secure passwords, and order history.</div></li>
            <li className="flex gap-3 items-start"><span className="text-gray-300 font-serif">—</span> <div><strong className="text-gray-900 font-medium">Device Information:</strong> Browser type, IP address, and device identifier.</div></li>
          </ul>
        </>
      ),
    },
    {
      id: "02",
      title: "How We Use It",
      content: (
        <ul className="space-y-4">
          <li className="flex gap-3"><span className="text-gray-300">—</span> To provide and seamlessly improve our services.</li>
          <li className="flex gap-3"><span className="text-gray-300">—</span> To securely process your orders and payments.</li>
          <li className="flex gap-3"><span className="text-gray-300">—</span> To personalize and elevate your shopping experience.</li>
          <li className="flex gap-3"><span className="text-gray-300">—</span> To improve security frameworks and prevent fraudulent activity.</li>
        </ul>
      ),
    },
    {
      id: "03",
      title: "Cookies & Tracking",
      content: (
        <p>
          We use cookies and similar technologies to enhance your browsing experience. Cookies help us remember your preferences, keep items securely in your shopping bag, and understand overall user behavior.
        </p>
      ),
    },
    {
      id: "04",
      title: "Data Security",
      content: (
        <p>
          We deploy industry-standard security measures to protect your data. All sensitive transactions are fully encrypted. While we strive for perfection, no system is 100% secure; we encourage users to maintain strong account passwords.
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

export default PrivacyPolicy;