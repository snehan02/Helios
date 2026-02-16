import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import { RefreshCw } from 'lucide-react';
import StatusCalendar from '../../components/Calendar/StatusCalendar';
import InfoBox from '../../components/Dashboard/InfoBox';
import api from '../../api/axios';

const fixDate = (dateStr) => {
    if (!dateStr) return new Date();
    const d = new Date(dateStr);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

const ClientDashboard = () => {
    // State
    const [events, setEvents] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState('');
    const [layout, setLayout] = useState([]);

    const fetchCalendarEvents = (userId) => {
        api.get(`/calendar/${userId}`)
            .then(res => {
                const formattedEvents = res.data.map(e => ({
                    ...e,
                    date: fixDate(e.date)
                }));
                setEvents(formattedEvents);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            if (user.clientId) {
                setClientId(user.clientId);
                api.get(`/clients/${user.clientId}`)
                    .then(res => setClientName(res.data.name))
                    .catch(err => console.error(err));

                fetchCalendarEvents(user.clientId);

                api.get(`/dashboard/${user.clientId}`)
                    .then(res => {
                        const data = res.data;
                        if (data.layout && data.layout.length > 0) {
                            setLayout(data.layout);
                        } else {
                            setLayout([
                                { id: 'payments', type: 'payment', title: 'Payments', data: data.payments?.map((p, i) => ({ id: p._id || i, label: p.invoiceName || 'Invoice', value: p.status || 'Pending' })) || [] },
                                { id: 'metrics', type: 'metric', title: 'Metrics', data: data.metrics?.map((m, i) => ({ id: m._id || i, label: m.label, value: m.value })) || [] },
                                { id: 'resources', type: 'resource', title: 'Resources', data: data.resources?.map((r, i) => ({ id: r._id || i, label: r.label, value: r.link })) || [] }
                            ]);
                        }
                    })
                    .catch(err => console.error(err));

                const intervalId = setInterval(() => {
                    fetchCalendarEvents(user.clientId);
                }, 10000);
                return () => clearInterval(intervalId);
            }
        }
    }, []);

    const handleBlocked = async () => {
        if (!clientId) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        try {
            const response = await api.post('/calendar', {
                clientId: clientId,
                date: todayStr,
                status: 'yellow',
                details: 'Client reported a blocker via Dashboard.'
            });

            const newEntry = response.data;
            newEntry.date = fixDate(newEntry.date);
            setEvents(prev => [...prev.filter(e => e._id !== newEntry._id), newEntry]);

            // Refresh calendar to ensure sync
            fetchCalendarEvents(clientId);

            alert("Team Notified: We've logged your blocker and will look into it immediately.");
        } catch (error) {
            console.error("Error marking as blocked:", error);
            alert("Blocked report failed. Please try again.");
        }
    };

    const handleCalendarSave = async (date, formData) => {
        if (!clientId) return;
        try {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;

            const response = await api.post('/calendar', {
                clientId: clientId,
                date: dateStr,
                ...formData
            });

            const newEntry = response.data;
            newEntry.date = fixDate(newEntry.date);
            setEvents(prev => {
                const exists = prev.find(e => e._id === newEntry._id);
                if (exists) return prev.map(e => e._id === newEntry._id ? newEntry : e);
                return [...prev, newEntry];
            });

            // Refresh calendar to ensure sync
            fetchCalendarEvents(clientId);

            alert("Status logged successfully!");
        } catch (error) {
            alert("Failed to save: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-slate-950 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
                {/* Main Content: Calendar */}
                <div className="lg:col-span-2 flex flex-col group">
                    <div className="mb-10 flex justify-between items-end bg-slate-900/40 p-8 rounded-3xl border border-slate-400/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-400/30 to-transparent" />
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
                                <h1 className="text-3xl font-black text-white tracking-tighter">PROJECT HUB</h1>
                            </div>
                            <p className="text-slate-500 font-medium text-sm flex items-center gap-2">
                                Welcome, <span className="text-slate-300 capitalize">{clientName || 'Partner'}</span>
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => clientId && fetchCalendarEvents(clientId)}
                                className="px-5 py-3 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-400 hover:text-white transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-xl"
                            >
                                <RefreshCw size={14} className="animate-spin-slow" />
                                Sync
                            </button>
                            <button
                                onClick={handleBlocked}
                                className="px-6 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_10px_30px_rgba(244,63,94,0.1)] hover:scale-105 active:scale-95"
                            >
                                Report Blocker
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-900/20 rounded-3xl overflow-hidden">
                        <StatusCalendar events={events} onSave={handleCalendarSave} role="client" />
                    </div>
                </div>

                {/* Sidebar: Widgets */}
                <div className="flex flex-col gap-8 lg:h-full lg:overflow-y-auto custom-scrollbar-silver pr-2">
                    <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-400/10 mb-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Quick Access</p>
                        <h2 className="text-lg font-bold text-white tracking-tight">Project Assets</h2>
                    </div>
                    {layout.map((widget) => {
                        if (!widget.data || widget.data.length === 0) return null;
                        return (
                            <div key={widget.id} className="transform transition-all duration-500 hover:translate-x-2">
                                <InfoBox
                                    title={widget.title}
                                    type={widget.type}
                                    data={widget.data}
                                    readOnly={true}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


export default ClientDashboard;
