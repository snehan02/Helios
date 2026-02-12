import { Outlet } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import Sidebar from './Sidebar';
import Notifications from '../Dashboard/Notifications';

const AdminLayout = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    ];

    return (
        <div className="flex min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
            <Sidebar navItems={navItems} role="admin" />
            <div className="flex-1 overflow-auto">
                <header className="flex h-16 items-center justify-between border-b border-gray-800 px-8 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-200">Admin Dashboard</h2>
                    <div className="flex items-center gap-4">
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
