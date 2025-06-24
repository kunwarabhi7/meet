import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axionInstance";

const VerifyEmail = () => {
  const { token } = useParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValidToken, setIsValidToken] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosInstance.get(`/user/verify-email/${token}`);
        setIsValidToken(true);
        setMessage(response.data.message);
        toast.success(response.data.message);
        setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2s
      } catch (error) {
        setIsValidToken(false);
        const errorMsg =
          error.response?.data?.message || "Something went wrong 😔";
        setMessage(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsVerifying(false);
      }
    };
    verifyToken();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-teal-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in-up">
        {isVerifying ? (
          <>
            <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
              Verifying Email
            </h2>
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
              <p className="text-gray-600 mt-3 text-lg animate-pulse">
                Verifying your email...
              </p>
            </div>
          </>
        ) : isValidToken ? (
          <>
            <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
              Email Verified
            </h2>
            <p className="text-gray-600 text-center mb-6">{message}</p>
            <p className="text-gray-600 text-center mb-6">
              Redirecting to login...
            </p>
            <a
              href="/login"
              className="block w-full py-2 px-4 rounded-md text-white font-medium bg-teal-600 hover:bg-teal-700 transition text-center"
            >
              Go to Login
            </a>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center">
              Verification Failed
            </h2>
            <p className="text-gray-600 text-center mb-6">{message}</p>
            <p className="text-gray-600 text-center mb-6">
              Request a new verification link below.
            </p>
            <a
              href="/resend-verification"
              className="block w-full py-2 px-4 rounded-md text-white font-medium bg-teal-600 hover:bg-teal-700 transition text-center"
            >
              Resend Verification Link
            </a>
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Back to{" "}
                <a
                  href="/signup"
                  className="text-teal-600 font-medium hover:underline"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
