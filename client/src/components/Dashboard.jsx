import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/Auth.Context";
import { useEvent } from "../context/Event.Context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const Dashboard = () => {
  const { user } = useAuth();
  const { events, isLoading, error, fetchEvents } = useEvent();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("all"); // Initialize to "all"

  // Filter events: show all events if "all" is selected, otherwise filter by category
  const filteredEvents =
    selectedCategory === "all"
      ? events
      : events.filter((event) => event.category === selectedCategory);

  useEffect(() => {
    fetchEvents(); // Fetch events when dashboard mounts
  }, []);

  console.log("Events:", events); // Debug events data
  console.log("Userrrr", user);

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  // Convert ISO date to English format (e.g., "20 June 2025")
  const formatDate = (isoDate) => {
    return new Date(isoDate).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-teal-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 dark:text-teal-300 mb-6 text-center animate-fade-in-down">
          Welcome to Your Dashboard, {user?.fullName || "User"}!
        </h2>

        {/* Create Event Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateEvent}
            className="bg-teal-600 dark:bg-teal-700 text-white p-3 rounded-md hover:bg-teal-700 dark:hover:bg-teal-600 transition font-semibold animate-pulse"
          >
            Create New Event
          </button>
        </div>

        <div className="mb-6">
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-full sm:w-60">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-700">
              <SelectItem className="bg-white dark:bg-gray-700" value="all">
                All Categories
              </SelectItem>
              {[...new Set(events.map((event) => event.category))]
                .filter(
                  (category) =>
                    category &&
                    typeof category === "string" &&
                    category.trim() !== ""
                )
                .map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <p className="text-center text-gray-600 dark:text-gray-300 animate-pulse">
            Loading Events...
          </p>
        )}

        {/* Error State */}
        {error && error.length > 0 && (
          <p className="text-center text-red-600 dark:text-red-400 animate-fade-in">
            Error: {error.map((err) => err.message).join(", ")}
          </p>
        )}

        {/* Events List */}
        {!isLoading && (!error || error.length === 0) && (
          <div className="space-y-6">
            {filteredEvents.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300 animate-fade-in">
                No events found. Create your first event!
              </p>
            ) : (
              filteredEvents.map((event, id) => (
                <div
                  key={id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fade-in-up border-l-4 border-teal-600 dark:border-teal-400"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <img
                        src={
                          event.organizer?.profilePicture ||
                          "https://via.placeholder.com/40"
                        }
                        alt={event.organizer?.fullName || "Organizer"}
                        className="w-10 h-10 rounded-full mr-3 border-2 border-teal-500 object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300">
                          {event.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{event.organizer?.username || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/event/${event._id}`}
                      className="text-sm text-amber-600 hover:underline font-medium"
                    >
                      View Details →
                    </Link>
                  </div>

                  <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p>
                      📅 <span className="font-medium">Date:</span>{" "}
                      {formatDate(event.eventDate)}
                    </p>
                    <p>
                      🕒 <span className="font-medium">Time:</span> {event.time}
                    </p>
                    <p>
                      📍 <span className="font-medium">Location:</span>{" "}
                      {event.location?.address || "N/A"}
                    </p>
                    <p>
                      🗂️ <span className="font-medium">Category:</span>{" "}
                      {event.category} / {event.subCategory}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
