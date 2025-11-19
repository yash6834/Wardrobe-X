import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api"; // your Axios instance
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import PolicySection from "../components/Policy";

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [searchText, setSearchText] = useState("");

  const backendURL = "http://localhost:3000"; // backend base URL

  // Fetch products
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

  const toggleCategory = (e) => {
    const value = e.target.value;
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];
    const normalizeText = (text) => text.toLowerCase().replace(/[-_\s]/g, "");

    if (searchText.trim() !== "") {
      const normalizedSearch = normalizeText(searchText);
      filtered = filtered.filter((item) => normalizeText(item.name).includes(normalizedSearch));
    }

    if (searchText.trim() === "") {
      if (category.length > 0) filtered = filtered.filter((item) => category.includes(item.category));
      if (subCategory.length > 0) filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    if (sortOption === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "high-low") filtered.sort((a, b) => b.price - a.price);

    setFilterProduct(filtered);
  }, [products, category, subCategory, sortOption, searchText]);

  return (
    <div className="px-5">
      <main className="pt-24">
        {/* Search Bar */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center justify-center border border-gray-400 px-4 py-2 rounded-3xl bg-white w-full max-w-md">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search products..."
              className="flex-1 outline-none px-2 py-1 text-sm"
            />
            {searchText === "" ? (
              <img className="w-4 ml-2" src={assets.search_icon} alt="search" />
            ) : (
              <button type="button" onClick={() => setSearchText("")} className="ml-2 focus:outline-none">
                <img className="w-4" src={assets.cross_icon} alt="clear" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-10 border-t py-10">
          {/* Left Filters */}
          <div className="min-w-60">
            <p
              className="my-2 text-xl flex items-center cursor-pointer gap-2 text-yellow-600 font-bold"
              onClick={() => setShowFilter(!showFilter)}
            >
              FILTERS
              <img
                className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
                src={assets.dropdown_icon}
                alt=""
              />
            </p>

            <div className={`border border-gray-300 pl-5 py-3 mt-6 shadow-sm my-6 ${showFilter ? "" : "hidden"} sm:block`}>
              <p className="mb-3 text-sm font-medium text-yellow-600">CATEGORIES</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <label className="flex gap-2 cursor-pointer">
                  <input type="checkbox" value="Men" onChange={toggleCategory} /> Men
                </label>
                <label className="flex gap-2 cursor-pointer">
                  <input type="checkbox" value="Women" onChange={toggleCategory} /> Women
                </label>
                <label className="flex gap-2 cursor-pointer">
                  <input type="checkbox" value="Kids" onChange={toggleCategory} /> Kids
                </label>
              </div>
            </div>

            <div className={`border border-gray-300 pl-5 py-3 mt-6 shadow-sm my-5 ${showFilter ? "" : "hidden"} sm:block`}>
              <p className="mb-3 text-sm font-medium text-yellow-600">TYPE</p>
              <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
                <label className="flex gap-2 cursor-pointer">
                  <input type="checkbox" value="Topwear" onChange={toggleSubCategory} /> Topwear
                </label>
                <label className="flex gap-2 cursor-pointer">
                  <input type="checkbox" value="Bottomwear" onChange={toggleSubCategory} /> Bottomwear
                </label>
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex-1">
            <div className="flex justify-center text-base sm:text-2xl mb-6">
              <Title text1="All" text2="COLLECTION" />
            </div>

            <div className="flex justify-end mb-6">
              <select
                className="border-2 border-gray-300 text-sm px-3 py-1 rounded"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="relevant">Sort By: Relevant</option>
                <option value="low-high">Sort By: Low to High</option>
                <option value="high-low">Sort By: High to Low</option>
              </select>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filterProduct.map((item, index) => {
                const productImage = Array.isArray(item.image) ? item.image : [item.image];

                return (
                  <Link
                    to={`/api/product/${item._id}`}
                    key={index}
                    className="flex flex-col items-center bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                  >
                    <div className="w-full h-56 sm:h-60 md:h-64 lg:h-72 overflow-hidden">
                      <img
                        src={productImage[0] ? `${backendURL}${productImage[0]}` : "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-full h-full object-cover object-center transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    <div className="p-3 text-center">
                      <p className="text-sm sm:text-base font-semibold">{item.name}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">₹{item.price}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
        
        <PolicySection />
      </main>
    </div>
  );
};

export default Collection;
