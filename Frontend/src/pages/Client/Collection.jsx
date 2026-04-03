import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/api";
import Title from "../../components/Title";
import { Search, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { CurrencyContext } from "../../context/Currency";

const Collection = () => {
  const { t } = useTranslation();
  const { currency, convertPrice } = useContext(CurrencyContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [searchText, setSearchText] = useState("");
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [user, setUser] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const backendURL = "http://localhost:3000";

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

    const normalizeText = (text) =>
      text?.toLowerCase().replace(/[-_\s]/g, "");

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

    // PRICE (still base INR)
    filtered = filtered.filter(
      (item) =>
        item.price >= priceRange[0] &&
        item.price <= priceRange[1]
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
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value.toLowerCase();
    setSubCategory((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  };

  const clearFilters = () => {
    setCategory([]);
    setSubCategory([]);
    setSearchText("");
    setPriceRange([0, 10000]);
    setSortOption("relevant");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="bg-white min-h-screen font-sans selection:bg-black selection:text-white">
      <main className="max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col lg:flex-row gap-12">

        {/* ================= HEADER & MOBILE TOGGLE ================= */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <Title text1="SHOP" text2="COLLECTION" />
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1"
          >
            Filters <SlidersHorizontal size={14} />
          </button>
        </div>

        {/* ================= SIDEBAR FILTERS ================= */}
        {/* 🔥 FIX: Added lg:sticky, lg:top-32, and a height calculation so it stays fixed on the screen */}
        <aside className={`fixed inset-0 z-50 bg-white p-6 lg:p-0 lg:sticky lg:top-32 lg:h-[calc(100vh-8rem)] lg:w-64 flex-shrink-0 transition-transform duration-300 ${showMobileFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
          
          {/* 🔥 FIX: Removed lg:overflow-visible so if you add lots of filters later, they scroll neatly inside the fixed sidebar */}
          <div className="space-y-12 h-full overflow-y-auto pb-20 lg:pb-8 pr-4 scrollbar-hide">
            
            {/* Mobile Close Button */}
            <div className="flex justify-between items-center lg:hidden mb-8">
              <h3 className="text-lg font-serif italic tracking-wide">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)} className="p-2"><X size={20} /></button>
            </div>

            <div className="hidden lg:flex items-center gap-3 border-b border-gray-100 pb-4">
              <SlidersHorizontal className="text-gray-900" size={18} strokeWidth={1.5} />
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-900">Filters</h3>
            </div>

            {/* CATEGORY */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-5 uppercase tracking-[0.2em]">Category</p>
              <div className="space-y-4">
                {["Men", "Women"].map((cat) => (
                  <label key={cat} className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        value={cat}
                        checked={category.includes(cat.toLowerCase())}
                        onChange={toggleCategory}
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black transition-colors cursor-pointer"
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 group-hover:text-black transition-colors uppercase tracking-wide">
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* SUBCATEGORY */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-5 uppercase tracking-[0.2em]">Subcategory</p>
              <div className="space-y-4">
                {["Topwear", "Bottomwear"].map((sub) => (
                  <label key={sub} className="flex items-center cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="checkbox"
                        value={sub}
                        checked={subCategory.includes(sub.toLowerCase())}
                        onChange={toggleSubCategory}
                        className="peer appearance-none w-4 h-4 border border-gray-300 rounded-sm checked:bg-black checked:border-black transition-colors cursor-pointer"
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                    <span className="ml-4 text-sm text-gray-600 group-hover:text-black transition-colors uppercase tracking-wide">
                      {sub}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* PRICE RANGE */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 mb-5 uppercase tracking-[0.2em]">Max Price</p>
              <input
                type="range"
                min="0"
                max="10000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full h-1 bg-gray-200 rounded-none appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-4 font-medium tracking-wider">
                <span>{currencySymbols[currency]}0</span>
                <span className="text-black">
                  {currencySymbols[currency]}{convertPrice(priceRange[1]).toLocaleString()}
                </span>
              </div>
            </div>

          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <section className="flex-1 w-full">

          {/* HEADER (Desktop Title, Search, Sort) */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-12 border-b border-gray-100 pb-6">
            
            <div className="hidden lg:block">
              <Title text1="SHOP" text2="COLLECTION" />
            </div>

            <div className="flex flex-col sm:flex-row w-full xl:w-auto gap-4">
              {/* SEARCH BAR */}
              <div className="relative w-full sm:w-64 border-b border-gray-300 group hover:border-black transition-colors">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-black transition-colors" size={16} strokeWidth={1.5} />
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full bg-transparent text-sm pl-8 pr-4 py-2 focus:outline-none placeholder-gray-400"
                />
              </div>

              {/* SORT DROPDOWN */}
              <div className="relative w-full sm:w-48 border-b border-gray-300 group hover:border-black transition-colors">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="w-full bg-transparent text-sm px-2 py-2 appearance-none focus:outline-none cursor-pointer text-gray-700 uppercase tracking-wide text-[10px] font-bold"
                >
                  <option value="relevant">Sort: Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* ================= PRODUCTS GRID ================= */}
          {filterProduct.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
  {filterProduct.map((item) => {
    const basePrice = item.price;
    const finalPrice = basePrice - (basePrice * discountPercent) / 100;

    return (
      <Link 
        key={item._id} 
        to={`/product/${item._id}`} 
        className="group block focus:outline-none"
      >
        {/* ================= IMAGE CONTAINER ================= */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-xl sm:rounded-2xl">
          <img
            src={`${backendURL}${item.image[0]}`}
            alt={item.name}
            loading="lazy"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-all duration-700 ease-out"
          />
          
          {/* Subtle Hover Overlay - makes the image feel tactile */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 z-10" />

          {/* Member Discount Badge */}
          {discountPercent > 0 && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <span className="bg-black/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 tracking-[0.2em] uppercase rounded shadow-sm">
                Member Price
              </span>
            </div>
          )}
        </div>

        {/* ================= DETAILS SECTION ================= */}
        <div className="flex flex-col px-1">
          {/* Product Name */}
          <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-1.5 line-clamp-1 group-hover:text-gray-500 transition-colors duration-300">
            {item.name}
          </h4>
          
          {/* Pricing */}
          <div className="flex items-center gap-2.5 mt-0.5">
            <p className="text-sm sm:text-base font-semibold text-black">
              {currencySymbols[currency]}{convertPrice(finalPrice).toLocaleString()}
            </p>
            {discountPercent > 0 && (
              <p className="text-[11px] sm:text-xs text-gray-400 line-through font-light decoration-gray-300">
                {currencySymbols[currency]}{convertPrice(basePrice).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </Link>
    );
  })}
</div>
          ) : (
            /* ================= EMPTY STATE ================= */
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Search size={24} className="text-gray-300" strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-serif italic text-gray-900 mb-2">No items found</h3>
              <p className="text-sm text-gray-500 font-light max-w-md mb-8">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
              </p>
              <button 
                onClick={clearFilters}
                className="px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Collection;