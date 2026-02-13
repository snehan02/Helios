import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Calendar, Edit2, Trash2, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateClientModal from '../../components/Dashboard/CreateClientModal';
import EditClientModal from '../../components/Dashboard/EditClientModal';
import FilesModal from '../../components/Dashboard/FilesModal';
import api, { BASE_URL } from '../../api/axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isFilesModalOpen, setIsFilesModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const [clients, setClients] = useState([]);
    const [globalStats, setGlobalStats] = useState({ Active: 0, Onboarding: 0 });

    const fetchClients = () => {
        api.get('/clients')
            .then(res => {
                const fetchedClients = res.data;
                setClients(fetchedClients);
                const counts = fetchedClients.reduce((acc, client) => {
                    const status = client.status || 'Active';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, { Active: 0, Onboarding: 0, Archived: 0 });
                setGlobalStats(counts);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleAddClient = (newClient) => {
        setClients([newClient, ...clients]);
    };

    const handleUpdateClient = (updatedClient) => {
        setClients(clients.map(c => c._id === updatedClient._id ? updatedClient : c));
    };

    const handleDeleteClient = async (clientId) => {
        if (window.confirm("Are you sure you want to delete this client? This will also delete their login account.")) {
            try {
                await api.delete(`/clients/${clientId}`);
                setClients(clients.filter(c => c._id !== clientId));
            } catch (error) {
                console.error("Error deleting client", error);
                alert("Failed to delete client");
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your clients and project statuses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>Add Client</span>
                </button>
            </div>

            {/* Global Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-xl flex items-center justify-between shadow-sm dark:shadow-none"
                >
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Clients</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{globalStats.Active || 0}</h3>
                    </div>
                    <div className="h-10 w-10 bg-green-500/10 dark:bg-green-500/20 rounded-full flex items-center justify-center text-green-600 dark:text-green-400">
                        <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-xl flex items-center justify-between shadow-sm dark:shadow-none"
                >
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Onboarding</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{globalStats.Onboarding || 0}</h3>
                    </div>
                    <div className="h-10 w-10 bg-yellow-500/10 dark:bg-yellow-500/20 rounded-full flex items-center justify-center text-yellow-600 dark:text-yellow-400">
                        <div className="h-3 w-3 bg-yellow-500 rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 rounded-xl flex items-center justify-between shadow-sm dark:shadow-none"
                >
                    <div>
                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Clients</p>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{clients.length}</h3>
                    </div>
                    <div className="h-10 w-10 bg-blue-500/10 dark:bg-blue-500/20 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Calendar size={20} />
                    </div>
                </motion.div>
            </div>

            {/* Clients Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Clients</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <motion.div
                            key={client._id}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(`/admin/client/${client._id}`)}
                            className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all cursor-pointer relative shadow-sm hover:shadow-md dark:shadow-none"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={client.logoUrl ? `${BASE_URL}${client.logoUrl}` : 'https://via.placeholder.com/40'} alt={client.name} className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 object-cover" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{client.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${client.status === 'Active' ? 'bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400' :
                                            client.status === 'Onboarding' ? 'bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400' :
                                                'bg-gray-600/10 dark:bg-gray-600/20 text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenuId(openMenuId === client._id ? null : client._id);
                                        }}
                                        className="text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    <AnimatePresence>
                                        {openMenuId === client._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 overflow-hidden"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSelectedClient(client);
                                                        setIsEditModalOpen(true);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 transition-colors"
                                                >
                                                    <Edit2 size={14} />
                                                    <span>Edit</span>
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDeleteClient(client._id);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-2 transition-colors"
                                                >
                                                    <Trash2 size={14} />
                                                    <span>Delete</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Next Update: Today</span>
                                </div>
                                <div className="text-blue-600 dark:text-blue-400 font-medium">
                                    {client.tasksPending} Pending Tasks
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Task Summary</h2>
                    <button
                        onClick={() => setIsFilesModalOpen(true)}
                        className="p-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-400 transition-colors"
                        title="View All Files"
                    >
                        <FileText size={16} />
                    </button>
                </div>
                <div className="bg-white dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm dark:shadow-none">
                    <div className="text-center text-gray-500 dark:text-gray-500 py-8">
                        <p>Select a client to view their detailed task calendar.</p>
                    </div>
                </div>
            </section>

            <CreateClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddClient}
            />

            <EditClientModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedClient(null);
                }}
                onSave={handleUpdateClient}
                client={selectedClient}
            />

            <FilesModal
                isOpen={isFilesModalOpen}
                onClose={() => setIsFilesModalOpen(false)}
                clients={clients}
            />
        </div>
    );
};

export default Dashboard;
