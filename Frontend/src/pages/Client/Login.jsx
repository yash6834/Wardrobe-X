import React, { useState } from "react";
import { Login as validateLogin } from "../../validation";
import { login } from "../../api/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Imported icons

function Login() {
  const initialFormState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State for eye toggle
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

      setLoggedInUser(user);
      setShowPopup(true);
    } catch (error) {
      alert(
        error.response?.data?.msg ||
          error.response?.data?.error ||
          "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4 font-sans">
      <div className="max-w-md w-full">
        
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 mt-3 text-sm">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Input */}
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
                className={`w-full px-4 py-4 rounded-xl bg-gray-50 border ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-200"
                } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password Input with Eye Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle type here
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full pl-4 pr-12 py-4 rounded-xl bg-gray-50 border ${
                    errors.password ? "border-red-500 bg-red-50" : "border-gray-200"
                  } text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400`}
                />
                
                {/* Eye Toggle Button */}
                <button
                  type="button" // Important: prevents form submission
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
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

            <div className="flex justify-end">
              <Link
                to="/forgot-Password"
                className="text-sm font-medium text-gray-500 hover:text-black transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-900/10 transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/registration"
              className="font-bold text-gray-900 hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm text-center shadow-2xl animate-[fadeIn_0.3s_ease-out]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful</h2>
            <p className="text-gray-500 mb-8">
              Welcome back, <span className="font-bold text-gray-900">{loggedInUser?.name}</span>
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                if (loggedInUser.role === "admin") navigate("/admin/dashboard");
                else if (loggedInUser.role === "seller") navigate("/seller");
                else navigate("/");
              }}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl font-bold hover:bg-black transition-all"
            >
              Continue to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;