import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { validateProductForm } from '../../validation';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    size: '',
    stock: '',
    image: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/api/product/${id}`);
        const data = res.data;

        console.log("Fetched sizes:", data); // Debug

        setProduct({
          name: data.name || '',
          description: data.description || '',
          price: data.price || '',
          category: data.category || '',
          subCategory: data.subCategory || '',
          size: Array.isArray(data.size) ? data.size.join(',') : data.size || '',
          stock: data.stock || '',
          image: null, // leave null initially
        });

        setImagePreview(data.image || null);

      } catch (err) {
        console.error(err);
        alert('❌ Failed to fetch product data');
      }
    };

    fetchProduct();
  }, [id]);

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
      console.log("vaidation error");
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
      // Convert comma-separated sizes to array
      /* formData.append(
        'size',
        JSON.stringify(product.size.split(',').map(s => s.trim()))
      ); */

      if (product.image) {
        formData.append('image', product.image);
      }

      await api.put(`/api/product/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('✅ Product updated successfully!');
      navigate('/admin/view-products');
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || '❌ Error updating product');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-center py-4 rounded-t-2xl">
          <h2 className="text-2xl font-semibold tracking-wide">✏️ Edit Product</h2>
          <p className="text-sm opacity-90">Update product details</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Name & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={product.name}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
                  errors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={product.price}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
                  errors.price ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                }`}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <textarea
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleChange}
              rows="3"
              className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
                errors.description ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
              }`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={product.category}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
                  errors.category ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                }`}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
            <div>
              <input
                type="text"
                name="subCategory"
                placeholder="Subcategory"
                value={product.subCategory}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
                  errors.subCategory ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                }`}
              />
              {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
            </div>
          </div>

          {/* Size & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={product.stock}
                onChange={handleChange}
                className={`border p-3 rounded-lg w-full focus:ring-2 focus:outline-none ${
                  errors.stock ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-yellow-400'
                }`}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          {/* Image Upload */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-4 border p-4 rounded-lg transition ${
              errors.image ? 'border-red-400 bg-red-50' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <label className="text-gray-600 font-medium w-full sm:w-1/3 text-center sm:text-left">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full sm:w-2/3 file:mr-3 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-white hover:file:bg-yellow-600"
            />
          </div>
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-3 text-center">
              <p className="text-gray-700 text-sm mb-1">Preview:</p>
              <img src={imagePreview} alt="Preview" className="h-40 w-40 object-cover rounded-lg mx-auto border" />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-700 transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
