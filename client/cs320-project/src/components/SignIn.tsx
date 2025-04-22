import React, { useState } from "react";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // DATABASE/BACKEND TODO: implement firebase auth and data info here
    console.log("Signing in with:", { email, password });
    setError("");
  };

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
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Sign In
        </button>

        <p style={styles.link}>
          Don't have an account? <a href="/signup">Create one</a>
        </p>
      </form>
    </div>
  );
};

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
    width: "100%",
    maxWidth: "400px",
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
    color: "4B382D",
  },
};

export default SignIn;
