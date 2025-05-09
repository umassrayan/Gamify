import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ClassBoard from "./ClassBoard";
import ProgressBar from "./ProgressBar";
import Account from "./Account";
import Calendar from "./Calendar";
import FocusTimer from "./FocusTimer";
import Leaderboard from "./Leaderboard";
import { AnimatePresence } from "framer-motion";
import AccountSettings from "./AccountSettings";


const ClassPage: React.FC = () => {
  const { id: classCode } = useParams<{ id: string }>();
  const [weeklySeconds, setWeeklySeconds] = useState(0);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
          flex: 1,
          padding: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* Calendar */}
        <Calendar classFilter={undefined} />

        {/* Focus + Leaderboard + ClassBoard */}
        <div style={{ display: "flex", gap: "20px", flexGrow: 1 }}>
          {/* Left: Focus Timer + Leaderboard side-by-side */}
          <div style={{ flex: 2, display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <FocusTimer classCode={classCode} setWeeklySeconds={setWeeklySeconds} />
            </div>
            <div style={{ flex: 1 }}>
              <Leaderboard classCode={classCode} />
            </div>
          </div>

          {/* Right: Class Board */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
            <ClassBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;

