// src/App.tsx
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useParams,
  Navigate,
} from 'react-router-dom';
import ClassAttendanceModule, { ClassDetails } from './ClassAttendanceModule';
import './App.css';

// --- Sample Firestore Class IDs ---
const SAMPLE_CLASS_ID_1 = 'math101';
const SAMPLE_CLASS_ID_2 = 'physicsLabA';

// --- Collection of Dummy Class Data ---
interface DummyClassCollection {
    [key: string]: ClassDetails; // Use a string key like "set1", "set2" or a descriptive ID
}

const allDummyClasses: DummyClassCollection = {
    cs101: {
        // Key used in the URL, e.g., /dummy-class/cs101
        id: 'DUMMY_CS101',
        className: 'Intro to CS (Dummy Set 1)',
        address: '140 Governors Dr, Amherst, MA 01003', // UMass CS Building area
    },
    art202: {
        // Key for the second dummy class
        id: 'DUMMY_ART202',
        className: 'Art History (Dummy Set 2)',
        address: 'lederle graduate research tower', // Mead Art Museum
    },
    libraryStudy: {
        id: 'DUMMY_LIB001',
        className: 'Library Study Group (Dummy Set 3)',
        address: 'worcester dining commons', // UMass Library
    },
    // Add more dummy class sets here with unique keys

};

const dummyUserForTesting = 'testDummyUser456';

// --- Firestore-backed Class Page ---
const FirestoreClassPage: React.FC = () => {
  const { classIdParam } = useParams<{ classIdParam: string }>();
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) return <div className="error-message">Missing API Key</div>;
  if (!classIdParam) return <Navigate to="/" replace />;

  return (
    <div className="page-container">
      <h2>Firestore-Backed Class: {classIdParam}</h2>
      <p>This uses Firestore with <code>classId</code>.</p>
      <ClassAttendanceModule
        classId={classIdParam}
        googleMapsApiKey={googleMapsApiKey}
        userId={dummyUserForTesting}
      />
    </div>
  );
};

// --- Dummy Class Page ---
const DummyDataClassPage: React.FC = () => {
  const { dummyKey } = useParams<{ dummyKey: string }>();
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!googleMapsApiKey) return <div className="error-message">Missing API Key</div>;

  const selected = dummyKey ? allDummyClasses[dummyKey] : null;
  if (!selected) {
    return (
      <div className="page-container error-message">
        <h2>Dummy Class Not Found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h2>Dummy Data Class: {selected.className}</h2>
      <ClassAttendanceModule
        initialClassDetails={selected}
        googleMapsApiKey={googleMapsApiKey}
        userId={dummyUserForTesting}
      />
    </div>
  );
};

// --- ✅ New User-Nested Class Page ---
const UserCourseClassPage: React.FC = () => {
  const [classDetails, setClassDetails] = useState<ClassDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const USER_ID = 'E0OfQZSolkauQXT7rRtQHhhalXD3';
  const COURSE_ID = 'AErLbp8O8BBLEjui87ao';

  useEffect(() => {
    const fetch = async () => {
      try {
        const { db } = await import('./FirebaseConfig');
        const { doc, getDoc } = await import('firebase/firestore');

        const courseRef = doc(db, `users/${USER_ID}/courses/${COURSE_ID}`);
        const snap = await getDoc(courseRef);
        const classObj = snap.data()?.classes?.[0];

        if (classObj?.name && classObj?.location) {
          setClassDetails({
            id: 'userCourseClass',
            className: classObj.name,
            address: classObj.location,
            radius: 75,
          });
        }
      } catch (err) {
        console.error('Failed to fetch nested user course:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  if (!googleMapsApiKey) return <p>Missing API key.</p>;
  if (loading) return <p>Loading user course...</p>;
  if (!classDetails) return <p>No valid class found in user course.</p>;

  return (
    <div className="page-container">
      <h2>Shreya’s CS320 from Nested User Course</h2>
      <ClassAttendanceModule
        googleMapsApiKey={googleMapsApiKey}
        userId={USER_ID}
        initialClassDetails={classDetails}
      />
    </div>
  );
};

// --- Main Home Page ---
const HomePage: React.FC = () => (
  <div className="page-container">
    <h1>Class Attendance Module - Test Harness</h1>
    <p>Select a mode to test the attendance module:</p>
    <nav>
      <ul>
        <li>
          <strong>Dummy Data Tests (No Firebase):</strong>
          <ul>
            {Object.keys(allDummyClasses).map((key) => (
              <li key={key}>
                <Link to={`/dummy-class/${key}`}>
                  Test Dummy: {allDummyClasses[key].className} (Key: {key})
                </Link>
              </li>
            ))}
          </ul>
          <p className="small-text">Uses hardcoded dummy class details.</p>
        </li>
        <hr />
        <li>
          <strong>Firestore-Backed Tests:</strong>
          <ul>
            <li><Link to={`/firestore-class/${SAMPLE_CLASS_ID_1}`}>Test Firestore Class: {SAMPLE_CLASS_ID_1}</Link></li>
            <li><Link to={`/firestore-class/${SAMPLE_CLASS_ID_2}`}>Test Firestore Class: {SAMPLE_CLASS_ID_2}</Link></li>
            <li><Link to="/firestore-class/nonExistentClassID">Test Firestore With Non-Existent Class ID</Link></li>
          </ul>
          <p className="small-text">Requires top-level <code>classes</code> collection.</p>
        </li>
        <hr />
        <li>
          <strong>User-Nested Class Test:</strong>
          <ul>
            <li>
              <Link to="/user-nested-class">
                Test User-Course Firestore Class: CS320 (Shreya)
              </Link>
            </li>
          </ul>
          <p className="small-text">Fetches class from nested path <code>users/&lt;uid&gt;/courses/&lt;courseId&gt;</code>.</p>
        </li>
      </ul>
    </nav>
  </div>
);

// --- App Component ---
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">Demo: Location-Based Attendance Module</header>
        <main className="App-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dummy-class/:dummyKey" element={<DummyDataClassPage />} />
            <Route path="/firestore-class/:classIdParam" element={<FirestoreClassPage />} />
            <Route path="/user-nested-class" element={<UserCourseClassPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

