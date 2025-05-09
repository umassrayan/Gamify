import React from "react";
import { useParams } from "react-router-dom";
import ClassBoard from "./ClassBoard";
import ProgressBar from "./ProgressBar";
import Account from "./Account";
import Calendar from "./Calendar";
import WeeklyAgenda from "./WeeklyAgenda";
import ToDo from "./ToDo";
import Leaderboard from "./Leaderboard";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import AccountSettings from "./AccountSettings";

const ClassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { day } = useParams(); // read day from URL (like /todo/Monday)
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  if (!id) {
    return <div>Error: Class not found!</div>;
  }

  return (
    <div style={{ display: "flex" }}>
      <div>
        {/* Left Column */}
        <ProgressBar progress={65} />
        <Account onClick={() => setSidebarOpen(true)} />
        <AnimatePresence>
          {isSidebarOpen && (
            <AccountSettings onClose={() => setSidebarOpen(false)} />
          )}
        </AnimatePresence>
      </div>
      <div
        style={{
          flex: 1,
          fontFamily: "sans-serif",
          backgroundColor: "#fff",
          minHeight: "100vh",
          padding: "15px",
          display: "grid",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", marginTop: "10px" }}>
          <Calendar />
          {/* {day ? <ToDo day={day} /> : <WeeklyAgenda />} */}
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
