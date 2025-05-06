// src/components/DashboardLayout1.tsx
import React from 'react';
// Make sure Router is removed if it's handled in App.tsx
import { Routes, Route, useNavigate } from 'react-router-dom'; // Import useNavigate
import { signOut } from 'firebase/auth'; // Import signOut function
import { auth } from '../firebase'; // Import your auth instance (adjust path if needed)

// Assuming these components exist and paths are correct
import Calendar from './Calendar';
import AssignmentBoard from './Assignment'; // Ensure correct path/name
import ProgressBar from './ProgressBar';
import Account from './Account';
import AccountSettings from './AccountSettings';

import OnboardingFlow from './Onboarding';
const DashboardLayout1: React.FC = () => {
    // Example progress state (you'll likely manage this differently)
    const navigate = useNavigate(); // Hook for navigation after logout

    // --- Logout Handler ---
    const handleLogout = async () => {
        console.log('Attempting to log out (DashboardLayout1)...');
        try {
            await signOut(auth);
            console.log('User signed out successfully.');
            // AuthProvider's onAuthStateChanged listener will handle the state update.
            // Optional: Navigate to sign-in page immediately.
            navigate('/signin'); // Or '/' if public layout handles root
        } catch (error) {
            console.error('Error signing out:', error);
            // Optionally display an error message to the user
        }
    };
    // --- End Logout Handler ---

    return (
        // Router should be removed if App.tsx has the main Router
        <Routes>
            <Route
                path="/" // Or maybe '/dashboard' if PublicAppLayout handles '/'
                element={
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {' '}
                        {/* Added gap for spacing */}
                        {/* Left Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {' '}
                            {/* Added flex column and gap */}
                            <ProgressBar progress={65} />
                            <Account />
                            {/* --- Logout Button Added Here --- */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: '10px 15px',
                                    backgroundColor: '#dc3545', // Red color for logout
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    marginTop: 'auto', // Push button towards bottom if container has height
                                }}
                            >
                                Log Out
                            </button>
                            {/* --- End Logout Button --- */}
                        </div>
                        {/* Right Column */}
                        <div
                            style={{
                                fontFamily: 'sans-serif',
                                backgroundColor: '#fff',
                                minHeight: '100vh', // Ensure it takes height
                                padding: '15px',
                                display: 'grid', // Using grid as in the original comment
                                gap: '10px',
                                flex: 1, // Allow this part to take up space
                                border: '1px solid #eee', // Added subtle border
                                borderRadius: '8px', // Added border radius
                            }}
                        >
                            <Calendar />
                            <AssignmentBoard />
                        </div>
                    </div>
                }
            />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/onboarding" element={<OnboardingFlow />} />
            {/* Add other dashboard-specific routes here */}
            {/* Example: Redirect unmatched dashboard routes */}
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
    );
};

export default DashboardLayout1;
