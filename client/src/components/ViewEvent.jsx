import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEvent } from "../context/Event.Context";
import { useAuth } from "../context/Auth.Context";
import axios from "axios";
import AddComment from "./AddComment";
import { FiMapPin } from "react-icons/fi";

import { toast } from "react-toastify";

import { FaWhatsapp } from "react-icons/fa";

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
      } catch (err) {
        console.error("Failed to fetch event:", err);
      }
    };

    loadEvent();
  }, [eventId, fetchEventById, location.state?.fromEdit]);

  const handleJoinEvent = async () => {
    const token = localStorage.getItem("token");
    if (!token || !user) {
      alert("Please login first 😏");
      navigate("/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/event/${eventId}/join`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(response.data.message);
      await fetchEventById(eventId, true);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Something went wrong 😔";
      if (error.response?.status === 401) {
        alert("Session expired, please login again 😏");
        navigate("/login");
      } else if (error.response?.status === 404) {
        alert("Event not found 😔");
      } else {
        alert(errorMsg);
      }
    }
  };

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

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:3000/api/event/${eventId}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchEventById(eventId, true);
    } catch (err) {
      alert("Failed to delete comment.");
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
      const res = await axios.get(
        `http://localhost:3000/api/event/${eventId}/share`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await navigator.clipboard.writeText(res.data.shareUrl);
      toast.success("Event link copied to clipboard!");
    } catch (error) {
      console.error(err);
      toast.error("Failed to generate share link 😔");
    }
  };

  // const handleWhatsAppShare = () => {
  //   const message = `Check out this event: ${window.location.href}`;
  //   const encodedMessage = encodeURIComponent(message);
  //   const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
  //   window.open(whatsappUrl, "_blank");
  // };

  const isOrganizer =
    user?.id &&
    event?.organizer?._id &&
    user.id.toString() === event.organizer._id.toString();

  return (
    <div className="min-h-screen bg-teal-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center animate-fade-in-down tracking-tight">
          Event Details
        </h2>

        {(isEventLoading || isAuthLoading) && (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="text-gray-600 mt-3 text-lg animate-pulse">
              {isAuthLoading
                ? "Loading user data..."
                : "Loading event details..."}
            </p>
          </div>
        )}

        {error && error.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 animate-fade-in shadow-sm">
            <p className="font-semibold">Error:</p>
            <p>{error.map((err) => err.message).join(", ")}</p>
          </div>
        )}

        {!isEventLoading &&
          !isAuthLoading &&
          user &&
          event &&
          event._id === eventId && (
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg animate-fade-in-up">
              {/* Organizer Info */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <img
                  src={
                    event.organizer?.profilePicture ||
                    "https://via.placeholder.com/40"
                  }
                  alt={`${
                    event.organizer?.fullName || "Unknown"
                  }'s profile picture`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-teal-600"
                />
                <div className="text-center sm:text-left">
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

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium text-teal-600">
                      Date & Time:
                    </span>{" "}
                    {formatDateTime(event.eventDate, event.time)}
                  </p>
                  <p className="text-gray-700 flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-teal-600 flex items-center gap-1">
                      <FiMapPin className="text-blue-500" />
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
                        className="ml-2 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                      >
                        View on Map
                      </button>
                    )}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-teal-600">
                      Max Attendees:
                    </span>{" "}
                    {event.maxAttendees}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium text-teal-600">Created:</span>{" "}
                    {event.createdAt ? formatTimestamp(event.createdAt) : "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-teal-600">
                      Last Updated:
                    </span>{" "}
                    {event.updatedAt ? formatTimestamp(event.updatedAt) : "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium text-teal-600">
                      Spots Left:
                    </span>{" "}
                    {event.spotLeft}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-teal-600 mb-2">
                  Description
                </h4>
                <p className="text-gray-700 bg-gray-100 p-4 rounded-lg">
                  {event.description}
                </p>
              </div>

              {/* Comments */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-teal-600 mb-3">
                  Comments
                </h4>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg shadow-inner">
                  {event?.comments?.length > 0 ? (
                    event.comments.map((comment, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition relative"
                      >
                        <img
                          src={comment.user?.profilePicture || "/default.jpg"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-teal-700 text-sm">
                            {comment.user?.fullName || "Unknown"}{" "}
                            <span className="text-xs text-gray-400">
                              @{comment.user?.username || "unknown"}
                            </span>
                          </p>
                          <p className="text-gray-700 text-sm mt-1">
                            {comment.text}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(comment.createdAt).toLocaleString(
                              "en-GB"
                            )}
                          </p>
                        </div>
                        {comment.user?._id === user?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No comments yet. Be the first one!
                    </p>
                  )}
                </div>
              </div>

              {/* Add Comment */}
              <AddComment
                eventId={eventId}
                user={user}
                navigate={navigate}
                onCommentAdded={() => fetchEventById(eventId, true)}
              />

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
                {isOrganizer ? (
                  <>
                    <Link
                      to={`/event/${eventId}/edit`}
                      className={`px-4 py-2 rounded-md text-white font-medium text-center ${
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
                      className={`px-4 py-2 rounded-md text-white font-medium text-center ${
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
                    className={`px-4 py-2 rounded-md text-white font-medium text-center ${
                      isEventLoading || isAuthLoading || !user
                        ? "bg-amber-400 cursor-not-allowed"
                        : "bg-amber-500 hover:bg-amber-600"
                    } transition`}
                    disabled={isEventLoading || isAuthLoading || !user}
                    onClick={handleJoinEvent}
                  >
                    Join Event
                  </button>
                )}
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-md text-white font-medium text-center ${
                    isEventLoading || isAuthLoading
                      ? "bg-amber-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600"
                  } transition`}
                  disabled={isEventLoading || isAuthLoading}
                >
                  Back to Dashboard
                </Link>
                <button
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center justify-center gap-2 text-center ${
                    isEventLoading || isAuthLoading || !user
                      ? "bg-amber-400 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  } transition`}
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
