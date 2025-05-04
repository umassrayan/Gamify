// src/main.tsx (or index.tsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import the provider
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            {' '}
            {/* Wrap App with the AuthProvider */}
            <App />
        </AuthProvider>
    </React.StrictMode>,
);
