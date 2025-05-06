import React, { useState } from "react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Event = {
  date: string; // format: 'YYYY-MM-DD'
  title: string;
};

const MonthlyCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date().toISOString().split("T")[0];

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (offset: number) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
    setActiveDay(null); // reset popup when changing months
  };

  const datesArray = Array.from({ length: startingDay + daysInMonth }, (_, i) =>
    i < startingDay ? null : i - startingDay + 1
  );

  const getDateString = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  const getEventsForDay = (day: number) => {
    const dateStr = getDateString(day);
    return events.filter((e) => e.date === dateStr);
  };

  const handleAddEvent = () => {
    if (newEventTitle && activeDay) {
      setEvents((prev) => [...prev, { date: activeDay, title: newEventTitle }]);
      setNewEventTitle("");
      setActiveDay(null);
    }
  };

  return (
    <div
      style={{
        maxWidth: "100vw",
        height: "100vh",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#E9E8E0",
        borderRadius: "25px",
        margin: "2rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <button
          onClick={() => changeMonth(-1)}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          style={{ border: "none", backgroundColor: "transparent" }}
        >
          &gt;
        </button>
      </div>

      {/* Days of the week */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
        }}
      >
        {daysOfWeek.map((day) => (
          <div key={day} style={{ paddingBottom: "0.5rem" }}>
            {day}
          </div>
        ))}

        {/* Calendar cells */}
        {datesArray.map((day, index) => {
          const dateStr = day ? getDateString(day) : "";
          const isToday = dateStr === today;
          const dayEvents = day ? getEventsForDay(day) : [];

          return (
            <div
              key={index}
              onClick={() => day && setActiveDay(dateStr)}
              style={{
                height: "65px",
                padding: "4px",
                backgroundColor: day
                  ? isToday
                    ? "#BEB5AA"
                    : "white"
                  : "transparent",
                borderRadius: "6px",
                margin: "2px",
                border: "none",
                fontWeight: isToday ? "normal" : "lighter",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                fontSize: "0.9rem",
                cursor: day ? "pointer" : "default",
              }}
            >
              <div style={{ marginBottom: "2px" }}>{day}</div>
              {dayEvents.map((event, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "0.65rem",
                    backgroundColor: "#6D5A4F",
                    color: "white",
                    borderRadius: "4px",
                    padding: "2px 4px",
                    marginTop: "2px",
                    maxWidth: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {event.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Add event form */}
      {activeDay && (
        <div
          style={{
            marginTop: "1rem",
            backgroundColor: "#fff",
            padding: "1rem",
            border: "1px solid #ccc",
            borderRadius: "8px",
          }}
        >
          <h4>Add Event for {activeDay}</h4>
          <input
            type="text"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            placeholder="Event title"
            style={{ padding: "0.5rem", width: "100%", marginBottom: "0.5rem" }}
          />
          <div>
            <button
              onClick={handleAddEvent}
              style={{
                padding: "0.5rem 1rem",
                marginRight: "1rem",
                backgroundColor: "#6D5A4F",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              onClick={() => setActiveDay(null)}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#ccc",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyCalendar;
