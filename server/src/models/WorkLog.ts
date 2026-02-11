import mongoose, { Schema, Document } from 'mongoose';

export interface IWorkLog extends Document {
    clientId: mongoose.Types.ObjectId | string;
    date: Date;
    status: 'GREEN' | 'YELLOW' | 'RED';
    description: string;
    attachments?: { title: string; url: string }[];
    createdByUserId: mongoose.Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
}

const WorkLogSchema: Schema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['GREEN', 'YELLOW', 'RED'],
        required: true,
    },
    description: { type: String, required: true },
    attachments: [{
        title: String,
        url: String
    }],
    createdByUserId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Compound index to ensure unique log per client per day
WorkLogSchema.index({ clientId: 1, date: 1 }, { unique: true });

export default mongoose.model<IWorkLog>('WorkLog', WorkLogSchema);
