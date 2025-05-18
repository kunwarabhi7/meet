import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { Login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setServerError(null);
      await Login(data.usermail, data.password);
      navigate("/dashboard");
    } catch (error) {
      console.log("Frontend login error:", error);
      // Capitalize first letter for better UX
      const errorMessage =
        typeof error === "string"
          ? error.charAt(0).toUpperCase() + error.slice(1)
          : "Login failed";
      setServerError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md animate-fade-in-up">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in-down">
          Log In to Let's Meet
        </h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md animate-fade-in">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="usermail"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Username or Email
            </label>
            <input
              type="text"
              id="usermail"
              {...register("usermail", {
                required: "Username or email is required",
                pattern: {
                  value:
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$|^[a-zA-Z0-9_]{3,}$/,
                  message:
                    "Enter a valid email or username (minimum 3 characters)",
                },
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                errors.usermail
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter your username or email"
            />
            {errors.usermail && (
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
                {errors.usermail.message}
              </div>
            )}
          </div>

          <div className="mb-6 relative">
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
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600 text-sm animate-fade-in-up">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Reset it here
            </Link>
          </p>
          <p className="text-gray-600 text-sm animate-fade-in-up">
            Need to verify your email?{" "}
            <Link
              to="/resend-verification"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Resend verification email
            </Link>
          </p>
          <p className="text-gray-600 text-sm animate-fade-in-up">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-amber-500 hover:text-amber-600 font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
