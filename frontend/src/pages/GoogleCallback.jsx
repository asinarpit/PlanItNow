import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userData = urlParams.get("user");

    if (token && userData) {
      const user = JSON.parse(decodeURIComponent(userData));

      dispatch(setCredentials({ user, token }));

      // Redirect based on user role
      switch (user.role) {
        case "admin":
          navigate("/dashboard/admin");
          break;
        case "faculty":
          navigate("/dashboard/faculty");
          break;
        case "student":
          navigate("/dashboard/student");
          break;
        default:
          navigate("/");
      }

      toast.success("Logged in with Google successfully!");
    } else {
      toast.error("Google login failed!");
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl font-semibold">Processing Google Login...</p>
    </div>
  );
};

export default GoogleCallback;
