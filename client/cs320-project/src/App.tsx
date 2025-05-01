// src/App.tsx
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import the custom hook

// Import layouts
import PublicAppLayout from './components/LoginRegister';

import './App.css';
import DashboardLayout1 from './components/DashboardLayout1';

const App: React.FC = () => {
    const { currentUser } = useAuth(); // Get the current user from context
    console.log('Current User in App.tsx:', currentUser);

    return (
        <Router>
            {currentUser ? (
                // If user exists (is logged in), show dashboard
                <DashboardLayout1 /> // No need to pass logout manually if using context/firebase directly
            ) : (
                // If no user (logged out), show public layout
                <PublicAppLayout /> // No need to pass login success callback
            )}
        </Router>
    );
};

export default App;
