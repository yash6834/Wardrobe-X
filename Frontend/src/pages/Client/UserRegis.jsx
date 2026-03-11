import React, { useState } from "react";
import { register } from "../../api/api";
import { validateUserForm } from "../../validation";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaPhoneAlt, FaLock, FaStore, FaEye, FaEyeSlash } from "react-icons/fa";

function UserRegis() {
  const initialFormState = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
    brandName: "", // 👈 seller only
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false); // 👈 State for eye toggle
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // clear brandName when switching to user
      ...(name === "role" && value === "user" ? { brandName: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateUserForm(formData);

    setErrors(validationErrors);
    if (!isValid) return;

    try {
      const response = await register(formData);
      alert(response.data.msg || "Registration successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Already Registered");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 font-sans">
    <div className="max-w-md w-full">
      
      {/* Card */}
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Join Wardrobe X today
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 border ${
                errors.name ? "border-red-500 bg-red-50" : "border-gray-200"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-2 ml-1">{errors.name}</p>}

          {/* Role Select */}
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all cursor-pointer hover:bg-gray-100 appearance-none"
            >
              <option value="user">User</option>
              <option value="seller">Seller</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>

          {/* Brand Name (Seller Only) */}
          {formData.role === "seller" && (
            <div className="relative animate-[fadeIn_0.3s_ease-out]">
              <FaStore className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="brandName"
                placeholder="Brand / Store Name"
                value={formData.brandName}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 border ${
                  errors.brandName ? "border-red-500 bg-red-50" : "border-gray-200"
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
              />
            </div>
          )}
          {errors.brandName && <p className="text-red-500 text-xs mt-2 ml-1">{errors.brandName}</p>}

          {/* Email */}
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 border ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-2 ml-1">{errors.email}</p>}

          {/* Phone */}
          <div className="relative">
            <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              maxLength={10}
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full pl-11 pr-4 py-3 rounded-full bg-gray-50 border ${
                errors.phone ? "border-red-500 bg-red-50" : "border-gray-200"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-2 ml-1">{errors.phone}</p>}

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-11 pr-12 py-3 rounded-full bg-gray-50 border ${
                errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
            >
              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-2 ml-1">{errors.password}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-full shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0 mt-4"
          >
            Create Account
          </button>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-gray-900 hover:underline">
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  </div>
);
}

export default UserRegis;