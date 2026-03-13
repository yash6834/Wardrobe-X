import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import Title from "../../components/Title";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { CurrencyContext } from "../../context/Currency";

const Collection = () => {

  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [convertedPrices, setConvertedPrices] = useState({});
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  const { currency } = useContext(CurrencyContext);

  const backendURL = "http://localhost:3000";

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  /* ---------------- Fetch Products ---------------- */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/product");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  /* ---------------- Fetch User ---------------- */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/profile");
        setUser(res.data.user);
      } catch {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  /* ---------------- Currency Conversion ---------------- */

  const convertPrices = async (productList) => {

    const priceMap = {};

    for (let product of productList) {

      try {

        if (currency === "INR") {
          priceMap[product._id] = product.price;
        } else {

          const res = await api.get(
            `/api/currency/convert?amount=${product.price}&currency=${currency}`
          );

          if (res.data.success) {
            priceMap[product._id] = Number(res.data.converted);
          }

        }

      } catch (error) {
        priceMap[product._id] = product.price;
      }

    }

    setConvertedPrices(priceMap);
  };

  useEffect(() => {
    if (filterProduct.length > 0) {
      convertPrices(filterProduct);
    }
  }, [currency, filterProduct]);

  /* ---------------- Membership Discount ---------------- */

  const activeMembership = user?.memberships?.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );

  const discountPercent = activeMembership?.discountPercent || 0;

  /* ---------------- Filters ---------------- */

  const toggleCategory = (e) => {
    const value = e.target.value;

    setCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;

    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  /* ---------------- Filtering + Sorting ---------------- */

  useEffect(() => {

    let filtered = [...products];

    const normalizeText = (text) =>
      text.toLowerCase().replace(/[-_\s]/g, "");

    if (searchText.trim() !== "") {
      const normalizedSearch = normalizeText(searchText);

      filtered = filtered.filter((item) =>
        normalizeText(item.name).includes(normalizedSearch)
      );
    }

    if (searchText.trim() === "") {

      if (category.length > 0) {
        filtered = filtered.filter((item) =>
          category.includes(item.category)
        );
      }

      if (subCategory.length > 0) {
        filtered = filtered.filter((item) =>
          subCategory.includes(item.subCategory)
        );
      }

    }

    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProduct(filtered);

  }, [products, category, subCategory, sortOption, searchText]);

  /* ---------------- UI ---------------- */

  return (
    <div className="bg-white min-h-screen">

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 flex flex-col md:flex-row gap-12 mb-16">

        {/* Sidebar */}

        <aside className="hidden md:block w-64 flex-shrink-0">

          <div className="sticky top-32 space-y-8">

            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={18} />
              <h3 className="text-sm font-semibold">Filters</h3>
            </div>

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="mb-4 text-xs font-bold uppercase">Category</p>

              {["Men", "Women"].map((cat) => (
                <label key={cat} className="flex items-center mb-2">

                  <input
                    type="checkbox"
                    value={cat}
                    onChange={toggleCategory}
                    className="accent-black"
                  />

                  <span className="ml-3 text-sm">{cat}</span>

                </label>
              ))}

            </div>

            <div className="bg-gray-50 rounded-lg p-5">

              <p className="mb-4 text-xs font-bold uppercase">Sub-Category</p>

              {["Topwear", "Bottomwear"].map((sub) => (
                <label key={sub} className="flex items-center mb-2">

                  <input
                    type="checkbox"
                    value={sub}
                    onChange={toggleSubCategory}
                    className="accent-black"
                  />

                  <span className="ml-3 text-sm">{sub}</span>

                </label>
              ))}

            </div>

          </div>

        </aside>

        {/* Products */}

        <section className="flex-1">

          {/* Top bar */}

          <div className="flex justify-between mb-10">

            <div className="relative w-full max-w-md">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-100 rounded-full py-3 pl-12 pr-6 text-sm"
              />

            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-gray-100 rounded-full px-4 py-2 text-xs"
            >
              <option value="relevant">Relevant</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>

          </div>

          <div className="flex justify-center mb-10">
            <Title text1="SHOP" text2="COLLECTION" />
          </div>

          {/* Grid */}

          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">

            {filterProduct.map((item) => {

              const productImage = Array.isArray(item.image)
                ? item.image
                : [item.image];

              const basePrice =
                convertedPrices[item._id] || item.price;

              const discountedPrice =
                basePrice - (basePrice * discountPercent) / 100;

              return (

                <Link
                  key={item._id}
                  to={`/product/${item._id}`}
                  className="group flex flex-col bg-white rounded-lg shadow-sm hover:shadow-md"
                >

                  <div className="relative aspect-[3/4] overflow-hidden">

                    <img
                      src={
                        productImage[0]
                          ? `${backendURL}${productImage[0]}`
                          : "https://via.placeholder.com/600x800"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105"
                    />

                    {discountPercent > 0 && (
                      <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1">
                        -{discountPercent}%
                      </div>
                    )}

                  </div>

                  <div className="p-4">

                    <p className="text-sm font-medium uppercase">
                      {item.name}
                    </p>

                    <div className="mt-2 flex gap-2">

                      {discountPercent > 0 ? (
                        <>
                          <span className="font-bold">
                            {currencySymbols[currency]}
                            {Math.round(discountedPrice)}
                          </span>

                          <span className="text-xs line-through text-gray-400">
                            {currencySymbols[currency]}
                            {Math.round(basePrice)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold">
                          {currencySymbols[currency]}
                          {Math.round(basePrice)}
                        </span>
                      )}

                    </div>

                  </div>

                </Link>

              );
            })}

          </div>

        </section>

      </main>

    </div>
  );
};

export default Collection;