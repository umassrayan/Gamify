import { useState, useEffect } from "react";
import { getUserCalendarEvents, addUserCalendarEvent } from "../api/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Props
interface CalendarProps {
  classFilter?: string;
  condensed?: boolean;
}

// Types
type CalendarEvent = {
  time: string;
  title: string;
  start: Date;
};

type EventMap = Record<string, CalendarEvent[]>;

const Calendar: React.FC<CalendarProps> = ({ classFilter, condensed }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;

  const [events, setEvents] = useState<EventMap>({});
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [inputName, setInputName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [dateInput, setDateInput] = useState("");

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  });

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    return date;
  });

  useEffect(() => {
    if (!userId) return;
    fetchEvents();
  }, [currentWeekStart, userId, classFilter]);

  const fetchEvents = async () => {
    if (!userId) return;
    try {
      const data = await getUserCalendarEvents(userId);
      const startOfWeek = new Date(currentWeekStart);
      const endOfWeek = new Date(currentWeekStart);
      endOfWeek.setDate(endOfWeek.getDate() + 7);

      const newEvents: EventMap = {};

      data.forEach((event: any) => {
        const start = event.startTime.toDate();
        const end = event.endTime.toDate();
        const eventClass = event.classCode || ""; // <- Firestore field

        if (start >= startOfWeek && start < endOfWeek) {
          const key = start.toDateString();
          const eventEntry: CalendarEvent = {
            time: `${formatTime(start)} – ${formatTime(end)}`,
            title: event.title,
            start,
          };
          newEvents[key] = [...(newEvents[key] || []), eventEntry];
        }
      });

      setEvents(newEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  };

  const handleAddEvent = async () => {
    if (!selectedDate || !inputName || !startTime || !endTime || !userId)
      return;

    try {
      const startDateTime = new Date(selectedDate);
      const endDateTime = new Date(selectedDate);
      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);

      await addUserCalendarEvent(userId, {
        title: inputName,
        startTime: startDateTime,
        endTime: endDateTime,
        classCode: classFilter || null,
      });

      setInputName("");
      setStartTime("");
      setEndTime("");
      setEventModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };

  const [scrollDeltaX, setScrollDeltaX] = useState(0);
  let scrollTimeout: NodeJS.Timeout;

  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      setScrollDeltaX((prev) => prev + e.deltaX);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        if (scrollDeltaX > 50) handleNextWeek();
        else if (scrollDeltaX < -50) handlePrevWeek();
        setScrollDeltaX(0);
      }, 100);
    }
  };

  const handlePrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const handleNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(newStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const todayStr = new Date().toDateString();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        // Only navigate if the active element is not an input or textarea
        const tag = document.activeElement?.tagName.toLowerCase();
        if (tag !== "input" && tag !== "textarea") {
          navigate("/monthlycalendar");
        }
      }}
      style={{
        border: "none",
        backgroundColor: "white",
        cursor: "pointer",
      }}
    >
      <div
        onWheel={handleWheel}
        style={{
          backgroundColor: "#E9E8E0",
          height: condensed ? "30vh" : "55vh",
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: ".25rem",
          padding: condensed ? "0.5rem" : "1rem",
          borderRadius: "25px",
        }}
      >
        {weekDates.map((date, i) => {
          const key = date.toDateString();
          const isToday = key === todayStr;

          return (
            <div
              key={i}
              style={{
                backgroundColor: isToday ? "#BEB5AA" : "#FFFFFF",
                width: "7.75vw",
                padding: ".5rem",
                textAlign: "center",
                borderRadius: "25px",
                height: condensed ? "28vh" : "53vh",
                display: "flex",
                flexDirection: "column",
                fontSize: condensed ? "1rem" : "1.5rem",
                fontWeight: isToday ? "bold" : "normal",
              }}
            >
              <div style={{ marginBottom: "1rem" }}>
                {date.getDate()}{" "}
                {date.toLocaleDateString(undefined, { weekday: "short" })}
              </div>
              <div
                style={{
                  fontSize: "0.9rem",
                  textAlign: "left",
                  marginBottom: "auto",
                }}
              >
                {[...(events[key] || [])]
                  .sort((a, b) => a.start.getTime() - b.start.getTime())
                  .map((event, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: "#ccc",
                        color: "#3c2f2f",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        // boxShadow: "0 1px 4px rgba(0, 0, 0, 0.08)",
                        marginBottom: "0.25rem",
                        // marginLeft: "0.1rem",
                        fontSize: "0.5rem",
                        fontWeight: 400,
                        lineHeight: 1.4,
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{event.time}</div>
                      <div style={{ fontStyle: "italic", fontSize: ".8rem" }}>
                        {event.title}
                      </div>
                    </div>
                  ))}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEventModalOpen(true);
                  setSelectedDate(date);
                  setDateInput(date.toISOString().split("T")[0]);
                }}
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                  height: condensed ? "25vh" : "50vh",
                  cursor: "pointer",
                }}
              ></button>
            </div>
          );
        })}
      </div>

      {/* Modal remains unchanged */}
      {eventModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#6E645E",
              padding: "2rem",
              borderRadius: "10px",
              width: "400px",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 style={styles.inputText}>ADD EVENT</h1>
            <input
              type="text"
              placeholder="Event Name"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              style={styles.input}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <h1 style={styles.inputText}>Date</h1>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <h1 style={styles.inputText}>Time</h1>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={styles.input}
              />
              <h1 style={styles.inputText}>-</h1>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={styles.input}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
              }}
            >
              <button
                onClick={() => setEventModalOpen(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddEvent}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#BEB5AA",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </button>
  );
};

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const styles: { [key: string]: React.CSSProperties } = {
  input: {
    padding: "0.5rem",
    fontSize: "1rem",
    borderRadius: "10px",
    backgroundColor: "white",
    border: "none",
    width: "100%",
    fontWeight: "lighter",
  },
  inputText: {
    fontSize: "1rem",
    color: "white",
    marginTop: "12px",
    fontWeight: "lighter",
  },
};

export default Calendar;
