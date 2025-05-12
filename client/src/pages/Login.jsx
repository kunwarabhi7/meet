import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      console.log("Login Data:", data);

      // Placeholder: Assuming login is successful, navigate to dashboard
      // Baad mein backend ke /login endpoint ke saath integrate karenge
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
          Log In to Let's Meet
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username or Email Field */}
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
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${
                errors.usermail
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-teal-500"
              }`}
              placeholder="Enter your username or email"
            />
            {errors.usermail && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.usermail.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 transition ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-teal-500"
              }`}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition font-semibold ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Logging In..." : "Log In"}
          </button>
        </form>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Forgot your password?{" "}
            <Link
              to="/forgot-password"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Reset it here
            </Link>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Need to verify your email?{" "}
            <Link
              to="/resend-verification"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Resend verification email
            </Link>
          </p>
          <p className="text-gray-600 text-sm mt-2">
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
