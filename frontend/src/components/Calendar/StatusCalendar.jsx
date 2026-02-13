import { useState } from 'react';
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, X, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const StatusCalendar = ({ events, onDateClick, onSave, role = 'client' }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ status: 'green', notes: [], newNote: '' });

    // Reset editing state when popup closes or date changes
    const resetForm = () => {
        setIsEditing(false);
        setFormData({ status: 'green', notes: [], newNote: '' });
    };

    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const getStatusColor = (date) => {
        const event = events.find(e => isSameDay(new Date(e.date), date));
        if (!event) return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';

        switch (event.status) {
            case 'green': return 'bg-green-500 hover:bg-green-600 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
            case 'yellow': return 'bg-yellow-500 hover:bg-yellow-600 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
            case 'red': return 'bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
            default: return 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700';
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
                // Handle incomplete data or migration from details -> notes
                let initialNotes = event.notes || [];
                if (initialNotes.length === 0 && event.details) {
                    initialNotes = [{ text: event.details, createdAt: new Date() }];
                }
                setFormData({
                    status: event.status,
                    notes: initialNotes,
                    newNote: ''
                });
            } else {
                setFormData({ status: 'green', notes: [], newNote: '' });
            }
        }
    };

    const closePopup = () => {
        setSelectedDate(null);
        resetForm();
    };

    const handleSave = () => {
        let finalNotes = [...formData.notes];
        if (formData.newNote.trim()) {
            finalNotes.push({
                text: formData.newNote,
                status: formData.status || 'green',
                createdAt: new Date()
            });
        }

        if (onSave) {
            onSave(selectedDate.date, { ...formData, notes: finalNotes });
        }
        closePopup();
    };

    const addNote = () => {
        if (!formData.newNote.trim()) return;
        setFormData({
            ...formData,
            notes: [...formData.notes, {
                text: formData.newNote,
                status: formData.status || 'green',
                createdAt: new Date()
            }],
            newNote: ''
        });
    };

    const removeNote = (index) => {
        const updatedNotes = formData.notes.filter((_, idx) => idx !== index);
        setFormData({ ...formData, notes: updatedNotes });
    };

    const statusOptions = [
        { value: 'green', label: 'Completed', color: 'bg-green-500', hover: 'hover:bg-green-600', text: 'text-green-600 dark:text-green-400' },
        { value: 'yellow', label: 'Blocked', color: 'bg-yellow-500', hover: 'hover:bg-yellow-600', text: 'text-yellow-600 dark:text-yellow-400' },
        { value: 'red', label: 'Delayed', color: 'bg-red-500', hover: 'hover:bg-red-600', text: 'text-red-600 dark:text-red-400' },
    ];

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-2xl relative transition-colors duration-300">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-4 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, currentMonth);
                    const event = events.find(e => isSameDay(new Date(e.date), day));
                    const hasMultipleNotes = event?.notes && event.notes.length > 1;

                    return (
                        <motion.div
                            key={day.toISOString()}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.01 }}
                            onClick={() => handleDateClick(day)}
                            className={clsx(
                                "aspect-square rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group",
                                hasMultipleNotes
                                    ? "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                                    : getStatusColor(day),
                                !isCurrentMonth && "opacity-30"
                            )}
                        >
                            <span className={clsx(
                                "text-sm font-semibold z-10",
                                hasMultipleNotes ? "mb-1" : "",
                                (hasMultipleNotes || getStatusColor(day).includes('gray')) ? 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-white' : 'text-white'
                            )}>
                                {format(day, 'd')}
                            </span>

                            {hasMultipleNotes && (
                                <div className="flex gap-1 flex-wrap justify-center px-1 max-w-[80%]">
                                    {event.notes.map((note, nIdx) => (
                                        <div
                                            key={nIdx}
                                            className={clsx(
                                                "w-1.5 h-1.5 rounded-full",
                                                note.status === 'green' ? 'bg-green-500' :
                                                    note.status === 'yellow' ? 'bg-yellow-500' :
                                                        note.status === 'red' ? 'bg-red-500' : 'bg-gray-400'
                                            )}
                                        />
                                    ))}
                                </div>
                            )}
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
                        className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 dark:bg-black/60 backdrop-blur-sm rounded-2xl"
                        onClick={closePopup}
                    >
                        <div
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-xl w-80 shadow-2xl transition-colors duration-300"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {format(selectedDate.date, 'MMM d, yyyy')}
                                </h3>
                                <button onClick={closePopup} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            {isEditing ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Status</label>
                                        <div className="flex gap-2">
                                            {statusOptions.map((option) => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setFormData({ ...formData, status: option.value })}
                                                    className={clsx(
                                                        "flex-1 py-2 rounded-lg text-sm font-bold transition-all border-2",
                                                        formData.status === option.value
                                                            ? `border-gray-900 dark:border-white ${option.color} text-white` // Active
                                                            : `border-transparent bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600` // Inactive
                                                    )}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Notes</label>

                                        {/* Notes List */}
                                        <div className="space-y-2 mb-3 max-h-40 overflow-y-auto custom-scrollbar">
                                            {formData.notes.map((note, idx) => (
                                                <div key={idx} className="bg-gray-50 dark:bg-gray-900/50 p-2 rounded border border-gray-100 dark:border-gray-700 flex justify-between items-start group">
                                                    <div className="flex items-start gap-2 flex-1">
                                                        <div className={clsx(
                                                            "w-2 h-2 mt-1.5 rounded-full flex-shrink-0",
                                                            note.status === 'green' ? 'bg-green-500' :
                                                                note.status === 'yellow' ? 'bg-yellow-500' :
                                                                    note.status === 'red' ? 'bg-red-500' : 'bg-gray-400'
                                                        )} />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300 break-words">{note.text}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeNote(idx)}
                                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Note Input */}
                                        <div className="flex gap-2">
                                            <input
                                                value={formData.newNote}
                                                onChange={(e) => setFormData({ ...formData, newNote: e.target.value })}
                                                onKeyDown={(e) => e.key === 'Enter' && addNote()}
                                                className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-gray-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                                                placeholder="Add a note..."
                                            />
                                            <button
                                                onClick={addNote}
                                                disabled={!formData.newNote.trim()}
                                                className="p-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                                                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${selectedDate.event.status === 'green' ? 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400' :
                                                    selectedDate.event.status === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                                                        'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400'
                                                    }`}>
                                                    {selectedDate.event.status === 'green' ? 'Completed' :
                                                        selectedDate.event.status === 'yellow' ? 'Blocked' : 'Delayed'}
                                                </div>
                                                {role === 'admin' && (
                                                    <button
                                                        onClick={() => setIsEditing(true)}
                                                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline"
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                                                {selectedDate.event.notes && selectedDate.event.notes.length > 0 ? (
                                                    selectedDate.event.notes.map((note, idx) => (
                                                        <div key={idx} className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                                                            {note.text}
                                                        </div>
                                                    ))
                                                ) : selectedDate.event.details ? (
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                        {selectedDate.event.details}
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">No details provided.</p>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-500 dark:text-gray-400 text-sm">No status logged for this date.</p>
                                            {role === 'admin' && (
                                                <button
                                                    onClick={() => setIsEditing(true)}
                                                    className="mt-4 px-4 py-2 bg-blue-50 dark:bg-blue-600/10 hover:bg-blue-100 dark:hover:bg-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium transition-colors border border-blue-200 dark:border-blue-500/30"
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
