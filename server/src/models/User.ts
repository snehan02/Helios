import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    passwordHash: string;
    role: 'admin' | 'client';
    clientId?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
        type: String,
        enum: ['admin', 'client'],
        default: 'client'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        required: function (this: IUser) { return this.role === 'client'; }
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
