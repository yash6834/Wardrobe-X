import React, { useState } from "react";
import { Login as validateLogin } from "../../validation";
import { login } from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const initialFormState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setServerError("");
    setSuccessMessage("");

    const { isValid, errors: validationErrors } = validateLogin(formData);
    setErrors(validationErrors);
    if (!isValid) return;

    try {
      const response = await login(formData);
      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", user.role);

      if (user.role === "seller") {
        localStorage.setItem("vendorToken", token);
        localStorage.setItem("vendorBrand", user.brandName);
      }

      window.dispatchEvent(new Event("storage"));

      setFormData(initialFormState);
      setErrors({});
      setSuccessMessage(`Welcome back, ${user.name}! You are logged in.`);

      setTimeout(() => {
        if (user.role === "admin") navigate("/admin/dashboard");
        else if (user.role === "seller") navigate("/seller");
        else navigate("/");
      }, 1500);

    } catch (error) {
      setServerError(
        error.response?.data?.msg ||
        error.response?.data?.error ||
        "Incorrect email or password"
      );
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 font-sans">
    <div className="max-w-md w-full">
      <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-10">
        
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Sign in to continue to your account
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium text-center">
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium text-center">
            {serverError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-full bg-gray-50 border ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
              } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full pl-4 pr-12 py-3 rounded-full bg-gray-50 border ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all placeholder-gray-400`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end">
            <Link
              to="/forgot-Password"
              className="text-sm font-medium text-gray-500 hover:text-black hover:underline transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-full shadow-md transform transition hover:-translate-y-0.5 active:translate-y-0"
          >
            Sign In
          </button>
        </form>

        {/* Register Link */}
        <p className="mt-8 text-center text-sm text-gray-500">
          Don’t have an account?{" "}
          <Link
            to="/registration"
            className="font-bold text-gray-900 hover:underline"
          >
            Register now
          </Link>
        </p>
      </div>
    </div>
  </div>
);
}

export default Login;