import { useEffect, useRef } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEvent } from "../context/Event.Context";
import { useAuth } from "../context/Auth.Context";
import axios from "axios";
import AddComment from "./AddComment";
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
          user &&
          event &&
          event._id === eventId && (
            <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in-up">
              {/* Organizer Info */}
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

              {/* Event Details */}
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
                  <p className="text-gray-600">
                    <span className="font-medium">Spots Left:</span> 2
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-teal-600 mb-2">
                  Description
                </h4>
                <p className="text-gray-600 bg-gray-100 p-4 rounded-md">
                  {event.description}
                </p>
              </div>

              {/* Comments */}
              <div className="mt-8">
                <h4 className="text-lg font-medium text-teal-600 mb-2">
                  Comments
                </h4>
              </div>

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg shadow-inner">
                {event?.comments?.length > 0 ? (
                  event.comments.map((comment, index) => (
                    <div
                      key={index}
                      className="relative flex gap-3 p-3 bg-white border rounded shadow-sm items-start"
                    >
                      <img
                        src={comment.user?.profilePicture || "/default.jpg"}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-teal-700">
                          {comment.user?.fullName || "Unknown"}{" "}
                          <span className="text-sm text-gray-400">
                            @{comment.user.fullName || "unknown"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-700 mt-1">
                          {comment.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(comment.createdAt).toLocaleString("en-GB")}
                        </p>
                      </div>
                      {comment.user._id === user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="absolute top-2 right-2 bg-red-500 text-xs text-white px-2 py-1 rounded hover:bg-red-800 shadow"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No comments yet. Be the first one!
                  </p>
                )}
              </div>

              {/* Add Comment */}
              <AddComment
                eventId={eventId}
                user={user}
                navigate={navigate}
                onCommentAdded={() => fetchEventById(eventId, true)}
              />

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-8 pt-5 sm:space-y-0 sm:space-x-3">
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
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    isEventLoading || isAuthLoading
                      ? "bg-amber-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600"
                  } transition`}
                  disabled={isEventLoading || isAuthLoading}
                >
                  Back to Dashboard
                </Link>
                <button
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 ${
                    isEventLoading || isAuthLoading || !user
                      ? "bg-amber-400 cursor-not-allowed"
                      : "bg-amber-500 hover:bg-amber-600"
                  } transition`}
                  disabled={isEventLoading || isAuthLoading || !user}
                  onClick={handleShare}
                >
                  <FaWhatsapp
                    className="text-white bg-[#25D366] p-1 rounded-full"
                    size={24}
                  />
                  Share Event
                </button>
                {/* <button
                  className={`px-4 py-2 rounded-md text-white font-medium flex items-center gap-2 bg-green-500 hover:bg-green-600 transition`}
                  onClick={handleWhatsAppShare}
                >
                  <FaWhatsapp className="text-white text-2xl" />
                  Share on WhatsApp
                </button> */}
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default ViewEvent;
