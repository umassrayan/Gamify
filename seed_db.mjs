import { initializeApp } from 'firebase/app';

import {
  getFirestore,
  collection,
  addDoc,
  doc,
  Timestamp,
  setDoc
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

const users = [
    { id: 'user1', name: 'Bob', streak: 12 },
    { id: 'user2', name: 'Eli', streak: 10 },
    { id: 'user3', name: 'Charlie', streak: 8 },
    { id: 'user4', name: 'Alice', streak: 5 },
    { id: 'user5', name: 'Dana', streak: 3 },
  ];
  
  const courseDocId = 'AErLbp8O8BBLEjui87ao'; // reusing the same ID as Shreya
  const location = 'Tobin Hall, 130 Hicks Way, Amherst, MA 01003, USA';
  
  const seedUsersWithCoursesArray = async () => {
    for (const user of users) {
      const userRef = doc(db, `users/${user.id}`);
      await setDoc(userRef, { name: user.name }, { merge: true });
  
      const courseRef = doc(db, `users/${user.id}/courses/${courseDocId}`);
      await setDoc(courseRef, {
        classes: [
          {
            name: 'CS320',
            location: "Tobin Hall, 130 Hicks Way, Amherst, MA 01003, USA",
            streak: user.streak,
          },
          {
            name: 'CS305',
            location: 'Ledederle',
          },
          {
            name: 'CS501',
            location: 'ILC',
          },
        ],
        onboardingComplete: true,
      });
    }
  
    console.log('Seeded users with CS320 and streaks');
  };
  
  seedUsersWithCoursesArray();