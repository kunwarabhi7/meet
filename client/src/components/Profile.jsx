import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import axios from "axios";

const Profile = () => {
  const { user, setUser } = useAuth();
  console.log("User from context:", user);
  const uservalue = user.user;

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);

  // Fetch user details on mount if not available
  useEffect(() => {
    if (!user) {
      const fetchUser = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/user/me",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          setUser(response.data.user);
        } catch (error) {
          console.log("Fetch user error:", error.response?.data);
          setServerError("Failed to fetch user details");
          navigate("/login"); // Redirect to login if unauthorized
        }
      };
      fetchUser();
    }
  }, [user, setUser, navigate]);

  const onSubmit = async (data) => {
    try {
      setServerError(null);
      setServerSuccess(null);
      const response = await axios.put(
        "http://localhost:3000/api/user/profile",
        {
          bio: data.bio,
          profilePicture: data.profilePicture,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUser(response.data.user);
      setServerSuccess("Profile updated successfully");
      setIsEditing(false);
      reset({
        bio: response.data.user.bio,
        profilePicture: response.data.user.profilePicture,
      });
    } catch (error) {
      console.log("Update profile error:", error.response?.data);
      const errorMessage =
        error.response?.data?.errors ||
        error.response?.data?.message ||
        "Failed to update profile";
      setServerError(
        errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
      );
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setServerError(null);
    setServerSuccess(null);
    if (!isEditing && user) {
      reset({ bio: user.bio, profilePicture: user.profilePicture });
    }
  };

  // Loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="text-teal-700 text-xl animate-pulse">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md animate-fade-in-up">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in-down">
          Your Profile
        </h2>

        {serverError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md animate-fade-in">
            {serverError}
          </div>
        )}
        {serverSuccess && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md animate-fade-in">
            {serverSuccess}
          </div>
        )}

        {!isEditing ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img
                src={
                  uservalue?.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <p className="text-gray-900 text-lg">{uservalue?.fullName}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Username
              </label>
              <p className="text-gray-900 text-lg">{uservalue?.username}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <p className="text-gray-900 text-lg">{uservalue?.email}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Bio
              </label>
              <p className="text-gray-900 text-lg">
                {uservalue?.bio || "No bio provided"}
              </p>
            </div>
            <button
              onClick={handleEditToggle}
              className="w-full bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition font-semibold animate-pulse"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex justify-center">
              <img
                src={user.profilePicture || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-teal-500 mb-4"
              />
            </div>
            <div>
              <label
                htmlFor="bio"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Bio
              </label>
              <textarea
                id="bio"
                {...register("bio", {
                  maxLength: {
                    value: 200,
                    message: "Bio cannot exceed 200 characters",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                  errors.bio
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Tell us about yourself"
                rows="4"
              />
              {errors.bio && (
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
                  {errors.bio.message}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 text-sm font-medium mb-2"
              >
                Profile Picture URL
              </label>
              <input
                type="text"
                id="profilePicture"
                {...register("profilePicture", {
                  pattern: {
                    value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i,
                    message:
                      "Enter a valid image URL (png, jpg, jpeg, gif, svg)",
                  },
                })}
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                  errors.profilePicture
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter image URL"
              />
              {errors.profilePicture && (
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
                  {errors.profilePicture.message}
                </div>
              )}
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition font-semibold flex items-center justify-center ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "animate-pulse"
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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex-1 bg-gray-300 text-gray-700 p-3 rounded-md hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm animate-fade-in-up">
            Back to{" "}
            <Link
              to="/dashboard"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Dashboard
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
