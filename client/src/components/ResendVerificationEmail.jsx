import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axionInstance";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/ModeToggle";

const ResendVerificationEmail = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        "/user/resend-verification-email",
        {
          email: data.email.trim().toLowerCase(),
        }
      );
      toast.success(response.data.message);
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
          Resend Verification Email
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base text-center mb-8 leading-relaxed">
          Enter your email address to receive a new verification link.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              placeholder="you@example.com"
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

          <Button
            type="submit"
            disabled={isLoading || isSubmitting}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 ${
              isLoading || isSubmitting
                ? "bg-teal-400 dark:bg-teal-500 opacity-50 cursor-not-allowed"
                : "bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600"
            }`}
          >
            {isLoading || isSubmitting ? (
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
              "Send Verification Link"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-gray-600 dark:text-gray-300 text-base font-medium animate-fade-in-up">
            Already verified?{" "}
            <Link
              to="/login"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:underline transition-all duration-200"
            >
              Log In
            </Link>
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-base font-medium animate-fade-in-up">
            Need to sign up?
            <Link
              to="/signup"
              className="text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 font-semibold hover:underline transition-all duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResendVerificationEmail;
