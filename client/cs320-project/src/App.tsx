import React from "react";
import AssignmentBoard from "./components/Assignment";

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
      <AssignmentBoard />
    </div>
  );
};

export default App;
