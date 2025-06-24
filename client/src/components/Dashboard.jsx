import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/Auth.Context";
import { useEvent } from "../context/Event.Context";
const Dashboard = () => {
  const { user } = useAuth();
  const { events, isLoading, error, fetchEvents } = useEvent();
  const navigate = useNavigate();

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
            {events.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-300 animate-fade-in">
                No events found. Create your first event!
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-fade-in-up"
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        event.organizer?.profilePicture ||
                        "https://via.placeholder.com/40"
                      }
                      alt={`${
                        event.organizer?.fullName || "Unknown"
                      }'s profile picture`}
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-teal-600 dark:border-teal-400"
                    />
                    <h3 className="text-xl font-semibold text-teal-700 dark:text-teal-300">
                      {event.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(event.eventDate)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Time:</span> {event.time}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location?.address || "No location provided"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Max Attendees:</span>{" "}
                    {event.maxAttendees}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Spots Left:</span>{" "}
                    {event?.spotLeft}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium">Organizer:</span>{" "}
                    {event.organizer?.fullName || "Unknown"} (@
                    {event.organizer?.username || "Unknown"})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                    {event.description}
                  </p>
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/event/${event._id}`}
                      className="bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-600 dark:hover:bg-amber-700 transition"
                    >
                      View Details
                    </Link>
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
