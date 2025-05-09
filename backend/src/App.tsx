// src/App.tsx (Test Harness)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, Navigate } from 'react-router-dom';
import ClassAttendanceModule, { ClassDetails } from './ClassAttendanceModule'; // Import ClassDetails type
import './App.css';
// import './firebaseConfig'; // Firebase init can be optional

// --- Sample Class IDs (for Firestore testing) ---
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
        radius: 75,
    },
    art202: {
        // Key for the second dummy class
        id: 'DUMMY_ART202',
        className: 'Art History (Dummy Set 2)',
        address: 'lederle graduate research tower', // Mead Art Museum
        radius: 75,
    },
    libraryStudy: {
        id: 'DUMMY_LIB001',
        className: 'Library Study Group (Dummy Set 3)',
        address: 'worcester dining commons', // UMass Library
        radius: 75,
    },
    // Add more dummy class sets here with unique keys
};

const dummyUserForTesting = 'testDummyUser456'; // Or make this selectable too if needed

// Component for Firestore-backed Class Module
const FirestoreClassPage: React.FC = () => {
    const { classIdParam } = useParams<{ classIdParam: string }>();
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
        return <div className="error-message">Error: Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY) is missing.</div>;
    }
    if (!classIdParam) return <Navigate to="/" replace />;

    return (
        <div className="page-container">
            <h2>Firestore-Backed Class: {classIdParam}</h2>
            <p>
                This page uses <code>ClassAttendanceModule</code> with Firebase.
            </p>
            <ClassAttendanceModule classId={classIdParam} googleMapsApiKey={googleMapsApiKey} userId={dummyUserForTesting} />
        </div>
    );
};

// Modified Component for Dummy Data Class Module
const DummyDataClassPage: React.FC = () => {
    const { dummyKey } = useParams<{ dummyKey: string }>(); // Get the key from URL
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!googleMapsApiKey) {
        return <div className="error-message">Error: Google Maps API Key (VITE_GOOGLE_MAPS_API_KEY) is missing.</div>;
    }

    const selectedDummyData = dummyKey ? allDummyClasses[dummyKey] : null;

    if (!selectedDummyData) {
        return (
            <div className="page-container error-message">
                <h2>Dummy Data Class Not Found</h2>
                <p>
                    No dummy data found for key: {dummyKey}. Check your <code>allDummyClasses</code> definition and URL.
                </p>
                <Link to="/">Go to Home</Link>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h2>Dummy Data Class: {selectedDummyData.className}</h2>
            <p>
                This page uses <code>ClassAttendanceModule</code> with hardcoded data (no Firebase calls) for set: <strong>{dummyKey}</strong>.
            </p>
            <ClassAttendanceModule
                initialClassDetails={selectedDummyData} // Pass the selected dummy data
                googleMapsApiKey={googleMapsApiKey}
                userId={dummyUserForTesting} // You can also make userId part of the dummy set if needed
            />
        </div>
    );
};

// Main Test Harness App
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
                    <p className="small-text">Uses hardcoded class name and location based on the selected set.</p>
                </li>
                <hr style={{ margin: '15px 0' }} />
                <li>
                    <strong>Firestore-Backed Tests:</strong>
                    <ul>
                        <li>
                            <Link to={`/firestore-class/${SAMPLE_CLASS_ID_1}`}>Test Firestore Class: {SAMPLE_CLASS_ID_1}</Link>
                        </li>
                        <li>
                            <Link to={`/firestore-class/${SAMPLE_CLASS_ID_2}`}>Test Firestore Class: {SAMPLE_CLASS_ID_2}</Link>
                        </li>
                        <li>
                            <Link to="/firestore-class/nonExistentClassID">Test Firestore With Non-Existent Class ID</Link>
                        </li>
                    </ul>
                    <p className="small-text">Requires Firebase setup and corresponding documents in Firestore.</p>
                </li>
            </ul>
        </nav>
        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>Setup Reminders:</h4>
            <ul className="small-text">
                <li>
                    Make sure your <code>.env.local</code> file has <code>VITE_Maps_API_KEY="YOUR_KEY"</code>.
                </li>
                <li>
                    For Firestore tests: Ensure <code>src/firebaseConfig.ts</code> has your credentials and sample data exists.
                </li>
            </ul>
        </div>
    </div>
);

function App() {
    // import('./firebaseConfig'); // Uncomment if actively testing Firestore routes

    return (
        <Router>
            <div className="App">
                <header className="App-header">Demo: Location-Based Attendance Module</header>
                <main className="App-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        {/* Route for different dummy data sets */}
                        <Route path="/dummy-class/:dummyKey" element={<DummyDataClassPage />} />
                        <Route path="/firestore-class/:classIdParam" element={<FirestoreClassPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
