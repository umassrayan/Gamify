import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    color: "#5a4c42",
    padding: "12px 16px",
    display: "block",
    borderRadius: "6px",
    marginBottom: "10px",
    transition: "all 0.2s ease-in-out",
    fontWeight: 500,
  };

  const activeStyle: React.CSSProperties = {
    backgroundColor: "#d6cfc7",
    color: "#3c2f2f",
    fontWeight: 600,
  };

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#f4f1ee",
        padding: "30px 20px",
        height: "100vh",
        boxSizing: "border-box",
        borderRight: "1px solid #ddd8d3",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h2
        style={{
          marginBottom: "30px",
          fontSize: "26px",
          fontWeight: "bold",
          color: "#5a4c42",
        }}
      >
        <span
          style={{
            fontFamily: "Zapfino, serif",
            fontSize: "26px",
            fontWeight: "bold",
          }}
        >
          Gamify
        </span>{" "}
        <span
          style={{
            fontSize: "10px",
            fontWeight: "normal",
            display: "block",
            textAlign: "right",
          }}
        >
          @BOHARIS
        </span>
      </h2>
      <nav>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          <li>
            <Link
              to="/calendar"
              style={{
                ...linkStyle,
                ...(location.pathname === "/calendar" ? activeStyle : {}),
              }}
            >
              📅 Calendar
            </Link>
          </li>
          <li>
            <Link
              to="/assignments"
              style={{
                ...linkStyle,
                ...(location.pathname === "/assignments" ? activeStyle : {}),
              }}
            >
              📝 Assignments
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
