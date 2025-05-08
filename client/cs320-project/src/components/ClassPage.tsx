import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ClassBoard from "./ClassBoard";
import ProgressBar from "./ProgressBar";
import Account from "./Account";
import Calendar from "./Calendar";
import FocusTimer from "./FocusTimer";

// Utility function to format duration from seconds
function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
}

const ClassPage: React.FC = () => {
  const { id: classCode } = useParams<{ id: string }>();
  const [weeklySeconds, setWeeklySeconds] = useState(0);

  if (!classCode) {
    return <div>Error: Class not found!</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div>
        <ProgressBar progress={65} />
        <Account />
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Calendar classFilter={classCode} />

        <div style={{ display: "flex", gap: "20px", flexGrow: 1 }}>
          {/* Left: Focus + Time Summary */}
          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <FocusTimer classCode={classCode} setWeeklySeconds={setWeeklySeconds} />
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              {/* <div style={{ fontWeight: "bold" }}>
                {formatDuration(weeklySeconds)} Focused this week
              </div> */}
            </div>
          </div>

          {/* Right: Class board */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
            <ClassBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;

