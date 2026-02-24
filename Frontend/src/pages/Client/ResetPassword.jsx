// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/api";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 State for eye toggle

  const handleReset = async (e) => {
    e.preventDefault();
    setIsError(false);
    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, { newPassword });
      setMessage(res.data.message);
      setIsError(false);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired link");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
          
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaLock className="text-gray-900 text-xl" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Reset Password
            </h1>
            <p className="text-gray-500 mt-3 text-sm">
              Please enter your new secure password below.
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                New Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                
                <input
                  type={showPassword ? "text" : "password"} // 👈 Toggle type
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-4 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all placeholder-gray-400 font-medium"
                />

                {/* Eye Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 transition-colors focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg shadow-gray-900/10 transform transition hover:-translate-y-0.5 active:translate-y-0"
            >
              Update Password
            </button>
          </form>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-sm text-center font-medium ${
              isError 
                ? "bg-red-50 text-red-600 border border-red-100" 
                : "bg-green-50 text-green-600 border border-green-100"
            }`}>
              {message}
            </div>
          )}

          <div className="mt-8 text-center">
            <button 
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;