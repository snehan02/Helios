import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import CreateClientModal from '../../components/Dashboard/CreateClientModal';

const Dashboard = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mock Data for now
    const [clients, setClients] = useState([
        { id: 1, name: 'Acme Corp', logo: 'https://via.placeholder.com/40', status: 'Active', tasksPending: 3 },
        { id: 2, name: 'Globex Inc', logo: 'https://via.placeholder.com/40', status: 'Onboarding', tasksPending: 1 },
        { id: 3, name: 'Soylent Corp', logo: 'https://via.placeholder.com/40', status: 'Inactive', tasksPending: 0 },
    ]);

    const handleAddClient = (newClient) => {
        setClients([...clients, newClient]);
    };

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage your clients and project statuses.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>Add Client</span>
                </button>
            </div>

            {/* Clients Grid */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-200">Clients</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search clients..."
                            className="bg-gray-800 border border-gray-700 text-sm text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {clients.map((client) => (
                        <motion.div
                            key={client.id}
                            whileHover={{ y: -4 }}
                            onClick={() => navigate(`/admin/client/${client.id}`)}
                            className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-colors cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={client.logo || 'https://via.placeholder.com/40'} alt={client.name} className="w-12 h-12 rounded-lg bg-gray-700 object-cover" />
                                    <div>
                                        <h3 className="font-semibold text-white">{client.name}</h3>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${client.status === 'Active' ? 'bg-green-500/20 text-green-400' :
                                                client.status === 'Onboarding' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-gray-600/20 text-gray-400'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </div>
                                </div>
                                <button onClick={(e) => { e.stopPropagation(); }} className="text-gray-500 hover:text-white">
                                    <MoreVertical size={18} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-400 mt-4 pt-4 border-t border-gray-700/50">
                                <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Next Update: Today</span>
                                </div>
                                <div className="text-blue-400 font-medium">
                                    {client.tasksPending} Pending Tasks
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Recent Activity / Task Summary Section (Placeholder) */}
            <section>
                <h2 className="text-xl font-semibold text-gray-200 mb-4">Task Summary</h2>
                <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
                    <div className="text-center text-gray-500 py-8">
                        <p>Select a client to view their detailed task calendar.</p>
                    </div>
                </div>
            </section>

            {/* Create Client Modal */}
            <CreateClientModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddClient}
            />
        </div>
    );
};

export default Dashboard;
