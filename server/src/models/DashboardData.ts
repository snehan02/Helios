import mongoose, { Document, Schema } from 'mongoose';

export interface IDashboardData extends Document {
    client: mongoose.Types.ObjectId;
    payments: Array<{
        invoiceName: string;
        status: 'Pending' | 'Completed' | 'Overdue';
        amount: string;
        date: Date;
    }>;
    metrics: Array<{
        label: string;
        value: string;
        trend?: string;
    }>;
    resources: Array<{
        label: string;
        link: string;
        type: string;
    }>;
    layout: Array<{
        id: string;
        type: 'payment' | 'metric' | 'resource' | 'custom';
        title: string;
        data: any;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const DashboardDataSchema: Schema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true,
        unique: true
    },
    payments: [{
        invoiceName: String,
        status: { type: String, enum: ['Pending', 'Completed', 'Overdue'] },
        amount: String,
        date: Date
    }],
    metrics: [{
        label: String,
        value: String,
        trend: String
    }],
    resources: [{
        label: String,
        link: String,
        type: { type: String, default: 'link' }
    }],
    layout: [{
        id: String,
        type: { type: String, enum: ['payment', 'metric', 'resource', 'custom'] },
        title: String,
        data: Schema.Types.Mixed
    }]
}, { timestamps: true });

export default mongoose.model<IDashboardData>('DashboardData', DashboardDataSchema);
