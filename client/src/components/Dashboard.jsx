import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth.Context";
import { useState } from "react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Team Meetup",
      date: "2025-05-15",
      time: "10:00 AM",
      location: "Delhi",
      description: "A casual team meetup to discuss project updates.",
    },
    {
      id: 2,
      title: "Workshop: React Basics",
      date: "2025-05-20",
      time: "2:00 PM",
      location: "Online",
      description: "Learn the basics of React in this hands-on workshop.",
    },
  ]);

  const handleCreateEvent = () => {
    navigate("/create-event");
  };

  return (
    <div className="min-h-screen bg-teal-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-teal-700 mb-6 text-center animate-fade-in-down">
          Welcome to Your Dashboard, {user.fullName}!
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

        {/* Events List */}
        <div className="space-y-6">
          {events.length === 0 ? (
            <p className="text-center text-gray-600 animate-fade-in">
              No events yet. Create your first event!
            </p>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="bg-white p-6 rounded-lg shadow-md animate-fade-in-up"
              >
                <h3 className="text-xl font-semibold text-teal-700">
                  {event.title}
                </h3>
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Date:</span> {event.date}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Location:</span>{" "}
                  {event.location}
                </p>
                <p className="text-gray-600 mt-2">{event.description}</p>
                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/event/${event.id}`}
                    className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
