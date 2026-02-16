import { Outlet } from 'react-router-dom';
import { LayoutDashboard, Moon, Sun } from 'lucide-react';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { useTheme } from '../../context/ThemeContext';

const ClientLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const [clientData, setClientData] = useState(null);

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
        logoUrl: clientData.logoUrl ? `${BASE_URL}${clientData.logoUrl}` : null,
        name: clientData.name,
        colors: {
            primary: clientData.brandColors?.primary,
            secondary: clientData.brandColors?.secondary
        }
    } : null;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-blue-500/30"
            style={{ '--primary-color': branding?.colors?.primary || '#3b82f6' }}>
            <Sidebar navItems={navItems} role="client" branding={branding} />

            <div className="flex-1 overflow-auto">
                {/* Header - Simplified since navigation is in Sidebar */}
                <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 px-8 bg-white dark:bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10 transition-colors duration-300">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Client Portal</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="flex items-center gap-4">
                            <div
                                className="h-8 w-8 rounded-full border flex items-center justify-center text-xs font-bold"
                                style={{
                                    backgroundColor: branding?.colors?.primary ? `${branding.colors.primary}33` : 'rgba(37, 99, 235, 0.2)',
                                    borderColor: branding?.colors?.primary ? `${branding.colors.primary}66` : 'rgba(59, 130, 246, 0.3)',
                                    color: branding?.colors?.primary || '#60A5FA'
                                }}
                            >
                                {clientData ? clientData.name.substring(0, 2).toUpperCase() : 'CL'}
                            </div>
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

export default ClientLayout;
