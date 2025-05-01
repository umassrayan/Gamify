import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../client/cs320-project/src/firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const nav = useNavigate();
    const [form, setForm] = useState({ email: '', pw: '', mode: 'signin' });
    const action = form.mode === 'signin' ? 'Log in' : 'Register';

    const handle = async (e) => {
        e.preventDefault();
        const fn = form.mode === 'signin' ? signInWithEmailAndPassword : createUserWithEmailAndPassword;
        await fn(auth, form.email, form.pw);
        nav('/dashboard');
    };

    return (
        <div className="p-8 max-w-sm mx-auto">
            <h1 className="text-2xl mb-4">{action}</h1>
            <form onSubmit={handle} className="flex flex-col gap-2">
                <input type="email" placeholder="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="border p-2 rounded" />
                <input type="password" placeholder="password" value={form.pw} onChange={(e) => setForm({ ...form, pw: e.target.value })} required className="border p-2 rounded" />
                <button className="border rounded p-2" type="submit">
                    {action}
                </button>
            </form>

            <button className="mt-4 border rounded p-2 w-full" onClick={() => signInWithPopup(auth, googleProvider)}>
                Sign in with Google
            </button>

            <p className="mt-2 text-sm text-center">
                {form.mode === 'signin' ? 'No account?' : 'Have an account?'}{' '}
                <button className="underline" onClick={() => setForm((f) => ({ ...f, mode: f.mode === 'signin' ? 'register' : 'signin' }))}>
                    {form.mode === 'signin' ? 'Register' : 'Log in'}
                </button>
            </p>
        </div>
    );
}
