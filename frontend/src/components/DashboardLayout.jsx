// src/components/DashboardLayout.js
import React from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar"; // You can create this or use a pre-built component
import DashboardHeader from "./DashboardHeader";


const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />  
      <div className="flex-1">
        <DashboardHeader/>
        <main className="p-10 bg-gray-100 dark:bg-gray-800 min-h-screen">
          <Outlet />  
        </main>

        {/* add footer later */}
      </div>
    </div>
  );
};

export default DashboardLayout;
