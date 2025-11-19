import React, { useState } from "react";
import { Login as validateLogin } from "../validation";
import { login } from "../api/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const initialFormState = { email: "", password: "" };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 /*  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors: validationErrors } = validateLogin(formData);
    setErrors(validationErrors);

    if (!isValid) return;

    try {
      const response = await login(formData);
      alert(response.data.msg || "Login Successful!");

      // Save login info
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email || "");
      localStorage.setItem("userName", user.name || "");

      // ✅ Notify Navbar
      window.dispatchEvent(new Event("storage"));

      setFormData(initialFormState);
      setErrors({});

      const role = response.data.user.role;
      if (role === "admin") {
        navigate("/Admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const { msg, error: apiError } = error.response.data;
        alert(msg || apiError || "Login failed");
      } else {
        alert("Something went wrong. Please try again.");
      }
    }
  };
 */
const handleSubmit = async (e) => {
  e.preventDefault();

  const { isValid, errors: validationErrors } = validateLogin(formData);
  setErrors(validationErrors);

  if (!isValid) return;

  try {
    const response = await login(formData);
    alert(response.data.msg || "Login Successful!");

    const { user } = response.data; // ✅ fix here

    // ✅ Save login info
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", user.email || "");
    localStorage.setItem("userName", user.name || "");

    // ✅ Notify Navbar about login status
    window.dispatchEvent(new Event("storage"));

    setFormData(initialFormState);
    setErrors({});

    // ✅ Redirect by role
    const role = user.role;
    if (role === "admin") {
      navigate("/Admin");
    } else {
      navigate("/");
    }
  } catch (error) {
    if (error.response && error.response.data) {
      const { msg, error: apiError } = error.response.data;
      alert(msg || apiError || "Login failed");
    } else {
      alert("Something went wrong. Please try again.");
    }
  }
};

  return (
    <div className="min-h-screen w-full flex justify-center items-center font-sans">
     
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200"
      >
        <h1 className="text-3xl font-extrabold text-center mb-6 text-gray-900 tracking-wide">
          Log In
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          Welcome back to Men’s Style
        </p>

        <div className="mb-5">
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email :
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@gmail.com"
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
            Password :
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter Password"
            className="w-full px-4 py-3 border rounded-lg bg-gray-5 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <Link className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition" to="/forgot-Password">Forgot-Password?</Link>

        <p className="text-sm mb-4 text-gray-500 text-center">
          Don’t have an account?{" "}
          <Link to="/registration" className="text-yellow-600 font-medium hover:underline">
            Register
          </Link>
        </p>

        <button
          type="submit"
          id="submit"
          className="w-full bg-yellow-500 text-gray-900 py-3 rounded-lg hover:bg-yellow-400 transition-all shadow-md font-semibold tracking-wide"
        >
          Log In
        </button>
      </form>
      
    </div>
  );
}

export default Login;
