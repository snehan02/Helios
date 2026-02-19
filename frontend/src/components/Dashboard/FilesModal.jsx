import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download } from 'lucide-react';
import { BASE_URL } from '../../api/axios';

const FilesModal = ({ isOpen, onClose, clients }) => {
    // Aggregate resources from all clients to show "All Files"
    // In a real app, this might be a dedicated endpoint
    // For now, we simulate it by checking client resources if available, 
    // or just mock it since we don't fetch deep client details in Dashboard listing.
    // Dashboard only fetches `clients` list.

    // We'll show a placeholder or mock files for now to demonstrate UI.
    const allFiles = clients.flatMap(c => [
        { name: `${c.name} - Contract.pdf`, type: 'pdf', date: '2025-10-12', size: '2.4 MB' },
        { name: `${c.name} - Brand_Kit.zip`, type: 'zip', date: '2025-10-14', size: '15 MB' },
    ]);

    const handleDownload = (e, file) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        try {
            // Since these are mock files, we simulate a download
            const blob = new Blob([`Content of ${file.name}`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            console.log(`Simulated download started: ${file.name}`);
        } catch (err) {
            console.error("Download simulation failed:", err);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh]"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <FileText className="text-zinc-500 dark:text-zinc-400" />
                                File Repository
                            </h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {allFiles.length > 0 ? (
                                <div className="space-y-3">
                                    {allFiles.map((file, idx) => (
                                        <div
                                            key={idx}
                                            onClick={(e) => handleDownload(e, file)}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-zinc-200 dark:border-gray-700 hover:border-zinc-400 dark:hover:border-zinc-500/30 transition-all group cursor-pointer shadow-sm hover:shadow-md"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-700 transition-colors">
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-zinc-800 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors">{file.name}</h3>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{file.date} • {file.size}</p>
                                                </div>
                                            </div>
                                            <div className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                                                <Download size={20} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No files found.</p>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                Showing {allFiles.length} documents across all clients.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default FilesModal;
