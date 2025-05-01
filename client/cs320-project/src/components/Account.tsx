import { useNavigate } from "react-router-dom";

function Account() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/AccountSettings")}
      style={{
        width: "7vh",
        height: "7vh",
        border: "none",
        borderRadius: "50%",
        backgroundColor: "#6D5A4F",
        color: "white",
        textAlign: "center",
        margin: "35px",
        marginTop: "-10px",
        cursor: "pointer",
        fontSize: "40px",
      }}
    >
      B
    </button>
  );
}

export default Account;
