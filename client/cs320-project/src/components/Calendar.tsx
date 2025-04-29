import { useState } from "react";

const days = [" SUN", " MON", " TUE", " WED", " THU", " FRI", " SAT"];
const dates = [13, 14, 15, 16, 17, 18, 19];

function Calendar() {
  //To add events
  const [events, setEvents] = useState<string[][]>(
    Array(7)
      .fill([])
      .map(() => [])
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [InputName, setInputName] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [date, setDate] = useState("");

  const handleAddEvent = () => {
    //TODO: Right now the added stuff is wrong, database people please help
    if (InputName && date !== null) {
      const dateReal = new Date(date);
      const updatedEvents = [...events];
      updatedEvents[dateReal.getDate()] = [
        ...updatedEvents[dateReal.getDate()],
        `${startTime} – ${endTime}: ${InputName}`,
      ];
      setEvents(updatedEvents);
    }
    setInputName("");
    setStartTime("");
    setEndTime("");
    setDate("");
    setModalOpen(false);
  };

  return (
    <>
      <div
        style={{
          //Columns
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
