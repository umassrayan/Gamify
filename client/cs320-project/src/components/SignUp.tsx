// src/components/SignUp.tsx
// Merged Version: Functionality from "current" + Structure/Styling from "previous"

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Imports needed for the "current" functionality's Firebase logic
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db, doc, setDoc } from '../firebase'; // Using imports from "current" version
import { FirebaseError } from 'firebase/app'; // Using import from "current" version
import { serverTimestamp, collection } from 'firebase/firestore';

// Using state structure from "previous" version to match JSX
const SignUp: React.FC = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    // Adding isLoading state from the "current" functionality
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Using the handleSubmit logic primarily from the "current" version,
    // but adapted to use the state variables from the "previous" version.
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Using validation from "previous" version (checking all fields)
        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        // Adding password length check from "current" version's logic
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        // Setting loading state (from "current" version)
        setIsLoading(true);
        setError(''); // Clear previous errors (was missing setError('') in previous, good practice)

        try {
            console.log('Attempting Firebase registration for:', email);
            // Using Firebase function call from "current" version, with adapted state vars
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Firebase user created successfully:', user.uid);

            // --- Using Firestore saving logic inspired by "current" version ---
            // --- Adapted to save separate firstName/lastName from "previous" state structure ---
            try {
                const userDocRef = doc(db, 'users', user.uid);
                await setDoc(userDocRef, {
                    name: `${firstName} ${lastName}`,
                    email: user.email,
                    currentStreak: 0,
                    lastAttendanceDateTime: serverTimestamp(), // You could also use serverTimestamp() if imported
                    streakRestoreCount: 0,
                    totalPoints: 0,
                    settings: {
                        notificationsEnabled: true,
                        theme: 'light', // or 'dark' depending on your default
                    },
                });
                // 2. Create example assignment
                const assignmentsRef = collection(userDocRef, 'assignments');
                await setDoc(doc(assignmentsRef), {
                calendarEventId: 'event001',
                completed: false,
                description: 'Welcome assignment to get started!',
                dueDate: serverTimestamp(), // or use new Date()
                title: 'Intro Task',
                });

                // 3. Create example calendar event
                const calendarRef = collection(userDocRef, 'calendarEvents');
                await setDoc(doc(calendarRef), {
                colorTag: 'default',
                startTime: serverTimestamp(),
                endTime: serverTimestamp(), // same here — replace with actual start/end if needed
                title: 'Welcome Session',
                type: 'custom',
                });
                console.log('User data saved to Firestore');
            } catch (firestoreError) {
                console.error('Error saving user data to Firestore:', firestoreError);
                // Decide how to handle this - maybe log it but still proceed?
                // Or set an error message specific to this failure
            }
            // --- End Firestore section ---

            // Navigate based on "current" version's logic
            console.log('Navigating to dashboard...');
            navigate('/'); // Using '/' from "current" version

            // No need to setIsLoading(false) on success because we navigate away
        } catch (err) {
            // Using error handling from "current" version
            console.error('Firebase registration error:', err);

            if (err instanceof FirebaseError) {
                console.error('Firebase Error Code:', err.code);
                if (err.code === 'auth/email-already-in-use') {
                    setError('This email address is already registered.');
                } else if (err.code === 'auth/weak-password') {
                    setError('Password is too weak. Minimum 6 characters required.');
                } else {
                    setError(err.message || 'Failed to register. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
                console.error('Non-Firebase Error:', err);
            }
            // Set loading false only on error (from "current" version)
            setIsLoading(false);
        }
    };

    // --- Using JSX structure and inline styles from "previous" version ---
    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Create Account</h2>

                {/* Using error display style from "previous" version's styles object */}
                {error && <p style={styles.error}>{error}</p>}

                {/* Keeping First/Last name structure from "previous" version */}
                <div className="name-row" style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ ...styles.input, width: 'calc(50% - 0.25rem)' }}
                        required // Added required attribute for basic browser validation
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ ...styles.input, width: 'calc(50% - 0.25rem)' }}
                        required // Added required attribute
                    />
                </div>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={styles.input}
                    required // Added required attribute
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required // Added required attribute
                />

                {/* Using button style from "previous" version, adding disabled state */}
                <button type="submit" style={styles.button} disabled={isLoading}>
                    {/* Adding loading text from "current" version */}
                    {isLoading ? 'Registering...' : 'Sign Up'}
                </button>

                {/* Keeping the sign-in link from "previous" version */}
                <p style={styles.link}>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </form>
        </div>
    );
};

// --- Keeping the styles object exactly from the "previous" version ---
const styles: { [key: string]: React.CSSProperties } = {
    page: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4F2', // Light beige background
    },
    form: {
        backgroundColor: '#fff', // White form background
        padding: '2rem',
        borderRadius: '10px',
        minWidth: '350px', // Ensure minimum width
        maxWidth: '500px', // Max width
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)', // Subtle shadow
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem', // Spacing between elements
    },
    title: {
        marginBottom: '1rem',
        textAlign: 'center',
        color: '#333', // Darker title color
    },
    error: {
        color: '#dc3545', // Bootstrap's danger color
        fontSize: '0.9rem',
        textAlign: 'center',
        backgroundColor: '#f8d7da', // Light red background for error
        padding: '0.5rem',
        borderRadius: '5px',
        border: '1px solid #f5c6cb',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
        boxSizing: 'border-box', // Include padding and border in element's total width/height
    },
    button: {
        padding: '0.75rem',
        fontSize: '1rem',
        backgroundColor: '#6E645E', // Muted brown color
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease', // Smooth hover transition
        marginTop: '0.5rem', // Add some space above the button
    },
    // Add hover style for button - cannot be done purely inline easily,
    // but could add a class and define hover in CSS file if needed.
    // For now, keep as is.
    link: {
        fontSize: '0.9rem',
        textAlign: 'center',
        marginTop: '1rem', // Add space above the link
    },
    // Link styling within the paragraph
    'link a': {
        // Note: This selector won't work directly in inline styles object
        color: '#6E645E', // Match button color
        textDecoration: 'none',
    },
    'link a:hover': {
        // Hover style for link
        textDecoration: 'underline',
    },
};
// Note: Selectors like 'link a' and pseudo-classes like ':hover' in the 'styles' object
// above won't actually work when applied via inline `style={...}` props.
// They are left here conceptually from the original object structure but would need
// to be implemented using actual CSS classes and stylesheets for hover effects etc.
// The basic styles for page, form, input, button, etc. will work.

export default SignUp;
