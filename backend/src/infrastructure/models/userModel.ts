import mongoose, { Document, Schema, Types } from 'mongoose';


export type UserRole = 'Rider' | 'Driver' | 'Admin';


export interface IUserDoc extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    mobile?: string;
    dob?: Date;
    gender?: string;
    address?: string;
    status: 'Active' | 'Suspended' | 'Deleted' | 'Pending Verification';
    role: UserRole;
    password: string;
    isVerified: boolean;
    otpHash?: string | null;
    otpExpires?: Date | null;
    otpAttempts?: number;
    createdAt: Date;
    updatedAt: Date;
}


const UserSchema = new Schema<IUserDoc>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true, index: true },
    mobile: { type: String, required: false, trim: true, unique: true, sparse: true },
    dob: { type: Date, required: false },
    gender: { type: String, required: false },
    address: { type: String, required: false },
    status: { type: String, enum: ['Active', 'Suspended', 'Deleted', 'Pending Verification'], default: 'Pending Verification' },
    role: { type: String, enum: ['Rider', 'Driver', 'Admin'], default: 'Rider' },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otpHash: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    otpAttempts: { type: Number, default: 0 }
}, { timestamps: true });


export const UserModel = mongoose.model<IUserDoc>('User', UserSchema);