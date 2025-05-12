import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserCalendarEvents } from "../api/firestore";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretLeft,
  faCaretRight,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const MyComponent = () => {
  return (
    <div>
      <FontAwesomeIcon icon={faUser} style={{ marginRight: "8px" }} />
      Profile
    </div>
  );
};

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

  const [hoveredLeft, setHoveredLeft] = useState(false);
  const [hoveredRight, setHoveredRight] = useState(false);

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
        fontFamily: "Inter",
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
          marginTop: "-1rem",
          marginBottom: "1rem",
          fontSize: "2rem",
        }}
      >
        <button
          onMouseEnter={() => setHoveredLeft(true)}
          onMouseLeave={() => setHoveredLeft(false)}
          onClick={() => changeMonth(-1)}
          style={{
            marginTop: "2rem",
            width: "40px",
            height: "40px",
            border: "none",
            borderRadius: "50%",
            transition: "background-color 0.3s ease",
            backgroundColor: hoveredLeft ? "#CDC6BD" : "transparent", // light circle on hover
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faCaretLeft} size="2x" />
        </button>
        <h2 style={{ fontFamily: "Inter", fontWeight: "lighter" }}>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button
          onMouseEnter={() => setHoveredRight(true)}
          onMouseLeave={() => setHoveredRight(false)}
          onClick={() => changeMonth(1)}
          style={{
            marginTop: "2rem",
            width: "40px",
            height: "40px",
            border: "none",
            borderRadius: "50%",
            transition: "background-color 0.3s ease",
            backgroundColor: hoveredRight ? "#CDC6BD" : "transparent", // light circle on hover
            cursor: "pointer",
          }}
        >
          <FontAwesomeIcon icon={faCaretRight} size="2x" />
        </button>
      </div>

      {/* Days of the week */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          textAlign: "center",
          marginTop: "-20px",
          marginBottom: "20px",
        }}
      >
        {daysOfWeek.map((day) => (
          <div key={day} style={{ paddingBottom: "1rem" }}>
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
                height: "110px",
                padding: "10px", //for the day numbers
                backgroundColor: day ? "white" : "transparent",
                borderRadius: "10px",
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
              <div
                style={{
                  marginBottom: "4px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: isToday ? "bold" : "normal",
                  border: "none",
                  backgroundColor: isToday ? "#BEB5AA" : "transparent",
                }}
              >
                {day}
              </div>
              {dayEvents.map((event, i) => (
                <div
                  key={i}
                  style={{
                    fontSize: "0.65rem",
                    backgroundColor: "#bbb",
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
