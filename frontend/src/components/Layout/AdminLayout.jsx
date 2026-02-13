import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Moon, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import Notifications from '../Dashboard/Notifications';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-blue-500/30">
            <Sidebar navItems={navItems} role="admin" />
            <div className="flex-1 overflow-auto">
                <header className="flex h-16 items-center justify-between border-b border-gray-800 px-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Admin Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Notifications />
                        <div className="h-8 w-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">
                            AD
                        </div>
                    </div>
                </header>
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
