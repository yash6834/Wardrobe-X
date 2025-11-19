import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/api';
import Title from './Title';

const LatestCollection = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const backendURL = "http://localhost:3000"; // Backend base URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/product');
        if (res.data.success && res.data.products) {
          setLatestProducts(res.data.products.slice(0, 8));
        }
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="my-12 px-5">
      {/* Heading */}
      <div className="text-center py-8">
        <Title text1="LATEST" text2="COLLECTIONS" />
        <p className="w-3/4 mx-auto text-gray-600 text-sm sm:text-base mt-3">
          Step into a season of bold expression and effortless elegance. Our newest collection celebrates individuality — crafted for those who dress with intention and live with flair.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {latestProducts.map((item, index) => {
          const productImage = Array.isArray(item.image) ? item.image : [item.image];

          return (
            <Link
              key={index}
              to={`/product/${item._id}`}
              className="flex flex-col items-center bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="w-full aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
                <img
                  src={
                    productImage[0]
                      ? `${backendURL}${productImage[0]}`
                      : "https://via.placeholder.com/300x300?text=No+Image"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="p-3 text-center">
                <p className="text-sm sm:text-base font-semibold truncate">{item.name}</p>
                <p className="text-gray-600 text-xs sm:text-sm">₹{item.price}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default LatestCollection;
