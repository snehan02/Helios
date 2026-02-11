import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Hexagon } from 'lucide-react';

const ClientLayout = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            <header className="flex h-16 items-center justify-between border-b border-gray-800 px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-2 text-blue-500">
                    <Hexagon size={28} />
                    <span className="text-xl font-bold tracking-wider text-white">HELIOS</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <LogOut size={18} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </header>

            <main className="p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default ClientLayout;
