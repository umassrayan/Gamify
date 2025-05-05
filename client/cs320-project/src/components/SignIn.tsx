// src/components/SignIn.tsx
// Merged: Functionality from previous steps + Structure/Styling from user's latest request

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import { signInWithEmailAndPassword } from "firebase/auth"; // Firebase sign-in function
import { auth } from "../firebase"; // Your initialized auth instance
import { FirebaseError } from "firebase/app"; // For specific error handling

// Using the structure and state variables from the user's provided code
const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  // Adding back isLoading state for button feedback
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Merging handleSubmit logic: Using user's state variables + robust error handling + correct navigation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation from user's code
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // Add loading state handling
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      console.log("Attempting Firebase sign-in for:", email);
      // Call Firebase sign-in using direct state variables
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Firebase sign-in successful.");

      // AuthProvider handles state change, navigate to root for dashboard
      console.log("Navigating to root route for dashboard...");
      navigate("/"); // *** Corrected navigation target ***

      // No need to setIsLoading(false) on success due to navigation
    } catch (err) {
      // Using robust FirebaseError handling
      console.error("Firebase sign-in error:", err);
      if (err instanceof FirebaseError) {
        console.error("Firebase Error Code:", err.code);
        if (
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password" ||
          err.code === "auth/invalid-credential"
        ) {
          setError("Invalid email or password. Please try again.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else {
          setError("Failed to sign in. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please check your connection.");
        console.error("Non-Firebase Error:", err);
      }
      // Set loading false only on error
      setIsLoading(false);
    }
  };

  // Using the styles object exactly as provided by the user
  const styles: { [key: string]: React.CSSProperties } = {
    page: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F6F4F2",
    },
    form: {
      backgroundColor: "#fff",
      padding: "2rem",
      borderRadius: "10px",
      width: "100%", // From user's code
      maxWidth: "400px", // From user's code
      boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    title: {
      marginBottom: "1rem",
      textAlign: "center",
    },
    error: {
      color: "red",
      fontSize: "0.9rem",
      textAlign: "center",
      // Optional: Add background/border back if desired
      // backgroundColor: '#f8d7da',
      // padding: '0.5rem',
      // borderRadius: '5px',
      // border: '1px solid #f5c6cb',
    },
    input: {
      padding: "0.75rem",
      fontSize: "1rem",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    button: {
      padding: "0.75rem",
      fontSize: "1rem",
      backgroundColor: "#6E645E",
      color: "white",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    link: {
      fontSize: "0.9rem",
      textAlign: "center",
    },
  };

  // Using the JSX structure exactly as provided by the user,
  // but adding disabled state to button and using <Link> component
  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Sign In</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required // Added required for basic validation
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required // Added required for basic validation
        />

        {/* Added disabled state and loading text */}
        <button type="submit" style={styles.button} disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </button>

        {/* Using <Link> for correct client-side routing */}
        <p style={styles.link}>
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
