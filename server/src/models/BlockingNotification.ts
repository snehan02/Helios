import mongoose, { Schema, Document } from 'mongoose';

export interface IBlockingNotification extends Document {
    clientId: mongoose.Types.ObjectId | string;
    blockingDate: Date;
    message?: string;
    isResolved: boolean;
    resolvedByUserId?: string | mongoose.Types.ObjectId;
    resolvedAt?: Date;
    createdAt: Date;
}

const BlockingNotificationSchema: Schema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    blockingDate: { type: Date, required: true },
    message: { type: String },
    isResolved: { type: Boolean, default: false },
    resolvedByUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date },
}, { timestamps: true }); // Mongoose adds createdAt/updatedAt automatically

export default mongoose.model<IBlockingNotification>('BlockingNotification', BlockingNotificationSchema);
