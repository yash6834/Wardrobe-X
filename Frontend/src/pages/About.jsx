import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import { Link } from 'react-router-dom'
import PolicySection from '../components/Policy'

const About = () => {
  return (
    <main className="pt-24 px-5 bg-gray-50 min-h-screen">
      {/* Section Title */}
      <div className="text-center pt-12">
        <Title text1="ABOUT" text2="US" />
        <p className="mt-3 text-gray-500 max-w-xl mx-auto text-sm sm:text-base">
          Discover our story, mission, and vision. At Wardrobe X, fashion meets style and individuality.
        </p>
      </div>

      {/* About Content */}
      <section className="my-16 flex flex-col md:flex-row items-center justify-center gap-12 max-w-6xl mx-auto">
        {/* Image */}
        <div className="md:w-1/2 w-full">
          <img
            className="w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-500 transform hover:scale-105"
            src={assets.about_img}
            alt="About us"
          />
        </div>

        {/* Text Content */}
        <div className="md:w-1/2 w-full flex flex-col justify-center gap-6 text-gray-700">
          <p className="text-lg sm:text-xl leading-relaxed">
            At <span className="font-semibold text-gray-900">Wardrobe X</span>, we redefine online clothing shopping with trendy, affordable, and high-quality fashion for everyone. Our collections blend timeless elegance with modern style, helping you express yourself effortlessly.
          </p>
          <p className="text-lg sm:text-xl leading-relaxed">
            We believe fashion is personal, and <span className="font-semibold text-gray-900">Wardrobe X</span> is here to inspire your wardrobe with confidence and creativity. Explore versatile, stylish pieces that celebrate individuality and make fashion effortless.
          </p>

          <div className="mt-6">

            <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/collection">
              Explore Collection
              </Link>
            </button>
          </div>
        </div>
        
      </section>
      <PolicySection/>
    </main>
  )
}

export default About
