import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import toast from "react-hot-toast";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      toast.error("You need to log in to access this page.");
    } else if (allowedRoles && !allowedRoles.includes(role)) {
      toast.error("You don't have permission to access this page.");
    }
  }, [user, role, allowedRoles]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
