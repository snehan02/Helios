
import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Moon, Sun, Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';

const ClientLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const [clientData, setClientData] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const fetchClientData = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    if (user.clientId) {
                        const response = await api.get(`/clients/${user.clientId}`);
                        setClientData(response.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching client branding:", error);
            }
        };

        fetchClientData();
    }, []);

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/client/dashboard' },
    ];

    const branding = clientData ? {
        logoUrl: clientData.logoUrl ? (clientData.logoUrl.startsWith('http') ? clientData.logoUrl : `${BASE_URL}${clientData.logoUrl}`) : null,
        name: clientData.name,
        colors: {
            primary: clientData.brandColors?.primary,
            secondary: clientData.brandColors?.secondary
        }
    } : null;

    return (
        <div className="flex min-h-screen bg-main-gradient text-zinc-900 dark:text-white font-sans selection:bg-zinc-200 selection:text-black dark:selection:bg-white/20 dark:selection:text-white"
            style={{ '--primary-color': '#e4e4e7' }}>
            <Sidebar
                navItems={navItems}
                role="client"
                branding={branding}
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
                        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200">Client Portal</h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-4">
                            <div
                                className="h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold dark:bg-zinc-800/50 dark:border-zinc-600/50 dark:text-zinc-200 bg-zinc-100 border-zinc-300 text-zinc-700"
                            >
                                {clientData ? clientData.name.substring(0, 2).toUpperCase() : 'CL'}
                            </div>
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

export default ClientLayout;