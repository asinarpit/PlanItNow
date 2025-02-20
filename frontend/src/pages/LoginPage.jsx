import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { deviceToken, status } = useSelector((state) => state.auth);
  const loading = status === "loading";

  const handleLogin = async (e) => {
    e.preventDefault();


    dispatch(loginUser({ email, password, deviceToken }))
      .unwrap()
      .then(({ role }) => {
        toast.success("User logged in successfully!");

        switch (role) {
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
            navigate("/home");
        }
      })
      .catch((error) => {
        toast.error("Error logging in: " + error);
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Log In</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 mb-4 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-900"
          />
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
              className="w-full p-2 mb-4 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-900"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>

          </div>



          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-teal-600 text-gray-100 rounded-md flex items-center justify-center gap-2"
          >
            {loading && <AiOutlineLoading3Quarters className="w-4 h-4 animate-spin" />}
            {loading ? "Logging In..." : "Log In"}
          </button>

        </form>
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
