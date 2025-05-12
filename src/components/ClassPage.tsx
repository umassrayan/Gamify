import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ClassBoard from './ClassBoard';
import ProgressBar from './ProgressBar';
import Account from './Account';
import FocusTimer from './FocusTimer';
import { AnimatePresence } from 'framer-motion';
import AccountSettings from './AccountSettings';
import Leaderboard from './Leaderboard';
import WeeklyAgenda from './WeeklyAgenda';
import ToDo from './ToDo';
import { useCourseProgress } from './ProgressBarHook';
import ClassAttendanceModule from './attendance/ClassAttendanceModule'; // Adjust path

// Utility function to format duration from seconds

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ClassPage: React.FC = () => {
    const { id: classCode } = useParams<{ id: string }>();
    const [weeklySeconds, setWeeklySeconds] = useState(0);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const courseProgress = useCourseProgress(); // <<< Use the hook here
    console.log(weeklySeconds);
    const { day } = useParams(); // read day from URL (like /todo/Monday)
    if (!googleMapsApiKey) {
        return <div style={{ padding: '20px', color: 'red' }}>Error: Google Maps API Key is not configured.</div>;
    }
    if (!classCode) {
        return <div>Error: Class not found!</div>;
    }

    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <div>
                <ProgressBar progress={courseProgress} />
                <Account onClick={() => setSidebarOpen(true)} />
                <AnimatePresence>{isSidebarOpen && <AccountSettings onClose={() => setSidebarOpen(false)} />}</AnimatePresence>
            </div>

            {/* Main content */}
            {/* <div
        style={{
          padding: "15px",
          display: "grid",
          gap: "20px",
        }}
      > */}
            {/* <Calendar classFilter={classCode} /> */}

            {/* <div style={{ display: "flex", gap: "20px", flexGrow: 1 }}> */}
            {/* Left: Focus + Time Summary */}
            {/* <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <FocusTimer
              classCode={classCode}
              setWeeklySeconds={setWeeklySeconds}
            />
            <Leaderboard />
            <div style={{ marginTop: "1rem", textAlign: "center" }}> */}
            {/* <div style={{ fontWeight: "bold" }}>
                {formatDuration(weeklySeconds)} Focused this week
              </div> */}
            {/* </div>
          </div> */}
            {/* Right: Class board */}
            {/* <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {day ? <ToDo day={day} /> : <WeeklyAgenda />}
            <ClassBoard />
          </div>
        </div> */}

            {/* ------------------------------------------------- */}

            <div
                style={{
                    padding: '15px', // Adds gap to the right
                    display: 'grid', // Using grid as in the original comment
                    gap: '20px', // Adds gap in between assignments, classes, and calendar, weekly agenda
                    marginLeft: '-15px',
                }}
            >
                <div style={{ display: 'flex', marginTop: '10px' }}>
                    <FocusTimer classCode={classCode} setWeeklySeconds={setWeeklySeconds} />
                    <div style={{ flex: 1 }}>
                        {/* --- SIMPLIFIED MODULE USAGE --- */}
                        <ClassAttendanceModule googleMapsApiKey={googleMapsApiKey} />
                    </div>
                    {/* -----------------------INSERT GOOGLE LOCATION HERE-------------------------- */}
                    {day ? <ToDo day={day} /> : <WeeklyAgenda />}
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: 2, display: 'flex', flexDirection: 'column' }}>
                        <Leaderboard classCode={classCode} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <ClassBoard />
                    </div>
                </div>
            </div>

            {/* ------------------------------------------------- */}
        </div>
        // </div>
    );
};

export default ClassPage;
