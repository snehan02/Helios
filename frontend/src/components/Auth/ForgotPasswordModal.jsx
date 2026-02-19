import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert } from 'lucide-react';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl"
                    >
                        {/* Silver Gradient Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-400/50 to-transparent" />

                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-white">
                                        <ShieldAlert size={20} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Reset Password</h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl bg-zinc-800/50 p-4 border border-zinc-700/50">
                                    <p className="text-zinc-300 text-sm leading-relaxed">
                                        For security reasons, automatic password resets are currently disabled.
                                    </p>
                                </div>

                                <p className="text-zinc-400 text-sm">
                                    Please contact your system administrator to request a password reset. They will verify your identity and provide you with temporary credentials.
                                </p>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        onClick={onClose}
                                        className="btn-silver px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wide"
                                    >
                                        Understood
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ForgotPasswordModal;
