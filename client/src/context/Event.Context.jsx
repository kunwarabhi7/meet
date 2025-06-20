import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useAuth } from "./Auth.Context.jsx";
import axios from "axios";
import axiosInstance from "../utils/axionInstance.jsx";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const [events, setEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const eventCacheRef = useRef(new Map());
  const { token } = useAuth();
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, [token]);

  const fetchEvents = useCallback(async () => {
    if (!token) {
      setEvents([]);
      setError([]);
      return;
    }
    setIsLoading(true);
    setError([]);
    try {
      const response = await axios.get(`${axiosInstance}/event`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const enrichedEvents = response.data.map((event) => ({
        ...event,
        organizer: event.organizer
          ? {
              _id: event.organizer._id,
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
      }));
      console.log("Enriched events:", enrichedEvents);
      setEvents(enrichedEvents);
    } catch (error) {
      const errorMessages = error.response?.data?.errors || [
        { message: "Error in event fetching" },
      ];
      setError(errorMessages);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const createEvent = useCallback(
    async (name, date, time, location, description, maxAttendees) => {
      setIsLoading(true);
      setError([]);
      try {
        const response = await axios.post(
          "${axiosInstance}/event",
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
        const newEvent = {
          ...response.data,
          organizer: response.data.organizer
            ? {
                _id: response.data.organizer._id,
                username: response.data.organizer.username || "Unknown",
                fullName: response.data.organizer.fullName || "Unknown",
                profilePicture:
                  response.data.organizer.profilePicture ||
                  "https://via.placeholder.com/40",
              }
            : {
                _id: null,
                username: "Unknown",
                fullName: "Unknown",
                profilePicture: "https://via.placeholder.com/40",
              },
        };
        console.log("Created event:", newEvent);
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        return newEvent;
      } catch (error) {
        const errorMessages = error.response?.data?.errors || [
          { message: "Error creating event" },
        ];
        setError(errorMessages);
        throw new Error(errorMessages[0].message);
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const fetchEventById = useCallback(
    async (eventId, forceRefresh = false) => {
      if (!eventId || !/^[0-9a-fA-F]{24}$/.test(eventId)) {
        const errorMessages = [{ message: "Invalid event ID" }];
        setError(errorMessages);
        throw errorMessages;
      }

      if (!forceRefresh && eventCacheRef.current.has(eventId)) {
        console.log(
          "Returning cached event:",
          eventCacheRef.current.get(eventId)
        );
        const cached = eventCacheRef.current.get(eventId);
        setEvent((prev) =>
          JSON.stringify(prev) === JSON.stringify(cached) ? prev : cached
        );
        return cached;
      }

      setIsLoading(true);
      setError([]);
      try {
        const response = await axios.get(`${axiosInstance}/event/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        });
        const eventData = response.data;
        const enrichedEvent = {
          ...eventData,
          organizer: eventData.organizer
            ? {
                _id: eventData.organizer._id,
                username: eventData.organizer.username || "Unknown",
                fullName: eventData.organizer.fullName || "Unknown",
                profilePicture:
                  eventData.organizer.profilePicture ||
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
        eventCacheRef.current.set(eventId, enrichedEvent);
        setEvent((prev) =>
          JSON.stringify(prev) === JSON.stringify(enrichedEvent)
            ? prev
            : enrichedEvent
        );
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
    },
    [token]
  );

  const updateEvent = useCallback(
    async (eventId, updateFields) => {
      setIsLoading(true);
      setError([]);
      try {
        const response = await axios.put(
          `${axiosInstance}/event/${eventId}`,
          updateFields,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedEvent = response.data.event;
        const enrichedEvent = {
          ...updatedEvent,
          organizer: updatedEvent.organizer
            ? {
                _id: updatedEvent.organizer._id,
                username: updatedEvent.organizer.username || "Unknown",
                fullName: updatedEvent.organizer.fullName || "Unknown",
                profilePicture:
                  updatedEvent.organizer.profilePicture ||
                  "https://via.placeholder.com/40",
              }
            : {
                _id: null,
                username: "Unknown",
                fullName: "Unknown",
                profilePicture: "https://via.placeholder.com/40",
              },
        };
        eventCacheRef.current.set(eventId, enrichedEvent);
        setEvent((prev) =>
          JSON.stringify(prev) === JSON.stringify(enrichedEvent)
            ? prev
            : enrichedEvent
        );
        setEvents((prevEvents) =>
          prevEvents.map((ev) => (ev._id === eventId ? enrichedEvent : ev))
        );
        console.log("Updated event:", enrichedEvent);
        return response.data;
      } catch (err) {
        const errorMessages = err.response?.data?.errors || [
          { message: "Error updating event" },
        ];
        setError(errorMessages);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const deleteEvent = useCallback(
    async (eventId) => {
      setIsLoading(true);
      setError([]);
      try {
        await axios.delete(`${axiosInstance}/event/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        eventCacheRef.current.delete(eventId);
        setEvent(null);
        setEvents((prevEvents) =>
          prevEvents.filter((ev) => ev._id !== eventId)
        );
        console.log("Deleted event:", eventId);
        return { message: "Event deleted successfully" };
      } catch (err) {
        const errorMessages = err.response?.data?.errors || [
          { message: "Error deleting event" },
        ];
        setError(errorMessages);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  const guestList = useCallback(
    async (eventId) => {
      if (!eventId || !/^[0-9a-fA-F]{24}$/.test(eventId)) {
        const errorMessages = [{ message: "Invalid event ID for guest list" }];
        setError(errorMessages);
        throw errorMessages;
      }
      console.log(eventId, "abhishek");
      setIsLoading(true);
      setError([]);
      try {
        const res = await axios.get(`${axiosInstance}/event/${eventId}/guest`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Guest List Response:", res.data); // 👈 yeh dekho

        setGuests(res.data.guests || []);
        return res.data.guests || [];
      } catch (err) {
        const errorMessages = err.response?.data?.errors || [
          { message: "Error fetching guest list" },
        ];
        setError(errorMessages);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [token]
  );

  return (
    <EventContext.Provider
      value={{
        events,
        event,
        isLoading,
        error,
        fetchEvents,
        createEvent,
        fetchEventById,
        updateEvent,
        deleteEvent,
        guestList,
        guests,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => useContext(EventContext);
