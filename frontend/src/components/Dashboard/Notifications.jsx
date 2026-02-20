import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications (mock for now, or real API if we implement that endpoint)
    // For "I'm Blocked", we really need to query the calendar for upcoming 'yellow' statuses created by clients
    // Or we can create a dedicated 'Notification' model.
    // For now, let's fetch calendar entries with status 'yellow' from all clients (if admin)
    // But since that might be heavy, let's just stick to a mock or a simple poller for now.

    // BETTER APPROACH: Let's create a dedicated Notifications context or just fetch blocked statuses.
    useEffect(() => {
        // Polling for "Blocked" statuses across all clients (simplification)
        // In a real app, use WebSockets or a dedicated /notifications endpoint
        const fetchNotifications = async () => {
            try {
                // This endpoint doesn't exist yet, we might need to add it or repurpose one
                // For this demo, let's assume we fetch recent 'yellow' events
                // Let's Mock it for immediate UI feedback as per instructions "notification"
                // But ideally we want it connected.

                // Let's implement a real logic: Fetch all clients, then check their calendars for today? Too slow.
                // Let's just create a mock notification if we see "yellow" in the local state of a ClientView
                // Since this is global dashboard, let's fetch a new endpoint /api/dashboard/notifications
            } catch (error) {
                console.error(error);
            }
        };

        // Mocking for Demo
        setNotifications([
            { id: 1, type: 'blocked', message: 'Acme Corp reported a blocker.', time: '10 mins ago', read: false },
            { id: 2, type: 'info', message: 'New invoice uploaded for Globex.', time: '1 hour ago', read: true },
        ]);
        setUnreadCount(1);
    }, []);

    const toggleOpen = () => setIsOpen(!isOpen);

    return (
        <div className="relative">
            <button onClick={toggleOpen} className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold border-2 border-white dark:border-zinc-900">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                            <h3 className="font-bold text-zinc-900 dark:text-white">Notifications</h3>
                            <button onClick={() => setIsOpen(false)}><X size={16} className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white" /></button>
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-zinc-500 text-sm italic">No notifications</div>
                            ) : (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b border-zinc-50 dark:border-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800/30 transition-colors ${notif.read ? 'opacity-60' : 'bg-zinc-500/5'}`}>
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{notif.message}</p>
                                        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">{notif.time}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Notifications;
