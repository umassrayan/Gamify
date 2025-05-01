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

  // New state for form visibility and new assignment data
  const [showForm, setShowForm] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    className: "",
    name: "",
    day: "",
  });

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

  // Adds a new assignment to the list if all fields are filled in
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignment.className && newAssignment.name && newAssignment.day) {
      setAssignments((prev) => [
        ...prev,
        {
          id: Date.now().toString(), // Convert to string for Firestore compatibility
          title: newAssignment.name,
          description: newAssignment.className,
          dueDate: newAssignment.day,
          completed: false,
        },
      ]);
      setNewAssignment({ className: "", name: "", day: "" });
      setShowForm(false);
    }
  };

  if (loading) return <div>Loading assignments...</div>;

  return (
    <div
      style={{
        backgroundColor: "#f4f1ee",
        borderRadius: "8px",
        padding: "10px",
        position: "relative",
        height: "36vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end", // Right-align the button
          marginBottom: "10px",
        }}
      >
        <button onClick={() => setShowForm(true)} style={addButtonStyle}>
          +
        </button>
      </div>

      {showForm && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h3 style={{ marginTop: 0 }}>Add Assignment</h3>
            <form
              onSubmit={handleAddAssignment}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="Class"
                value={newAssignment.className}
                onChange={(e) =>
                  setNewAssignment({
                    ...newAssignment,
                    className: e.target.value,
                  })
                }
              />
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={cancelButtonStyle}
                >
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
          {[...assignments]
            .sort((a, b) => {
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              return (
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
              );
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
