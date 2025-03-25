import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      setPasswordError("Password must be at least 8 characters long and include a number");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setPasswordMatchError("Passwords do not match");
    } else {
      setPasswordMatchError("");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (emailError || passwordError || passwordMatchError || !email || !password || !confirmPassword) {
      toast.error("Please fix the errors before submitting.");
      return;
    }
    const deviceToken = localStorage.getItem("deviceToken");
    dispatch(signupUser({ name, email, password, role, deviceToken }))
      .unwrap()
      .then(() => {
        toast.success("User registered successfully!");
        navigate("/login");
      })
      .catch((error) => {
        toast.error("Error registering user: " + error.message || error);
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${BASE_URL}/auth/google`;
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 mb-2 border rounded-md bg-gray-100 dark:bg-gray-900"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full p-2 mb-2 border rounded-md bg-gray-100 dark:bg-gray-900"
          />
          {emailError && <p className="text-red-500 text-sm mb-2">{emailError}</p>}

          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              required
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-900"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {passwordError && <p className="text-red-500 text-sm mb-2">{passwordError}</p>}

          <div className="relative mb-2">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
              className="w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-900"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>
          {passwordMatchError && <p className="text-red-500 text-sm mb-2">{passwordMatchError}</p>}

          {/* Role Selection */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-2 mb-4 border rounded-md  bg-gray-100 dark:bg-gray-900"
          >
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-teal-600 text-white rounded-md"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <button
            onClick={handleGoogleLogin}
            className="w-full p-2 mt-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center gap-2"
          >
            <FcGoogle className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <p className="mt-4 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;