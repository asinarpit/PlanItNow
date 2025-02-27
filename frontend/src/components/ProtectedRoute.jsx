import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router";
import toast from "react-hot-toast";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user?.id) {
      toast.error("You need to log in to access this page.");
    } else if (allowedRoles && !allowedRoles.includes(user?.role)) {
      toast.error("You don't have permission to access this page.");
    }
  }, [user, allowedRoles]);


  if (!user?.id) {
    return <Navigate to="/login" replace />;
  }


  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;