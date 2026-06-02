import { Gender } from "@domain/value-objects/Gender";
import mongoose, { Document } from "mongoose";
export interface IUserDocument extends Document {
    name: string;
    email: string;
    password: string;
    mobile?: string;
    dob?: Date;
    gender?: Gender;
    address?: string;
    role: string;
    status: string;
    isVerified: boolean;
    otpHash?: string;
    otpExpires?: Date;
    otpAttempts: number;
    googleId?: string;
    profilePicture?: string;
    authProvider: "email" | "google";
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: mongoose.Model<IUserDocument, {}, {}, {}, mongoose.Document<unknown, {}, IUserDocument, {}, {}> & IUserDocument & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserModel.d.ts.map