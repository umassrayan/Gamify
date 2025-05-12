// src/api/firestore.ts
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs, updateDoc, addDoc, query, where } from "firebase/firestore";

// Fetch a user's profile
export async function getUserProfile(userId: string) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    throw new Error("User not found");
  }
}

// Fetch a user's assignments
export async function getUserAssignments(userId: string) {
    const assignmentsRef = collection(db, "users", userId, "assignments");
    const querySnapshot = await getDocs(assignmentsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  
  export async function updateAssignmentCompletedStatus(userId: string, assignmentId: string, completed: boolean) {
    const assignmentRef = doc(db, "users", userId, "assignments", assignmentId);
    await updateDoc(assignmentRef, { completed });
  }

// Fetch a user's calendar events
export async function getUserCalendarEvents(userId: string) {
  const calendarEventsRef = collection(db, "users", userId, "calendarEvents");
  const querySnapshot = await getDocs(calendarEventsRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Fetch all courses (or filter by studentId if needed)
export async function getCoursesForUser(userId: string) {
  const coursesRef = collection(db, "courses");
  const q = query(coursesRef, where("studentIds", "array-contains", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Add a new calendar event for the user
  export async function addUserCalendarEvent(
    userId: string,
    event: {
      title: string;
      startTime: Date;
      endTime: Date;
      classCode?: string | null; // allow class-specific filtering
    }
  ) {
    const calendarEventsRef = collection(db, "users", userId, "calendarEvents");
    await addDoc(calendarEventsRef, {
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      classCode: event.classCode || null, // write classCode if provided
      type: "custom",
      colorTag: "default",
    });
  }