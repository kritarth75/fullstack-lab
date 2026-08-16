import React from "react";
import EventCard from "./EventCard.jsx";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00"];

export default function Calendar({ events, onDragStart, onDrop }) {
  return (
    <div className="calendar-grid">
      <div className="calendar-cell header-cell" />
      {DAYS.map((day) => (
        <div key={day} className="calendar-cell header-cell">
          {day}
        </div>
      ))}

      {TIMES.map((time) => (
        <React.Fragment key={time}>
          <div className="calendar-cell time-label">{time}</div>
          {DAYS.map((day) => {
            const slotEvents = events.filter(
              (e) => e.day === day && e.time === time
            );
            return (
              <div
                key={`${day}-${time}`}
                className="calendar-cell slot"
                data-testid={`slot-${day}-${time}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => onDrop(e, day, time)}
              >
                {slotEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onDragStart={onDragStart}
                  />
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}
