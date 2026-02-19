import { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import ImageUpload from '../ImageUpload';

const EditClientModal = ({ isOpen, onClose, onSave, client }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        status: 'Onboarding',
        primaryColor: '#3B82F6',
        secondaryColor: '#ffffff',
        logoUrl: ''
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                industry: client.industry || '',
                status: client.status || 'Onboarding',
                primaryColor: client.brandColors?.primary || '#3B82F6',
                secondaryColor: client.brandColors?.secondary || '#ffffff',
                logoUrl: client.logoUrl || ''
            });
        }
    }, [client]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.put(`/clients/${client._id}`, formData);
            onSave(response.data.client);
            onClose();
        } catch (error) {
            console.error("Error updating client", error);
            alert(error.response?.data?.message || "Failed to update client");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="absolute inset-0" onClick={onClose}></div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="glass-panel w-full md:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl relative z-10"
                    >
                        <div className="flex items-center justify-between p-6 border-b border-zinc-700">
                            <h2 className="text-xl font-bold text-white">Edit Client</h2>
                            <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Client Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Industry</label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Account Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white transition-colors"
                                    >
                                        <option value="Onboarding">Onboarding</option>
                                        <option value="Active">Active</option>
                                        <option value="Archived">Archived</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-300 mb-1">Client Logo</label>
                                <ImageUpload
                                    value={formData.logoUrl}
                                    onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                                    onRemove={() => setFormData({ ...formData, logoUrl: '' })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Primary Color</label>
                                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                                        <input
                                            type="color"
                                            value={formData.primaryColor}
                                            onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0"
                                        />
                                        <span className="text-sm text-zinc-400 font-mono">{formData.primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">Secondary Color</label>
                                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2">
                                        <input
                                            type="color"
                                            value={formData.secondaryColor}
                                            onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                            className="w-6 h-6 rounded cursor-pointer bg-transparent border-none p-0"
                                        />
                                        <span className="text-sm text-zinc-400 font-mono">{formData.secondaryColor}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 rounded-lg text-zinc-300 hover:bg-zinc-700 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-silver px-6 py-2 rounded-lg font-medium shadow-lg transition-all"
                                >
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <Loader size={18} className="animate-spin" />
                                            <span>Updating...</span>
                                        </div>
                                    ) : (
                                        'Update Client'
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditClientModal;
