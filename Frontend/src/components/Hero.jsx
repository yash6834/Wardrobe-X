import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const BASE_URL = "http://localhost:3000";

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const [recentProducts, setRecentProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);

  const navigate = useNavigate();
  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const autoSlideRef = useRef(null);

  const isLoggedIn = !!localStorage.getItem("token");

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchBanners();

    if (isLoggedIn) {
      fetchPersonalized();
    }
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/api/cms/banner");

      const sorted = data
        .filter((b) => b.isActive)
        .sort((a, b) => a.order - b.order);

      setBanners(sorted);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPersonalized = async () => {
    try {
      const { data } = await api.get("/api/recommendations/hero");

      setRecentProducts(data.recentViews || []);
      setRecommendedProducts(data.recommended || []);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= AUTO SLIDE ================= */

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [banners]);

  const startAutoSlide = () => {
    stopAutoSlide();

    if (banners.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  /* ================= INTERACTION HANDLERS ================= */

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
    stopAutoSlide();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging.current) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX.current - endX;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    isDragging.current = false;
    startAutoSlide();
  };

  const handleMouseDown = (e) => {
    startX.current = e.clientX;
    isDragging.current = true;
    stopAutoSlide();
  };

  const handleMouseUp = (e) => {
    if (!isDragging.current) return;

    const diff = startX.current - e.clientX;

    if (diff > 50) nextSlide();
    if (diff < -50) prevSlide();

    isDragging.current = false;
    startAutoSlide();
  };

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full max-w-[1440px] mx-auto px-4 pb-8">

      {/* ================= HERO SLIDER ================= */}

      <div
        ref={sliderRef}
        className="relative overflow-hidden rounded-[2.5rem] shadow-2xl group border border-white/10"
      >
        <div
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${current * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {banners.map((banner) => (
            <div key={banner._id} className="w-full shrink-0 relative">
              <div
                className="w-full h-[350px] sm:h-[450px] md:h-[550px] lg:h-[650px] bg-zinc-200 flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => navigate("/collection")}
              >
                <img
                  src={`${BASE_URL}${banner.image}`}
                  alt="Banner"
                  className="w-full h-full object-cover"
                  draggable="false"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
              </div>
            </div>
          ))}
        </div>

        {/* NAVIGATION ARROWS */}

        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-50"
            >
              <ChevronLeft size={28} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 z-50"
            >
              <ChevronRight size={28} />
            </button>
          </>
        )}

        {/* DOTS */}

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 z-30">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                current === i ? "w-10 bg-white" : "w-3 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= PERSONALIZED SECTION ================= */}

      {isLoggedIn && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-[-70px] md:mt-[-140px] relative z-10 px-2">

          {/* RECENTLY VIEWED */}

          <div className="bg-white rounded-3xl p-4 shadow-xl border border-zinc-100">
            <h3 className="font-bold text-zinc-900 text-base mb-3">
              Recent views
            </h3>

        <div className="grid grid-cols-2 gap-2 h-[180px]">

{[...new Map(recentProducts.map(p => [p._id, p])).values()]
  .slice(0,2)
  .map((product) => (

    <div key={product._id} className="group overflow-hidden rounded-xl bg-zinc-50">

      <img
        src={`${BASE_URL}${product.image[0]}`}
        className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
        onClick={() => navigate(`/product/${product._id}`)}
      />

    </div>

))}

</div>

            <button
              onClick={()=>navigate("/collection")}
              className="mt-3 text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"
            >
              Continue <ArrowRight size={14}/>
            </button>
          </div>


          {/* RECOMMENDED */}

          <div className="bg-white rounded-3xl p-4 shadow-xl border border-zinc-100">
            <h3 className="font-bold text-zinc-900 text-base mb-3">
              For You
            </h3>

            <div className="grid grid-cols-2 gap-2 h-[180px]">
              {recommendedProducts.slice(0,4).map((product)=>(
                <div key={product._id} className="overflow-hidden rounded-xl">
                  <img
                    src={`${BASE_URL}${product.image[0]}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={()=>navigate(`/product/${product._id}`)}
                  />
                </div>
              ))}
            </div>

            <button
              onClick={()=>navigate("/collection")}
              className="mt-3 text-xs font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2"
            >
              Explore <ArrowRight size={14}/>
            </button>
          </div>


          {/* FLASH DEALS */}

          <div
            className="bg-zinc-900 rounded-3xl p-7 shadow-2xl text-white cursor-pointer relative overflow-hidden"
            onClick={()=>navigate("/collection")}
          >
            <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
              <Zap size={22} fill="white"/>
            </div>

            <h3 className="font-black text-3xl mb-2">
              Flash Deals
            </h3>

            <p className="text-zinc-400 text-sm mb-6">
              Limited time offers.
            </p>

            <span className="inline-flex items-center gap-2 bg-white text-black px-5 py-3 rounded-2xl text-[11px] font-black uppercase">
              Shop Now <ArrowRight size={14}/>
            </span>
          </div>

        </div>
      )}

    </section>
  );
};

export default Hero;