import React from "react";
import Calendar from "./components/Calendar";
import AssignmentBoard from "./components/Assignment";
import ClassBoard from "./components/ClassBoard";
import ProgressBar from "./components/ProgressBar";
import Account from "./components/Account";
import "./App.css";
import { useAuth } from "./context/AuthContext"; // Import the custom hook
// import { AnimatePresence, motion } from "framer-motion"; //
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import PublicAppLayout from "./components/LoginRegister"; // Import layouts
import DashboardLayout1 from "./components/DashboardLayout1";

const App: React.FC = () => {
  return (
    <div style={{ display: "flex" }}>
      <div>
        <ProgressBar progress={65} />
        <Account />
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
        <div style={{ height: "70%" }}>
          <Calendar />
        </div>
        <div style={{ display: "flex", gap: "20px", height: "100vh" }}>
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
};

export default App;
