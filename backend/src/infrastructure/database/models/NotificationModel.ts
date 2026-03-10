import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { NotificationType } from "@domain/value-objects/NotificationType";
import { NotificationChannel } from "@domain/value-objects/NotificationChannel";
import { NotificationMetadata } from "@domain/entities/Notification";

export interface INotificationDocument extends Document {
  _id: Types.ObjectId;
  recipientId: Types.ObjectId;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  body: string;
  metadata: NotificationMetadata;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const notificationMetadataSchema = new Schema<NotificationMetadata>(
  {
    rideId: { type: String, default: undefined },
    requestId: { type: String, default: undefined },
    paymentId: { type: String, default: undefined },
  },
  { _id: false, strict: false },
);

const notificationSchema = new Schema<INotificationDocument>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
      index: true,
    },
    channel: {
      type: String,
      enum: Object.values(NotificationChannel),
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 255,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
    metadata: {
      type: notificationMetadataSchema,
      default: {},
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, type: 1, createdAt: -1 });

export const NotificationModel: Model<INotificationDocument> =
  mongoose.model<INotificationDocument>("Notification", notificationSchema);
