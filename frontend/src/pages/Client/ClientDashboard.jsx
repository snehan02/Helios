import { useState } from 'react';
import StatusCalendar from '../../components/Calendar/StatusCalendar';
import InfoBox from '../../components/Dashboard/InfoBox';

const ClientDashboard = () => {
    // Mock Data (Fetched from API in real implementation)
    const [events] = useState([
        { date: '2023-11-05', status: 'green', details: 'SEO Audit completed. All tags optimized.' },
        { date: '2023-11-12', status: 'yellow', details: 'Waiting on client feedback for homepage banner.' },
    ]);

    const [boxData] = useState({
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

    // Client cannot click to add events, but StatusCalendar handles clicks to show details
    // StatusCalendar handles clicks natively for showing the popup.
    // We just need to make sure we don't pass an onDateClick handler that opens an edit modal.
    // By default StatusCalendar shows details popup on click.

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-8rem)]">
            {/* Calendar Section - Takes up 2/3 width */}
            <div className="lg:col-span-2 flex flex-col">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">My Dashboard</h1>
                    <p className="text-gray-400">Welcome back, Client Name</p>
                </div>

                <div className="flex-1">
                    <StatusCalendar events={events} />
                </div>
            </div>

            {/* Info Boxes Section - Takes up 1/3 width */}
            <div className="flex flex-col gap-6 lg:h-full lg:overflow-y-auto custom-scrollbar pr-2">
                <InfoBox
                    title="Payments"
                    type="payment"
                    data={boxData.payments}
                    readOnly={true}
                />
                <InfoBox
                    title="Metrics"
                    type="metric"
                    data={boxData.metrics}
                    readOnly={true}
                />
                <InfoBox
                    title="Resources"
                    type="resource"
                    data={boxData.resources}
                    readOnly={true}
                />
            </div>
        </div>
    );
};

export default ClientDashboard;
