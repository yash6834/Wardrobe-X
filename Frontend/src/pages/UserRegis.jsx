// src/Pages/RegisForm/UserRegis.jsx
import React, { useState } from "react";
import { register } from "../api/api";
import { validateUserForm } from "../validation";
import { Link, useNavigate } from "react-router-dom";

function UserRegis() {
  const initialFormState = { name: "", email: "", phone: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateUserForm(formData);
    setErrors(validationErrors);
    if (!isValid) return;

    try {
      const response = await register(formData);
      alert(response.data.msg || "Registration successful!");
      setFormData(initialFormState);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.error || "Already Registered");
    }
  };

  return (
      <main className="pt-24 px-5"> 
    <div className="flex justify-center items-center min-h-screen font-sans">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
      >
        {/* Heading */}
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
          Sign Up
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Join the Men’s style community
        </p>

        {/* Name */}
        <div className="mb-5">
          <label className="block mb-1 font-medium text-gray-700">Name :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Full Name"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-400"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block mb-1 font-medium text-gray-700">Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-400"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-5">
          <label className="block mb-1 font-medium text-gray-700">
            Phone Number :
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter 10 Digit Number"
            maxLength={10}
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-400"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Password :
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none placeholder-gray-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Login redirect */}
        <p className="text-sm mb-4 text-gray-500 text-center">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-yellow-600 font-medium hover:underline"
          >
            Log In
          </Link>
        </p>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg hover:bg-yellow-400 transition-all shadow-md font-semibold tracking-wide"
        >
          Register
        </button>
      </form>
    </div>
    </main>
  );
}

export default UserRegis;
