
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
    const [searchQuery, setSearchQuery] = useState('');

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
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm md:text-base">Manage your clients and project statuses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn-silver flex items-center justify-center gap-2 px-4 py-2 rounded-lg w-full md:w-auto"
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
                    className="bg-metric-black p-6 rounded-xl flex items-center justify-between"
                >
                    <div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Active Clients</p>
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{globalStats.Active || 0}</h3>
                    </div>
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-700/50 rounded-full flex items-center justify-center text-zinc-600 dark:text-white border border-zinc-200 dark:border-zinc-600">
                        <div className="h-3 w-3 bg-zinc-400 dark:bg-white rounded-full animate-pulse" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-metric-black p-6 rounded-xl flex items-center justify-between"
                >
                    <div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Onboarding</p>
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{globalStats.Onboarding || 0}</h3>
                    </div>
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-700/50 rounded-full flex items-center justify-center text-zinc-600 dark:text-white border border-zinc-200 dark:border-zinc-600">
                        <div className="h-3 w-3 bg-zinc-400 dark:bg-white rounded-full" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-metric-black p-6 rounded-xl flex items-center justify-between"
                >
                    <div>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Total Clients</p>
                        <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mt-1">{clients.length}</h3>
                    </div>
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-700/50 rounded-full flex items-center justify-center text-zinc-600 dark:text-white border border-zinc-200 dark:border-zinc-600">
                        <Calendar size={20} />
                    </div>
                </motion.div>
            </div>

            {/* Clients Grid */}
            <section>
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Clients</h2>
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-zinc-400 dark:focus:border-white/50 transition-colors"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.filter(client =>
                        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        client.status.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((client) => (
                        <motion.div
                            key={client._id}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(`/admin/client/${client._id}`)}
                            className="client-card p-6 hover:shadow-md hover:scale-[1.02] cursor-pointer relative group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={client.logoUrl ? (client.logoUrl.startsWith('http') ? client.logoUrl : `${BASE_URL}${client.logoUrl}`) : `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`}
                                        alt={client.name}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(client.name)}&background=random`;
                                        }}
                                        className="w-12 h-12 rounded-lg bg-zinc-100 dark:bg-zinc-800 object-cover"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-zinc-900 dark:text-white">{client.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${client.status === 'Active' ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400' :
                                            client.status === 'Onboarding' ? 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400' :
                                                'bg-zinc-100 dark:bg-zinc-600/10 text-zinc-600 dark:text-zinc-400'
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
                                        className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white p-1 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    >
                                        <MoreVertical size={18} />
                                    </button>

                                    <AnimatePresence>
                                        {openMenuId === client._id && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                className="absolute right-0 mt-2 w-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-xl z-20 overflow-hidden"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <button
                                                    onClick={() => {
                                                        setSelectedClient(client);
                                                        setIsEditModalOpen(true);
                                                        setOpenMenuId(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center gap-2 transition-colors"
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

                            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Next Update: Today</span>
                                </div>
                                <div className="text-zinc-900 dark:text-white font-medium">
                                    {client.tasksPending} Pending Tasks
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            <section>
                <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-xl font-semibold text-zinc-800 dark:text-zinc-200">Task Summary</h2>
                    <button
                        onClick={() => setIsFilesModalOpen(true)}
                        className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                        title="View All Files"
                    >
                        <FileText size={16} />
                    </button>
                </div>
                <div className="glass-panel rounded-xl p-6">
                    <div className="text-center text-zinc-500 py-8">
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