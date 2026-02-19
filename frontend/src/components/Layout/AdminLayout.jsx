import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Moon, Sun, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import Notifications from '../Dashboard/Notifications';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

const AdminLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    ];

    return (
        <div className="flex min-h-screen bg-main-gradient text-zinc-900 dark:text-white font-sans selection:bg-zinc-200 selection:text-black dark:selection:bg-white/20 dark:selection:text-white">
            <Sidebar
                navItems={navItems}
                role="admin"
                mobileOpen={mobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
            />
            <div className="flex-1 overflow-auto">
                <header className="flex h-16 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 px-4 md:px-8 bg-white/50 dark:bg-black/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
                    <div className="flex items-center gap-3">
                        <button
                            className="md:hidden p-2 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 rounded-lg"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu size={20} />
                        </button>
                        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Admin Dashboard</h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <Notifications />
                        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">
                            AD
                        </div>
                    </div>
                </header>
                <main className="p-4 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
