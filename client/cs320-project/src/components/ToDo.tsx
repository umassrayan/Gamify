import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ToDo: React.FC = () => {
  const { day } = useParams<{ day: string }>(); // grab day name from URL
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  // TODO: Right now the tasks disappear. Database people please help
  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks((prev) => [...prev, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleCheckTask = (index: number) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      style={{
        backgroundColor: "#BEB5AA",
        display: "flex",
        flexDirection: "column",
        borderRadius: "25px",
        width: "37vh",
        height: "60vh",
        marginLeft: "15px",
        padding: "1rem",
      }}
    >
      {/* Heading */}
      <h2
        style={{
          fontFamily: "Arial",
          marginBottom: "5px",
          marginLeft: "10px",
        }}
      >
        {day}
      </h2>

      {/* Scrollable Task List + Input */}
      <div
        style={{
          overflowY: "auto", // can scroll when there are a lot of tasks
          flexGrow: "1",
          display: "flex",
          flexDirection: "column",
          opacity: ".25",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.li
                key={task + index} // (better unique key with task+index)
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "25px",
                  padding: "10px",
                }}
              >
                <span>{task}</span>
                <input
                  type="checkbox"
                  onChange={() => handleCheckTask(index)}
                  style={{ cursor: "pointer" }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {/* Input Text Bar immediately after task list */}
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddTask();
            }
          }}
          style={{
            marginTop: "-5px",
            padding: "8px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            // width: "100%",
            flexShrink: 0, // prevent it from shrinking
          }}
        />
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          borderRadius: "25px",
          border: "none",
          backgroundColor: "#fff",
          cursor: "pointer",
        }}
      >
        Back
      </button>
    </div>
  );
};

export default ToDo;
