import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface ClassType {
  id: number;
  code: string;
}

const classList: ClassType[] = [
  { id: 1, code: "CSC230" },
  { id: 2, code: "MTH101" },
  { id: 3, code: "ENG150" },
  { id: 4, code: "BIO110" },
];

const ClassBoard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the selected class ID from the URL (if any)
  const match = location.pathname.match(/^\/class\/(\d+)$/);
  const currentClassId = match ? parseInt(match[1]) : null;

  const handleClassClick = (classId: number) => {
    if (currentClassId === classId) {
      navigate("/"); // If already on the class page, go back to main page
    } else {
      navigate(`/class/${classId}`); // Otherwise go to selected class
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "20px",
        padding: "20px",
        backgroundColor: "#f4f1ee",
        borderRadius: "8px",
        height: "36%",
      }}
    >
      {classList.map((classItem) => (
        <div
          key={classItem.id}
          onClick={() => handleClassClick(classItem.id)}
          style={{
            backgroundColor:
              currentClassId === classItem.id ? "#3c2f2f" : "#f4f1ee",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: currentClassId === classItem.id ? "#fff" : "#3c2f2f",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            {classItem.code}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassBoard;
