import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db, doc, setDoc } from './firebase';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // 🔻 Write/merge a users/{uid} document for the DB team
                await setDoc(
                    doc(db, 'users', firebaseUser.uid),
                    {
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName ?? null,
                        lastLogin: new Date(),
                    },
                    { merge: true },
                );
            }
            setUser(firebaseUser);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>Loading…</p>;
    return <AuthCtx.Provider value={{ user }}>{children}</AuthCtx.Provider>;
}
