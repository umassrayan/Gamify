// Make sure Router is removed if it's handled in App.tsx
import { Routes, Route, useParams } from "react-router-dom"; // Import useNavigate
// import { signOut } from "firebase/auth"; // Import signOut function
// import { auth } from "../firebase"; // Import your auth instance (adjust path if needed)

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
  // const navigate = useNavigate(); // Hook for navigation after logout
  //
  // --- Logout Handler ---
  // const handleLogout = async () => {
  //   console.log("Attempting to log out (DashboardLayout1)...");
  //   try {
  //     await signOut(auth);
  //     console.log("User signed out successfully.");
  //     // AuthProvider's onAuthStateChanged listener will handle the state update.
  //     // Optional: Navigate to sign-in page immediately.
  //     navigate("/signin"); // Or '/' if public layout handles root
  //   } catch (error) {
  //     console.error("Error signing out:", error);
  //     // Optionally display an error message to the user
  //   }
  // };
  // --- End Logout Handler ---

  // If the current URL starts with /todo/, we know a day-specific page is selected
  const { day } = useParams(); // read day from URL (like /todo/Monday)

  return (
    <div style={{ display: "flex" }}>
      <div>
        {/* Left Column */}
        <ProgressBar progress={65} />
        <Account />
        {/* --- Logout Button Added Here --- HEATHER PUT THIS IN ACCOUNT SETTINGS */}
        {/* <button
          onClick={handleLogout}
          style={{
            padding: "10px 15px",
            backgroundColor: "#dc3545", // Red color for logout
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            marginTop: "auto", // Push button towards bottom if container has height
          }}
        >
          Log Out
        </button> */}
        {/* --- End Logout Button --- */}
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
      <Route path="/account-settings" element={<AccountSettings />} />
      <Route path="/todo/:day" element={<Main />} />
      <Route path="/class/:id" element={<ClassPage />} />
      {/* Add other dashboard-specific routes here */}
      {/* Example: Redirect unmatched dashboard routes */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default DashboardLayout;
