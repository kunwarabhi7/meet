import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import imageCompression from "browser-image-compression";

const Profile = () => {
  const { user, updateUser, isLoading } = useAuth();
  const uservalue = user;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [serverSuccess, setServerSuccess] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    console.log("User:", user, "IsLoading:", isLoading);
    if (!isLoading && !user) {
      navigate("/login");
    } else if (user && uservalue) {
      reset({
        bio: uservalue.bio || "",
        fullName: uservalue.fullName || "",
        profilePicture: "",
      });
      setPreview(uservalue.profilePicture || null);
    }
  }, [user, isLoading, navigate, reset, uservalue]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setServerError("Image size must not exceed 5MB");
        return;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        )
      ) {
        setServerError("Only JPEG, JPG, PNG, or GIF images are allowed");
        return;
      }
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        console.log("Compressed File Size:", compressedFile.size);
        const base64String = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(compressedFile);
        });
        console.log("Base64 String:", base64String);
        setValue("profilePicture", base64String);
        setPreview(base64String);
      } catch (error) {
        console.error("Image Processing Error:", error);
        setServerError("Failed to process image");
      }
    } else {
      setValue("profilePicture", "");
      setPreview(uservalue?.profilePicture || null);
    }
  };

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    try {
      setServerError(null);
      setServerSuccess(null);
      const payload = {
        bio: data.bio,
        fullName: data.fullName,
      };
      if (data.profilePicture && data.profilePicture.startsWith("data:image")) {
        payload.profilePicture = data.profilePicture;
      }
      console.log("Payload to updateUser:", payload);
      const response = await updateUser(payload);
      setServerSuccess(response.message);
      setIsEditing(false);
      reset({
        bio: response.user.bio,
        fullName: response.user.fullName,
        profilePicture: "",
      });
      setPreview(response.user.profilePicture);
    } catch (error) {
      console.log("Update profile error:", error);
      setServerError(error.charAt(0).toUpperCase() + error.slice(1));
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setServerError(null);
    setServerSuccess(null);
    if (!isEditing && uservalue) {
      reset({
        bio: uservalue.bio || "",
        fullName: uservalue.fullName || "",
        profilePicture: "",
      });
      setPreview(uservalue.profilePicture || null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-teal-50 flex items-center justify-center">
        <div className="text-teal-700 text-xl animate-pulse">Loading...</div>
      </div>
    );
  }
  console.log(user, "profileee");
  if (!user || !uservalue) {
    return null; // Avoid rendering until redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl border border-teal-200 dark:border-teal-700 animate-fade-in-up">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-8 text-center animate-fade-in-down tracking-tight">
          Your Profile
        </h2>

        {/* Server Error */}
        {serverError && (
          <div className="mb-6 p-6 bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 rounded-xl shadow-md animate-fade-in">
            <p className="font-semibold text-lg">{serverError}</p>
          </div>
        )}

        {/* Server Success */}
        {serverSuccess && (
          <div className="mb-6 p-6 bg-green-100 dark:bg-green-900/50 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-300 rounded-xl shadow-md animate-fade-in">
            <p className="font-semibold text-lg">{serverSuccess}</p>
          </div>
        )}

        {/* Profile View Mode */}
        {!isEditing ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img
                src={
                  uservalue.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-36 h-36 rounded-full object-cover border-4 border-teal-500 dark:border-teal-400 shadow-md"
              />
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight">
                Full Name
              </label>
              <p className="text-gray-900 dark:text-gray-100 text-xl font-medium">
                {uservalue.fullName}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight">
                Username
              </label>
              <p className="text-gray-900 dark:text-gray-100 text-xl font-medium">
                {uservalue.username}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight">
                Email
              </label>
              <p className="text-gray-900 dark:text-gray-100 text-xl font-medium">
                {uservalue.email}
              </p>
            </div>
            <div>
              <label className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight">
                Bio
              </label>
              <p className="text-gray-900 dark:text-gray-100 text-xl font-medium leading-relaxed">
                {uservalue.bio || "No bio provided"}
              </p>
            </div>
            <button
              onClick={handleEditToggle}
              className="w-full bg-teal-600 dark:bg-teal-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-teal-700 dark:hover:bg-teal-600 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          /* Profile Edit Mode */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex justify-center">
              <img
                src={
                  preview ||
                  uservalue.profilePicture ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile Preview"
                className="w-36 h-36 rounded-full object-cover border-4 border-teal-500 dark:border-teal-400 shadow-md mb-4"
              />
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
              >
                Full Name
              </label>
              <input
                id="fullName"
                {...register("fullName", {
                  minLength: {
                    value: 3,
                    message: "Full name must be at least 3 characters",
                  },
                })}
                className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
                placeholder="Enter full name"
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
                htmlFor="bio"
                className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
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
                className={`w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md ${
                  errors.bio
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                }`}
                placeholder="Tell us about yourself"
                rows="5"
              />
              {errors.bio && (
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
                  {errors.bio.message}
                </div>
              )}
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-gray-600 dark:text-gray-300 text-sm font-semibold mb-2 tracking-tight"
              >
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileChange}
                className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-teal-600 dark:file:bg-teal-700 file:text-white file:font-semibold file:hover:bg-teal-700 dark:file:hover:bg-teal-600"
              />
              <input type="hidden" {...register("profilePicture")} />
            </div>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 ${
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
                    Saving...
                  </div>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                type="button"
                onClick={handleEditToggle}
                className="flex-1 px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg font-semibold shadow-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-300 text-base font-medium animate-fade-in-up">
            Back to{" "}
            <Link
              to="/dashboard"
              className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold hover:underline transition-all duration-200"
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
