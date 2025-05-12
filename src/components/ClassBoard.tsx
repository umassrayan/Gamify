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
        backgroundColor: "#E0E0E0", // Background on outer wrapper
        borderRadius: "20px", // Rounded corners for background
        padding: "20px", // Padding inside the background
        height: "34vh", // Fixed visible height
        overflowY: classes.length > 4 ? "auto" : "hidden", // Scroll if needed
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          rowGap: "15px", // Adjust for tighter vertical spacing
          columnGap: "16px",
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
                  ? "#ccc"
                  : "#E9E9E9",
              height: "135px",
              borderRadius: "30px",
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
            <div
              style={{
                fontFamily: "Inter",
                fontWeight: "lighter",
                fontSize: "25px",
              }}
            >
              {classItem.class_code || classItem.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassBoard;
