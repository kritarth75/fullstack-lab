import React, { useState, useEffect, useMemo, useCallback } from "react";
import Calendar from "./Calendar.jsx";
import { fetchEvents } from "./mockApi.js";

export default function App() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Simulates loading events from a backend on mount
  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  // Recomputes only when events or search text change
  const filteredEvents = useMemo(() => {
    return events.filter((e) =>
      e.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [events, search]);

  // Stable reference so EventCard doesn't re-render just because App re-rendered
  const handleDragStart = useCallback((e, eventId) => {
    e.dataTransfer.setData("eventId", eventId);
  }, []);

  const handleDrop = useCallback((e, day, time) => {
    const eventId = e.dataTransfer.getData("eventId");
    setEvents((prev) =>
      prev.map((ev) => (ev.id === eventId ? { ...ev, day, time } : ev))
    );
  }, []);

  if (loading) return <p className="loading">Loading events...</p>;

  return (
    <div className="app">
      <h1>Weekly Event Calendar</h1>
      <input
        className="search-input"
        placeholder="Search events..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Calendar
        events={filteredEvents}
        onDragStart={handleDragStart}
        onDrop={handleDrop}
      />
    </div>
  );
}
