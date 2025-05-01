// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   Timestamp
// } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyAhAXbtLOmC-fW7u_3Yhux_1yy-OZTJ3Eo",
//   authDomain: "gamify-cs320.firebaseapp.com",
//   projectId: "gamify-cs320",
//   storageBucket: "gamify-cs320.firebasestorage.app",
//   messagingSenderId: "641481633457",
//   appId: "1:641481633457:web:48a91983215ec882a5fc90",
//   measurementId: "G-RT0P353P49"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// async function seedFirestore() {
//   try {
//     // Users
//     const userRef = await addDoc(collection(db, "users"), {
//       name: "John Doe",
//       email: "john@example.com",
//       totalPoints: 1200,
//       currentStreak: 5,
//       lastAttendanceDateTime: Timestamp.now(),
//       streakRestoreCount: 1,
//       settings: {
//         theme: "dark",
//         notificationsEnabled: true
//       }
//     });

//     const userId = userRef.id;

//     // Courses
//     const courseRef = await addDoc(collection(db, "courses"), {
//       title: "Introduction to Gamification",
//       code: "GAM101",
//       instructor: "Prof. Jane Smith",
//       schedule: { mon: "10:00 AM", wed: "10:00 AM" },
//       location: "Room 101",
//       studentIds: [userId]
//     });

//     const courseId = courseRef.id;

//     // Focus Logs
//     await addDoc(collection(db, "focusLogs"), {
//       userId,
//       startTime: Timestamp.fromDate(new Date("2025-04-18T09:00:00")),
//       endTime: Timestamp.fromDate(new Date("2025-04-18T10:00:00")),
//       duration: 60
//     });

//     // Tasks
//     await addDoc(collection(db, "tasks"), {
//       userId,
//       title: "Finish project proposal",
//       description: "Draft the proposal for the final app project.",
//       dueDate: Timestamp.fromDate(new Date("2025-04-20")),
//       calendarEventId: "event789",
//       completed: false,
//       courseId
//     });

//     // Attendance Logs
//     await addDoc(collection(db, "attendanceLogs"), {
//       userId,
//       courseId,
//       date: Timestamp.fromDate(new Date("2025-04-17")),
//       status: "present"
//     });

//     // Streak History
//     await addDoc(collection(db, "streakHistory"), {
//       userId,
//       date: Timestamp.fromDate(new Date("2025-04-17")),
//       streakLength: 5
//     });

//     // Assignments
//     await addDoc(collection(db, "assignments"), {
//       courseId,
//       title: "Midterm Presentation",
//       description: "15-minute demo and Q&A",
//       dueDate: Timestamp.fromDate(new Date("2025-04-22")),
//       calendarEventId: "event789",
//       points: 100
//     });

//     // Attendance Requirements
//     await addDoc(collection(db, "attendanceRequirements"), {
//       courseId,
//       checkInWindow: {
//         start: Timestamp.fromDate(new Date("2025-04-18T09:45:00")),
//         end: Timestamp.fromDate(new Date("2025-04-18T10:15:00"))
//       },
//       locationRequired: true
//     });

//     // Leaderboard
//     await addDoc(collection(db, "leaderboard"), {
//       topUsers: [
//         { userId, points: 1200 },
//         { userId: "xyz123", points: 950 }
//       ],
//       lastUpdated: Timestamp.now()
//     });

//     // Calendar Events
//     await addDoc(collection(db, "calendarEvents"), {
//       userId,
//       title: "Gamification Class",
//       type: "class",
//       relatedCourse: courseId,
//       startTime: Timestamp.fromDate(new Date("2025-04-19T10:00:00")),
//       endTime: Timestamp.fromDate(new Date("2025-04-19T11:00:00")),
//       repeat: "weekly",
//       colorTag: "blue"
//     });

//     // Streak Multipliers
//     await addDoc(collection(db, "streakMultipliers"), {
//       baseMultiplier: 1.5,
//       maxStreakCap: 30,
//       restoreCost: 100
//     });

//     console.log("🌟 Firestore seeded successfully!");
//   } catch (e) {
//     console.error("🔥 Error seeding Firestore: ", e);
//   }
// }

// seedFirestore();

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  Timestamp
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAhAXbtLOmC-fW7u_3Yhux_1yy-OZTJ3Eo",
  authDomain: "gamify-cs320.firebaseapp.com",
  projectId: "gamify-cs320",
  storageBucket: "gamify-cs320.appspot.com",
  messagingSenderId: "641481633457",
  appId: "1:641481633457:web:48a91983215ec882a5fc90",
  measurementId: "G-RT0P353P49"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirestore() {
  try {
    // Create user
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

    // Add user dashboard-level assignments
    await addDoc(collection(userRef, "assignments"), {
      title: "Draft project outline",
      description: "Initial plan for app structure",
      dueDate: Timestamp.fromDate(new Date("2025-04-23")),
      calendarEventId: "event001",
      completed: false
    });

    // Add user-level calendar event
    await addDoc(collection(userRef, "calendarEvents"), {
      title: "Team Brainstorm",
      type: "custom",
      startTime: Timestamp.fromDate(new Date("2025-04-20T16:00:00")),
      endTime: Timestamp.fromDate(new Date("2025-04-20T17:00:00")),
      repeat: "none",
      colorTag: "green"
    });

    // Create course
    const courseRef = await addDoc(collection(db, "courses"), {
      title: "Gamified Systems Design",
      code: "GAM200",
      instructor: "Prof. Jane Smith",
      schedule: { tue: "3:00 PM", thu: "3:00 PM" },
      location: "Room 201",
      studentIds: [userId]
    });

    // Subcollections under course
    const courseDocRef = doc(db, "courses", courseRef.id);

    // Class-specific assignment
    await addDoc(collection(courseDocRef, "assignments"), {
      title: "Gamification Pitch",
      description: "5-minute pitch for your app",
      dueDate: Timestamp.fromDate(new Date("2025-04-25")),
      calendarEventId: "event002",
      points: 50
    });

    // Class-specific focus log
    await addDoc(collection(courseDocRef, "focusLogs"), {
      userId,
      startTime: Timestamp.fromDate(new Date("2025-04-18T14:00:00")),
      endTime: Timestamp.fromDate(new Date("2025-04-18T15:00:00")),
      duration: 60
    });

    // Class-specific attendance log
    await addDoc(collection(courseDocRef, "attendanceLogs"), {
      userId,
      date: Timestamp.fromDate(new Date("2025-04-18")),
      status: "present"
    });

    // Class-specific leaderboard
    await addDoc(collection(courseDocRef, "leaderboard"), {
      topUsers: [
        { userId, points: 1200 },
        { userId: "placeholderId", points: 880 }
      ],
      lastUpdated: Timestamp.now()
    });

    // Class-specific attendance requirement
    await addDoc(collection(courseDocRef, "attendanceRequirements"), {
      checkInWindow: {
        start: Timestamp.fromDate(new Date("2025-04-18T14:45:00")),
        end: Timestamp.fromDate(new Date("2025-04-18T15:15:00"))
      },
      locationRequired: true
    });

    // Global multiplier config
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

