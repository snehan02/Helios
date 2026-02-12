import { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const StatusCalendar = ({ events, onDateClick, onSave, role = 'client' }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ status: 'green', details: '' });

    // Reset editing state when popup closes or date changes
    const resetForm = () => {
        setIsEditing(false);
        setFormData({ status: 'green', details: '' });
    };

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
            // Pre-fill form if event exists
            if (event) {
                setFormData({ status: event.status, details: event.details || '' });
            } else {
                setFormData({ status: 'green', details: '' });
            }
        }
    };

    const closePopup = () => {
        setSelectedDate(null);
        resetForm();
    };

    const handleSave = () => {
        if (onSave) {
            onSave(selectedDate.date, formData);
        }
        closePopup();
    };

    const statusOptions = [
        { value: 'green', label: 'Completed', color: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-green-400' },
        { value: 'yellow', label: 'Blocked', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-400' },
        { value: 'red', label: 'Delayed', color: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-400' },
    ];

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

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Status</label>
                                        <div className="flex gap-2">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setFormData({ ...formData, status: option.value })}
                                                    className={clsx(
                                                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all border-2",
                                                        formData.status === option.value
                                                            ? `border-white ${option.color} text-black` // Active state
                                                            : `border-transparent bg-gray-700 text-gray-400 hover:bg-gray-600` // Inactive state
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Notes</label>
                                        <textarea
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none h-24"
                                            placeholder="What happened today?"
                                        />
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors"
                                        >
                                            Save Log
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {selectedDate.event ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedDate.event.status === 'green' ? 'bg-green-500/20 text-green-400' :
                                                    selectedDate.event.status === 'yellow' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {selectedDate.event.status === 'green' ? 'Completed' :
                                                        selectedDate.event.status === 'yellow' ? 'Blocked' : 'Delayed'}
                                                </div>
                                                {role === 'admin' && (
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {selectedDate.event.details || 'No details provided.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 text-sm">No status logged for this date.</p>
                                            {role === 'admin' && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="mt-4 px-4 py-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 rounded-lg text-sm font-medium transition-colors border border-blue-500/30"
                                                >
                                                    Log Status
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StatusCalendar;
