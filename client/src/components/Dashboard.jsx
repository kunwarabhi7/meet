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
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-10 text-center animate-fade-in-down tracking-tight">
          Welcome to Your Dashboard, {user?.fullName || "User"}!
        </h2>

        {/* Create Event Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={handleCreateEvent}
            className="px-6 py-3 bg-teal-600 dark:bg-teal-700 text-white rounded-lg font-semibold shadow-md hover:bg-teal-700 dark:hover:bg-teal-600 transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400"
          >
            Create New Event
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <Select onValueChange={setSelectedCategory} value={selectedCategory}>
            <SelectTrigger className="w-full sm:w-64 bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-700 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400">
              <SelectValue placeholder="Filter by Category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800/90 border-teal-200 dark:border-teal-700 rounded-lg shadow-xl">
              <SelectItem
                value="all"
                className="text-gray-700 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-teal-900/50 focus:bg-teal-100 dark:focus:bg-teal-900/50"
              >
                All Categories
              </SelectItem>
              {[
                "🎉 Social Events",
                "🏢 Corporate Events",
                "🎓 Educational Events",
                "🎨 Cultural & Entertainment",
                "🏃 Sports & Fitness",
                "💒 Religious & Spiritual",
                "🌱 Community & Charity",
                "🛍️ Market & Expo",
              ].map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="text-gray-700 dark:text-gray-200 hover:bg-teal-100 dark:hover:bg-teal-900/50 focus:bg-teal-100 dark:focus:bg-teal-900/50"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-teal-600 dark:border-teal-400 border-r-transparent"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-xl animate-pulse font-medium">
              Loading Events...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && error.length > 0 && (
          <div className="bg-red-100 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 p-6 rounded-xl mb-8 animate-fade-in shadow-md">
            <p className="font-semibold text-lg">Error:</p>
            <p>{error.map((err) => err.message).join(", ")}</p>
          </div>
        )}

        {/* Events List */}
        {!isLoading && (!error || error.length === 0) && (
          <div className="space-y-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-gray-100 dark:bg-gray-800/50 rounded-xl shadow-inner">
                <p className="text-gray-600 dark:text-gray-300 text-lg animate-fade-in font-medium">
                  No events found. Create your first event!
                </p>
              </div>
            ) : (
              filteredEvents.map((event, id) => (
                <div
                  key={id}
                  className="bg-white dark:bg-gray-800/90 p-6 rounded-2xl shadow-xl border-l-4 border-teal-600 dark:border-teal-400 animate-fade-in-up hover:shadow-2xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          event.organizer?.profilePicture ||
                          "https://via.placeholder.com/48"
                        }
                        alt={event.organizer?.fullName || "Organizer"}
                        className="w-12 h-12 rounded-full object-cover border-4 border-teal-500 dark:border-teal-400 shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-teal-700 dark:text-teal-300 tracking-tight">
                          {event.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{event.organizer?.username || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/event/${event._id}`}
                      className="mt-3 sm:mt-0 text-base text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-500 hover:underline transition-all duration-200"
                    >
                      View Details →
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200 text-base">
                    <p>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        📅 Date:
                      </span>{" "}
                      {formatDate(event.eventDate)}
                    </p>
                    <p>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        🕒 Time:
                      </span>{" "}
                      {event.time}
                    </p>
                    <p>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        📍 Location:
                      </span>{" "}
                      {event.location?.address || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold text-teal-600 dark:text-teal-400">
                        🗂️ Category:
                      </span>{" "}
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
