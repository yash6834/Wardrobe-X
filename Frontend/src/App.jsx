import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import UserRegis from "./pages/UserRegis";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import Placeorder from "./pages/Placeorder";
import { ToastContainer } from "react-toastify";

// Admin Pages
import Dashboard from "./pages/Admin/DashBoard";
import AddProduct from "./pages/Admin/AddProduct";
import ViewProducts from "./pages/Admin/ViewProduct";
import ViewOrders from "./pages/Admin/ViewOrders";
import MainLayout from "./mainLayout"
import EditProduct from "./pages/Admin/EditProduct";
import MyOrders from "./pages/MyOrders";
import MyProfile from "./pages/MyProfile";
import AdminLayout from "./pages/Admin/AdminLayou";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Pages with MainLayout */}
        <Route path="/" element={<MainLayout><Home /></MainLayout>} />
        <Route path="/collection" element={<MainLayout><Collection /></MainLayout>} />
        <Route path="/about" element={<MainLayout><About /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/api/product/:productId" element={<MainLayout><Product /></MainLayout>} />
        <Route path="/placeorder" element={<MainLayout><Placeorder /></MainLayout>} />
        <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
        <Route path="/registration" element={<MainLayout><UserRegis /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><Cart /></MainLayout>} />
        <Route path="/myorders" element={<MainLayout><MyOrders /></MainLayout>} />
        <Route path="/myprofile" element={<MainLayout><MyProfile /></MainLayout>} />
        <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
        <Route path="/reset-password/:token" element={<MainLayout><ResetPassword /></MainLayout>} />


        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} /> 
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="view-products" element={<ViewProducts />} />
          <Route path="view-orders" element={<ViewOrders />} />
          <Route path="product/edit/:id" element={<EditProduct />} />
        </Route>
       {/*  
        <Route path="/admin" element={<Dashboard />}>
          <Route path="add-product" element={<AddProduct />} />
          <Route path="view-products" element={<ViewProducts />} />
          <Route path="view-orders" element={<ViewOrders />} />
          <Route path="/admin/products" element={<ViewProducts />} />
          <Route path="/admin/product/edit/:id" element={<EditProduct />} />
        </Route>*/}
      </Routes> 
    </>
  );
};

export default App;
