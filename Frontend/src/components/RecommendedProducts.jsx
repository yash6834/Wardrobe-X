import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

const BASE_URL = "http://localhost:3000";

const RecommendedProducts = () => {

  const navigate = useNavigate();

  // ✅ get current productId from URL
  const { productId } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    if (!productId) return;

    const fetchRecommended = async () => {

      try {

        setLoading(true);

        // ✅ correct API call
        const { data } = await api.get(
          `/api/activity/recommended/${productId}`
        );

        console.log("Recommended:", data);

        setProducts(data.products || data);

      } catch (error) {

        console.error("Recommendation error:", error);

      } finally {

        setLoading(false);

      }

    };

    fetchRecommended();

  }, [productId]);


  if (loading) {
    return <div>Loading recommendations...</div>;
  }

  if (!products.length) {
    return <div>No recommendations found</div>;
  }


  return (

    <section className="mt-24 max-w-[1440px] mx-auto px-6">

      <h2 className="text-2xl font-semibold mb-6">
        Recommended for You
      </h2>

      <div className="grid grid-cols-5 gap-6">

        {products.map(product => (

          <div
            key={product._id}
            onClick={() => navigate(`/product/${product._id}`)}
            className="cursor-pointer border rounded-xl overflow-hidden"
          >

            <img
              src={`${BASE_URL}${product.image?.[0]}`}
              alt={product.name}
            />

            <div className="p-3">
              {product.name}
            </div>

          </div>

        ))}

      </div>

    </section>

  );

};

export default RecommendedProducts;