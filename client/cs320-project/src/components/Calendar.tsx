import { useState, useEffect } from "react";
import { getUserCalendarEvents, addUserCalendarEvent } from "../api/firestore"; // Import Firestore functions

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const dates = [13, 14, 15, 16, 17, 18, 19];

function Calendar() {
  const userId = "hqbb3FUjX6LLjMKAnqb2"; // Hardcoded for now
  const [events, setEvents] = useState<string[][]>(
    Array(7)
      .fill([])
      .map(() => [])
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [inputName, setInputName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      const data = await getUserCalendarEvents(userId);
      const mappedEvents: string[][] = Array(7)
        .fill(0)
        .map(() => []);

      data.forEach((event: any) => {
        const start = event.startTime.toDate();
        const end = event.endTime.toDate();
        const dayIndex = start.getDay();

        mappedEvents[dayIndex] = [
          ...mappedEvents[dayIndex],
          `${formatTime(start)} – ${formatTime(end)}: ${event.title}`,
        ];
      });

      setEvents(mappedEvents);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
    }
  }

  const handleAddEvent = async () => {
    if (inputName && currentDayIndex !== null && startTime && endTime) {
      try {
        const today = new Date();
        const selectedDate = new Date(today.getFullYear(), today.getMonth(), dates[currentDayIndex]);
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
        });

        await fetchEvents();

        setInputName("");
        setStartTime("");
        setEndTime("");
        setModalOpen(false);
      } catch (error) {
        console.error("Failed to add event:", error);
      }
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#E9E8E0",
          height: "60vh",
          display: "grid",
          gridTemplateColumns: "repeat(7, 2fr)",
          gap: ".25rem",
          padding: "1rem",
          borderRadius: "25px",
        }}
      >
        {dates.map((date, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#FFFFFF",
              padding: ".5rem",
              textAlign: "center",
              borderRadius: "25px",
              minHeight: "45vh",
              minWidth: "14vh",
              display: "flex",
              flexDirection: "column",
              fontSize: "1.5rem",
            }}
          >
            <div style={{ marginBottom: "1rem" }}>
              {date} {days[i]}
            </div>
            <div
              style={{
                fontSize: "1rem",
                marginBottom: "auto",
                textAlign: "left",
              }}
            >
              {events[i].map((event, idx) => (
                <div key={idx} style={{ marginBottom: "0.5rem" }}>
                  • {event}
                </div>
              ))}
            </div>
            <button
              style={{
                padding: "0.5rem 0.5rem",
                fontSize: "1rem",
                borderRadius: "8px",
                minHeight: "45vh",
                border: "none",
                backgroundColor: "white",
                cursor: "pointer",
              }}
              onClick={() => {
                setModalOpen(true);
                setCurrentDayIndex(i);
              }}
            ></button>
          </div>
        ))}
      </div>

      {modalOpen && (
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
          >
            <h1
              style={{
                color: "white",
                fontSize: "1.25rem",
                textAlign: "center",
              }}
            >
              ADD EVENT
            </h1>
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
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
                onClick={() => setModalOpen(false)}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ccc",
                  border: "none",
                  borderRadius: "5px",
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
                }}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Utility function to format time nicely
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
  },
  inputText: {
    fontSize: "1rem",
    color: "white",
    marginTop: "12px",
  },
};

export default Calendar;
