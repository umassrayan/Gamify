import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// Defines the structure of an assignment
export interface AssignmentType {
  id: number;
  className: string;
  name: string;
  day: string;
  completed: boolean;
}

const AssignmentBoard: React.FC = () => {
  // Initializes the state with a list of example assignments
  const [assignments, setAssignments] = useState<AssignmentType[]>([
    {
      id: 1,
      className: "CSC230",
      name: "Programming Assignment",
      day: "2025-04-20",
      completed: false,
    },
    {
      id: 2,
      className: "MTH101",
      name: "Calculus Homework",
      day: "2025-04-21",
      completed: true,
    },
    {
      id: 3,
      className: "ENG150",
      name: "Read Chapter 3",
      day: "2025-04-22",
      completed: false,
    },
    {
      id: 4,
      className: "BIO110",
      name: "Lab Report",
      day: "2025-04-23",
      completed: false,
    },
    {
      id: 5,
      className: "HIS200",
      name: "Essay Draft",
      day: "2025-04-24",
      completed: true,
    },
  ]);

  // Manages the visibility of the "New Assignment" form
  const [showForm, setShowForm] = useState(false);
  // Stores the data inputted in the "New Assignment" form
  const [newAssignment, setNewAssignment] = useState({
    className: "",
    name: "",
    day: "",
  });

  // Toggles the 'completed' status of a specific assignment by ID
  const handleToggleCompleted = (id: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  // Deletes an assignment from the list by its ID
  const handleDeleteAssignment = (id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // Adds a new assignment to the list if all fields are filled in
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAssignment.className && newAssignment.name && newAssignment.day) {
      setAssignments((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...newAssignment,
          completed: false,
        },
      ]);
      setNewAssignment({ className: "", name: "", day: "" });
      setShowForm(false);
    }
  };

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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        {/* <div style={{ fontWeight: "bold", color: "#3c2f2f", fontSize: "18px" }}>
          Assignments
        </div> */}
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

      {/* Table */}
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
            <th style={thStyle}>Class</th>
            <th style={thStyle}>Assignment</th>
            <th style={thStyle}>Day</th>
            <th style={thStyle}>Completed</th>
            <th style={{ ...thStyle, textAlign: "right", minWidth: "80px" }}>
              <button
                onClick={() => setShowForm(true)}
                style={{
                  backgroundColor: "#8b5e3c",
                  color: "white",
                  border: "none",
                  padding: "6px 10px",
                  borderRadius: "4px",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                +
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {[...assignments]
            .sort((a, b) => {
              if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
              }
              return new Date(a.day).getTime() - new Date(b.day).getTime();
            })
            .map((assignment) => (
              <tr
                key={assignment.id}
                style={{
                  backgroundColor: assignment.completed ? "#e6e2df" : "#faf8f6",
                }}
              >
                <td style={tdStyle}>{assignment.className}</td>
                <td style={tdStyle}>{assignment.name}</td>
                <td style={tdStyle}>{assignment.day}</td>
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
