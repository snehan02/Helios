import mongoose, { Schema, Document } from 'mongoose';

export interface IClientAdminAssignment extends Document {
    clientId: string;
    adminId: string;
    createdAt: Date;
}

const ClientAdminAssignmentSchema: Schema = new Schema({
    clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Ensure unique assignment per client and admin
ClientAdminAssignmentSchema.index({ clientId: 1, adminId: 1 }, { unique: true });

export default mongoose.model<IClientAdminAssignment>('ClientAdminAssignment', ClientAdminAssignmentSchema);
