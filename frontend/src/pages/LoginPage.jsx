import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.auth);
  const loading = status === "loading";

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@#$%^&*!]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (!validateEmail(value)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (!validatePassword(value)) {
      setPasswordError("Password must be at least 6 characters long and include a number");
    } else {
      setPasswordError("");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (emailError || passwordError || !email || !password) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    const deviceToken = localStorage.getItem("deviceToken");
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
            navigate("/");
        }
      })
      .catch((error) => {
        toast.error("Error logging in: " + error.payload);
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
            onChange={handleEmailChange}
            required
            className="w-full p-2 mb-2 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-900"
          />
          {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full p-2 mb-2 border dark:border-gray-700 rounded-md bg-gray-100 dark:bg-gray-900"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Forgot Password?
            </Link>
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

        <button
          onClick={() => (window.location.href = `${BASE_URL}/auth/google`)}
          className="w-full p-2 mt-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-2"
        >
          <FcGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>

        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;