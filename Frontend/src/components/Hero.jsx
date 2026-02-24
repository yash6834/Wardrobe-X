import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const BASE_URL = "http://localhost:3000";

const Hero = () => {

  const [banners, setBanners] = useState([]);
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const sliderRef = useRef(null);
  const startX = useRef(0);
  const isDragging = useRef(false);
  const autoSlideRef = useRef(null);

  /* ================= FETCH BANNERS ================= */

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/api/cms/banner");

      const sorted = data
        .filter(b => b.isActive)
        .sort((a, b) => a.order - b.order);

      setBanners(sorted);

    } catch (error) {
      console.error(error);
    }
  };

  /* ================= AUTO SLIDE ================= */

  useEffect(() => {
    startAutoSlide();
    return stopAutoSlide;
  }, [banners, current]);

  const startAutoSlide = () => {
    stopAutoSlide();

    if (banners.length <= 1) return;

    autoSlideRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
  };

  const stopAutoSlide = () => {
    if (autoSlideRef.current) {
      clearInterval(autoSlideRef.current);
    }
  };

  /* ================= NAVIGATION ================= */

  const nextSlide = () => {
    setCurrent(prev =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrent(prev =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  /* ================= TOUCH EVENTS ================= */

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

  /* ================= MOUSE DRAG ================= */

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

  /* ================= CLICK ================= */

  const handleClick = () => {
    if (!isDragging.current) {
      navigate("/collection");
    }
  };

  if (banners.length === 0) return null;

  return (

    <section className="relative w-full max-w-[1400px] mx-auto px-4">

      <div
        ref={sliderRef}
        className="relative overflow-hidden rounded-2xl shadow-xl group"
        onMouseEnter={stopAutoSlide}
        onMouseLeave={startAutoSlide}
      >

        {/* SLIDER */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${current * 100}%)`
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >

          {banners.map((banner) => (

            <div
              key={banner._id}
              className="w-full shrink-0"
            >

              <div
                className="
                  w-full
                  h-[180px]
                  sm:h-[250px]
                  md:h-[350px]
                  lg:h-[450px]
                  xl:h-[500px]
                  bg-slate-100
                  flex
                  items-center
                  justify-center
                  cursor-pointer
                  select-none
                "
                onClick={handleClick}
              >

                <img
                  src={`${BASE_URL}${banner.image}`}
                  alt="Banner"
                  className="w-full h-full object-contain pointer-events-none"
                  draggable="false"
                />

              </div>

            </div>

          ))}

        </div>

        {/* ARROWS */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* DOTS */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`
                h-2 rounded-full transition-all duration-300
                ${current === i
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white"}
              `}
            />
          ))}
        </div>

      </div>

    </section>

  );

};

export default Hero;