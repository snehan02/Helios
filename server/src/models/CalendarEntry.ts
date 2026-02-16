import mongoose, { Document, Schema } from 'mongoose';

export interface ICalendarEntry extends Document {
    client: mongoose.Types.ObjectId;
    date: Date;
    status: 'green' | 'yellow' | 'red';
    details?: string;
    createdBy?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CalendarEntrySchema: Schema = new Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: true
    },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['green', 'yellow', 'red'],
        required: true
    },
    details: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Allow multiple entries per client per day
CalendarEntrySchema.index({ client: 1, date: 1 });

export default mongoose.model<ICalendarEntry>('CalendarEntry', CalendarEntrySchema);
