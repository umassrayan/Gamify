import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: 'gamify-cs320.firebaseapp.com',
    projectId: 'gamify-cs320',
    storageBucket: 'gamify-cs320.appspot.com',
    messagingSenderId: '641481633457',
    appId: '1:641481633457:web:48a91983215ec882a5fc90',
    measurementId: 'G-RT0P353P49',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider, doc, setDoc };
