import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserCalendarEvents } from "../api/firestore";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Event = {
  date: string; // format: 'YYYY-MM-DD'
  title: string;
};

const MonthlyCalendar: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date().toISOString().split("T")[0];

  const firstDayOfMonth = new Date(year, month, 1);
  const startingDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (offset: number) => {
    const newDate = new Date(year, month + offset, 1);
    setCurrentDate(newDate);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      if (!userId) return;
      try {
        const data = await getUserCalendarEvents(userId);
        const formatted = data.map((event: any) => {
          const date = event.startTime.toDate();
          const dateStr = `${date.getFullYear()}-${String(
            date.getMonth() + 1
          ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
          return {
            date: dateStr,
            title: event.title,
          };
        });
        setEvents(formatted);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      }
    };

    fetchEvents();
  }, [currentDate, userId]);

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
                cursor: day ? "default" : "default",
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
    </div>
  );
};

export default MonthlyCalendar;

