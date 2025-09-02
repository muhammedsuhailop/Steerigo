import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    mobile?: string;
    dob?: Date;
    gender?: string;
    address?: string;
    role: string;
    status: string;
    isVerified: boolean;
    otpHash?: string;
    otpExpires?: Date;
    otpAttempts: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        mobile: {
            type: String,
            sparse: true,
            unique: true,
        },
        dob: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
        },
        address: {
            type: String,
            maxlength: 500,
        },
        role: {
            type: String,
            enum: ["Rider", "Driver", "Admin"],
            default: "Rider",
        },
        status: {
            type: String,
            enum: ["Pending Verification", "Active", "Suspended", "Inactive"],
            default: "Pending Verification",
        },
        isVerified: {
            type: Boolean,
            default: false,
            index: true,
        },
        otpHash: {
            type: String,
        },
        otpExpires: {
            type: Date,
            index: true,
        },
        otpAttempts: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

UserSchema.index({ email: 1, isVerified: 1 });

export const UserModel = mongoose.model<IUserDocument>("User", UserSchema);
