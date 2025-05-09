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

const MAX_STREAK_GOAL = 21;

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<UserStreak[]>([]);

  useEffect(() => {
    const sorted = [...fakeData].sort((a, b) => b.streak - a.streak);
    setUsers(sorted);
  }, []);

  const getMedal = (rank: number) => {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `${rank + 1}`;
  };

  return (
    <div style={boardStyle}>
      <h2 style={titleStyle}>Leaderboard</h2>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Streak</th>
            <th style={thStyle}>Progress</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const progress = Math.min(user.streak / MAX_STREAK_GOAL, 1);
            return (
              <tr
                key={user.userId}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faf8f6" : "#e6e2df",
                  transition: "background-color 0.3s ease",
                }}
              >
                <td style={tdStyle}>{getMedal(index)}</td>
                <td style={tdStyle}>{user.displayName}</td>
                <td style={tdStyle}>{user.streak}</td>
                <td style={tdStyle}>
                  <div style={progressContainer}>
                    <div
                      style={{
                        ...progressBar,
                        width: `${progress * 100}%`,
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Styles
const boardStyle: React.CSSProperties = {
  backgroundColor: "#f4f1ee",
  borderRadius: "8px",
  padding: "10px",
  position: "relative",
  height: "32vh",
};

const titleStyle: React.CSSProperties = {
  margin: "0 0 10px 0",
  color: "#3c2f2f",
  fontSize: "20px",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#fff",
  border: "none",
  borderRadius: "4px",
  overflow: "hidden",
};

const theadStyle: React.CSSProperties = {
  backgroundColor: "#d6cfc7",
};

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

const progressContainer: React.CSSProperties = {
  backgroundColor: "#ddd",
  height: "8px",
  borderRadius: "4px",
  overflow: "hidden",
};

const progressBar: React.CSSProperties = {
  backgroundColor: "#5a4c42",
  height: "100%",
};

export default Leaderboard;
