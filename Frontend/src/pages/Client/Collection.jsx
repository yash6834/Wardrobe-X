import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api"; 
import { assets } from "../../assets/frontend_assets/assets";
import Title from "../../components/Title";
import PolicySection from "../../components/Policy";
import { Search, ChevronDown, SlidersHorizontal } from "lucide-react"; // Professional icon set

const Collection = () => {
  const [products, setProducts] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortOption, setSortOption] = useState("relevant");
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  const backendURL = "http://localhost:3000"; 

  // 🔹 Fetch products (LOGIC PRESERVED)
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

  // 🔹 Fetch logged-in user (LOGIC PRESERVED)
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

  // 🔥 Get active membership discount (LOGIC PRESERVED)
  const activeMembership = user?.memberships?.find(
    (m) => m.isActive === true && new Date(m.endDate) > new Date()
  );
  const discountPercent = activeMembership?.discountPercent || 0;

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

  // 🔹 Filter & sort (LOGIC PRESERVED)
  useEffect(() => {
    let filtered = [...products];
    const normalizeText = (text) => text.toLowerCase().replace(/[-_\s]/g, "");

    if (searchText.trim() !== "") {
      const normalizedSearch = normalizeText(searchText);
      filtered = filtered.filter((item) =>
        normalizeText(item.name).includes(normalizedSearch)
      );
    }

    if (searchText.trim() === "") {
      if (category.length > 0)
        filtered = filtered.filter((item) => category.includes(item.category));
      if (subCategory.length > 0)
        filtered = filtered.filter((item) => subCategory.includes(item.subCategory));
    }

    if (sortOption === "low-high") filtered.sort((a, b) => a.price - b.price);
    if (sortOption === "high-low") filtered.sort((a, b) => b.price - a.price);

    setFilterProduct(filtered);
  }, [products, category, subCategory, sortOption, searchText]);

  return (
    <div className="bg-[#fdfdfd] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 flex flex-col md:flex-row gap-12">
        
        {/* Sidebar Filters */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-32 space-y-10">
            <div className="flex items-center gap-2 mb-6">
              <SlidersHorizontal size={16} className="text-gray-900" />
              <h3 className="text-xs font-black tracking-widest uppercase text-gray-900">Filters</h3>
            </div>

            {/* Categories Group */}
            <div className="border-t border-gray-100 pt-6">
              <p className="mb-4 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Collections</p>
              <div className="space-y-3">
                {["Men", "Women", "Kids"].map((cat) => (
                  <label key={cat} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      value={cat} 
                      onChange={toggleCategory} 
                      className="w-3.5 h-3.5 border-gray-300 rounded-sm accent-black"
                    />
                    <span className="ml-3 text-sm text-gray-500 group-hover:text-black transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Group */}
            <div className="border-t border-gray-100 pt-6">
              <p className="mb-4 text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase">Category</p>
              <div className="space-y-3">
                {["Topwear", "Bottomwear"].map((sub) => (
                  <label key={sub} className="flex items-center group cursor-pointer">
                    <input 
                      type="checkbox" 
                      value={sub} 
                      onChange={toggleSubCategory} 
                      className="w-3.5 h-3.5 border-gray-300 rounded-sm accent-black"
                    />
                    <span className="ml-3 text-sm text-gray-500 group-hover:text-black transition-colors">{sub}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Products Area */}
        <section className="flex-1">
          {/* Top Bar: Search & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div className="relative w-full md:max-w-md group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search our catalog..."
                className="w-full bg-gray-50 border-none rounded-full py-3 pl-12 pr-6 text-sm focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-4 self-end md:self-auto">
              <div className="relative">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="appearance-none bg-transparent pl-2 pr-8 py-2 text-xs font-bold uppercase tracking-widest cursor-pointer outline-none"
                >
                  <option value="relevant">Relevant</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <div className="flex justify-center mb-10">
            <Title text1="SHOP" text2="COLLECTION" />
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
            {filterProduct.map((item) => {
              const productImage = Array.isArray(item.image) ? item.image : [item.image];
              const discountedPrice = item.price - (item.price * discountPercent) / 100;

              return (
                <Link
                  to={`/product/${item._id}`}
                  key={item._id}
                  className="group flex flex-col"
                >
                  {/* Image Holder */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm mb-4">
                    <img
                      src={
                        productImage[0]
                          ? `${backendURL}${productImage[0]}`
                          : "https://via.placeholder.com/600x800"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {discountPercent > 0 && (
                      <div className="absolute top-0 left-0 bg-black text-white text-[9px] font-bold px-2.5 py-1.5 uppercase tracking-tighter">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex flex-col items-start px-1">
                    <p className="text-[13px] font-medium text-gray-900 group-hover:text-gray-500 transition-colors uppercase tracking-tight truncate w-full">
                      {item.name}
                    </p>
                    
                    <div className="mt-1 flex items-center gap-2">
                      {discountPercent > 0 ? (
                        <>
                          <span className="text-sm font-bold text-black">₹{Math.round(discountedPrice).toLocaleString()}</span>
                          <span className="text-[11px] text-gray-400 line-through">₹{item.price.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-black">₹{item.price.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {filterProduct.length === 0 && (
            <div className="py-40 text-center">
              <p className="text-gray-400 font-light italic">No results found for your search.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Collection;