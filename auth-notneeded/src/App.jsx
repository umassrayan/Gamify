import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider, { useAuth } from './AuthProvider';
import Login from './Login';
import Dashboard from './Dashboard';

function Private({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route
                        path="/dashboard"
                        element={
                            <Private>
                                <Dashboard />
                            </Private>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}
