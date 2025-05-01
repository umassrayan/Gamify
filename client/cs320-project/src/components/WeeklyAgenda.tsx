// import React, { useState } from "react";
// import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const days = ["W", "M", "T", "W", "T", "F"];
const daysFullName = [
  "Weekend",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const WeeklyAgenda: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        backgroundColor: "#BEB5AA",
        width: "37vh",
        height: "60vh",
        display: "grid",
        gridTemplateRows: "repeat(6, 2fr)",
        padding: "1rem",
        gap: ".25rem",
        borderRadius: "25px",
        marginLeft: "15px",
      }}
    >
      {days.map((label, index) => (
        <button
          key={index}
          onClick={() => navigate(`/todo/${daysFullName[index]}`)} // 👈 navigate to dynamic URL
          style={{
            backgroundColor: "#CDC6BD",
            textAlign: "center",
            border: "none",
            borderRadius: "50px",
            minWidth: "34vh",
            display: "flex",
            flexDirection: "column",
            fontSize: "1.5rem",
            marginTop: "5px",
          }}
        >
          <div
            style={{
              width: "6vh",
              height: "6vh",
              borderRadius: "50%",
              backgroundColor: "#fff",
              opacity: "0.5",
              textAlign: "center",
              lineHeight: "6vh",
              marginTop: "8px",
              marginLeft: "2px",
            }}
          >
            {label}
          </div>
        </button>
      ))}
    </div>
  );
};

export default WeeklyAgenda;
