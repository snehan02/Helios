import { LayoutDashboard, Users, Calendar, Settings, LogOut, Bell, AlertTriangle, Plus, CheckCircle2 } from 'lucide-react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

export default function AdminDashboard({ user }: { user: any }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const navLinks = [
        { label: 'Dashboard', path: '/admin' },
        { label: 'Clients', path: '/admin/clients' },
        { label: 'Work Log', path: '/admin/work-log' },
        { label: 'Notifications', path: '/admin/notifications' },
        { label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">
            {/* 1. Top Navbar */}
            <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tighter text-blue-600">HELIOS</span>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">Agency Engine</span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`text-sm font-semibold transition-colors ${location.pathname === link.path ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:text-red-600 ml-4 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>

                    <div className="md:hidden">
                        {/* Simple mobile menu indicator or icon could go here */}
                        <button onClick={handleLogout} className="text-red-500"><LogOut size={20} /></button>
                    </div>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* 2. Welcome Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">Welcome, {user?.firstName || 'Super'}</h1>
                        <button className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow relative">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>
                    </div>
                </div>

                {/* 3. Dashboard Grid Content */}
                <Routes>
                    <Route path="/" element={<DashboardOverview />} />
                    <Route path="/clients" element={<ClientsList />} />
                    <Route path="/work-log" element={<WorkLogEntry />} />
                    <Route path="/notifications" element={<NotificationsCenter />} />
                    <Route path="/settings" element={<div className="bg-white p-8 rounded-xl shadow-sm">Settings Content</div>} />
                </Routes>
            </main>
        </div>
    );
}

function DashboardOverview() {
    return (
        <div className="space-y-8">
            {/* 4. Stats Cards Grid (4 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={<Users size={24} className="text-blue-500" />}
                    title="Active Clients"
                    value="12"
                    subtext="+2 this month"
                />
                <StatCard
                    icon={<Calendar size={24} className="text-green-500" />}
                    title="Logs Updated Today"
                    value="8/12"
                    subtext="Updated 2h ago"
                />
                <StatCard
                    icon={<CheckCircle2 size={24} className="text-purple-500" />}
                    title="Completion"
                    value="66%"
                    subtext="Target: 100%"
                />
                <StatCard
                    icon={<AlertTriangle size={24} className="text-red-500" />}
                    title="Blocked Clients"
                    value="1"
                    subtext="Requires attention"
                    warning
                />
            </div>

            {/* Extra spacing for future sections */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="font-bold text-gray-700 mb-4">Daily Activity Pulse</h3>
                <div className="h-40 bg-gray-50 flex items-center justify-center text-gray-400 italic">
                    Activity chart will appear here
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, title, value, subtext, warning }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                    {icon}
                </div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
            </div>
            <p className={`text-4xl font-bold mb-1 ${warning ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
            <p className={`text-xs font-medium ${warning ? 'text-red-500' : 'text-gray-400'}`}>{subtext}</p>
        </div>
    );
}

// Keep existing implementations of child components but ensure they fit the grid logic if needed
function ClientsList() {
    const [showAdd, setShowAdd] = useState(false);
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const queryClient = useQueryClient();

    const { data: clients, isLoading } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data } = await api.get('/clients');
            return data;
        }
    });

    const createClient = useMutation({
        mutationFn: async (newClient: any) => api.post('/clients', newClient),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['clients'] });
            setShowAdd(false);
            setName('');
            setContact('');
        }
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold">Manage Clients</h3>
                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>Add Client</span>
                </button>
            </div>

            {showAdd && (
                <div className="bg-white p-6 rounded-xl shadow-sm border animate-in slide-in-from-top-4">
                    <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => {
                        e.preventDefault();
                        createClient.mutate({ companyName: name, primaryContactName: contact });
                    }}>
                        <input placeholder="Company Name" className="p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={e => setName(e.target.value)} required />
                        <input placeholder="Contact Name" className="p-3 bg-gray-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={contact} onChange={e => setContact(e.target.value)} required />
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <button type="button" onClick={() => setShowAdd(false)} className="px-4 py-2 text-gray-500">Cancel</button>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold">Save</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Client</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Contact</th>
                            <th className="p-4 text-left text-xs font-bold text-gray-400 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {clients?.map((c: any) => (
                            <tr key={c.id}>
                                <td className="p-4 font-semibold">{c.companyName}</td>
                                <td className="p-4 text-gray-600">{c.primaryContactName}</td>
                                <td className="p-4 font-bold text-xs"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full">ACTIVE</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function WorkLogEntry() {
    const [selectedClient, setSelectedClient] = useState('');
    const [status, setStatus] = useState('GREEN');
    const [description, setDescription] = useState('');
    const queryClient = useQueryClient();

    const { data: clients } = useQuery({
        queryKey: ['clients'],
        queryFn: async () => {
            const { data } = await api.get('/clients');
            return data;
        }
    });

    const saveLog = useMutation({
        mutationFn: (newLog: any) => api.post('/work-logs', newLog),
        onSuccess: () => {
            alert('Saved!');
            setDescription('');
        }
    });

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
            <h3 className="text-xl font-bold mb-6 text-center">Submit Daily Log</h3>
            <div className="space-y-4">
                <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className="w-full p-3 bg-gray-50 rounded-lg border">
                    <option value="">Select Client...</option>
                    {clients?.map((c: any) => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                </select>
                <div className="flex gap-2">
                    {['GREEN', 'YELLOW', 'RED'].map(s => (
                        <button key={s} onClick={() => setStatus(s)} className={`flex-1 p-3 rounded-lg font-bold border-2 transition-all ${status === s ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400'}`}>{s}</button>
                    ))}
                </div>
                <textarea rows={4} className="w-full p-4 bg-gray-50 rounded-lg border outline-none focus:ring-2 focus:ring-blue-500" value={description} onChange={e => setDescription(e.target.value)} placeholder="What was done today?" />
                <button onClick={() => saveLog.mutate({ clientId: selectedClient, date: new Date().toISOString().split('T')[0], status, description })} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold">Submit</button>
            </div>
        </div>
    );
}

function NotificationsCenter() {
    const queryClient = useQueryClient();
    const { data: notifications } = useQuery({ queryKey: ['notifications'], queryFn: async () => (await api.get('/notifications')).data });
    const resolve = useMutation({
        mutationFn: (id: string) => api.put(`/notifications/${id}/resolve`),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
    });
    const unresolved = notifications?.filter((n: any) => !n.isResolved) || [];

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold">Unresolved Alerts</h3>
            {unresolved.map((n: any) => (
                <div key={n.id} className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
                    <div>
                        <p className="font-bold text-red-900">{n.client?.companyName} is Blocked</p>
                        <p className="text-sm text-red-700 italic">"{n.message}"</p>
                    </div>
                    <button onClick={() => resolve.mutate(n.id)} className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold">Resolve</button>
                </div>
            ))}
            {!unresolved.length && <div className="text-center py-12 text-gray-400">No alerts today</div>}
        </div>
    );
}
