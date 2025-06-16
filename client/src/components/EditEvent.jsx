import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEvent } from "../context/Event.Context";

const EditEvent = () => {
  const { eventId } = useParams();
  const {
    fetchEventById,
    updateEvent,
    event,
    isLoading: isEventLoading,
    error,
  } = useEvent();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    eventDate: "",
    time: "",
    location: "",
    description: "",
    maxAttendees: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [updateError, setUpdateError] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasLoadedRef = useRef(false); // Track load status

  useEffect(() => {
    if (hasLoadedRef.current && event?._id === eventId) {
      return; // Skip if already loaded
    }

    const loadEvent = async () => {
      try {
        await fetchEventById(eventId);
        hasLoadedRef.current = true;
      } catch (err) {
        console.error("Error loading event:", err);
      }
    };

    if (!event || event._id !== eventId) {
      loadEvent();
    }
  }, [eventId, fetchEventById]);

  useEffect(() => {
    if (event && event._id === eventId && !originalData) {
      const eventData = {
        name: event.name || "",
        eventDate: event.eventDate
          ? new Date(event.eventDate).toISOString().split("T")[0]
          : "",
        time: event.time || "",
        location: event.location || "",
        description: event.description || "",
        maxAttendees: event.maxAttendees ? event.maxAttendees.toString() : "",
      };
      setFormData(eventData);
      setOriginalData(eventData);
      console.log("Loaded event data from context:", eventData);
    }
  }, [event, eventId, originalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setUpdateError([]);

    const changedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key] && formData[key] !== "") {
        changedFields[key] =
          key === "maxAttendees" ? Number(formData[key]) : formData[key];
      }
    });

    console.log("Changed fields:", changedFields);

    if (Object.keys(changedFields).length === 0) {
      setIsSubmitting(false);
      setUpdateError([{ message: "No changes made to update" }]);
      return;
    }

    try {
      await updateEvent(eventId, changedFields);
      navigate(`/event/${eventId}`, { state: { fromEdit: true } });
    } catch (error) {
      const errorMessages = error.response?.data?.errors || [
        { message: `Error updating event: ${error.message}` },
      ];
      setUpdateError(errorMessages);
      console.error("Update error:", errorMessages);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 mb-8 text-center animate-fade-in-down">
          Update Event
        </h2>

        {isEventLoading && (
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="text-gray-600 mt-2 animate-pulse">Loading event...</p>
          </div>
        )}

        {(error.length > 0 || updateError.length > 0) && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fade-in">
            <p className="font-medium">Error:</p>
            <p>
              {[...error, ...updateError].map((err) => err.message).join(", ")}
            </p>
          </div>
        )}

        {!isEventLoading && !error.length && originalData && (
          <div className="bg-white p-8 rounded-lg shadow-lg animate-fade-in-up">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter event name"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Time
                  </label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="e.g., 6:30 PM"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                    placeholder="Enter location"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                    rows="4"
                    placeholder="Enter event description"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Max Attendees
                  </label>
                  <input
                    type="number"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                    min="1"
                    placeholder="Enter max attendees"
                  />
                </div>
              </div>
              <div className="mt-8 flex justify-end space-x-3">
                <Link
                  to={`/event/${eventId}`}
                  className="px-4 py-2 rounded-md text-white font-medium bg-gray-500 hover:bg-gray-600 transition"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    isSubmitting || isEventLoading
                      ? "bg-teal-400 cursor-not-allowed"
                      : "bg-teal-600 hover:bg-teal-700"
                  } transition`}
                  disabled={isSubmitting || isEventLoading}
                >
                  {isSubmitting ? "Updating..." : "Update Event"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditEvent;
