// import Calendar from "./components/Calendar";
import WelcomePage from "./components/WelcomePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import React from "react";
import AssignmentBoard from "./components/Assignment";
import Calendar from "./components/Calendar";

const App: React.FC = () => {
  return (
    // <div>
    //   <Calendar></Calendar>
    // </div>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
    <div
      style={{
        fontFamily: "sans-serif",
        backgroundColor: "#ece8e4",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <Calendar></Calendar>
      <AssignmentBoard />
    </div>
  );
};

export default App;
