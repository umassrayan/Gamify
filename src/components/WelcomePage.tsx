import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#F6F4F2",
      }}
    >
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "2rem" }}>
          Welcome to Gamify
        </h1>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button style={buttonStyle} onClick={() => navigate("/signin")}>
            Sign In
          </button>
          <button
            style={{ ...buttonStyle }}
            onClick={() => navigate("/signup")}
          >
            Create Account
          </button>
        </div>
      </div>
      <p style={{ fontSize: "0.85rem", color: "#6E645E" }}>
        © 2025 BOHARIS. All rights reserved.
      </p>
    </div>
  );
};
const buttonStyle = {
  padding: "0.75rem 1.5rem",
  fontSize: "1rem",
  border: "none",
  borderRadius: "5px",
  backgroundColor: "#6E645E",
  color: "#fff",
  cursor: "pointer",
};

export default WelcomePage;
