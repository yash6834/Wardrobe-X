import React, { useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc] px-4">
      <div className="bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 md:p-12 w-full max-w-md">
        
        {/* Back to Login Link */}
        <Link to="/login" className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors text-xs uppercase tracking-widest font-bold mb-8">
          <FaArrowLeft size={10} />
          Back to Login
        </Link>

        <div className="mb-10">
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
            Forgot Password <span className="text-gray-500">?</span>
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Enter your email and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="w-full">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
                <FaEnvelope size={14} />
              </span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-black focus:ring-0 transition-all text-sm outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
              loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-black text-white hover:bg-gray-800 active:scale-[0.98] shadow-black/10"
            }`}
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>

          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center text-xs font-bold tracking-wide transition-all animate-in fade-in slide-in-from-bottom-2 ${
              message.toLowerCase().includes("wrong") || message.toLowerCase().includes("failed")
              ? "bg-red-50 text-red-500" 
              : "bg-green-50 text-green-600"
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="mt-10 text-center">
          <p className="text-gray-400 text-[10px] uppercase tracking-widest">
            Need help? <a href="/contact" className="text-black font-bold hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;