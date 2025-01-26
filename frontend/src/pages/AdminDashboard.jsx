import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router";

const AdminDashboard = () => {
  return (
       <div className="flex">
      <Sidebar />
      <div className="flex-grow p-4">
        <Outlet /> 
      </div>
    </div>
  );
};

export default AdminDashboard;
