import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const BASE_URL = "http://localhost:3000";

const AlsoBought = ({ productId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchAlsoBought = async () => {
      try {
        setLoading(true);

        const { data } = await api.get(
          `/api/activity/also-bought/${productId}`
        );

        setProducts(data.products || []);
      } catch (error) {
        console.error("AlsoBought error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlsoBought();
  }, [productId]);

  return (
    <section className="max-w-[1440px] mx-auto px-6 md:px-16 lg:px-24 mt-20 mb-8">
      <h2 className="text-2xl font-light mb-10">
        Customers Also Bought
      </h2>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-500 text-sm">
          No related purchases yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {products.map((product) => {
            const imageUrl = product.image?.[0]
              ? `${BASE_URL}${product.image[0]}`
              : "https://via.placeholder.com/300";

            return (
              <div
                key={product._id}
                onClick={() =>
                  navigate(`/product/${product._id}`)
                }
                className="cursor-pointer group"
              >
                <div className="bg-[#FAFAFA] aspect-[3/4] overflow-hidden rounded-xl">
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default AlsoBought;