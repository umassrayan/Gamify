import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  Timestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhAXbtLOmC-fW7u_3Yhux_1yy-OZTJ3Eo",
  authDomain: "gamify-cs320.firebaseapp.com",
  projectId: "gamify-cs320",
  storageBucket: "gamify-cs320.firebasestorage.app",
  messagingSenderId: "641481633457",
  appId: "1:641481633457:web:48a91983215ec882a5fc90",
  measurementId: "G-RT0P353P49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestore() {
  try {
    // Users
    const userRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      email: "john@example.com",
      totalPoints: 1200,
      currentStreak: 5,
      lastAttendanceDateTime: Timestamp.now(),
      streakRestoreCount: 1,
      settings: {
        theme: "dark",
        notificationsEnabled: true
      }
    });

    const userId = userRef.id;

    // Courses
    const courseRef = await addDoc(collection(db, "courses"), {
      title: "Introduction to Gamification",
      code: "GAM101",
      instructor: "Prof. Jane Smith",
      schedule: { mon: "10:00 AM", wed: "10:00 AM" },
      location: "Room 101",
      studentIds: [userId]
    });

    const courseId = courseRef.id;

    // Focus Logs
    await addDoc(collection(db, "focusLogs"), {
      userId,
      startTime: Timestamp.fromDate(new Date("2025-04-18T09:00:00")),
      endTime: Timestamp.fromDate(new Date("2025-04-18T10:00:00")),
      duration: 60
    });

    // Tasks
    await addDoc(collection(db, "tasks"), {
      userId,
      title: "Finish project proposal",
      description: "Draft the proposal for the final app project.",
      dueDate: Timestamp.fromDate(new Date("2025-04-20")),
      completed: false,
      courseId
    });

    // Attendance Logs
    await addDoc(collection(db, "attendanceLogs"), {
      userId,
      courseId,
      date: Timestamp.fromDate(new Date("2025-04-17")),
      status: "present"
    });

    // Streak History
    await addDoc(collection(db, "streakHistory"), {
      userId,
      date: Timestamp.fromDate(new Date("2025-04-17")),
      streakLength: 5
    });

    // Assignments
    await addDoc(collection(db, "assignments"), {
      courseId,
      title: "Midterm Presentation",
      description: "15-minute demo and Q&A",
      dueDate: Timestamp.fromDate(new Date("2025-04-22")),
      points: 100
    });

    // Attendance Requirements
    await addDoc(collection(db, "attendanceRequirements"), {
      courseId,
      checkInWindow: {
        start: Timestamp.fromDate(new Date("2025-04-18T09:45:00")),
        end: Timestamp.fromDate(new Date("2025-04-18T10:15:00"))
      },
      locationRequired: true
    });

    // Leaderboard
    await addDoc(collection(db, "leaderboard"), {
      topUsers: [
        { userId, points: 1200 },
        { userId: "xyz123", points: 950 }
      ],
      lastUpdated: Timestamp.now()
    });

    // Calendar Events
    await addDoc(collection(db, "calendarEvents"), {
      userId,
      title: "Gamification Class",
      type: "class",
      relatedCourse: courseId,
      startTime: Timestamp.fromDate(new Date("2025-04-19T10:00:00")),
      endTime: Timestamp.fromDate(new Date("2025-04-19T11:00:00")),
      repeat: "weekly",
      colorTag: "blue"
    });

    // Streak Multipliers
    await addDoc(collection(db, "streakMultipliers"), {
      baseMultiplier: 1.5,
      maxStreakCap: 30,
      restoreCost: 100
    });

    console.log("🌟 Firestore seeded successfully!");
  } catch (e) {
    console.error("🔥 Error seeding Firestore: ", e);
  }
}

seedFirestore();
