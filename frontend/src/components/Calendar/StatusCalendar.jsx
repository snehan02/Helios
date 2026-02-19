import { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const StatusCalendar = ({ events, onDateClick, onSave, role = 'client' }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ status: 'green', details: '' });

    // resetForm moved to avoid duplication

    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getEventsForDay = (date) => {
        return (events || []).filter(e => isSameDay(new Date(e.date), date));
    };

    const handleDateClick = (date) => {
        const dayEvents = getEventsForDay(date);
        if (onDateClick) {
            onDateClick(date, dayEvents);
        } else {
            setSelectedDate({ date, dayEvents });
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
        { value: 'green', label: 'Completed', color: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/30' },
        { value: 'yellow', label: 'Blocked', color: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/30' },
        { value: 'red', label: 'Delayed', color: 'bg-rose-400/10', text: 'text-rose-400', border: 'border-rose-400/30' },
    ];

    const getStatusStyles = (status) => {
        return statusOptions.find(o => o.value === status) || statusOptions[0];
    };

    return (
        <div className="glass-panel p-6 relative overflow-hidden">
            {/* Glossy Background Effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-light text-gray-800 dark:text-zinc-100 tracking-tight">
                    <span className="font-bold text-gray-900 dark:text-white mr-2">{format(currentMonth, 'MMMM')}</span>
                    <span className="text-gray-400 dark:text-zinc-400">{format(currentMonth, 'yyyy')}</span>
                </h2>
                <div className="flex gap-3">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="btn-silver p-2.5 rounded-xl shadow-lg"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="btn-silver p-2.5 rounded-xl shadow-lg"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-4 mb-2 md:mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 md:gap-4">
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const dayEvents = getEventsForDay(day);

                    // Logic: If all logs have the same status, fill the cell.
                    // If logs have different statuses, show dots.
                    const hasUniformStatus = dayEvents.length > 0 && dayEvents.every(e => e.status === dayEvents[0].status);
                    const uniformStatusStyle = hasUniformStatus ? getStatusStyles(dayEvents[0].status) : null;

                    return (
                        <motion.div
                            key={day.toISOString()}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.005 }}
                            onClick={() => handleDateClick(day)}
                            className={clsx(
                                "aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group overflow-hidden border",
                                isCurrentMonth ? "border-zinc-700/50 hover:border-zinc-400/40" : "opacity-20 pointer-events-none",
                                hasUniformStatus ? `${uniformStatusStyle.color} ${uniformStatusStyle.border}` : "bg-zinc-800/30",
                                !hasUniformStatus && isCurrentMonth && "hover:bg-zinc-800/60"
                            )}
                        >
                            <span className={clsx(
                                "text-sm font-medium transition-colors z-10",
                                hasUniformStatus ? "text-white" : "text-gray-500 dark:text-zinc-300 group-hover:text-gray-900 dark:group-hover:text-white"
                            )}>
                                {format(day, 'd')}
                            </span>

                            {/* Show dots ONLY if statuses are NOT uniform (i.e. different colored dots) */}
                            {!hasUniformStatus && dayEvents.length > 0 && (
                                <div className="flex gap-1 mt-1.5 justify-center flex-wrap px-1">
                                    {dayEvents.map((e, i) => (
                                        <div
                                            key={e._id || i}
                                            className={clsx(
                                                "w-1.5 h-1.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]",
                                                e.status === 'green' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' :
                                                    e.status === 'yellow' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' :
                                                        'bg-rose-400 shadow-[0_0_8px_#fb7185]'
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedDate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-md p-4"
                        onClick={closePopup}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-zinc-900/95 border border-zinc-400/20 rounded-[2.5rem] w-full max-w-lg shadow-[0_40px_80px_rgba(0,0,0,0.7)] relative overflow-hidden flex flex-col max-h-[85vh] md:max-h-[90vh]"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Silver Glow */}
                            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-zinc-400/40 to-transparent z-20 pointer-events-none" />

                            <div className="flex-1 overflow-y-auto custom-scrollbar-silver p-6 md:p-10">

                                <div className="flex justify-between items-start mb-6 md:mb-10 sticky top-0 bg-transparent z-10">
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
                                            {format(selectedDate.date, 'MMMM d')}
                                        </h3>
                                        <p className="text-zinc-500 font-black text-xs uppercase tracking-[0.3em] flex items-center gap-2">
                                            Project Timeline <span className="w-4 h-[1px] bg-zinc-800" /> {format(selectedDate.date, 'yyyy')}
                                        </p>
                                    </div>
                                    <button onClick={closePopup} className="btn-silver p-2 md:p-3 rounded-2xl shadow-xl group">
                                        <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                                    </button>
                                </div>

                                {isEditing ? (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-4">Select Status</label>
                                            <div className="flex gap-3">
                                                {statusOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => setFormData({ ...formData, status: option.value })}
                                                        className={clsx(
                                                            "flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                                                            formData.status === option.value
                                                                ? option.value === 'green' ? 'bg-green-400/20 border-green-400/50 text-green-400 shadow-[0_10px_30px_rgba(74,222,128,0.2)] scale-105' :
                                                                    option.value === 'yellow' ? 'bg-yellow-400/20 border-yellow-400/50 text-yellow-400 shadow-[0_10px_30px_rgba(250,204,21,0.2)] scale-105' :
                                                                        'bg-red-400/20 border-red-400/50 text-red-400 shadow-[0_10px_30px_rgba(248,113,113,0.2)] scale-105'
                                                                : `border-zinc-800 bg-zinc-800/20 text-zinc-500 hover:border-zinc-700/50 hover:bg-zinc-800/40`
                                                        )}
                                                    >
                                                        {option.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-zinc-400 text-xs font-bold uppercase tracking-widest mb-3">Logs & Details</label>
                                            <textarea
                                                value={formData.details}
                                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-all resize-none h-24 md:h-32 placeholder:text-zinc-600"
                                                placeholder="Description of the log..."
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800/50 mt-4">
                                            <button
                                                onClick={() => setIsEditing(false)}
                                                className="px-6 py-3 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="btn-silver px-8 py-3 text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                            >
                                                Save Changes
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar-silver space-y-4">
                                            {selectedDate.dayEvents.length > 0 ? (
                                                selectedDate.dayEvents.map((e, i) => {
                                                    const styles = getStatusStyles(e.status);
                                                    return (
                                                        <div key={e._id || i} className="p-5 bg-zinc-900/40 border border-zinc-400/10 rounded-2xl group relative hover:border-zinc-400/30 transition-all duration-300 shadow-xl">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <div className={clsx("px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border backdrop-blur-md", styles.color, styles.text, styles.border)}>
                                                                    {styles.label}
                                                                </div>
                                                                <button
                                                                    onClick={() => {
                                                                        setFormData({ status: e.status, details: e.details || '', id: e._id });
                                                                        setIsEditing(true);
                                                                    }}
                                                                    className="text-[10px] text-zinc-500 hover:text-white underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 uppercase tracking-widest font-black transition-all"
                                                                >
                                                                    Edit Entry
                                                                </button>
                                                            </div>
                                                            <p className="text-zinc-300 text-sm leading-relaxed font-medium">
                                                                {e.details || 'No details provided.'}
                                                            </p>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center py-16 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                                                    <p className="text-zinc-500 text-sm font-medium">No activity logged yet.</p>
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => {
                                                setFormData({ status: 'green', details: '', id: null });
                                                setIsEditing(true);
                                            }}
                                            className="btn-silver w-full py-5 mt-6 rounded-2xl text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 group shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
                                        >
                                            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                                            Log New Status
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export default StatusCalendar;
