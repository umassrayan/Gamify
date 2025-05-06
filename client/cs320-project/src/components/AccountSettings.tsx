import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { signOut } from "firebase/auth"; // Import signOut function
import { auth } from "../firebase"; // Import your auth instance (adjust path if needed)

type Props = {
  onClose: () => void;
};

const AccountSettings: React.FC<Props> = ({ onClose }) => {
  const navigate = useNavigate(); // Hook for navigation after logout

  // --- Logout Handler ---
  const handleLogout = async () => {
    console.log("Attempting to log out (DashboardLayout1)...");
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      // AuthProvider's onAuthStateChanged listener will handle the state update.
      // Optional: Navigate to sign-in page immediately.
      navigate("/signin"); // Or '/' if public layout handles root
    } catch (error) {
      console.error("Error signing out:", error);
      // Optionally display an error message to the user
    }
  };
  // --- End Logout Handler ---
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
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: "300px",
          backgroundColor: "#f4f4f4",
          zIndex: 1000,
          padding: "20px",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        {/* <button
          onClick={onClose}
          style={{
            padding: "8px 12px",
            backgroundColor: "#6D5A4F",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Close
        </button> */}
        {/* --- Logout Button Added Here --- */}
        <button
          onClick={handleLogout}
          style={{
            padding: "10px 15px",
            backgroundColor: "#dc3545", // Red color for logout
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            // marginLeft: "22vh",
          }}
        >
          Log Out
        </button>{" "}
        {/* DATABASE TODO: Connect the database information to store here: */}
        {/* --- End Logout Button --- */}
        <h2>Account Settings</h2>
        <p>Name: </p>
        <p>Email: </p>
        <p>Total Points: </p>
        <p>Current Streak: </p>
        <p>Last Tracked Attendance: </p>
        <p>Restored Streak Count: </p>
        <h2>User Preferences</h2>
        <p>Theme: </p>
        <p>Enable Notifications? </p>
      </motion.div>
    </>
  );
};

export default AccountSettings;
