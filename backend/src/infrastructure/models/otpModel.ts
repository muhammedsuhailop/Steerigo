import mongoose, { Schema, Document } from 'mongoose';

export interface OtpDoc extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema = new Schema<OtpDoc>({
  email:     { type: String, required: true },
  otp:       { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 }  // auto-delete after 5 min
});

export const OtpModel = mongoose.model<OtpDoc>('Otp', otpSchema);
