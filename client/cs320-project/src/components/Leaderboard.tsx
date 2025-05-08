import React, { useEffect, useState } from "react";

interface UserStreak {
  userId: string;
  displayName: string;
  streak: number;
}

const fakeData: UserStreak[] = [
  { userId: "1", displayName: "Alice", streak: 5 },
  { userId: "2", displayName: "Bob", streak: 12 },
  { userId: "3", displayName: "Charlie", streak: 8 },
  { userId: "4", displayName: "Dana", streak: 3 },
  { userId: "5", displayName: "Eli", streak: 10 },
];

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserStreak[]>([]);

  useEffect(() => {
    // Simulate fetching data
    const sorted = [...fakeData].sort((a, b) => b.streak - a.streak);
    setUsers(sorted);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#f4f1ee",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        🏆 Leaderboard
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <thead style={{ backgroundColor: "#d6cfc7" }}>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Streak</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.userId}
              style={{
                backgroundColor: index % 2 === 0 ? "#faf8f6" : "#e6e2df",
              }}
            >
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{user.displayName}</td>
              <td style={tdStyle}>{user.streak}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const thStyle: React.CSSProperties = {
  padding: "12px",
  color: "#3c2f2f",
  fontWeight: "bold",
  textAlign: "left",
  borderBottom: "1px solid #b0a9a1",
};

const tdStyle: React.CSSProperties = {
  padding: "10px",
  borderBottom: "1px solid #ddd",
  color: "#4a403a",
};

export default Leaderboard;
