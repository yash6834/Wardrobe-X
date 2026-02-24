import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import Title from "./Title";

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [user, setUser] = useState(null);

  const backendURL = "http://localhost:3000";

  useEffect(() => {
    fetchProducts();
    fetchUser();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/product");
      if (res.data.success && res.data.products) {
        setLatestProducts(res.data.products.slice(0, 8));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/api/users/profile");
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (err) {
      setUser(null);
    }
  };

  const activeMembership = user?.memberships?.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );

  const discountPercent = activeMembership?.discountPercent || 0;

  return (
    <section className="py-24 px-6 lg:px-16 bg-[#FDFDFD]">
      {/* Heading Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <div className="inline-block px-3 py-1 mb-4 text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase border border-gray-200 rounded-sm">
          New Season
        </div>
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="mt-6 text-gray-500 font-light leading-relaxed max-w-xl mx-auto text-sm sm:text-base">
          A curated selection of our newest arrivals, blending contemporary 
          craftsmanship with timeless silhouettes.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-12 sm:gap-x-8">
        {latestProducts.map((item) => {
          const productImage = Array.isArray(item.image) ? item.image : [item.image];
          const discountedPrice = item.price - (item.price * discountPercent) / 100;

          return (
            <Link
              key={item._id}
              to={`/product/${item._id}`}
              className="group flex flex-col"
            >
              {/* Image Wrapper */}
              <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-gray-100 rounded-sm">
                <img
                  src={
                    productImage[0]
                      ? `${backendURL}${productImage[0]}`
                      : "https://via.placeholder.com/600x800"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-110"
                />

                {/* Badge System */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {discountPercent > 0 && (
                    <span className="bg-black text-white text-[10px] font-bold px-2 py-1 uppercase tracking-tighter">
                      -{discountPercent}%
                    </span>
                  )}
                  <span className="bg-white/80 backdrop-blur-md text-black text-[9px] font-bold px-2 py-1 uppercase border border-black/5 shadow-sm">
                    Arrival
                  </span>
                </div>

                {/* Hover Quick View Button */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="w-full bg-white py-3 text-center text-[11px] font-bold tracking-widest uppercase text-black shadow-2xl translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    Discover More
                  </div>
                </div>
              </div>

              {/* Content Info */}
              <div className="flex flex-col items-start px-1">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 tracking-tight mb-1 group-hover:text-gray-500 transition-colors">
                  {item.name}
                </h3>
                
                <div className="flex items-baseline gap-2">
                  {discountPercent > 0 ? (
                    <>
                      <span className="text-sm sm:text-base font-bold text-black">
                        ₹{Math.round(discountedPrice).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-gray-400 line-through">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm sm:text-base font-bold text-black">
                      ₹{item.price.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Navigation */}
      <div className="mt-20 flex justify-center">
        <Link 
          to="/collection" 
          className="text-[11px] font-bold tracking-[0.2em] uppercase border-b border-black pb-1 hover:text-gray-400 hover:border-gray-200 transition-all"
        >
          View Full Catalog
        </Link>
      </div>
    </section>
  );
};

export default LatestCollection;