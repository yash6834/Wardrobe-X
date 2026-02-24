import React from "react";
import { Outlet } from "react-router-dom";
import VendorSidebar from "../../components/Vendorsidebar";

const VendorLayout = () => {
  return (
    <div className="flex">
      <VendorSidebar />

      {/* Main content */}
      <main className="flex-1 bg-gray-100 min-h-screen
        pt-16 md:pt-6 px-4 md:px-6
        md:ml-64 transition-all">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
