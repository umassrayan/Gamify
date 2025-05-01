// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase'; // Import your initialized auth object

// Define the shape of the context data
interface AuthContextType {
    currentUser: User | null;
    loading: boolean; // Optional: To handle initial auth state loading
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    loading: true,
});

// Custom hook to use the auth context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// The provider component
interface AuthProviderProps {
    children: ReactNode; // To wrap around other components
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Start loading

    useEffect(() => {
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user ? user.uid : 'No user');
            setCurrentUser(user); // Set user (null if logged out)
            setLoading(false); // Finished loading initial state
        });

        // Cleanup subscription on unmount
        return unsubscribe;
    }, []); // Run only once on mount

    const value = {
        currentUser,
        loading,
        // You could add login/logout/signup functions here if preferred,
        // but often components call Firebase functions directly
    };

    // Don't render children until initial auth state is determined
    // Or show a loading spinner
    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
