import React from "react";
import { useAuth } from "./context/AuthContext"; // Import the custom hook
import PublicAppLayout from "./components/LoginRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // <-- Need these imports
import "./App.css";
import DashboardLayout from "./components/Dashboard";

const App: React.FC = () => {
  const { currentUser } = useAuth();
  console.log("Current User in App.tsx:", currentUser);

  return (
    // 1. Need the top-level Router here
    <Router>
      {/* 2. Need Routes to define routing rules */}
      <Routes>
        {currentUser ? (
          // 3. Use Route with /* for layouts containing nested Routes
          <Route path="/*" element={<DashboardLayout />} />
        ) : (
          <Route path="/*" element={<PublicAppLayout />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;
