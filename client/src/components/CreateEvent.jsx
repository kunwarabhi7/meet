import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEvent } from "../context/Event.Context";
import LocationPicker from "./LocationPicker";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
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
        ? new Date(
            `1970-01-01T${data.time.replace("Z", "")}`
          ).toLocaleTimeString("en-US", {
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-teal-600 dark:text-teal-300 mb-6 text-center">
          Create New Event
        </h2>
        {successMessage && (
          <p className="text-amber-600 dark:text-amber-400 text-sm mb-4 text-center">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Event Name */}
          <div>
            <Label htmlFor="name" className="block font-medium mb-1">
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
            <Label htmlFor="date" className="block font-medium mb-1">
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
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
            {apiErrors.date && (
              <p className="text-red-500 text-sm mt-1">{apiErrors.date}</p>
            )}
          </div>

          {/* Event Time */}
          <div className="text-gray-900 dark:text-gray-400">
            <Label htmlFor="time" className="block font-medium mb-1">
              Event Time (e.g., 6:30 PM)
            </Label>
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
                  className="w-full p-2 border rounded-md"
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
            <Label htmlFor="location" className="block font-medium mb-1">
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
          <div>
            <Label className="block font-medium mt-4 mb-1">
              Pick Event Location:
            </Label>
            <LocationPicker setLocation={setLocation} />
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category" className="block font-medium mb-1">
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
                    className="bg-white dark:bg-gray-700"
                  >
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    {Object.keys(categories).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
            {apiErrors.category && (
              <p className="text-red-500 text-sm mt-1">{apiErrors.category}</p>
            )}
          </div>

          {/* Sub-Category */}
          <div>
            <Label htmlFor="subCategory" className="block font-medium mb-1">
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
                    className="bg-white dark:bg-gray-700"
                  >
                    <SelectValue placeholder="Select Sub-Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-700">
                    {categories[selectedCategory]?.map((subCategory) => (
                      <SelectItem key={subCategory} value={subCategory}>
                        {subCategory}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subCategory && (
              <p className="text-red-500 text-sm mt-1">
                {errors.subCategory.message}
              </p>
            )}
            {apiErrors.subCategory && (
              <p className="text-red-500 text-sm mt-1">
                {apiErrors.subCategory}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="block font-medium mb-1">
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
            <Label htmlFor="maxAttendees" className="block font-medium mb-1">
              Max Attendees
            </Label>
            <Input
              id="maxAttendees"
              type="number"
              {...register("maxAttendees", {
                required: "Max attendees is required",
                min: { value: 1, message: "Must allow at least 1 attendee" },
              })}
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
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
