import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, Hexagon } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        // { icon: Users, label: 'Clients', path: '/admin/clients' }, // Merged into Dashboard for now based on reqs
    ];

    return (
        <div className="flex h-screen w-64 flex-col bg-gray-900 border-r border-gray-800 text-white">
            <div className="flex items-center justify-center h-20 border-b border-gray-800">
                <div className="flex items-center gap-2 text-blue-500">
                    <Hexagon size={28} />
                    <span className="text-xl font-bold tracking-wider text-white">HELIOS</span>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive(item.path)
                                ? 'text-blue-400 bg-blue-500/10'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                    >
                        {isActive(item.path) && (
                            <motion.div
                                layoutId="activeNav"
                                className="absolute left-0 h-full w-1 bg-blue-500 rounded-r-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                        <item.icon size={20} />
                        <span className="font-medium">{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
