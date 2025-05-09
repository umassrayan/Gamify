import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface CourseClass {
  name: string;
  class_code?: string;
  location?: string;
}

const ClassBoard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const db = getFirestore();

  const [classes, setClasses] = useState<CourseClass[]>([]);

  const match = location.pathname.match(/^\/class\/(.+)$/);
  const currentClassCode = match ? match[1] : null;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!currentUser) return;
      const userId = currentUser.uid;
      const coursesRef = collection(db, "users", userId, "courses");
      const courseSnapshots = await getDocs(coursesRef);

      const loaded: CourseClass[] = [];

      courseSnapshots.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.classes)) {
          data.classes.forEach((c: CourseClass) => {
            if (c.class_code || c.name) loaded.push(c);
          });
        }
      });

      setClasses(loaded);
    };

    fetchCourses();
  }, [currentUser]);

  const handleClassClick = (code: string) => {
    if (currentClassCode === code) {
      navigate("/dashboard"); // Already selected → go home
    } else {
      navigate(`/class/${code}`);
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
        height: "30vh",
      }}
    >
      {classes.map((classItem, idx) => (
        <div
          key={idx}
          onClick={() =>
            handleClassClick(classItem.class_code || classItem.name)
          }
          style={{
            backgroundColor:
              currentClassCode === (classItem.class_code || classItem.name)
                ? "#3c2f2f"
                : "#f4f1ee",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color:
              currentClassCode === (classItem.class_code || classItem.name)
                ? "#fff"
                : "#3c2f2f",
          }}
        >
          <div style={{ fontWeight: "bold", fontSize: "18px" }}>
            {classItem.class_code || classItem.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassBoard;
