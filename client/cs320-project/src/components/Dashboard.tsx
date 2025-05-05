// Make sure Router is removed if it's handled in App.tsx
import { useState } from "react";
import { Routes, Route, useParams } from "react-router-dom"; // Import useNavigate
import { AnimatePresence } from "framer-motion";

// Assuming these components exist and paths are correct
import ProgressBar from "./ProgressBar";
import Account from "./Account";
import AccountSettings from "./AccountSettings";

import Calendar from "./Calendar";
import WeeklyAgenda from "./WeeklyAgenda";
import ToDo from "./ToDo";
import AssignmentBoard from "./Assignment"; // Ensure correct path/name
import ClassBoard from "./ClassBoard";
import ClassPage from "./ClassPage";

function Main() {
  // If the current URL starts with /todo/, we know a day-specific page is selected
  const { day } = useParams(); // read day from URL (like /todo/Monday)
  const [isSidebarOpen, setSidebarOpen] = useState(false);

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
      {/* Right Column */}
      <div
        style={{
          padding: "15px", // Adds gap to the right
          display: "grid", // Using grid as in the original comment
          gap: "20px", // Adds gap in between assignments, classes, and calendar, weekly agenda
          marginLeft: "-15px",
        }}
      >
        <div style={{ display: "flex", marginTop: "10px" }}>
          <Calendar />
          {day ? <ToDo day={day} /> : <WeeklyAgenda />}
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <AssignmentBoard />
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <ClassBoard />
          </div>
        </div>
      </div>
    </div>
  );
}

const DashboardLayout: React.FC = () => {
  // Example progress state (you'll likely manage this differently)
  return (
    // Router should be removed if App.tsx has the main Router
    <Routes>
      <Route
        path="/" // Or maybe '/dashboard' if PublicAppLayout handles '/'
        element={<Main />}
      />
      <Route path="/todo/:day" element={<Main />} />
      <Route path="/class/:id" element={<ClassPage />} />
      {/* Add other dashboard-specific routes here */}
      {/* Example: Redirect unmatched dashboard routes */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default DashboardLayout;
