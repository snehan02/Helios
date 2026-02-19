
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Hexagon, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
// Removed Theme Toggle and useTheme import/hook


const Sidebar = ({ navItems = [], role = 'admin', branding = null }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);


    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    // Default nav items if none provided (backward compatibility/safety)
    const items = navItems.length > 0 ? navItems : [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    ];

    const sidebarVariants = {
        expanded: { width: "16rem" },
        collapsed: { width: "5rem" }
    };

    return (
        <motion.div
            initial="expanded"
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={sidebarVariants}
            className="flex h-screen flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white relative transition-all duration-300 ease-in-out shadow-xl z-50"
        >
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                style={{ backgroundColor: branding?.colors?.primary || '#2563EB' }} // Dynamic primary color
                className="absolute -right-3 top-9 rounded-full p-1 text-white shadow-lg transition-colors z-50 hover:brightness-110"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>



            <div className={`flex items-center h-20 border-b border-gray-200 dark:border-gray-800 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
                {branding && branding.logoUrl ? (
                    <div className="flex items-center gap-3 overflow-hidden">
                        <img
                            src={branding.logoUrl}
                            alt={branding.name || "Logo"}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(branding.name || 'Client')}&background=random`;
                            }}
                            className="h-10 w-10 rounded-lg object-contain bg-gray-100 dark:bg-gray-800"
                        />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="text-lg font-bold tracking-wide text-gray-900 dark:text-white whitespace-nowrap"
                                >
                                    {branding.name || 'Client Portal'}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 overflow-hidden">
                        <Hexagon size={28} className="flex-shrink-0" />
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="text-xl font-bold tracking-wider text-gray-900 dark:text-white whitespace-nowrap"
                                >
                                    HELIOS
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <nav className="flex-1 p-2 space-y-2 overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative group ${isActive(item.path)
                            ? 'text-gray-900 dark:text-white bg-opacity-20 ' // Active state handled by inline style for dyanmic color
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            } ${isCollapsed ? 'justify-center' : ''}`}
                        style={isActive(item.path) && branding?.colors?.primary ? { backgroundColor: `${branding.colors.primary}33`, color: branding.colors.primary } : isActive(item.path) ? { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' } : {}}
                        title={isCollapsed ? item.label : ''}
                    >
                        {!isCollapsed && isActive(item.path) && (
                            <motion.div
                                layoutId="activeNav"
                                className="absolute left-0 h-full w-1 rounded-r-full"
                                style={{ backgroundColor: branding?.colors?.primary || '#3B82F6' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        )}
                        <item.icon size={20} className="flex-shrink-0" />

                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.span
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="font-medium whitespace-nowrap overflow-hidden"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </AnimatePresence>

                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transform translate-x-1 transition-all">
                                {item.label}
                            </div>
                        )}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                    onClick={handleLogout}
                    className={`flex w-full items-center gap-3 px-3 py-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? 'Logout' : ''}
                >
                    <LogOut size={20} className="flex-shrink-0" />
                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="font-medium whitespace-nowrap overflow-hidden"
                            >
                                Logout
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.div>
    );
};

export default Sidebar;