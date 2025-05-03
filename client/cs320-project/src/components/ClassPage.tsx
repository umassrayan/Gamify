import React from "react";
import { useParams } from "react-router-dom";
import ClassBoard from "./ClassBoard";
import ProgressBar from "./ProgressBar";
import Account from "./Account";
import Calendar from "./Calendar";

const ClassPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <div>Error: Class not found!</div>;
  }

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
        <Calendar />
        <div style={{ display: "flex", gap: "20px", height: "100vh" }}>
          <div
            style={{ flex: 2, display: "flex", flexDirection: "column" }}
          ></div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <ClassBoard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassPage;
