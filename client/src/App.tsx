import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ClientPortal from './pages/ClientPortal';
import { useState, useEffect } from 'react';

function App() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <Routes>
            <Route path="/login" element={<LoginPage setUser={setUser} />} />

            <Route
                path="/admin/*"
                element={
                    user?.role === 'SUPER_ADMIN' || user?.role === 'ACCOUNT_MANAGER'
                        ? <AdminDashboard user={user} />
                        : <Navigate to="/login" />
                }
            />

            <Route
                path="/portal/*"
                element={
                    user?.role === 'CLIENT'
                        ? <ClientPortal user={user} />
                        : <Navigate to="/login" />
                }
            />

            <Route path="/" element={<Navigate to={user ? (user.role === 'CLIENT' ? '/portal' : '/admin') : '/login'} />} />
        </Routes>
    );
}

export default App;
