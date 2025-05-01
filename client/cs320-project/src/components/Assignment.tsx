import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  getUserAssignments,
  updateAssignmentCompletedStatus,
} from "../api/firestore"; // Import Firestore functions

// Defines the structure of an assignment
export interface AssignmentType {
  id: string; // Firestore document ID is a string
  title: string;
  description: string;
  dueDate: string; // Formatted date string
  completed: boolean;
}

const AssignmentBoard: React.FC = () => {
  const userId = "hqbb3FUjX6LLjMKAnqb2"; // Hardcoded for now
  const [assignments, setAssignments] = useState<AssignmentType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const data = await getUserAssignments(userId);
        const formattedAssignments = data.map((assignment: any) => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate.toDate().toISOString().split("T")[0], // Format Firestore Timestamp
          completed: assignment.completed,
        }));
        setAssignments(formattedAssignments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      }
    }
    fetchAssignments();
  }, []);

  // Toggle the "completed" status of an assignment and sync to Firestore
  const handleToggleCompleted = async (id: string) => {
    try {
      const assignment = assignments.find((a) => a.id === id);
      if (!assignment) return;

      const newCompletedStatus = !assignment.completed;

      // Update frontend immediately
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === id ? { ...a, completed: newCompletedStatus } : a
        )
      );

      // Update Firestore
      await updateAssignmentCompletedStatus(userId, id, newCompletedStatus);
    } catch (error) {
      console.error("Failed to update assignment in Firestore:", error);
    }
  };

  // Delete an assignment locally (does not delete in Firestore yet)
  const handleDeleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div
      style={{
        backgroundColor: "#f4f1ee",
        borderRadius: "8px",
        padding: "10px",
        position: "relative",
        height: "38vh",
      }}
    >
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          border: "none",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#d6cfc7" }}>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Description</th>
            <th style={thStyle}>Due Date</th>
            <th style={thStyle}>Completed</th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
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

// Table header styles
const thStyle: React.CSSProperties = {
  padding: "12px",
  color: "#3c2f2f",
  fontWeight: "bold",
  textAlign: "left",
  borderBottom: "1px solid #b0a9a1",
};

// Table data cell styles
const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "#4a403a",
};

// Trash button style
const trashButtonStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#8b5e3c",
  cursor: "pointer",
  fontSize: "16px",
};

// Modal styles
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

export default AssignmentBoard;
