import { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const StatusCalendar = ({ events, onDateClick }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getStatusColor = (date) => {
        const event = events.find(e => isSameDay(new Date(e.date), date));
        if (!event) return 'bg-gray-800 hover:bg-gray-700';

        switch (event.status) {
            case 'green': return 'bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
            case 'yellow': return 'bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
            case 'red': return 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
            default: return 'bg-gray-800 hover:bg-gray-700';
        }
    };

    const handleDateClick = (date) => {
        const event = events.find(e => isSameDay(new Date(e.date), date));

        if (onDateClick) {
            onDateClick(date, event);
        } else {
            setSelectedDate({ date, event });
        }
    };

    const closePopup = () => setSelectedDate(null);

    return (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl relative">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-4 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    return (
                        <motion.div
                            key={day.toISOString()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.01 }}
                            onClick={() => handleDateClick(day)}
                            className={clsx(
                                "aspect-square rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 relative group",
                                getStatusColor(day),
                                !isCurrentMonth && "opacity-30"
                            )}
                        >
                            <span className={clsx(
                                "text-sm font-semibold z-10",
                                getStatusColor(day).includes('gray') ? 'text-gray-400 group-hover:text-white' : 'text-white'
                            )}>
                                {format(day, 'd')}
                            </span>
                        </motion.div>
                    );
                })}
            </div>

            {/* Detail Popup */}
            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl"
                        onClick={closePopup}
                    >
                        <div
                            className="bg-gray-800 border border-gray-700 p-6 rounded-xl w-80 shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-white">
                                    {format(selectedDate.date, 'MMM d, yyyy')}
                                </h3>
                                <button onClick={closePopup} className="text-gray-400 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {selectedDate.event ? (
                                <div className="space-y-3">
                                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedDate.event.status === 'green' ? 'bg-green-500/20 text-green-400' :
                                        selectedDate.event.status === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                        {selectedDate.event.status === 'green' ? 'Completed' :
                                            selectedDate.event.status === 'yellow' ? 'Blocked' : 'Delayed'}
                                    </div>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {selectedDate.event.details || 'No details provided.'}
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm">No status logged for this date.</p>
                                    <button className="mt-4 text-blue-400 text-sm hover:underline">
                                        Log Status (Admin)
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StatusCalendar;
