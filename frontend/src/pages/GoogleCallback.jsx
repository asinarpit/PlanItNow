import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleLogin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userData = urlParams.get("user");

      if (token && userData) {
        const user = JSON.parse(decodeURIComponent(userData));
        
        dispatch(setCredentials({ user, token }));

        try {
          const deviceToken = localStorage.getItem("deviceToken");
          
          if (deviceToken) {            
            await axios.post(
              `${BASE_URL}/auth/update-device-token`,
              { deviceToken },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
          }
        } catch (error) {
          console.error("Device token update failed:", error.response?.data);
          toast.error("Failed to register device for notifications");
        }

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
    };

    handleGoogleLogin();
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-xl font-semibold">Processing Google Login...</p>
    </div>
  );
};

export default GoogleCallback;