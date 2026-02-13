import { format, isSameDay, isAfter, startOfToday } from 'date-fns';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const TimelineView = ({ events = [] }) => {
    // Filter for upcoming events (including today) and sort by date
    const today = startOfToday();
    const upcomingEvents = events
        .filter(e => isAfter(new Date(e.date), today) || isSameDay(new Date(e.date), today))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5); // Show next 5 events

    if (upcomingEvents.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Upcoming Timeline</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm italic">No upcoming events scheduled.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Upcoming Timeline</h3>
            <div className="relative">
                {/* Connector Line */}
                <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />

                <div className="space-y-6">
                    {upcomingEvents.map((event, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative flex gap-6 items-start group"
                        >
                            {/* Status Dot */}
                            <div className={clsx(
                                "z-10 w-12 h-12 rounded-full flex items-center justify-center border-4 border-white dark:border-gray-900 shadow-md flex-shrink-0 transition-transform group-hover:scale-110",
                                event.status === 'green' ? 'bg-green-500' :
                                    event.status === 'yellow' ? 'bg-yellow-500' :
                                        event.status === 'red' ? 'bg-red-500' : 'bg-gray-400'
                            )}>
                                <span className="text-white text-xs font-bold">
                                    {format(new Date(event.date), 'dd')}
                                </span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                                    {format(new Date(event.date), 'MMMM yyyy')}
                                </span>
                                <h4 className="text-md font-bold text-gray-900 dark:text-white mt-1">
                                    {event.status === 'green' ? 'Completed' :
                                        event.status === 'yellow' ? 'Blocked' :
                                            event.status === 'red' ? 'Delayed' : 'Scheduled'}
                                </h4>
                                {event.notes && event.notes.length > 0 ? (
                                    <div className="mt-2 space-y-1">
                                        {event.notes.slice(0, 2).map((note, nIdx) => (
                                            <p key={nIdx} className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                                • {note.text}
                                            </p>
                                        ))}
                                        {event.notes.length > 2 && (
                                            <p className="text-xs text-blue-500 italic">+{event.notes.length - 2} more notes</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {event.details || 'No details provided.'}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimelineView;
