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
  Tag,
  X,
  Plus,
  Info
} from "lucide-react";

const MAX_IMAGES = 5;

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
      } catch {
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
    const updated = [...formData.sizes];
    updated[index].stock = value;
    setFormData({ ...formData, sizes: updated });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const total = existingImages.length + images.length + files.length;
    if (total > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }
    const updatedImages = [...images, ...files];
    setImages(updatedImages);
    const updatedPreview = updatedImages.map((file) => URL.createObjectURL(file));
    setPreview(updatedPreview);
  };

  const removeExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  const removeNewImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    const updatedPreview = updated.map((file) => URL.createObjectURL(file));
    setPreview(updatedPreview);
  };

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
    data.append("existingImages", JSON.stringify(existingImages));
    images.forEach((img) => data.append("image", img));

    try {
      await api.put(`/api/vendor/products/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      });
      toast.success("Product updated successfully");
      navigate("/seller/products");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-600"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-sm text-gray-500">Update your product details and inventory</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <FileText size={18} />
                <h2 className="font-semibold text-gray-800">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Enter product title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
                    placeholder="Describe your product..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* Organization & Stock */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <Layers size={18} />
                <h2 className="font-semibold text-gray-800">Category & Inventory</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                  <input
                    name="subCategory"
                    value={formData.subCategory}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Sizes & Stock Levels</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.sizes.map((sizeObj, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2 text-center">{sizeObj.size}</p>
                      <input
                        type="number"
                        value={sizeObj.stock}
                        onChange={(e) => handleSizeChange(index, Number(e.target.value))}
                        className="w-full bg-white border border-gray-200 rounded text-center py-1 focus:ring-2 focus:ring-indigo-500 outline-none"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Media Management */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-indigo-600">
                  <ImageIcon size={18} />
                  <h2 className="font-semibold text-gray-800">Product Media</h2>
                </div>
                <span className="text-xs text-gray-400">{existingImages.length + images.length} / {MAX_IMAGES} images</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {/* Existing Images */}
                {existingImages.map((img, index) => (
                  <div key={`exist-${index}`} className="group relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                    <img src={`http://localhost:3000${img}`} className="h-full w-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeExistingImage(index)} className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* New Preview Images */}
                {preview.map((img, index) => (
                  <div key={`new-${index}`} className="group relative aspect-square rounded-lg overflow-hidden border-2 border-dashed border-indigo-200">
                    <img src={img} className="h-full w-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeNewImage(index)} className="bg-red-500 text-white p-1.5 rounded-full hover:scale-110 transition-transform">
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Upload Trigger */}
                {existingImages.length + images.length < MAX_IMAGES && (
                  <label className="cursor-pointer aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-indigo-600">
                    <Plus size={24} />
                    <span className="text-[10px] font-medium">Add Image</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-6">
              <div className="flex items-center gap-2 mb-4 text-indigo-600">
                <DollarSign size={18} />
                <h2 className="font-semibold text-gray-800">Pricing</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6 flex gap-3">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  Make sure your inventory counts are accurate. Changes will be visible to customers immediately after saving.
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95"
              >
                <Save size={18} />
                Save Changes
              </button>
              
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full mt-3 bg-white border border-gray-200 text-gray-600 py-3.5 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorEditProduct;