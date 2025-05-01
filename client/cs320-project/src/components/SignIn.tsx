import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase.ts';
import { signInWithEmailAndPassword } from 'firebase/auth'; // ← and this one

const SignIn = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate(); // ← hook for redirect

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            // ← replace the TODO with this:
            await signInWithEmailAndPassword(auth, email, password);
            setError('');
            navigate('WelcomePage'); // ← go to protected area
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
                <h2 style={styles.title}>Sign In</h2>

                {error && <p style={styles.error}>{error}</p>}

                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} />

                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} />

                <button type="submit" style={styles.button}>
                    Sign In
                </button>

                <p style={styles.link}>
                    Don't have an account? <a href="/signup">Create one</a>
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
        width: '100%',
        maxWidth: '400px',
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

export default SignIn;
