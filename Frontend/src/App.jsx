import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

/* ===== Public Pages ===== */
import Home from "./pages/Client/Home.jsx";
import Collection from "./pages/Client/Collection";
import About from "./pages/Client/About";
import Contact from "./pages/Client/Contact";
import Login from "./pages/Client/Login";
import UserRegis from "./pages/Client/UserRegis";
import Cart from "./pages/Client/Cart";
import Product from "./pages/Client/Product";
import Placeorder from "./pages/Client/Placeorder";
import MyOrders from "./pages/Client/MyOrders";
import MyProfile from "./pages/Client/MyProfile";
import ForgotPassword from "./pages/Client/ForgotPassword";
import ResetPassword from "./pages/Client/ResetPassword";
import CreateReturn from "./components/CreateReturn.jsx";
import MyReturns from "./pages/Client/MyReturns.jsx";

/* ===== Layouts ===== */
import MainLayout from "./mainLayout";
import AdminLayout from "./pages/Admin/AdminLayou";
import VendorLayout from "./pages/Vendor/VendorLayoout.jsx";

/* ===== Admin Pages ===== */
import Dashboard from "./pages/Admin/DashBoard";
import ViewProducts from "./pages/Admin/ViewProduct.jsx";
import ViewOrders from "./pages/Admin/ViewOrders";
import EditProduct from "./pages/Admin/EditProduct";
import ReturnsAdmin from "./pages/Admin/ReturnAdmin.jsx";
import Vendor from "./pages/Admin/Vendors.jsx";
import PendingApprovals from "./pages/Admin/PendingApprovals.jsx";
import Revenue from "./pages/Admin/Revenue.jsx";
import Membership from "./pages/Admin/Membership.jsx";

/* ===== CMS Pages (NEW) ===== */
import Banners from "./pages/Admin/CMS/Banner.jsx";

/* ===== Vendor Pages ===== */
import VendorDashboard from "./pages/Vendor/VendorDashboard.jsx";
import VendorViewProducts from "./pages/Vendor/ViewProduct";
import VendorOrders from "./pages/Vendor/Orders.jsx";
import VendorPayouts from "./pages/Vendor/PayOut.jsx";
import VendorAnalytics from "./pages/Vendor/Analytics.jsx";
import VendorProducts from "./pages/Vendor/VendorProduct.jsx";
import VendorAddProduct from "./pages/Vendor/AddProduct.jsx";
import VendorEditProduct from "./pages/Vendor/VendorEditProduct.jsx";
import VendorReturns from "./pages/Vendor/Return.jsx";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/collection" element={<MainLayout><Collection /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/product/:productId" element={<MainLayout><Product /></MainLayout>} />
        <Route path="/placeorder" element={<MainLayout><Placeorder /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/registration" element={<MainLayout><UserRegis /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/myorders" element={<MainLayout><MyOrders /></MainLayout>} />
        <Route path="/myprofile" element={<MainLayout><MyProfile /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password/:token" element={<MainLayout><ResetPassword /></MainLayout>} />

        {/* ================= RETURNS (USER) ================= */}
        <Route path="/return/:orderId" element={<MainLayout><CreateReturn /></MainLayout>} />
        <Route path="/my-returns" element={<MainLayout><MyReturns /></MainLayout>} />

        {/* ================= ADMIN ROUTES ================= */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="view-products" element={<ViewProducts />} />
          <Route path="orders" element={<ViewOrders />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
          <Route path="vendor" element={<Vendor />} />
          <Route path="pending" element={<PendingApprovals />} />
          <Route path="products" element={<ViewProducts />} />
          <Route path="revenue" element={<Revenue />} />
          <Route path="membership-plans" element={<Membership />} />
          <Route path="returns" element={<ReturnsAdmin />} />

          {/* ===== CMS ROUTES (NEW) ===== */}
          <Route path="cms/banners" element={<Banners />} />

        </Route>

        {/* ================= VENDOR ROUTES ================= */}
        <Route path="/seller" element={<VendorLayout />}>

          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="products" element={<VendorViewProducts />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="payouts" element={<VendorPayouts />} />
          <Route path="analytics" element={<VendorAnalytics />} />
          <Route path="product" element={<VendorProducts />} />
          <Route path="addproduct" element={<VendorAddProduct />} />
          <Route path="editproduct/:id" element={<VendorEditProduct />} />
          <Route path="returns" element={<VendorReturns />} />

        </Route>

      </Routes>
    </>
  );
};

export default App;
