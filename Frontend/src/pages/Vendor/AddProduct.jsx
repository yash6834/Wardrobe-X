import React, { useState } from "react";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiUploadCloud,
  FiPackage,
  FiTag,
  FiType,
  FiX
} from "react-icons/fi";

const MAX_IMAGES = 5;

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

  // Handle text input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle size stock
  const handleSizeChange = (index, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index].stock = value;
    setFormData({ ...formData, sizes: updatedSizes });
  };

  // Handle image select (max 5)
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    const updatedImages = [...images, ...files];
    setImages(updatedImages);

    const updatedPreviews = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(updatedPreviews);
  };

  // Remove image
  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);

    const updatedPreviews = updatedImages.map((file) =>
      URL.createObjectURL(file)
    );
    setPreview(updatedPreviews);
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

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
      toast.error(error?.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Add New Product
          </h1>
          <p className="text-gray-500">
            Upload up to {MAX_IMAGES} images for best results.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiPackage className="text-blue-600" />
                Basic Information
              </h2>

              <div className="space-y-4">

                <input
                  name="name"
                  type="text"
                  placeholder="Product Name"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded-lg"
                />

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Description"
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                />

              </div>
            </div>

            {/* Sizes */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">

              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiType className="text-blue-600" />
                Inventory & Sizes
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.sizes.map((s, i) => (
                  <div key={s.size}>
                    <label>Size {s.size}</label>
                    <input
                      type="number"
                      min="0"
                      value={s.stock}
                      onChange={(e) =>
                        handleSizeChange(i, Number(e.target.value))
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}
          <div className="space-y-6">

            {/* Price & Category */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">

              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiTag className="text-blue-600" />
                Pricing & Category
              </h2>

              <div className="space-y-3">

                <input
                  name="price"
                  type="number"
                  placeholder="Price"
                  onChange={handleChange}
                  required
                  className="w-full border p-3 rounded"
                />

                <input
                  name="category"
                  placeholder="Category"
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />

                <input
                  name="subCategory"
                  placeholder="Sub Category"
                  onChange={handleChange}
                  className="w-full border p-3 rounded"
                />

              </div>

            </div>

            {/* Image Upload */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">

              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiUploadCloud className="text-blue-600" />
                Media ({images.length}/{MAX_IMAGES})
              </h2>

              {/* Upload Box */}
              {images.length < MAX_IMAGES && (
                <div className="relative border-2 border-dashed p-6 rounded cursor-pointer">

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />

                  <div className="text-center">
                    <FiUploadCloud className="mx-auto text-3xl text-gray-400" />
                    <p>Click to upload</p>
                  </div>

                </div>
              )}

              {/* Preview */}
              {preview.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">

                  {preview.map((img, index) => (
                    <div key={index} className="relative">

                      <img
                        src={img}
                        className="h-24 w-full object-cover rounded"
                        alt=""
                      />

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                      >
                        <FiX size={14} />
                      </button>

                    </div>
                  ))}

                </div>
              )}

            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold"
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