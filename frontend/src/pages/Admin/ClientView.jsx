import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
            alert("Failed to save layout.");
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
                const exists = prev.find(e => new Date(e.date).toDateString() === new Date(newEntry.date).toDateString());
                if (exists) {
                    return prev.map(e => new Date(e.date).toDateString() === new Date(newEntry.date).toDateString() ? newEntry : e);
                }
                return [...prev, newEntry];
            });

            alert("Work log saved successfully!");
        } catch (error) {
            console.error("Error saving calendar status:", error);
            alert("Failed to save work log.");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
            {/* Calendar Section - Takes up 2/3 width on large screens */}
            <div className="lg:col-span-2 flex flex-col">
                {/* Client Header */}
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{client?.name || 'Loading...'}</h1>
                        <p className="text-gray-400">Viewing project status and resources.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={fetchData}
                            className="px-4 py-2 bg-gray-800 text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" /></svg>
                            Refresh
                        </button>
                        <button
                            onClick={() => setIsLayoutMode(!isLayoutMode)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLayoutMode ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            {isLayoutMode ? 'Done Editing' : 'Edit Layout'}
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl w-96 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-4">Add New Widget</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Widget Title</label>
                                    <input
                                        type="text"
                                        value={newWidgetTitle}
                                        onChange={(e) => setNewWidgetTitle(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
                                        placeholder="e.g. Weekly Reports"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Type</label>
                                    <select
                                        value={newWidgetType}
                                        onChange={(e) => setNewWidgetType(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
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
                                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
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
    );
};

export default ClientView;
