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
    <div className="min-h-screen bg-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in-down">
          Welcome to Your Dashboard, {user?.fullName || "User"}!
        </h2>

        {/* Create Event Button */}
        <div className="flex justify-end mb-6">
          <button
            onClick={handleCreateEvent}
            className="bg-teal-600 text-white p-3 rounded-md hover:bg-teal-700 transition font-semibold animate-pulse"
          >
            Create New Event
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <p className="text-center text-gray-600 animate-pulse">
            Loading Events...
          </p>
        )}

        {/* Error State */}
        {error && error.length > 0 && (
          <p className="text-center text-red-600 animate-fade-in">
            Error: {error.map((err) => err.message).join(", ")}
          </p>
        )}

        {/* Events List */}
        {!isLoading && (!error || error.length === 0) && (
          <div className="space-y-6">
            {events.length === 0 ? (
              <p className="text-center text-gray-600 animate-fade-in">
                No events found. Create your first event!
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event._id}
                  className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up"
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
                      className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-teal-600"
                    />
                    <h3 className="text-xl font-semibold text-teal-700">
                      {event.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 mt-1">
                    <span className="font-medium">Date:</span>{" "}
                    {formatDate(event.eventDate)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span> {event.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Max Attendees:</span>{" "}
                    {event.maxAttendees}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Spots Left:</span> 2
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Organizer:</span>{" "}
                    {event.organizer?.fullName || "Unknown"} (@
                    {event.organizer?.username || "Unknown"})
                  </p>
                  <p className="text-gray-６0 mt-2">{event.description}</p>
                  <div className="mt-4 flex justify-end">
                    <Link
                      to={`/event/${event._id}`}
                      className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
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
