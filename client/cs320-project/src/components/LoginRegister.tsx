// src/components/PublicAppLayout.tsx
import React from 'react';
// *** REMOVE Router import if it was here: import { BrowserRouter as Router, ... } from 'react-router-dom'; ***
import { Routes, Route, Navigate } from 'react-router-dom'; // Keep Routes, Route, etc.
import WelcomePage from './WelcomePage';
import SignIn from './SignIn';
import SignUp from './SignUp';

// Remove props interface if onLoginSuccess is no longer needed due to context
// interface PublicAppLayoutProps { ... }

const PublicAppLayout: React.FC = (/* Remove props if not needed */) => {
    return (
        <div>
            {' '}
            {/* Or Fragment <></> */}
            {/* *** NO <Router> HERE *** */}
            <Routes>
                <Route path="/" element={<WelcomePage />} />
                <Route
                    path="/signup"
                    // Pass props directly if needed, or SignUp can use context/navigate itself
                    element={<SignUp />}
                />
                <Route path="/signin" element={<SignIn />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            {/* *** NO </Router> HERE *** */}
        </div>
    );
};

export default PublicAppLayout;
