import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import imageCompression from "browser-image-compression";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const uservalue = user?.user;
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
    console.log("User:", user);
    if (!user) {
      navigate("/login");
    } else {
      reset({
        bio: uservalue?.bio || "",
        fullName: uservalue?.fullName || "",
        profilePicture: "",
      });
      setPreview(uservalue?.profilePicture || null);
    }
  }, [user, navigate, reset, uservalue]);

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
        // Compress image
        const options = {
          maxSizeMB: 1, // Target size ~1MB
          maxWidthOrHeight: 1024, // Resize to max 1024px
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        console.log("Compressed File Size:", compressedFile.size);

        // Convert to base64
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

  if (!user || !uservalue) {
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
                  uservalue.profilePicture || "https://via.placeholder.com/150"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-teal-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Full Name
              </label>
              <p className="text-gray-900 text-lg">{uservalue.fullName}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Username
              </label>
              <p className="text-gray-900 text-lg">{uservalue.username}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Email
              </label>
              <p className="text-gray-900 text-lg">{uservalue.email}</p>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Bio
              </label>
              <p className="text-gray-900 text-lg">
                {uservalue.bio || "No bio provided"}
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
                src={
                  preview ||
                  uservalue.profilePicture ||
                  "https://via.placeholder.com/150"
                }
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border-2 border-teal-500 mb-4"
              />
            </div>
            <div>
              <label
                htmlFor="fullName"
                className="block text-gray-700 text-sm font-medium mb-2"
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
                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Enter full name"
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
                Profile Picture
              </label>
              <input
                type="file"
                id="profilePicture"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleFileChange}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition transform focus:scale-100 hover:scale-100 border-gray-300"
              />
              <input type="hidden" {...register("profilePicture")} />
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
