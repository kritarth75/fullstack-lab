import React from "react";

// React.memo prevents this from re-rendering unless its own props change,
// which matters since the calendar can hold many event cards at once.
const EventCard = React.memo(function EventCard({ event, onDragStart }) {
  return (
    <div
      className="event-card"
      draggable
      onDragStart={(e) => onDragStart(e, event.id)}
    >
      {event.title}
    </div>
  );
});

export default EventCard;
