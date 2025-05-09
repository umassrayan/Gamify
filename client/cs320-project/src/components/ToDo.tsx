import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

type Task = {
  title: string;
  completed: boolean;
};

type ToDoProps = {
  day: string | undefined;
};

const getWeekId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(
    ((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + new Date(year, 0, 1).getDay() + 1) / 7
  );
  return `${year}-W${week}`;
};

const ToDo: React.FC<ToDoProps> = ({ day }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const weekId = getWeekId();

  // Use full case-sensitive day name for consistency with WeeklyAgenda (e.g. "Thursday")
  const agendaRef = doc(
    db,
    "users",
    currentUser?.uid ?? "anon",
    "agenda",
    weekId,
    "days",
    day ?? "unknown"
  );

  const loadTasks = async () => {
    if (!currentUser || !day) return;
    const snap = await getDoc(agendaRef);
    const data = snap.exists() ? snap.data() : {};
    const existing: Task[] = data.tasks || [];
    setTasks(existing);
  };

  const saveTasks = async (updated: Task[]) => {
    if (!currentUser || !day) return;
    await setDoc(agendaRef, {
      tasks: updated,
    });
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const updated = [...tasks, { title: newTask.trim(), completed: false }];
      setTasks(updated);
      setNewTask("");
      saveTasks(updated);
    }
  };

  const handleCheckTask = (index: number) => {
    const updated = tasks.map((t, i) => i === index ? { ...t, completed: !t.completed } : t);
    setTasks(updated);
    saveTasks(updated);
  };

  useEffect(() => {
    loadTasks();
  }, [currentUser, day]);

  return (
    <div
      style={{
        backgroundColor: "#BEB5AA",
        display: "flex",
        flexDirection: "column",
        borderRadius: "25px",
        width: "35vh",
        height: "55vh",
        marginLeft: "15px",
        padding: "1rem",
      }}
    >
      <h2 style={{ fontFamily: "Arial", marginBottom: "5px", marginLeft: "10px" }}>{day}</h2>

      <div style={{ overflowY: "auto", flexGrow: "1", display: "flex", flexDirection: "column", opacity: ".25" }}>
        <ul style={{ listStyle: "none", padding: 0, width: "100%" }}>
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.li
                key={task.title + index}
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
                <span>{task.title}</span>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleCheckTask(index)}
                  style={{ cursor: "pointer" }}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="..."
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAddTask();
          }}
          style={{
            marginTop: "-5px",
            padding: "8px",
            borderRadius: "25px",
            border: "1px solid #ccc",
            flexShrink: 0,
          }}
        />
      </div>

      <button
        onClick={() => navigate("/", { state: { refresh: true } })}
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

