import mongoose, { Document, Schema } from 'mongoose';

export interface IClient extends Document {
    name: string;
    email: string; // Added for convenience/redundancy or just rely on user? PRD says "Input Client Name, Email, Industry" for creation.
    industry?: string;
    logoUrl?: string;
    brandColors: {
        primary: string;
        secondary: string;
    };
    userId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema: Schema = new Schema({
    name: { type: String, required: true },
    industry: { type: String },
    logoUrl: { type: String, default: '' },
    brandColors: {
        primary: { type: String, default: '#000000' },
        secondary: { type: String, default: '#ffffff' }
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model<IClient>('Client', ClientSchema);
