import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUploadCloud, FiPackage, FiTag, FiDollarSign, FiType } from "react-icons/fi";

const VendorAddProduct = () => {
  const navigate = useNavigate();

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
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
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

    images.forEach((img) => data.append("image", img));

    try {
      await api.post("/api/vendor/products", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("vendorToken")}`,
        },
      });
      toast.success("Product added successfully");
      navigate("/seller/products");
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Add New Product</h1>
          <p className="text-gray-500">Fill in the details to list your product in the marketplace.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiPackage className="text-blue-600" /> Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Premium Cotton Oversized Tee"
                    onChange={handleChange}
                    required
                    className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe the material, fit, and style..."
                    onChange={handleChange}
                    className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiType className="text-blue-600" /> Inventory & Sizes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.sizes.map((s, i) => (
                  <div key={s.size} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Size {s.size}</label>
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={(e) => handleSizeChange(i, Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 p-2 rounded focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Section */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiTag className="text-blue-600" /> Pricing & Category
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FiDollarSign className="text-xs" /> Price
                  </label>
                  <input
                    name="price"
                    type="number"
                    placeholder="0.00"
                    onChange={handleChange}
                    required
                    className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    name="category"
                    placeholder="e.g. Clothing"
                    onChange={handleChange}
                    className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                  <input
                    name="subCategory"
                    placeholder="e.g. T-Shirts"
                    onChange={handleChange}
                    className="w-full border-gray-200 border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiUploadCloud className="text-blue-600" /> Media
              </h2>
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors group cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <FiUploadCloud className="mx-auto text-3xl text-gray-400 group-hover:text-blue-500 mb-2" />
                  <p className="text-sm text-gray-600">Click or drag to upload</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>

              {preview.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {preview.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="preview"
                      className="h-20 w-full object-cover rounded-lg border border-gray-100 shadow-sm"
                    />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95"
            >
              Publish Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorAddProduct;