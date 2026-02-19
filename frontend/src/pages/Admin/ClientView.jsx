import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import clsx from 'clsx';
import StatusCalendar from '../../components/Calendar/StatusCalendar';
import InfoBox from '../../components/Dashboard/InfoBox';
import api from '../../api/axios';
const ClientView = () => {
    const { clientId } = useParams();
    const [client, setClient] = useState(null);
    const [events, setEvents] = useState([]);
    const [boxData, setBoxData] = useState({
        payments: [],
        metrics: [],
        resources: []
    });
    const [layout, setLayout] = useState([]);
    const [isLayoutMode, setIsLayoutMode] = useState(false);
    const [showWidgetModal, setShowWidgetModal] = useState(false);
    const [newWidgetType, setNewWidgetType] = useState('custom');
    const [newWidgetTitle, setNewWidgetTitle] = useState('');

    const fetchData = () => {
        // Fetch Client Details
        api.get(`/clients/${clientId}`)
            .then(res => setClient(res.data))
            .catch(err => console.error(err));

        // Fetch Calendar Events
        api.get(`/calendar/${clientId}`)
            .then(res => setEvents(res.data))
            .catch(err => console.error(err));

        // Fetch Dashboard Data (InfoBoxes)
        api.get(`/dashboard/${clientId}`)
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
    };

    useEffect(() => {
        fetchData();
    }, [clientId]);

    const handleSaveLayout = async (updatedLayout) => {
        try {
            await api.put(`/dashboard/${clientId}/layout`, { layout: updatedLayout });
            setLayout(updatedLayout);
        } catch (error) {
            console.error("Error saving layout:", error);
            alert("Failed to save layout: " + (error.response?.data?.error || error.message));
        }
    };

    const handleAddWidget = () => {
        const newWidget = {
            id: `widget-${Date.now()}`,
            type: newWidgetType,
            title: newWidgetTitle || 'New Widget',
            data: []
        };
        const updatedLayout = [...layout, newWidget];
        handleSaveLayout(updatedLayout);
        setShowWidgetModal(false);
        setNewWidgetTitle('');
    };

    const handleDeleteWidget = (widgetId) => {
        if (window.confirm("Are you sure you want to delete this widget?")) {
            const updatedLayout = layout.filter(w => w.id !== widgetId);
            handleSaveLayout(updatedLayout);
        }
    };

    const handleWidgetDataUpdate = (widgetId, newData) => {
        const updatedLayout = layout.map(w => {
            if (w.id === widgetId) {
                return { ...w, data: newData };
            }
            return w;
        });
        setLayout(updatedLayout);
        handleSaveLayout(updatedLayout);
    };


    const handleCalendarSave = async (date, formData) => {
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

            // Update local state
            const newEntry = response.data;
            setEvents(prev => {
                const exists = prev.find(e => e._id === newEntry._id);
                if (exists) {
                    return prev.map(e => e._id === newEntry._id ? newEntry : e);
                }
                return [...prev, newEntry];
            });

            alert("Work log saved successfully!");
        } catch (error) {
            console.error("Error saving calendar status:", error);
            alert("Failed to save work log: " + (error.response?.data?.error || error.message));
        }
    };

    const handleDownloadReport = () => {
        const reportData = {
            clientName: client?.name || 'Client',
            generatedAt: new Date().toISOString(),
            dashboardData: layout,
            calendarEvents: events
        };
        const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${(client?.name || 'Client').replace(/\s+/g, '_')}_Data.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-[calc(100vh-8rem)] bg-zinc-950 p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 h-full">
                {/* Main Content: Calendar */}
                <div className="lg:col-span-2 flex flex-col group">
                    <div className="mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-zinc-400/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-400/30 to-transparent" />
                        <div className="w-full md:w-auto">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase break-words">{client?.name || 'Loading...'}</h1>
                            </div>
                            <p className="text-zinc-500 font-medium text-sm">
                                Managing project status and resources for <span className="text-zinc-300">partner view</span>.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                            <button
                                onClick={fetchData}
                                className="btn-silver w-full sm:w-auto px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                                Sync
                            </button>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDownloadReport();
                                }}
                                className="btn-silver w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
                                Download Data
                            </button>
                            <button
                                onClick={() => setIsLayoutMode(!isLayoutMode)}
                                className={clsx(
                                    "btn-silver w-full sm:w-auto px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all",
                                    isLayoutMode ? "opacity-100 ring-2 ring-zinc-400" : "opacity-80"
                                )}
                            >
                                {isLayoutMode ? 'Finish Layout' : 'Modify Layout'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1">
                        <StatusCalendar
                            events={events}
                            onSave={handleCalendarSave}
                            role="admin"
                        />
                    </div>
                </div>

                {/* Info Boxes Section - Takes up 1/3 width */}
                <div className="flex flex-col gap-6 lg:h-full lg:overflow-y-auto custom-scrollbar pr-2">
                    {layout.map((widget, index) => (
                        <div key={widget.id} className="relative group">
                            {isLayoutMode && (
                                <div className="absolute -top-3 -right-3 z-10 flex gap-1">
                                    <button
                                        onClick={() => {
                                            const newLayout = [...layout];
                                            if (index > 0) {
                                                [newLayout[index - 1], newLayout[index]] = [newLayout[index], newLayout[index - 1]];
                                                handleSaveLayout(newLayout);
                                            }
                                        }}
                                        disabled={index === 0}
                                        className="p-1 bg-gray-700 rounded hover:bg-gray-600 text-white disabled:opacity-30"
                                    >
                                        ↑
                                    </button>
                                    <button
                                        onClick={() => {
                                            const newLayout = [...layout];
                                            if (index < layout.length - 1) {
                                                [newLayout[index + 1], newLayout[index]] = [newLayout[index], newLayout[index + 1]];
                                                handleSaveLayout(newLayout);
                                            }
                                        }}
                                        disabled={index === layout.length - 1}
                                        className="p-1 bg-gray-700 rounded hover:bg-gray-600 text-white disabled:opacity-30"
                                    >
                                        ↓
                                    </button>
                                    <button
                                        onClick={() => handleDeleteWidget(widget.id)}
                                        className="p-1 bg-red-500/80 rounded hover:bg-red-500 text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            )}
                            <InfoBox
                                title={widget.title}
                                type={widget.type}
                                data={widget.data}
                                onSave={(newData) => handleWidgetDataUpdate(widget.id, newData)}
                                readOnly={false} // Admin can always edit content
                            />
                        </div>
                    ))}

                    {isLayoutMode && (
                        <button
                            onClick={() => setShowWidgetModal(true)}
                            className="w-full py-4 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800/30 transition-all flex flex-col items-center justify-center gap-2"
                        >
                            <span className="text-2xl">+</span>
                            <span className="font-medium">Add Widget</span>
                        </button>
                    )}

                    {/* Add Widget Modal */}
                    {showWidgetModal && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                            <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-full max-w-sm shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-4">Add New Widget</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Widget Title</label>
                                        <input
                                            type="text"
                                            value={newWidgetTitle}
                                            onChange={(e) => setNewWidgetTitle(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-zinc-500"
                                            placeholder="e.g. Weekly Reports"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Type</label>
                                        <select
                                            value={newWidgetType}
                                            onChange={(e) => setNewWidgetType(e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-zinc-500"
                                        >
                                            <option value="custom">Custom List (Text)</option>
                                            <option value="resource">Links / Resources</option>
                                            <option value="metric">Metrics / Stats</option>
                                            <option value="payment">Payments (Status)</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <button
                                            onClick={() => setShowWidgetModal(false)}
                                            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddWidget}
                                            className="flex-1 px-4 py-2 btn-silver text-white rounded-lg"
                                        >
                                            Add Widget
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientView;
