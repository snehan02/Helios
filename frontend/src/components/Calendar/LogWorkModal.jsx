import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const LogWorkModal = ({ isOpen, onClose, onSave, date, initialData }) => {
    const [status, setStatus] = useState('green');
    const [details, setDetails] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setStatus(initialData.status);
            setDetails(initialData.details);
        } else {
            setStatus('green');
            setDetails('');
        }
    }, [isOpen, initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ date: format(date, 'yyyy-MM-dd'), status, details });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && date && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="absolute inset-0" onClick={onClose}></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl relative z-10"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-700">
                            <h2 className="text-xl font-bold text-white">
                                Log Work: {format(date, 'MMM d, yyyy')}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Status</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['green', 'yellow', 'red'].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStatus(s)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${status === s
                                                ? s === 'green' ? 'bg-green-500/20 border-green-500 text-green-400'
                                                    : s === 'yellow' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                                                        : 'bg-red-500/20 border-red-500 text-red-400'
                                                : 'bg-gray-700/50 border-gray-600 text-gray-400 hover:bg-gray-700'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full mb-2 ${s === 'green' ? 'bg-green-500' : s === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                                                }`} />
                                            <span className="text-xs font-bold uppercase">{s}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Details Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Details / Notes</label>
                                <textarea
                                    rows={4}
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-zinc-400 placeholder-gray-500"
                                    placeholder="Enter task details, SEO stats, or links..."
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    className="btn-silver flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium shadow-lg transition-all"
                                >
                                    <Check size={18} />
                                    <span>Save Entry</span>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LogWorkModal;
