import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useEvent } from "../context/Event.Context";
import LocationPicker from "./LocationPicker";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";

const CreateEvent = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const { isLoading, error, createEvent } = useEvent();
  const [location, setLocation] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      date: "",
      time: "",
      location: "",
      description: "",
      maxAttendees: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      console.log("Submitted date:", data.date);
      if (!location) {
        throw new Error("Please pick a location on the map 🗺️");
      }
      // Validate date
      if (!data.date) {
        throw new Error("Date is required");
      }
      const dateObj = new Date(data.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date selected");
      }
      // Send date as YYYY-MM-DD
      const formattedDate = data.date;
      const formattedTime = data.time
        ? new Date(`1970-01-01T${data.time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "";

      console.log("Formatted date:", formattedDate);
      console.log("Formatted Time", formattedTime);
      await createEvent(
        data.name,
        formattedDate,
        formattedTime,
        {
          address: data.location,
          coordinates: location,
        },
        data.description,
        data.maxAttendees
      );
      setSuccessMessage("Event created successfully!");
      reset();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Event creation failed:", err);
    }
  };

  // Safeguard: Ensure error is an array
  const apiErrors = Array.isArray(error)
    ? error.reduce((acc, err) => {
        acc[err.field] = err.message;
        return acc;
      }, {})
    : {};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
          Create New Event
        </h2>
        {successMessage && (
          <p className="text-amber-600 text-sm mb-4 text-center">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Event Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Event Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter event name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
            {apiErrors.name && (
              <p className="text-red-500 text-sm mt-1">{apiErrors.name}</p>
            )}
          </div>

          {/* Event Date */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Event Date
            </label>
            <input
              type="date"
              {...register("date", {
                required: "Event date is required",
                validate: (value) =>
                  !isNaN(new Date(value).getTime()) || "Invalid date",
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
            {apiErrors.date && (
              <p className="text-red-500 text-sm mt-1">{apiErrors.date}</p>
            )}
          </div>

          {/* Event Time */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Event Time (e.g., 6:30 PM)
            </label>
            <Controller
              name="time"
              control={control}
              rules={{ required: "Event time is required" }}
              render={({ field }) => (
                <TimePicker
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                  disableClock
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              )}
            />
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time.message}</p>
            )}
            {apiErrors.time && (
              <p className="text-red-500 text-sm mt-1">{apiErrors.time}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location
            </label>
            <input
              type="text"
              {...register("location", {
                required: "Location is required",
                minLength: {
                  value: 3,
                  message: "Location must be at least 3 characters",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter event location"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">
                {errors.location.message}
              </p>
            )}
            {apiErrors.location && (
              <p className="text-red-500 text-sm mt-1">{apiErrors.location}</p>
            )}
          </div>

          {/* Location Picker */}
          <label className="font-medium block mt-4 mb-1">
            Pick Event Location:
          </label>
          <LocationPicker setLocation={setLocation} />

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Describe your event"
              rows="4"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
            {apiErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {apiErrors.description}
              </p>
            )}
          </div>

          {/* Max Attendees */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Max Attendees
            </label>
            <input
              type="number"
              {...register("maxAttendees", {
                required: "Max attendees is required",
                min: { value: 1, message: "Must allow at least 1 attendee" },
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter max attendees"
            />
            {errors.maxAttendees && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxAttendees.message}
              </p>
            )}
            {apiErrors.maxAttendees && (
              <p className="text-red-500 text-sm mt-1">
                {apiErrors.maxAttendees}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              isLoading
                ? "bg-teal-400 cursor-not-allowed"
                : "bg-teal-600 hover:bg-teal-700"
            } transition-colors duration-200`}
          >
            {isLoading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
