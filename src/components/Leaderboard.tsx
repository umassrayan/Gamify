import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

interface UserStreak {
  userId: string;
  displayName: string;
  streak: number;
}

interface LeaderboardProps {
  classCode: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ classCode }) => {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<UserStreak[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      if (!currentUser || !classCode) return;

      console.log("📊 Fetching leaderboard for class:", classCode);

      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const leaderboardData: UserStreak[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();
          const coursesSnapshot = await getDocs(
            collection(db, `users/${userId}/courses`)
          );

          for (const courseDoc of coursesSnapshot.docs) {
            const courseData = courseDoc.data();

            if (!Array.isArray(courseData.classes)) continue;

            const matchedClass = courseData.classes.find(
              (cls: any) =>
                cls.name === classCode && typeof cls.streak === "number"
            );

            if (matchedClass) {
              leaderboardData.push({
                userId,
                displayName: userData.name || "Unknown",
                streak: matchedClass.streak,
              });
              break;
            }
          }
        }

        setUsers(leaderboardData);
      } catch (err) {
        console.error("Error fetching leaderboard data:", err);
      }
    };

    fetchLeaderboardData();
  }, [classCode, currentUser]);

  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  // ✅ Accurate tie-aware ranking
  const rankedAll: (UserStreak & { __rank: number })[] = [];
  let lastStreak: number | null = null;
  let lastRank = 0;

  users
    .sort((a, b) => b.streak - a.streak)
    .forEach((user, index) => {
      const isTie = user.streak === lastStreak;
      const rank = isTie ? lastRank : index + 1;

      rankedAll.push({ ...user, __rank: rank });
      lastStreak = user.streak;
      lastRank = rank;
    });

  const rankedUsers = rankedAll.slice(0, 5);

  return (
    <div style={boardStyle}>
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Rank</th>
            <th style={thStyle}>User</th>
            <th style={thStyle}>Streak</th>
          </tr>
        </thead>
        <tbody>
          {rankedUsers.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: "1rem", color: "#888" }}>
                No streaks found for {classCode}.
              </td>
            </tr>
          ) : (
            rankedUsers.map((user, index) => (
              <tr
                key={user.userId}
                style={{
                  backgroundColor: index % 2 === 0 ? "#faf8f6" : "#e6e2df",
                  transition: "background-color 0.3s ease",
                }}
              >
                <td style={tdStyle}>{getMedal(user.__rank)}</td>
                <td style={tdStyle}>{user.displayName}</td>
                <td style={tdStyle}>{user.streak}</td>
              </tr>
            ))
          )}
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

export default Leaderboard;
