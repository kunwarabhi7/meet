import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Watch password for confirm password validation
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      console.log("Signup Data:", data);
      // Placeholder: Assuming signup is successful, navigate to login or dashboard
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md animate-fade-in-up">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in-down">
          Sign Up for Let's Meet
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name Field */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              {...register("fullName", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters long",
                },
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <div className="mt-1 flex items-center text-red-600 text-sm animate-fade-in">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.fullName.message}
              </div>
            )}
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              {...register("username", {
                required: "Username is required",
                pattern: {
                  value: /^[a-zA-Z0-9_]{3,}$/,
                  message:
                    "Username must be at least 3 characters long and can only contain letters, numbers, and underscores",
                },
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="mt-1 flex items-center text-red-600 text-sm animate-fade-in">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.username.message}
              </div>
            )}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="mt-1 flex items-center text-red-600 text-sm animate-fade-in">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.email.message}
              </div>
            )}
          </div>

          {/* Password Field with Toggle */}
          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-600 hover:text-teal-600 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <div className="mt-1 flex items-center text-red-600 text-sm animate-fade-in">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.password.message}
              </div>
            )}
          </div>

          {/* Confirm Password Field with Toggle */}
          <div className="mb-6 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-10 text-gray-600 hover:text-teal-600 text-sm"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
            {errors.confirmPassword && (
              <div className="mt-1 flex items-center text-red-600 text-sm animate-fade-in">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.confirmPassword.message}
              </div>
            )}
          </div>

          {/* Submit Button with Spinner */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition font-semibold flex items-center justify-center ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "animate-pulse"
            }`}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
            ) : null}
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm animate-fade-in-up">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-500 hover:text-amber-600 font-medium"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
