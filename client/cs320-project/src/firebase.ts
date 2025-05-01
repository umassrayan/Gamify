// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAhAXbtLOmC-fW7u_3Yhux_1yy-OZTJ3Eo",
    authDomain: "gamify-cs320.firebaseapp.com",
    projectId: "gamify-cs320",
    storageBucket: "gamify-cs320.appspot.com",
    messagingSenderId: "641481633457",
    appId: "1:641481633457:web:48a91983215ec882a5fc90",
    measurementId: "G-RT0P353P49"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);
