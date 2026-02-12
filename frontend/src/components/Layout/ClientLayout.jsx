import { Outlet } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import api from '../../api/axios';

const ClientLayout = () => {
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
        logoUrl: clientData.logoUrl ? `http://localhost:5000${clientData.logoUrl}` : null,
        name: clientData.name,
        colors: {
            primary: clientData.brandColors?.primary,
            secondary: clientData.brandColors?.secondary
        }
    } : null;

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-blue-500/30"
            style={{ '--primary-color': branding?.colors?.primary || '#3b82f6' }}>
            <Sidebar navItems={navItems} role="client" branding={branding} />

            <div className="flex-1 overflow-auto">
                {/* Header - Simplified since navigation is in Sidebar */}
                <header className="flex h-16 items-center justify-between border-b border-gray-800 px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-200">Client Portal</h2>
                    <div className="flex items-center gap-4">
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
