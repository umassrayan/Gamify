import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

// Type definition for a single assignment
export interface AssignmentType {
  id: number;
  className: string;
  name: string;
  day: string;
  completed: boolean;
}

// AssignmentBoard Component
const AssignmentBoard: React.FC = () => {
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

  // Toggle the "completed" status of an assignment
  const handleToggleCompleted = (id: number) => {
    setAssignments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, completed: !a.completed } : a))
    );
  };

  // Delete an assignment by ID
  const handleDeleteAssignment = (id: number) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div
      style={{
        backgroundColor: "#f4f1ee",
        padding: "20px",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ color: "#5a4c42" }}>Assignment Board</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#d6cfc7" }}>
          <tr>
            <th style={thStyle}>Class</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Day</th>
            <th style={thStyle}>Completed</th>
            <th style={thStyle}> </th>
          </tr>
        </thead>
        <tbody>
          {assignments.map((assignment) => (
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

export default AssignmentBoard;
