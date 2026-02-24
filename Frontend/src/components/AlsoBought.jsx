import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const BASE_URL = "http://localhost:3000"; // ✅ ADD THIS

const AlsoBought = ({ productId }) => {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  /* ================= FETCH ALSO BOUGHT PRODUCTS ================= */

  useEffect(() => {

    const fetchAlsoBought = async () => {

      try {

        setLoading(true);

        const { data } = await api.get(
          `/api/activity/also-bought/${productId}`
        );

        console.log("Also bought:", data); // ✅ debug

        // remove duplicates
        const uniqueProducts = Array.from(
          new Map(
            (data.products || data).map(item => [item._id, item])
          ).values()
        );

        setProducts(uniqueProducts);

      } catch (error) {

        console.error("AlsoBought error:", error);

      } finally {

        setLoading(false);

      }

    };

    if (productId)
      fetchAlsoBought();

  }, [productId]);


  /* ================= LOADING ================= */

  if (loading) {

    return (
      <div className="mt-16">

        <h2 className="text-xl font-semibold mb-6">
          Customers Also Bought
        </h2>

        <div className="flex gap-4">

          {[1,2,3,4].map(i => (
            <div
              key={i}
              className="w-48 h-64 bg-gray-100 animate-pulse rounded-lg"
            />
          ))}

        </div>

      </div>
    );

  }


  /* ================= NO DATA ================= */

  if (!products.length)
    return null;


  /* ================= UI ================= */

  return (

    <div className="mt-16">

      <h2 className="text-xl font-semibold mb-6">
        Customers Also Bought
      </h2>


      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">


        {products.map(product => (

          <div
            key={product._id}
            onClick={() =>
              navigate(`/product/${product._id}`)
            }
            className="
              cursor-pointer
              group
              border
              rounded-xl
              overflow-hidden
              hover:shadow-lg
              transition
            "
          >


            {/* Image */}

            <div className="bg-gray-100 aspect-[3/4] overflow-hidden">

              <img
                src={`${BASE_URL}${product.image?.[0]}`} // ✅ FIXED
                alt={product.name}
                className="
                  w-full
                  h-full
                  object-cover
                  group-hover:scale-105
                  transition
                "
              />

            </div>


            {/* Info */}

            <div className="p-3">

              <h3 className="text-sm font-medium line-clamp-1">
                {product.name}
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                ₹{product.price}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default AlsoBought;