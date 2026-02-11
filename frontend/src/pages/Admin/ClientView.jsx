import { useState } from 'react';
import { useParams } from 'react-router-dom';
import StatusCalendar from '../../components/Calendar/StatusCalendar';
import InfoBox from '../../components/Dashboard/InfoBox';
import LogWorkModal from '../../components/Calendar/LogWorkModal';

const ClientView = () => {
    const { clientId } = useParams();

    // Mock Data
    const [events, setEvents] = useState([
        { date: '2023-11-05', status: 'green', details: 'SEO Audit completed. All tags optimized.' },
        { date: '2023-11-12', status: 'yellow', details: 'Waiting on client feedback for homepage banner.' },
        { date: '2023-11-15', status: 'red', details: 'Server downtime caused delay in deployment.' },
    ]);

    const [boxData, setBoxData] = useState({
        payments: [
            { id: 1, label: 'Invoice #001', value: 'Completed' },
            { id: 2, label: 'Invoice #002', value: 'Pending' },
        ],
        metrics: [
            { id: 1, label: 'Total Followers', value: '12.5k' },
            { id: 2, label: 'Engagement Rate', value: '4.2%' },
        ],
        resources: [
            { id: 1, label: 'Brand Kit', value: 'https://figma.com/file/...' },
            { id: 2, label: 'Drive Folder', value: 'https://drive.google.com/...' },
        ]
    });

    const handleUpdateBox = (type, newData) => {
        setBoxData(prev => ({ ...prev, [type]: newData }));
        // API call would go here
    };

    /* Log Work Modal Logic */
    const [isLogWorkOpen, setIsLogWorkOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [existingEvent, setExistingEvent] = useState(null);

    const handleDateClick = (date, event) => {
        setSelectedDate(date);
        setExistingEvent(event || null);
        setIsLogWorkOpen(true);
    };

    const handleSaveLogWork = (newEntry) => {
        // Check if entry exists for this date, if so update, else add
        const exists = events.find(e => e.date === newEntry.date);
        if (exists) {
            setEvents(events.map(e => e.date === newEntry.date ? newEntry : e));
        } else {
            setEvents([...events, newEntry]);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
            {/* Calendar Section - Takes up 2/3 width on large screens */}
            <div className="lg:col-span-2 flex flex-col">
                {/* Client Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">Acme Corp</h1>
                    <p className="text-gray-400">Viewing project status and resources.</p>
                </div>

                <div className="flex-1">
                    <StatusCalendar events={events} onDateClick={handleDateClick} />
                </div>
            </div>

            {/* Info Boxes Section - Takes up 1/3 width */}
            <div className="flex flex-col gap-6 lg:h-full lg:overflow-y-auto custom-scrollbar pr-2">
                <InfoBox
                    title="Payments"
                    type="payment"
                    data={boxData.payments}
                    onSave={(data) => handleUpdateBox('payments', data)}
                />
                <InfoBox
                    title="Metrics"
                    type="metric"
                    data={boxData.metrics}
                    onSave={(data) => handleUpdateBox('metrics', data)}
                />
                <InfoBox
                    title="Resources"
                    type="resource"
                    data={boxData.resources}
                    onSave={(data) => handleUpdateBox('resources', data)}
                />
            </div>

            <LogWorkModal
                isOpen={isLogWorkOpen}
                onClose={() => setIsLogWorkOpen(false)}
                onSave={handleSaveLogWork}
                date={selectedDate}
                initialData={existingEvent}
            />
        </div>
    );
};

export default ClientView;
