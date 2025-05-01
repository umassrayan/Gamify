import { signOut } from 'firebase/auth';
import { auth } from '../../client/cs320-project/src/firebase';
import { useAuth } from './AuthProvider';

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="p-8">
            <h1 className="text-xl mb-2">Welcome, {user.email}!</h1>
            <button className="border rounded p-2" onClick={() => signOut(auth)}>
                Sign out
            </button>
        </div>
    );
}
