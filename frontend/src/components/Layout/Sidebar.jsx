
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, Hexagon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const Sidebar = ({ navItems = [], role = 'admin', branding = null, mobileOpen = false, setMobileOpen = () => { } }) => {
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
        <>
            {/* Mobile Backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <motion.div
                initial={false}
                animate={isCollapsed ? "collapsed" : "expanded"}
                variants={sidebarVariants}
                className={`flex h-screen flex-col glass-panel border-r border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white 
                    fixed inset-y-0 left-0 z-50 md:relative 
                    transition-transform duration-300 ease-in-out shadow-xl rounded-r-3xl
                    ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Desktop Toggle Button */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    style={{ backgroundColor: branding?.colors?.primary || '#2563EB' }}
                    className="hidden md:flex absolute -right-3 top-9 rounded-full p-1 text-white shadow-lg transition-colors z-50 hover:brightness-110"
                >
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Mobile Close Button */}
                <button
                    onClick={() => setMobileOpen(false)}
                    className="md:hidden absolute right-4 top-4 p-2 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                >
                    <X size={20} />
                </button>

                <div className={`flex items-center h-20 border-b border-zinc-200 dark:border-zinc-800 ${isCollapsed ? 'justify-center' : 'px-6'}`}>
                    {branding && branding.logoUrl ? (
                        <div className="flex items-center gap-3 overflow-hidden">
                            <img
                                src={branding.logoUrl}
                                alt={branding.name || "Logo"}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(branding.name || 'Client')}&background=random`;
                                }}
                                className="h-10 w-10 rounded-lg object-contain bg-zinc-100 dark:bg-zinc-900"
                            />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-lg font-bold tracking-wide text-zinc-900 dark:text-white whitespace-nowrap"
                                    >
                                        {branding.name || 'Client Portal'}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-zinc-900 dark:text-white overflow-hidden">
                            <Hexagon size={28} className="flex-shrink-0" />
                            <AnimatePresence>
                                {!isCollapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: "auto" }}
                                        exit={{ opacity: 0, width: 0 }}
                                        className="text-xl font-bold tracking-wider text-zinc-900 dark:text-white whitespace-nowrap"
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
                            onClick={() => setMobileOpen(false)} // Close sidebar on nav click (mobile)
                            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors relative group ${isActive(item.path)
                                ? 'text-zinc-900 dark:text-white bg-zinc-100 dark:bg-white/10'
                                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                                } ${isCollapsed ? 'justify-center' : ''}`}
                            title={isCollapsed ? item.label : ''}
                        >
                            {!isCollapsed && isActive(item.path) && (
                                <motion.div
                                    layoutId="activeNav"
                                    className="absolute left-0 h-full w-1 rounded-r-full bg-zinc-900 dark:bg-white"
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

                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none transform translate-x-1 transition-all">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className={`flex w-full items-center gap-3 px-3 py-3 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
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
        </>
    );
};

export default Sidebar;