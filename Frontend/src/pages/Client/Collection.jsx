import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import Title from "../../components/Title";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { CurrencyContext } from "../../context/Currency";

const Collection = () => {
  const { t } = useTranslation();
  const { currency } = useContext(CurrencyContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [user, setUser] = useState(null);

  const backendURL = "http://localhost:3000"; // Update this in production

  const currencySymbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  /* ---------------- FETCH PRODUCTS ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/product");
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProducts();
  }, []);

  /* ---------------- FETCH USER ---------------- */
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

  /* ---------------- URL LOAD ---------------- */
  useEffect(() => {
    const cat = searchParams.get("category");
    const sub = searchParams.get("subCategory");
    const search = searchParams.get("search");

    if (cat) setCategory(cat.split(","));
    if (sub) setSubCategory(sub.split(","));
    if (search) setSearchText(search);
  }, []);

  /* ---------------- URL UPDATE ---------------- */
  useEffect(() => {
    const params = {};
    if (category.length) params.category = category.join(",");
    if (subCategory.length) params.subCategory = subCategory.join(",");
    if (searchText) params.search = searchText;

    setSearchParams(params);
  }, [category, subCategory, searchText]);

  /* ---------------- FILTER LOGIC ---------------- */
  useEffect(() => {
    let filtered = [...products];

    const normalizeText = (text) => text?.toLowerCase().replace(/[-_\s]/g, "");

    // SEARCH
    if (searchText.trim() !== "") {
      const normalizedSearch = normalizeText(searchText);
      filtered = filtered.filter((item) =>
        normalizeText(item.name).includes(normalizedSearch)
      );
    }

    // CATEGORY
    if (category.length > 0) {
      filtered = filtered.filter((item) =>
        category.includes(item.category?.toLowerCase())
      );
    }

    // SUBCATEGORY
    if (subCategory.length > 0) {
      filtered = filtered.filter((item) =>
        subCategory.includes(item.subCategory?.toLowerCase())
      );
    }

    // PRICE
    filtered = filtered.filter(
      (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // SORT
    if (sortOption === "low-high") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "high-low") {
      filtered.sort((a, b) => b.price - a.price);
    }

    setFilterProduct(filtered);
  }, [products, category, subCategory, sortOption, searchText, priceRange]);

  /* ---------------- MEMBERSHIP ---------------- */
  const activeMembership = user?.memberships?.find(
    (m) => m.isActive && new Date(m.endDate) > new Date()
  );

  const discountPercent = activeMembership?.discountPercent || 0;

  /* ---------------- FILTER HANDLERS ---------------- */
  const toggleCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setCategory((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setSubCategory((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
    );
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR FILTERS */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28 space-y-8">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <SlidersHorizontal className="text-gray-500" size={20} />
              <h3 className="text-lg font-semibold text-gray-800 tracking-tight">Filters</h3>
            </div>

            {/* CATEGORY */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Category</p>
              <div className="space-y-3">
                {["Men", "Women"].map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      value={cat}
                      checked={category.includes(cat.toLowerCase())}
                      onChange={toggleCategory}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                    <span className="ml-3 text-gray-600 group-hover:text-black transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* SUBCATEGORY */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Subcategory</p>
              <div className="space-y-3">
                {["Topwear", "Bottomwear"].map((sub) => (
                  <label key={sub} className="flex items-center cursor-pointer group">
                    <input
                      type="checkbox"
                      value={sub}
                      checked={subCategory.includes(sub.toLowerCase())}
                      onChange={toggleSubCategory}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                    <span className="ml-3 text-gray-600 group-hover:text-black transition-colors">{sub}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Max Price</p>
              <input
                type="range"
                min="0"
                max="5000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
                <span>{currencySymbols[currency]}0</span>
                <span className="text-black">{currencySymbols[currency]}{priceRange[1]}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <section className="flex-1">
          
          {/* HEADER (Title, Search, Sort) */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
            <Title text1="SHOP" text2="COLLECTION" />

            <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
              {/* SEARCH BAR */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-sm pl-10 pr-4 py-2.5 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                />
              </div>

              {/* SORT DROPDOWN */}
              <div className="relative w-full sm:w-48">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-white border border-gray-200 text-sm px-4 py-2.5 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer shadow-sm text-gray-700"
                >
                  <option value="relevant">Sort by: Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>
          </div>

          {/* PRODUCT GRID */}
          {filterProduct.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filterProduct.map((item) => {
                const basePrice = item.price;
                const finalPrice = basePrice - (basePrice * discountPercent) / 100;

                return (
                  <Link key={item._id} to={`/product/${item._id}`} className="group">
                    <div className="bg-white rounded-2xl p-3 border border-transparent hover:border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                      
                      {/* Image Container */}
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-4">
                        <img
                          src={`${backendURL}${item.image[0]}`}
                          alt={item.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        {/* Member Discount Badge */}
                        {discountPercent > 0 && (
                          <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 rounded tracking-wide uppercase">
                            Member Price
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex flex-col flex-1 px-1">
                        <h4 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2 leading-tight group-hover:text-black transition-colors">
                          {item.name}
                        </h4>
                        
                        <div className="mt-auto pt-2 flex items-center gap-2">
                          <p className="text-base font-bold text-black">
                            {currencySymbols[currency]}{Math.round(finalPrice)}
                          </p>
                          {discountPercent > 0 && (
                            <p className="text-xs text-gray-400 line-through font-medium">
                              {currencySymbols[currency]}{Math.round(basePrice)}
                            </p>
                          )}
                        </div>
                      </div>

                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Search size={48} className="text-gray-300 mb-4" />
              <p className="text-lg font-medium text-gray-800">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setCategory([]); setSubCategory([]); setSearchText(""); setPriceRange([0, 5000]); }}
                className="mt-6 px-6 py-2 bg-black text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Collection;