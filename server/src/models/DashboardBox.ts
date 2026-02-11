import mongoose, { Schema, Document } from 'mongoose';

export interface IDashboardBox extends Document {
    clientId: mongoose.Types.ObjectId | string;
    type: 'PAYMENT' | 'RESOURCE' | 'METRIC' | 'CUSTOM';
    title: string;
    data: any;
    displayOrder: number;
    isVisible: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const DashboardBoxSchema: Schema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    type: {
        type: String,
        enum: ['PAYMENT', 'RESOURCE', 'METRIC', 'CUSTOM'],
        required: true,
    },
    title: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true }, // Use Mixed for flexible JSON structure
    displayOrder: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IDashboardBox>('DashboardBox', DashboardBoxSchema);
