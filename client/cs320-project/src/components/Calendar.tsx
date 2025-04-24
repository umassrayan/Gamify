import { useState } from "react";

const days = [" SUN", " MON", " TUE", " WED", " THU", " FRI", " SAT"];
// const dayOfWeek = [
//   "Sunday",
//   "Monday",
//   "Tuesday",
//   "Wednesday",
//   "Thursday",
//   "Friday",
//   "Saturday",
// ];
const dates = [13, 14, 15, 16, 17, 18, 19];

function Calendar() {
  //To add events
  const [events, setEvents] = useState<string[][]>(
    Array(7)
      .fill([])
      .map(() => [])
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<number | null>(null);
  const [InputName, setInputName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const handleAddEvent = () => {
    //Right now the added stuff becomes bullet points
    if (InputName && currentDayIndex !== null) {
      const updatedEvents = [...events];
      updatedEvents[currentDayIndex] = [
        ...updatedEvents[currentDayIndex],
        `${startTime} – ${endTime}: ${InputName}`,
      ];
      setEvents(updatedEvents);
    }
    setInputName("");
    setStartTime("");
    setEndTime("");
    setModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          //Columns
          backgroundColor: "#E9E8E0",
          display: "grid",
          gridTemplateColumns: "repeat(7, 2fr)",
          gap: ".25rem",
          padding: ".75rem",
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
            <button //button to add events
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
                setCurrentDayIndex(i);
                setModalOpen(true);
              }}
            ></button>
          </div>
        ))}
      </div>
      {modalOpen && ( //Event Modal
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
            <input //Input for the Event Name
              type="text"
              placeholder="Event Name"
              value={InputName}
              onChange={(e) => setInputName(e.target.value)}
              style={{
                padding: "1rem",
                fontSize: "1rem",
                borderRadius: "10px",
                backgroundColor: "white",
              }}
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <h1
                style={{
                  fontSize: "1rem",
                  color: "white",
                  marginTop: "10px",
                }}
              >
                Time
              </h1>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                style={{
                  padding: "0.5rem",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              />
              <h1
                style={{
                  fontSize: "1rem",
                  color: "white",
                  marginTop: "14px",
                }}
              >
                -
              </h1>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                style={{
                  padding: "0.5rem",
                  fontSize: "1rem",
                  borderRadius: "10px",
                  backgroundColor: "white",
                }}
              />
            </div>
            <div
              style={{
                //In between Add and Cancel Buttons
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
                  color: "#4B382D",
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

export default Calendar;
