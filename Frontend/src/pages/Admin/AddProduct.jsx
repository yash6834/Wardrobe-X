import React, { useState } from 'react';
import api from '../../api/api';
import { validateProductForm } from '../../validation';

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    size: '',
    stock: '',
    image: null
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProduct({ ...product, image: file });
      setImagePreview(URL.createObjectURL(file));
      setErrors({ ...errors, image: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateProductForm(product);
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('subCategory', product.subCategory);
      formData.append('stock', product.stock);
      //formData.append('size', JSON.stringify(product.size.split(',').map(s => s.trim())));

      if (product.image) formData.append('image', product.image);

      await api.post('/api/product', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Product added successfully!');

      setProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        subCategory: '',
        //size: '',
        stock: '',
        image: null
      });
      setErrors({});
      setImagePreview(null);
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || '❌ Error adding product');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="w-full max-w-3xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-center py-5">
          <h2 className="text-2xl font-bold">🛍 Add New Product</h2>
          <p className="text-sm opacity-90">Manage your store inventory</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Product Name"
              name="name"
              value={product.name}
              onChange={handleChange}
              error={errors.name}
            />
            <InputField
              label="Price (₹)"
              name="price"
              type="number"
              value={product.price}
              onChange={handleChange}
              error={errors.price}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={product.description}
              onChange={handleChange}
              className={`w-full border p-3 rounded-lg focus:ring-2 focus:outline-none ${
                errors.description
                  ? 'border-red-500 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-400'
              }`}
              placeholder="Describe your product..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Category"
              name="category"
              value={product.category}
              onChange={handleChange}
              error={errors.category}
            />
            <InputField
              label="Subcategory"
              name="subCategory"
              value={product.subCategory}
              onChange={handleChange}
              error={errors.subCategory}
            />
          </div>

          {/* Size & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/*   
            <InputField

              
  label="Available Sizes (comma-separated)"
  name="size"
  value={product.size}
  onChange={handleChange}
  error={errors.size}
/>
 */}
<InputField
              label="Stock Quantity"
              name="stock"
              type="number"
              value={product.stock}
              onChange={handleChange}
              error={errors.stock}
            />
          </div>

          {/* Image Upload */}
          <div
            className={`border p-4 rounded-lg transition ${
              errors.image ? 'border-red-400 bg-red-50' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <label className="block text-gray-600 font-medium mb-2">Upload Product Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
            {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

            {imagePreview && (
              <div className="mt-3 text-center">
                <p className="text-gray-700 text-sm mb-1">Preview:</p>
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 w-40 object-cover rounded-lg mx-auto border shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

/* Reusable Input Field Component */
const InputField = ({ label, name, type = 'text', value, onChange, error }) => (
  <div>
    <label className="block text-gray-700 font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={label}
      className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
        error ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-blue-400'
      }`}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default AddProduct;
