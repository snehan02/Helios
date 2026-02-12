import { useState, useEffect } from 'react';
import { isSameDay } from 'date-fns';
import StatusCalendar from '../../components/Calendar/StatusCalendar';
import InfoBox from '../../components/Dashboard/InfoBox';
import api from '../../api/axios';

const ClientDashboard = () => {
    // State
    const [events, setEvents] = useState([]);
    const [clientId, setClientId] = useState(null);
    const [clientName, setClientName] = useState('');

    const [boxData, setBoxData] = useState({
        payments: [],
        metrics: [],
        resources: []
    });
    const [layout, setLayout] = useState([]);

    useEffect(() => {
        // Fetch current user/client info
        // In a real app, this would come from a Context or Redux store
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            // Assuming the user object has a clientId field (it should if structured correctly on login)
            // If not, we might need to fetch /me endpoint
            if (user.clientId) {
                setClientId(user.clientId);
                // Also fetch client details to get name
                api.get(`/clients/${user.clientId}`)
                    .then(res => setClientName(res.data.name))
                    .catch(err => console.error(err));

                // Fetch calendar events
                api.get(`/calendar/${user.clientId}`)
                    .then(res => setEvents(res.data))
                    .catch(err => console.error(err));

                // Fetch Dashboard Data (InfoBoxes)
                api.get(`/dashboard/${user.clientId}`)
                    .then(res => {
                        const data = res.data;
                        // Use dynamic layout if available, otherwise fallback
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
            }
        }
    }, []);

    const handleBlocked = async () => {
        if (!clientId) return;

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        try {
            const response = await api.post('/calendar', {
                clientId: clientId,
                date: today,
                status: 'yellow',
                details: 'Client reported a blocker via Dashboard.'
            });

            // Update local state with the returned entry from server
            const newEntry = response.data;
            setEvents(prev => {
                const exists = prev.find(e => isSameDay(new Date(e.date), new Date(newEntry.date)));
                if (exists) {
                    return prev.map(e => isSameDay(new Date(e.date), new Date(newEntry.date)) ? newEntry : e);
                }
                return [...prev, newEntry];
            });

            alert("Status updated: You have marked today as blocked. The team has been notified.");
        } catch (error) {
            console.error("Error marking as blocked:", error);
            alert("Failed to update status. Please try again.");
        }
    };

    // Mock data for InfoBox removed, now using state initialized above

    // Client cannot click to add events, but StatusCalendar handles clicks to show details
    // StatusCalendar handles clicks natively for showing the popup.
    // We just need to make sure we don't pass an onDateClick handler that opens an edit modal.
    // By default StatusCalendar shows details popup on click.

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
            {/* Calendar Section - Takes up 2/3 width */}
            <div className="lg:col-span-2 flex flex-col">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {clientName || 'Partner'}</p>
                    </div>
                    <button
                        onClick={handleBlocked}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all transform hover:scale-105 active:scale-95 animate-pulse"
                    >
                        I'm Blocked ✋
                    </button>
                </div>

                <div className="flex-1">
                    <StatusCalendar events={events} role="client" />
                </div>
            </div>

            {/* Info Boxes Section - Takes up 1/3 width */}
            <div className="flex flex-col gap-6 lg:h-full lg:overflow-y-auto custom-scrollbar pr-2">
                {layout.map((widget) => {
                    // Filter out empty widgets if strictly required, but usually we want to show what Admin configured
                    // But requirement says "If a box is empty, it shouldn't show up."
                    // Let's implement that check.
                    if (!widget.data || widget.data.length === 0) return null;

                    return (
                        <InfoBox
                            key={widget.id}
                            title={widget.title}
                            type={widget.type}
                            data={widget.data}
                            readOnly={true}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ClientDashboard;
