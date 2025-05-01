import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db, doc, setDoc } from '../firebase.ts'; // ← add Firestore imports :contentReference[oaicite:4]{index=4}&#8203;:contentReference[oaicite:5]{index=5}
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // ← auth functions

const SignUp = () => {
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // ← create the user
            const userCred = await createUserWithEmailAndPassword(auth, email, password);

            // ← (optional) set displayName on the Firebase user
            await updateProfile(userCred.user, {
                displayName: `${firstName} ${lastName}`,
            });

            // ← store any extra data in Firestore
            await setDoc(
                doc(db, 'users', userCred.user.uid),
                {
                    firstName,
                    lastName,
                    email,
                    createdAt: new Date(),
                },
                { merge: true },
            );

            setError('');
            navigate('/dashboard'); // ← redirect
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred');
            }
        }
    };

    return (
        <div style={styles.page}>
            <form onSubmit={handleSubmit} style={styles.form}>
                <h2 style={styles.title}>Create Account</h2>

                {error && <p style={styles.error}>{error}</p>}

                <div className="name-row" style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        style={{ ...styles.input, width: 'calc(50% - 0.25rem)' }}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        style={{ ...styles.input, width: 'calc(50% - 0.25rem)' }}
                    />
                </div>

                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

                <button type="submit" style={styles.button}>
                    Sign Up
                </button>

                <p style={styles.link}>
                    Already have an account? <a href="/signin">Sign In</a>
                </p>
            </form>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F6F4F2',
    },
    form: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '10px',
        maxWidth: '500px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    title: {
        marginBottom: '1rem',
        textAlign: 'center',
    },
    error: {
        color: 'red',
        fontSize: '0.9rem',
        textAlign: 'center',
    },
    input: {
        padding: '0.75rem',
        fontSize: '1rem',
        border: '1px solid #ccc',
        borderRadius: '5px',
    },
    button: {
        padding: '0.75rem',
        fontSize: '1rem',
        backgroundColor: '#6E645E',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    link: {
        fontSize: '0.9rem',
        textAlign: 'center',
    },
};

export default SignUp;
