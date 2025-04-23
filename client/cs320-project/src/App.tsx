import WelcomePage from "./components/WelcomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import React from "react";
import AssignmentBoard from "./components/Assignment";
import Calendar from "./components/Calendar";
import Sidebar from "./components/Sidebar";

const App: React.FC = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            fontFamily: "sans-serif",
            backgroundColor: "#ece8e4",
            minHeight: "100vh",
            padding: "40px",
          }}
        >
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/assignments" element={<AssignmentBoard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
