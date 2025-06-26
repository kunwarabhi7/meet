import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEvent } from "../context/Event.Context";
import { useAuth } from "../context/Auth.Context";
import { toast } from "react-toastify";
import { FiMapPin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import AddComment from "./AddComment";
import axiosInstance from "../utils/axionInstance";

const ViewEvent = () => {
  const { eventId } = useParams();
  const {
    fetchEventById,
    deleteEvent,
    event,
    isLoading: isEventLoading,
    guestList,
    guests,
    error,
  } = useEvent();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (
      hasFetchedRef.current &&
      event?._id === eventId &&
      !location.state?.fromEdit
    ) {
      return;
    }

    const loadEvent = async () => {
      try {
        const forceRefresh = location.state?.fromEdit || false;
        await fetchEventById(eventId, forceRefresh);
        hasFetchedRef.current = true;
        await guestList(eventId);
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    loadEvent();
  }, [eventId, fetchEventById, location.state?.fromEdit]);

  const handleJoinEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      toast.error("Please login first 😏");
      navigate("/login");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/event/${eventId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(response.data.message);
      await fetchEventById(eventId, true);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong 😔";
      if (error.response?.status === 401) {
        toast.error("Session expired, please login again 😏");
        navigate("/login");
      } else if (error.response?.status === 404) {
        toast.error("Event not found 😔");
      } else {
        toast.error(errorMsg);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(eventId);
        toast.success("Event deleted successfully!");
        navigate("/dashboard");
      } catch (err) {
        toast.error("Failed to delete event 😔");
        console.error("Failed to delete event:", err);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      await axiosInstance.delete(`/event/${eventId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Comment deleted successfully!");
      await fetchEventById(eventId, true);
    } catch (err) {
      toast.error("Failed to delete comment 😔");
      console.error("Error deleting comment:", err);
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

  const handleShare = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/event/${eventId}/share`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await navigator.clipboard.writeText(res.data.shareUrl);
      toast.success("Event link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to generate share link 😔");
      console.error("Error generating share link:", error);
    }
  };

  const isOrganizer =
    user?.id &&
    event?.organizer?._id &&
    user.id.toString() === event.organizer._id.toString();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-100 to-teal-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h2 className="text-4xl font-extrabold text-teal-700 dark:text-teal-300 mb-10 text-center animate-fade-in-down tracking-tight">
          Event Details
        </h2>

        {/* Loading State */}
        {(isEventLoading || isAuthLoading) && (
          <div className="text-center py-16">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-teal-600 dark:border-teal-400 border-r-transparent"></div>
            <p className="text-gray-600 dark:text-gray-300 mt-4 text-xl animate-pulse font-medium">
              {isAuthLoading
                ? "Loading user data..."
                : "Loading event details..."}
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

        {/* Event Content */}
        {!isEventLoading &&
          !isAuthLoading &&
          user &&
          event &&
          event._id === eventId && (
            <div className="bg-white dark:bg-gray-800/90 p-8 rounded-2xl shadow-xl animate-fade-in-up border border-teal-200 dark:border-teal-700">
              {/* Organizer Info */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                <img
                  src={
                    event.organizer?.profilePicture ||
                    "https://via.placeholder.com/48"
                  }
                  alt={`${
                    event.organizer?.fullName || "Unknown"
                  }'s profile picture`}
                  className="w-16 h-16 rounded-full object-cover border-4 border-teal-600 dark:border-teal-400 shadow-sm"
                />
                <div className="text-center sm:text-left">
                  <h3 className="text-3xl font-bold text-teal-700 dark:text-teal-300 tracking-tight">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                    Organized by{" "}
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      {event.organizer?.fullName || "Unknown"} (@
                      {event.organizer?.username || "Unknown"})
                    </span>
                  </p>
                </div>
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-200 flex items-center gap-2">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      📅 Date & Time:
                    </span>
                    {formatDateTime(event.eventDate, event.time)}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1">
                      <FiMapPin className="text-blue-500 dark:text-blue-400" />
                      Location:
                    </span>
                    {event.location?.address || "No location provided"}
                    {event.location?.address && (
                      <button
                        onClick={() => {
                          const query = event.location?.address || "";
                          const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            query
                          )}`;
                          window.open(mapUrl, "_blank");
                        }}
                        className="ml-3 text-sm bg-blue-600 dark:bg-blue-700 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-all shadow-sm hover:shadow-md"
                      >
                        View on Map
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      Max Attendees:
                    </span>{" "}
                    {event.maxAttendees}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      Category:
                    </span>{" "}
                    {event.category}
                  </p>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      Created:
                    </span>{" "}
                    {event.createdAt ? formatTimestamp(event.createdAt) : "N/A"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      Last Updated:
                    </span>{" "}
                    {event.updatedAt ? formatTimestamp(event.updatedAt) : "N/A"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      Spots Left:
                    </span>{" "}
                    {event.spotLeft}
                  </p>
                  <p className="text-gray-700 dark:text-gray-200">
                    <span className="font-semibold text-teal-600 dark:text-teal-400">
                      Sub-Category:
                    </span>{" "}
                    {event.subCategory}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-3 tracking-tight">
                  Description
                </h4>
                <p className="text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800/50 p-6 rounded-xl shadow-inner leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Guest List */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-4 tracking-tight">
                  Guest List
                </h4>
                {guests.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl shadow-inner">
                    {guests.map((guest) => (
                      <div
                        key={guest._id}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                      >
                        <img
                          src={
                            guest.profilePicture ||
                            "https://via.placeholder.com/40"
                          }
                          alt={guest.fullName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 dark:border-teal-400"
                        />
                        <div>
                          <p className="text-teal-700 dark:text-teal-300 font-semibold text-base">
                            {guest?.fullName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            @{guest.username}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No one has joined this event yet.
                  </p>
                )}
              </div>

              {/* Comments */}
              <div className="mb-8">
                <h4 className="text-xl font-semibold text-teal-600 dark:text-teal-400 mb-4 tracking-tight">
                  Comments
                </h4>
                <div className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl shadow-inner">
                  {event?.comments?.length > 0 ? (
                    event.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm hover:shadow-md transition-all relative group"
                      >
                        <img
                          src={
                            comment.user?.profilePicture ||
                            "https://via.placeholder.com/40"
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-teal-500 dark:border-teal-400"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-teal-700 dark:text-teal-300 text-base">
                            {comment.user?.fullName || "Unknown"}{" "}
                            <span className="text-sm text-gray-400 dark:text-gray-500">
                              @{comment.user?.username || "unknown"}
                            </span>
                          </p>
                          <p className="text-gray-700 dark:text-gray-200 text-base mt-1 leading-relaxed">
                            {comment.text}
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                            {new Date(comment.createdAt).toLocaleString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                        {comment.user?._id === user?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="absolute top-3 right-3 bg-red-500 dark:bg-red-600 text-white text-sm px-3 py-1.5 rounded-lg hover:bg-red-600 dark:hover:bg-red-700 transition-all opacity-0 group-hover:opacity-100"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>

              {/* Add Comment */}
              <div className="mb-8">
                <AddComment
                  eventId={eventId}
                  user={user}
                  navigate={navigate}
                  onCommentAdded={() => fetchEventById(eventId, true)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mt-10">
                {isOrganizer ? (
                  <>
                    <Link
                      to={`/event/${eventId}/edit`}
                      className={`px-6 py-3 rounded-lg text-white font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                        isEventLoading || isAuthLoading
                          ? "bg-teal-400 dark:bg-teal-500 cursor-not-allowed"
                          : "bg-teal-600 dark:bg-teal-700 hover:bg-teal-700 dark:hover:bg-teal-600"
                      }`}
                      disabled={isEventLoading || isAuthLoading}
                    >
                      Edit Event
                    </Link>
                    <button
                      onClick={handleDelete}
                      className={`px-6 py-3 rounded-lg text-white font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                        isEventLoading || isAuthLoading
                          ? "bg-red-400 dark:bg-red-500 cursor-not-allowed"
                          : "bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700"
                      }`}
                      disabled={isEventLoading || isAuthLoading}
                    >
                      Delete Event
                    </button>
                  </>
                ) : (
                  <button
                    className={`px-6 py-3 rounded-lg text-white font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                      isEventLoading || isAuthLoading || !user
                        ? "bg-amber-400 dark:bg-amber-500 cursor-not-allowed"
                        : "bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700"
                    }`}
                    disabled={isEventLoading || isAuthLoading || !user}
                    onClick={handleJoinEvent}
                  >
                    Join Event
                  </button>
                )}
                <Link
                  to="/dashboard"
                  className={`px-6 py-3 rounded-lg text-white font-semibold text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                    isEventLoading || isAuthLoading
                      ? "bg-amber-400 dark:bg-amber-500 cursor-not-allowed"
                      : "bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-700"
                  }`}
                  disabled={isEventLoading || isAuthLoading}
                >
                  Back to Dashboard
                </Link>
                <button
                  className={`px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                    isEventLoading || isAuthLoading || !user
                      ? "bg-green-400 dark:bg-green-500 cursor-not-allowed"
                      : "bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700"
                  }`}
                  disabled={isEventLoading || isAuthLoading || !user}
                  onClick={handleShare}
                >
                  <FaWhatsapp className="text-white" size={20} />
                  Share Event
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ViewEvent;
