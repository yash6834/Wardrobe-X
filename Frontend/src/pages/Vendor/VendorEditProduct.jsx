import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  ArrowLeft, 
  Save, 
  Package, 
  DollarSign, 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  UploadCloud,
  Tag
} from "lucide-react";

const VendorEditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    subCategory: "",
    description: "",
    sizes: [
      { size: "S", stock: 0 },
      { size: "M", stock: 0 },
      { size: "L", stock: 0 },
      { size: "XL", stock: 0 },
    ],
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/vendor/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
          },
        });

        const product = res.data;

        setFormData({
          name: product.name,
          price: product.price,
          category: product.category,
          subCategory: product.subCategory,
          description: product.description,
          sizes: product.sizes,
        });

        setExistingImages(product.image || []);
      } catch (error) {
        toast.error("Failed to load product");
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSizeChange = (index, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index].stock = value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      if (key === "sizes") {
        data.append("sizes", JSON.stringify(formData.sizes));
      } else {
        data.append(key, formData[key]);
      }
    });

    images.forEach((img) => data.append("image", img));

    try {
      await api.put(`/api/vendor/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      });

      toast.success("Product updated successfully");
      navigate("/seller/products");
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  /* ================= UI HELPER CLASSES ================= */
  const inputClass = "w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-gray-700";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="min-h-screen bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500 mt-1">Update details, stock, and media</p>
            </div>
          </div>
          <button 
            onClick={handleSubmit}
            className="hidden sm:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-500" />
                Product Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className={labelClass}>Product Name</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className={inputClass} 
                      placeholder="e.g. Vintage Cotton T-Shirt"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Category</label>
                    <div className="relative">
                      <Layers className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange} 
                        className={inputClass}
                        placeholder="e.g. Men's Wear"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Sub-Category</label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                      <input 
                        name="subCategory" 
                        value={formData.subCategory} 
                        onChange={handleChange} 
                        className={inputClass}
                        placeholder="e.g. T-Shirts"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      className={`${inputClass} min-h-[150px]`}
                      placeholder="Describe your product..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-indigo-500" />
                Product Media
              </h3>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 block">Current Images</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                        <img 
                          src={`http://localhost:3000${img}`} 
                          alt="" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              <div className="relative group">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageSelect} 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 group-hover:bg-indigo-50 group-hover:border-indigo-300 transition-all">
                  <div className="p-3 bg-white rounded-full shadow-sm mb-3">
                    <UploadCloud className="w-6 h-6 text-indigo-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Click to upload new images</p>
                  <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </div>
              </div>

              {/* New Previews */}
              {preview.length > 0 && (
                <div className="mt-6">
                   <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider mb-3 block">New Selected Images</span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                    {preview.map((img, i) => (
                      <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-emerald-500/50 relative shadow-sm">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - Price & Stock */}
          <div className="space-y-6">
            
            {/* Price Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
               <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-indigo-500" />
                Pricing
              </h3>
              <div>
                <label className={labelClass}>Selling Price</label>
                <div className="relative">
                  <span className="absolute left-4 top-3.5 text-gray-500 font-bold">$</span>
                  <input 
                    name="price" 
                    type="number" 
                    value={formData.price} 
                    onChange={handleChange} 
                    className={`${inputClass} pl-8`}
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            {/* Inventory Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-500" />
                Inventory
              </h3>
              
              <div className="space-y-4">
                {formData.sizes.map((s, i) => (
                  <div key={s.size} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg font-bold text-gray-700 shadow-sm border border-gray-200">
                        {s.size}
                      </div>
                      <span className="text-sm font-medium text-gray-600">Stock</span>
                    </div>
                    <input
                      type="number"
                      value={s.stock}
                      onChange={(e) => handleSizeChange(i, Number(e.target.value))}
                      className="w-24 text-center py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Submit Button (Visible only on small screens) */}
            <button 
              onClick={handleSubmit}
              className="w-full flex sm:hidden items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-xl font-medium shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              Save Changes
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorEditProduct;