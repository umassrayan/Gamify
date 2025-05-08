import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getUserAssignments,
  updateAssignmentCompletedStatus,
} from "../api/firestore";
import { useAuth } from "../context/AuthContext";
import { getFirestore, collection, addDoc, Timestamp, getDocs } from "firebase/firestore";

export interface AssignmentType {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
}

const AssignmentBoard: React.FC = () => {
  const { currentUser } = useAuth();
  const userId = currentUser?.uid;
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    className: "",
    name: "",
    day: "",
  });

  const [userCourses, setUserCourses] = useState<{ name: string; class_code?: string }[]>([]);

  useEffect(() => {
    async function fetchAssignments() {
      if (!userId) return;
      try {
        const data = await getUserAssignments(userId);
        const formattedAssignments = data.map((assignment: any) => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate.toDate().toISOString().split("T")[0],
          completed: assignment.completed,
        }));
        setAssignments(formattedAssignments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    }

    fetchAssignments();
  }, [userId]);

  useEffect(() => {
    const fetchUserCourses = async () => {
      if (!userId) return;
      const db = getFirestore();
      const coursesRef = collection(db, "users", userId, "courses");
      const courseSnapshots = await getDocs(coursesRef);

      const loaded: { name: string; class_code?: string }[] = [];

      courseSnapshots.forEach((doc) => {
        const data = doc.data();
        if (Array.isArray(data.classes)) {
          data.classes.forEach((c: any) => {
            if (c.name) loaded.push(c);
          });
        }
      });

      setUserCourses(loaded);
    };

    fetchUserCourses();
  }, [userId]);

  const handleToggleCompleted = async (id: string) => {
    if (!userId) return;
    try {
      const assignment = assignments.find((a) => a.id === id);
      if (!assignment) return;

      const newCompletedStatus = !assignment.completed;

      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, completed: newCompletedStatus } : a
        )
      );

      await updateAssignmentCompletedStatus(userId, id, newCompletedStatus);
    } catch (error) {
      console.error("Failed to update assignment in Firestore:", error);
    }
  };

  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // const handleAddAssignment = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (newAssignment.className && newAssignment.name && newAssignment.day) {
  //     setAssignments((prev) => [
  //       ...prev,
  //       {
  //         id: Date.now().toString(),
  //         title: newAssignment.name,
  //         description: newAssignment.className,
  //         dueDate: newAssignment.day,
  //         completed: false,
  //       },
  //     ]);
  //     setNewAssignment({ className: "", name: "", day: "" });
  //     setShowForm(false);
  //   }
  // };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.className || !newAssignment.name || !newAssignment.day || !userId) return;
  
    const db = getFirestore();
  
    try {
      // 1. Write to Firestore
      await addDoc(collection(db, "users", userId, "assignments"), {
        class: newAssignment.className,
        title: newAssignment.name,
        dueDate: Timestamp.fromDate(new Date(newAssignment.day)),
        completed: false,
      });
  
      // 2. Refresh from Firestore
      const snapshot = await getDocs(collection(db, "users", userId, "assignments"));
      const updatedAssignments = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          description: data.class,
          dueDate: data.dueDate.toDate().toISOString().split("T")[0],
          completed: data.completed,
        };
      });
  
      setAssignments(updatedAssignments);
      setNewAssignment({ className: "", name: "", day: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error adding assignment to Firestore:", error);
    }
  };
  

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div style={boardStyle}>
      <div style={headerStyle}>
        <button onClick={() => setShowForm(true)} style={addButtonStyle}>
          +
        </button>
      </div>

      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0 }}>Add Assignment</h3>
            <form onSubmit={handleAddAssignment} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <select
                value={newAssignment.className}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    className: e.target.value,
                  })
                }
              >
                <option value="">Select a class</option>
                {userCourses.map((course, idx) => (
                  <option key={idx} value={course.class_code || course.name}>
                    {course.class_code || course.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Assignment"
                value={newAssignment.name}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, name: e.target.value })
                }
              />
              <input
                type="date"
                value={newAssignment.day}
                onChange={(e) =>
                  setNewAssignment({ ...newAssignment, day: e.target.value })
                }
              />
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" onClick={() => setShowForm(false)} style={cancelButtonStyle}>
                  Cancel
                </button>
                <button type="submit" style={addButtonStyle}>
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Course</th>
            <th style={thStyle}>Due Date</th>
            <th style={thStyle}>Completed</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {[...assignments]
            .sort((a, b) => {
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            })
            .map((assignment) => (
              <tr
                key={assignment.id}
                style={{
                  backgroundColor: assignment.completed ? "#e6e2df" : "#faf8f6",
                  transition: "background-color 0.3s ease",
                }}
              >
                <td style={tdStyle}>{assignment.title}</td>
                <td style={tdStyle}>{assignment.description}</td>
                <td style={tdStyle}>{assignment.dueDate}</td>
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={assignment.completed}
                    onChange={() => handleToggleCompleted(assignment.id)}
                  />
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleDeleteAssignment(assignment.id)}
                    style={trashButtonStyle}
                    title="Delete Assignment"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// 🎨 Styles
const boardStyle: React.CSSProperties = {
  backgroundColor: "#f4f1ee",
  borderRadius: "8px",
  padding: "10px",
  position: "relative",
  height: "32vh",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  marginBottom: "10px",
};

const modalOverlayStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: "#ccc",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const addButtonStyle: React.CSSProperties = {
  backgroundColor: "#5a4c42",
  color: "white",
  border: "none",
  padding: "6px 12px",
  borderRadius: "4px",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  border: "none",
  borderRadius: "4px",
  overflow: "hidden",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#d6cfc7",
};

const thStyle: React.CSSProperties = {
  padding: "12px",
  color: "#3c2f2f",
  fontWeight: "bold",
  textAlign: "left",
  borderBottom: "1px solid #b0a9a1",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "#4a403a",
};

const trashButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#8b5e3c",
  cursor: "pointer",
  fontSize: "16px",
};

export default AssignmentBoard;