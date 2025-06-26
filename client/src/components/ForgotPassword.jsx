import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axionInstance";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post(`/user/forgot-password`, {
        email: email.trim().toLowerCase(),
      });
      toast.success(response.data.message);
      setEmail("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Something went wrong 😔";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-teal-200 dark:border-teal-700 animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-6 text-center animate-fade-in-down tracking-tight">
          Forgot Password
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base text-center mb-8 leading-relaxed">
          Enter your email address to receive a password reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
              placeholder="you@example.com"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 ${
              isLoading
                ? "bg-teal-400 dark:bg-teal-500 opacity-50 cursor-not-allowed"
                : "bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600"
            }`}
          >
            {isLoading ? (
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
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                  />
                </svg>
                Sending...
              </div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-base font-medium animate-fade-in-up">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:underline transition-all duration-200"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
