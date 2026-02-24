import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Package, Search, Plus, IndianRupee, MoreVertical } from "lucide-react";
import api from "../../api/api";
import { toast } from "react-toastify";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/admin/products");
      if (res.data.success && res.data.products) {
        const approvedProducts = res.data.products.filter(
          (product) => product.isApproved === true
        );
        setProducts(approvedProducts);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    if (!window.confirm("Move this product to trash?")) return;

    try {
      const res = await api.delete(`/api/admin/products/${id}`);
      if (res.data.success) {
        setProducts((prev) => prev.filter((item) => item._id !== id));
        toast.success("Product deleted successfully");
      }
    } catch (err) {
      toast.error("Error deleting product");
    }
  };

  // Logic for search filtering
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto p-6 md:p-8 space-y-8">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            Live Inventory
          </h2>
          <p className="text-zinc-500 font-medium mt-1">
            Browse and manage your active store listings.
          </p>
        </div>
        
       
      </div>

      {/* SEARCH BAR */}
      <div className="relative group max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
        <input
          type="text"
          placeholder="Search inventory..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all text-sm"
        />
      </div>

      {/* PRODUCT GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-zinc-200">
          <Package className="mx-auto text-zinc-200 mb-4" size={48} />
          <p className="text-zinc-500 font-bold text-lg">No products found</p>
          <p className="text-zinc-400 text-sm">Try adjusting your search or add a new item.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((item) => (
            <div
              key={item._id}
              className="group bg-white rounded-[2rem] border border-zinc-100 overflow-hidden hover:shadow-2xl hover:shadow-zinc-200/50 transition-all duration-500 flex flex-col"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[4/5] bg-zinc-50 overflow-hidden">
                <img
                  src={
                    item.image
                      ? `http://localhost:3000${item.image}`
                      : "https://via.placeholder.com/400"
                  }
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-zinc-900 text-[10px] font-black px-3 py-1.5 rounded-full border border-white/20 shadow-sm uppercase tracking-tighter">
                    Active
                  </span>
                </div>
              </div>

              {/* PRODUCT DETAILS */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.category || "General"}</p>
                  <h3 className="text-lg font-bold text-zinc-900 line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1 text-zinc-900 mt-2 font-black text-xl">
                    <span className="text-xs font-normal text-zinc-400">₹</span>
                    {item.price.toLocaleString()}
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-auto pt-4 border-t border-zinc-50 flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/product/edit/${item._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-zinc-900 text-white rounded-xl text-xs font-bold hover:bg-zinc-800 transition-all active:scale-95"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="w-12 flex items-center justify-center bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;