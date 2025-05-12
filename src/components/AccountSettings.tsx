import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

type Props = {
  onClose: () => void;
};

const AccountSettings: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "100vw",
          backgroundColor: "black",
          zIndex: 999,
        }}
      />

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "300px",
          backgroundColor: "white",
          zIndex: 1000,
          padding: "2rem",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          overflowY: "auto",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#d9534f",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          Log Out
        </button>

        <h2>Account Settings</h2>
        {userData ? (
          <>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Total Points:</strong> {userData.totalPoints}</p>
            <p><strong>Current Streak:</strong> {userData.currentStreak}</p>
            <p><strong>Last Tracked Attendance:</strong> {new Date(userData.lastAttendanceDateTime?.seconds * 1000).toLocaleString()}</p>
            <p><strong>Restored Streak Count:</strong> {userData.streakRestoreCount}</p>

            <h3>User Preferences</h3>
            <p><strong>Theme:</strong> {userData.settings?.theme}</p>
            <p><strong>Enable Notifications?</strong> {userData.settings?.notificationsEnabled ? "Yes" : "No"}</p>
          </>
        ) : (
          <p>Loading account info...</p>
        )}
      </motion.div>
    </>
  );
};

export default AccountSettings;
