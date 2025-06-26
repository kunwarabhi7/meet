import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEvent } from "../context/Event.Context";
import LocationPicker from "./LocationPicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import axiosInstance from "@/utils/axionInstance";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ModeToggle } from "./ui/ModeToggle";

const CreateEvent = () => {
  const [successMessage, setSuccessMessage] = useState(null);
  const { isLoading, error, createEvent } = useEvent();
  const [location, setLocation] = useState(null);
  const [categories, setCategories] = useState({});
  console.log(categories, "catttt");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm({
    defaultValues: {
      name: "",
      date: "",
      time: "",
      location: "",
      description: "",
      maxAttendees: "",
      category: "",
      subCategory: "",
    },
  });

  // Watch category to enable subCategory dropdown
  const selectedCategory = useWatch({ control, name: "category" });

  // Fetch categories and sub-categories
  useEffect(() => {
    axiosInstance
      .get("/event/categories")
      .then((response) => {
        console.log("Fetched categories:", response.data);
        setCategories(response.data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log("Submitted data:", data);
      if (!location) {
        throw new Error("Please pick a location on the map 🗺️");
      }
      if (!data.date) {
        throw new Error("Date is required");
      }
      const dateObj = new Date(data.date);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date selected");
      }
      const formattedDate = data.date;
      const formattedTime = data.time
        ? new Date(`1970-01-01T${data.time}`).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        : "";

      console.log("Formatted date:", formattedDate);
      console.log("Formatted time:", formattedTime);
      console.log("Payload to createEvent:", {
        name: data.name,
        date: formattedDate,
        time: formattedTime,
        location: { address: data.location, coordinates: location },
        description: data.description,
        maxAttendees: Number(data.maxAttendees),
        category: data.category,
        subCategory: data.subCategory,
      });

      await createEvent(
        data.name,
        formattedDate,
        formattedTime,
        {
          address: data.location,
          coordinates: location,
        },
        data.description,
        Number(data.maxAttendees),
        data.category,
        data.subCategory
      );
      setSuccessMessage("Event created successfully!");
      reset();
      setLocation(null);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Event creation failed:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack,
      });
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
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800/90 rounded-2xl shadow-xl border border-teal-200 dark:border-teal-700 p-8 max-w-lg w-full animate-fade-in-up">
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-8 text-center animate-fade-in-down tracking-tight">
          Create New Event
        </h2>
        {successMessage && (
          <div className="mb-6 p-6 bg-amber-100 dark:bg-amber-900/50 border-l-4 border-amber-500 dark:border-amber-400 text-amber-700 dark:text-amber-300 rounded-xl shadow-md animate-fade-in">
            <p className="font-semibold text-lg">{successMessage}</p>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Event Name */}
          <div>
            <Label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Event Name
            </Label>
            <Input
              id="name"
              type="text"
              {...register("name", {
                required: "Event Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters",
                },
              })}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter event name"
            />
            {(errors.name || apiErrors.name) && (
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
                {errors.name?.message || apiErrors.name}
              </div>
            )}
          </div>

          {/* Event Date */}
          <div>
            <Label
              htmlFor="date"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Event Date
            </Label>
            <Input
              id="date"
              type="date"
              {...register("date", {
                required: "Event date is required",
                validate: (value) =>
                  !isNaN(new Date(value).getTime()) || "Invalid date",
              })}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            {(errors.date || apiErrors.date) && (
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
                {errors.date?.message || apiErrors.date}
              </div>
            )}
          </div>

          {/* Event Time */}
          <div>
            <Label
              htmlFor="time"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Event Time
            </Label>
            <Controller
              name="time"
              control={control}
              rules={{ required: "Event time is required" }}
              render={({ field }) => (
                <Input
                  id="time"
                  type="time"
                  {...field}
                  className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              )}
            />
            {(errors.time || apiErrors.time) && (
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
                {errors.time?.message || apiErrors.time}
              </div>
            )}
          </div>

          {/* Location */}
          <div>
            <Label
              htmlFor="location"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Location
            </Label>
            <Input
              id="location"
              type="text"
              {...register("location", {
                required: "Location is required",
                minLength: {
                  value: 3,
                  message: "Location must be at least 3 characters",
                },
              })}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter event location"
            />
            {(errors.location || apiErrors.location) && (
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
                {errors.location?.message || apiErrors.location}
              </div>
            )}
          </div>

          {/* Location Picker */}
          <div>
            <Label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight">
              Pick Event Location
            </Label>
            <LocationPicker setLocation={setLocation} />
          </div>

          {/* Category */}
          <div>
            <Label
              htmlFor="category"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Category
            </Label>
            <Controller
              name="category"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setValue("subCategory", "");
                  }}
                  value={field.value}
                >
                  <SelectTrigger
                    id="category"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    {Object.keys(categories).map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="text-gray-900 dark:text-gray-100 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {(errors.category || apiErrors.category) && (
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
                {errors.category?.message || apiErrors.category}
              </div>
            )}
          </div>

          {/* Sub-Category */}
          <div>
            <Label
              htmlFor="subCategory"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Sub-Category
            </Label>
            <Controller
              name="subCategory"
              control={control}
              rules={{ required: "Sub-Category is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCategory || !categories[selectedCategory]}
                >
                  <SelectTrigger
                    id="subCategory"
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <SelectValue placeholder="Select Sub-Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                    {categories[selectedCategory]?.map((subCategory) => (
                      <SelectItem
                        key={subCategory}
                        value={subCategory}
                        className="text-gray-900 dark:text-gray-100 hover:bg-teal-100 dark:hover:bg-teal-900/50"
                      >
                        {subCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {(errors.subCategory || apiErrors.subCategory) && (
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
                {errors.subCategory?.message || apiErrors.subCategory}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <Label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Description
            </Label>
            <Textarea
              id="description"
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Describe your event"
              rows="4"
            />
            {(errors.description || apiErrors.description) && (
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
                {errors.description?.message || apiErrors.description}
              </div>
            )}
          </div>

          {/* Max Attendees */}
          <div>
            <Label
              htmlFor="maxAttendees"
              className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 tracking-tight"
            >
              Max Attendees
            </Label>
            <Input
              id="maxAttendees"
              type="number"
              {...register("maxAttendees", {
                required: "Max attendees is required",
                min: { value: 1, message: "Must allow at least 1 attendee" },
              })}
              className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 transition-all duration-200 shadow-sm hover:shadow-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Enter max attendees"
            />
            {(errors.maxAttendees || apiErrors.maxAttendees) && (
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
                {errors.maxAttendees?.message || apiErrors.maxAttendees}
              </div>
            )}
          </div>

          {/* Submit Button */}
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
                Creating...
              </div>
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
