import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEvent } from "../context/Event.Context";
import { useAuth } from "../context/Auth.Context";

const ViewEvent = () => {
  const { eventId } = useParams();
  const {
    fetchEventById,
    deleteEvent,
    event,
    isLoading: isEventLoading,
    error,
  } = useEvent();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetchedRef = useRef(false); // Track fetch status

  useEffect(() => {
    if (
      hasFetchedRef.current &&
      event?._id === eventId &&
      !location.state?.fromEdit
    ) {
      return; // Skip if already fetched and no edit redirect
    }

    const loadEvent = async () => {
      try {
        const forceRefresh = location.state?.fromEdit || false;
        await fetchEventById(eventId, forceRefresh);
        hasFetchedRef.current = true;
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    loadEvent();
  }, [eventId, fetchEventById, location.state?.fromEdit]);

  useEffect(() => {
    console.log("User:", JSON.stringify(user, null, 2));
    console.log("Event Organizer:", JSON.stringify(event?.organizer, null, 2));
    console.log(
      "isOrganizer:",
      user?.user?.id &&
        event?.organizer?._id &&
        user.user.id.toString() === event.organizer._id.toString()
    );
    console.log("User ID:", user?.user?.id);
    console.log("Organizer ID:", event?.organizer?._id);
    console.log("isAuthLoading:", isAuthLoading);
  }, [user, event, isAuthLoading]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to delete event:", err);
      }
    }
  };

  const formatDateTime = (isoDate, time) => {
    const date = new Date(isoDate);
    const dateStr = date.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    return `${dateStr}, ${time}`;
  };

  const formatTimestamp = (isoDate) => {
    return new Date(isoDate).toLocaleString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOrganizer =
    user?.user?.id &&
    event?.organizer?._id &&
    user.user.id.toString() === event.organizer._id.toString();

  return (
    <div className="min-h-screen bg-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in-down">
          Event Details
        </h2>

        {(isEventLoading || isAuthLoading) && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="text-gray-600 mt-2 animate-pulse">
              {isAuthLoading
                ? "Loading user data..."
                : "Loading event details..."}
            </p>
          </div>
        )}

        {error && error.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fade-in">
            <p className="font-medium">Error:</p>
            <p>{error.map((err) => err.message).join(", ")}</p>
          </div>
        )}

        {!isEventLoading &&
          !isAuthLoading &&
          (!user || !event || event._id !== eventId) &&
          !error?.length && (
            <div className="text-center bg-gray-100 p-6 rounded-lg animate-fade-in">
              <p className="text-gray-600 text-lg">
                Failed to load user or event data.
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
              >
                Log In
              </Link>
            </div>
          )}

        {!isEventLoading &&
          !isAuthLoading &&
          user &&
          event &&
          event._id === eventId && (
            <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in-up">
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <img
                  src={
                    event.organizer?.profilePicture ||
                    "https://via.placeholder.com/40"
                  }
                  alt={`${
                    event.organizer?.fullName || "Unknown"
                  }'s profile picture`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-teal-600 mb-4 sm:mb-0 sm:mr-4"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-teal-700">
                    {event.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Organized by{" "}
                    <span className="font-medium text-teal-600">
                      {event.organizer?.fullName || "Unknown"} (@
                      {event.organizer?.username || "Unknown"})
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Date & Time:</span>{" "}
                    {formatDateTime(event.eventDate, event.time)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Max Attendees:</span>{" "}
                    {event.maxAttendees}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Created:</span>{" "}
                    {event.createdAt ? formatTimestamp(event.createdAt) : "N/A"}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Last Updated:</span>{" "}
                    {event.updatedAt ? formatTimestamp(event.updatedAt) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-medium text-teal-600 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 bg-gray-100 p-4 rounded-md">
                  {event.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                {isOrganizer ? (
                  <>
                    <Link
                      to={`/event/${eventId}/edit`}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        isEventLoading || isAuthLoading
                          ? "bg-teal-400 cursor-not-allowed"
                          : "bg-teal-600 hover:bg-teal-700"
                      } transition`}
                      disabled={isEventLoading || isAuthLoading}
                    >
                      Edit Event
                    </Link>
                    <button
                      onClick={handleDelete}
                      className={`px-4 py-2 rounded-md text-white font-medium ${
                        isEventLoading || isAuthLoading
                          ? "bg-red-400 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700"
                      } transition`}
                      disabled={isEventLoading || isAuthLoading}
                    >
                      Delete Event
                    </button>
                  </>
                ) : (
                  <button
                    className={`px-4 py-2 rounded-md text-white font-medium ${
                      isEventLoading || isAuthLoading
                        ? "bg-amber-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    } transition`}
                    disabled={isEventLoading || isAuthLoading}
                    onClick={() => alert("Join Event feature coming soon!")}
                  >
                    Join Event
                  </button>
                )}
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    isEventLoading || isAuthLoading
                      ? "bg-amber-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600"
                  } transition`}
                  disabled={isEventLoading || isAuthLoading}
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ViewEvent;
