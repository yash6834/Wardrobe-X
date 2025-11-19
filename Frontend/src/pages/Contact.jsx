import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'

const Contact = () => {
  return (
    <main className="pt-24 px-5 bg-gray-50 min-h-screen">
      {/* Section Title */}
      <div className="text-center pt-12">
        <Title text1="CONTACT" text2="US" />
        <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
          Get in touch with us for any queries, orders, or support. We’re here to help!
        </p>
      </div>

      {/* Contact Content */}
      <section className="my-16 flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
        {/* Image */}
        <div className="md:w-1/2 w-full">
          <img
            className="w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 transform hover:scale-105"
            src={assets.contact_img}
            alt="Contact us"
          />
        </div>

        {/* Contact Details */}
        <div className="md:w-1/2 w-full flex flex-col justify-center gap-6 text-gray-700 bg-white p-8 rounded-2xl shadow-lg">
          <p className="text-xl font-semibold text-gray-800">Our Store</p>
          <p className="text-gray-600 leading-relaxed">
            📍 Woredrobe X Valsad Office <br />
            Shop No. 8, Shreeji Complex, <br />
            Near Tithal Road, <br />
            Valsad – 396001, Gujarat, India
          </p>
          <p className="text-gray-600 leading-relaxed">
            📞 Tel: +91 8780800578 <br />
            📧 Email: woredrobex@gmail.com
          </p>
        </div>
      </section>

     
    </main>
  )
}

export default Contact;
