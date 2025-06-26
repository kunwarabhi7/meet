import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/Auth.Context";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";

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
  const [serverError, setServerError] = useState(null);
  const { SignUp } = useAuth();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setServerError(null);
      await SignUp(data.username, data.password, data.fullName, data.email);
      console.log("Signup successful");
      navigate("/verify-email");
    } catch (error) {
      console.log("Frontend signup error:", error);
      const errorMessage =
        typeof error === "string"
          ? error.charAt(0).toUpperCase() + error.slice(1)
          : "Sign up failed";
      setServerError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-teal-200 dark:border-teal-700 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-8 text-center animate-fade-in-down tracking-tight">
          Sign Up for Let's Meet
        </h2>

        {serverError && (
          <div className="mb-6 p-6 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 rounded-xl shadow-md animate-fade-in">
            <p className="font-semibold text-lg">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
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
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                errors.fullName
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-fade-in">
                <svg
                  className="w-5 h-5 mr-1"
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

          <div>
            <label
              htmlFor="username"
              className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
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
                    "Username must be at least 3 characters and contain only letters, numbers, or underscores",
                },
              })}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                errors.username
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
              placeholder="Enter your username"
            />
            {errors.username && (
              <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-fade-in">
                <svg
                  className="w-5 h-5 mr-1"
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

          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email address",
                },
              })}
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-fade-in">
                <svg
                  className="w-5 h-5 mr-1"
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

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
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
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-12 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-all duration-200"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            {errors.password && (
              <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-fade-in">
                <svg
                  className="w-5 h-5 mr-1"
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

          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
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
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-12 text-gray-600 dark:text-gray-400 hover:text-teal-600 dark:hover:text-teal-400 text-sm font-medium transition-all duration-200"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
            {errors.confirmPassword && (
              <div className="mt-2 flex items-center text-red-600 dark:text-red-400 text-sm animate-fade-in">
                <svg
                  className="w-5 h-5 mr-1"
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

          <Button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 ${
              isSubmitting
                ? "bg-teal-400 dark:bg-teal-500 opacity-50 cursor-not-allowed"
                : "bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
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
                Signing Up...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-base font-medium animate-fade-in-up">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-semibold hover:underline transition-all duration-200"
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
