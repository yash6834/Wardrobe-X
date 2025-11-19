import React from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen p-8 overflow-y-auto bg-gray-100">
        <Outlet /> {/* nested pages will render here */}
      </div>
    </div>
  );
};

export default AdminLayout;
