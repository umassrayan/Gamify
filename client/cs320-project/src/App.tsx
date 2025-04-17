import React from "react";
import AssignmentBoard from "./components/Assignment";
import Calendar from "./components/Calendar";

const App: React.FC = () => {
  return (
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
