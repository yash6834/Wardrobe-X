import React, { useEffect } from "react";
import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold">
            Last Updated: April 2026
          </p>
        </div>

        {/* Intro */}
        <div className="max-w-2xl mx-auto text-center mb-24">
          <p className="text-lg md:text-xl text-gray-500 font-light leading-relaxed">
            This Privacy Policy explains how Wardrobe X collects, uses, and protects your information when you use our platform. Your privacy is very important to us, and we are committed to protecting your personal data.
          </p>
        </div>

        {/* Content Sections - Editorial Two-Column Layout */}
        <div className="max-w-5xl mx-auto">
          
          {/* Section 1 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">01</span> 
                Information We Collect
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-6">We may collect the following types of information when you interact with our brand:</p>
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> <div><strong className="text-gray-900 font-medium">Personal Information:</strong> Name, email, phone number, and delivery address.</div></li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> <div><strong className="text-gray-900 font-medium">Account Data:</strong> Login credentials, secure passwords, and order history.</div></li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> <div><strong className="text-gray-900 font-medium">Device Information:</strong> Browser type, IP address, and device identifier.</div></li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> <div><strong className="text-gray-900 font-medium">Usage Data:</strong> Pages visited, time spent, and interaction clicks.</div></li>
              </ul>
            </div>
          </section>

          {/* Section 2 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">02</span> 
                How We Use It
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> To provide and seamlessly improve our services.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> To securely process your orders and payments.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> To personalize and elevate your shopping experience.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> To send necessary updates, exclusive offers, and notifications.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> To improve security frameworks and prevent fraudulent activity.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">03</span> 
                Cookies & Tracking
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p>
                We use cookies and similar technologies to enhance your browsing experience. Cookies help us remember your preferences, keep items securely in your shopping bag, and understand overall user behavior to continuously improve our website interface.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">04</span> 
                Data Sharing
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-6">We deeply respect your privacy. We do <strong className="text-gray-900 font-medium">NOT</strong> sell your personal data. However, for operational necessity, we may share data securely with:</p>
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> Payment gateways for encrypted, secure transactions.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> Verified delivery partners for global order fulfillment.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> Trusted analytics services to monitor and improve platform performance.</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">05</span> 
                Data Security
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p>
                We deploy industry-standard security measures to protect your data. All sensitive transactions are fully encrypted. While we strive for perfection, no system is 100% secure, so we cannot guarantee absolute security of data transmitted over the internet.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">06</span> 
                Your Rights
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <ul className="space-y-4">
                <li className="flex gap-3"><span className="text-gray-300">—</span> You can access and view your data via your profile dashboard.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> You can formally request correction or deletion of your account.</li>
                <li className="flex gap-3"><span className="text-gray-300">—</span> You can opt-out of marketing communications at any given time.</li>
              </ul>
            </div>
          </section>

          {/* Section 7 */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12 border-t border-gray-200 border-b">
            <div className="md:col-span-4 relative">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest md:sticky md:top-32">
                <span className="text-gray-300 mr-4">07</span> 
                Contact Us
              </h2>
            </div>
            <div className="md:col-span-8 text-sm md:text-base text-gray-600 font-light leading-relaxed">
              <p className="mb-8">
                If you have any questions or require further clarification regarding this Privacy Policy, please reach out to our dedicated support team:
              </p>
              
              {/* NEW Minimalist Contact Card */}
              <div className="border border-gray-200 bg-gray-50 p-8 md:p-12 text-center group hover:border-gray-900 hover:bg-white transition-all duration-300">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 font-semibold mb-2 group-hover:text-gray-900 transition-colors">
                  Email Support
                </p>
                <a href="mailto:wardrobex@gmail.com" className="text-lg md:text-2xl font-serif italic tracking-wide text-gray-800 group-hover:text-black transition-colors">
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

export default PrivacyPolicy;