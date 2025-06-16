import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Auth.Context.jsx";
import axios from "axios";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const { token } = useAuth();
  const [eventCache, setEventCache] = useState(new Map()); // Cache for fetched events

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    if (!token) {
      setEvents([]);
      setError([]);
      return;
    }
    setIsLoading(true);
    setError([]);
    try {
      const response = await axios.get("http://localhost:3000/api/event", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrichedEvents = response.data.map((event) => ({
        ...event,
        organizer: event.organizer
          ? {
              username: event.organizer.username || "Unknown",
              fullName: event.organizer.fullName || "Unknown",
              profilePicture:
                event.organizer.profilePicture ||
                "https://via.placeholder.com/40",
            }
          : {
              username: "Unknown",
              fullName: "Unknown",
              profilePicture: "https://via.placeholder.com/40",
            },
      }));
      console.log("Enriched events:", enrichedEvents); // Debug enriched events
      setEvents(enrichedEvents);
    } catch (error) {
      const errorMessages = error.response?.data?.errors || [
        { message: "Error in event fetching" },
      ];
      setError(errorMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const createEvent = async (
    name,
    date,
    time,
    location,
    description,
    maxAttendees
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/event",
        {
          name,
          date,
          time,
          location,
          description,
          maxAttendees: parseInt(maxAttendees),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response);
      setEvents((preEvent) => [...preEvent, response.data]);
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error creating event";
      setError(errorMessage);
      throw new Error(errorMessage); // Throw error for the caller to handle
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventById = async (eventId) => {
    if (!eventId || !/^[0-9a-fA-F]{24}$/.test(eventId)) {
      const errorMessages = [{ message: "Invalid event ID" }];
      setError(errorMessages);
      throw errorMessages;
    }

    if (eventCache.has(eventId)) {
      console.log("Returning cached event:", eventCache.get(eventId));
      return eventCache.get(eventId);
    }

    setIsLoading(true);
    setError([]);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/event/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const event = response.data;
      const enrichedEvent = {
        ...event,
        organizer: event.organizer
          ? {
              _id: event.organizer._id, // Ensure _id is included
              username: event.organizer.username || "Unknown",
              fullName: event.organizer.fullName || "Unknown",
              profilePicture:
                event.organizer.profilePicture ||
                "https://via.placeholder.com/40",
            }
          : {
              _id: null,
              username: "Unknown",
              fullName: "Unknown",
              profilePicture: "https://via.placeholder.com/40",
            },
      };
      console.log("Enriched event:", enrichedEvent);
      setEventCache(new Map(eventCache.set(eventId, enrichedEvent)));
      return enrichedEvent;
    } catch (error) {
      const errorMessages = error.response?.data?.errors || [
        { message: `Error fetching event: ${error.message}` },
      ];
      setError(errorMessages);
      throw errorMessages;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        isLoading,
        error,
        fetchEvents,
        createEvent,
        fetchEventById,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
