import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface FocusTimerProps {
  classCode: string;
}

const FocusTimer: React.FC<FocusTimerProps> = ({ classCode }) => {
  const { currentUser } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [weeklySeconds, setWeeklySeconds] = useState(0);

  let interval: NodeJS.Timeout;
  useEffect(() => {

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval);
      logFocusTime();
      setSeconds(0);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    fetchWeeklyFocusTime();
  }, [currentUser, classCode]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const logFocusTime = async () => {
    if (!currentUser || !classCode) return;

    try {
      await addDoc(collection(db, "users", currentUser.uid, "focusLogs"), {
        classCode,
        duration: seconds,
        timestamp: serverTimestamp(),
      });
      fetchWeeklyFocusTime();
    } catch (err) {
      console.error("Error logging focus time:", err);
    }
  };

  const fetchWeeklyFocusTime = async () => {
    if (!currentUser || !classCode) return;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "users", currentUser.uid, "focusLogs"),
      where("classCode", "==", classCode)
    );

    try {
      const snapshot = await getDocs(q);
      let total = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const timestamp = data.timestamp?.toDate?.();
        if (timestamp && timestamp >= startOfWeek) {
          total += data.duration || 0;
        }
      });

      setWeeklySeconds(total);
    } catch (err) {
      console.error("Error fetching focus logs:", err);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const formatDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div
      style={{
        backgroundColor: "#BEB5AA",
        padding: "2rem",
        borderRadius: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexGrow: 1,
      }}
    >
      {/* Left: Timer + Button */}
      <div style={{ textAlign: "center", flex: 1 }}>
        <h2 style={{ color: "#594C44" }}>FOCUS TIMER</h2>
        <h1 style={{ fontSize: "3rem", margin: "1rem 0", color: "#594C44" }}>
          {formatTime(seconds)}
        </h1>
        <button
          onClick={toggleTimer}
          style={{
            padding: "0.8rem 2rem",
            backgroundColor: "#594C44",
            color: "white",
            border: "none",
            borderRadius: "15px",
            fontSize: "1.25rem",
            cursor: "pointer",
          }}
        >
          {isRunning ? "STOP" : "GO!"}
        </button>
      </div>

      {/* Right: Focus Summary */}
      <div style={{ textAlign: "right", flex: 1 }}>
        <div style={{ fontSize: "1.2rem", color: "#594C44", fontWeight: "bold" }}>
          {formatDuration(weeklySeconds)} Focused this week
        </div>
      </div>
    </div>
  );
};

export default FocusTimer;




