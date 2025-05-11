import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ClassBoard from "./ClassBoard";
import ProgressBar from "./ProgressBar";
import Account from "./Account";
import FocusTimer from "./FocusTimer";
import Leaderboard from "./Leaderboard";
import { AnimatePresence } from "framer-motion";
import AccountSettings from "./AccountSettings";
import WeeklyAgenda from "./WeeklyAgenda";
import ToDo from "./ToDo";

const ClassPage: React.FC = () => {
  const { id: classCode } = useParams<{ id: string }>();
  const [weeklySeconds, setWeeklySeconds] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { day } = useParams(); // read day from URL (like /todo/Monday)

  if (!classCode) {
    return <div>Error: Class not found!</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div>
        <ProgressBar progress={65} />
        <Account onClick={() => setSidebarOpen(true)} />
        <AnimatePresence>
          {isSidebarOpen && (
            <AccountSettings onClose={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Main content */}
      <div
        style={{
          padding: "15px",
          display: "grid",
          gap: "20px",
          marginLeft: "-15px",
        }}
      >
        <div style={{ display: "flex", marginTop: "10px" }}>
          <FocusTimer
            classCode={classCode}
            setWeeklySeconds={setWeeklySeconds}
          />
          {day ? <ToDo day={day} /> : <WeeklyAgenda />}
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <Leaderboard />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <ClassBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
