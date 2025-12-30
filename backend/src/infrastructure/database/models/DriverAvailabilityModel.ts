import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { DayOfWeek } from "@domain/value-objects/DayOfWeek";
import { RecurringPattern } from "@domain/value-objects/RecurringPattern";
import { Schema, model, Document, Types } from "mongoose";

interface TimeSlot {
  startTime: number; // 0-1440 minutes
  endTime: number; // 0-1440 minutes
}

interface DailyRecurrence {
  daysOfWeek: DayOfWeek[];
  timeSlots: TimeSlot[];
  excludedTimeSlots?: TimeSlot[];
}

interface ScheduleValidity {
  startDate: Date;
  endDate?: Date | null;
}

interface AvailabilityException {
  _id?: Types.ObjectId;
  type: AvailabilityExceptionType;
  reason?: string;
  startTime: Date;
  endTime: Date;
  isRecurring?: boolean;
  recurringPattern?: RecurringPattern;
  createdAt?: Date;
}

export interface IDriverAvailabilityModel extends Document {
  _id: string;
  driverId: Types.ObjectId;
  status: string;
  currentLocation: {
    latitude: number;
    longitude: number;
    address?: string;
    updatedAt?: Date;
  };
  recurringSchedule?: {
    dailyRecurrence: DailyRecurrence;
    validity: ScheduleValidity;
    notes?: string;
  };
  exceptions?: AvailabilityException[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Location sub-schema
const locationSchema = new Schema(
  {
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    address: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// Time slot sub-schema
const timeSlotSchema = new Schema(
  {
    startTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },
    endTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1440,
    },
  },
  { _id: false }
);

// Daily recurrence sub-schema
const dailyRecurrenceSchema = new Schema(
  {
    daysOfWeek: {
      type: [Number],
      enum: [0, 1, 2, 3, 4, 5, 6],
      required: true,
    },
    timeSlots: {
      type: [timeSlotSchema],
      required: true,
      validate: {
        validator: (slots: TimeSlot[]) => slots.length > 0,
        message: "At least one time slot must be defined",
      },
    },
    excludedTimeSlots: {
      type: [timeSlotSchema],
      default: [],
    },
  },
  { _id: false }
);

// Schedule validity sub-schema
const scheduleValiditySchema = new Schema(
  {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

// Recurring schedule sub-schema
const recurringScheduleSchema = new Schema(
  {
    dailyRecurrence: {
      type: dailyRecurrenceSchema,
      required: true,
    },
    validity: {
      type: scheduleValiditySchema,
      required: true,
    },
    notes: {
      type: String,
      maxlength: 1000,
      trim: true,
    },
  },
  { _id: false }
);

// Availability exception sub-schema
const availabilityExceptionSchema = new Schema(
  {
    type: {
      type: String,
      enum: AvailabilityExceptionType,
      required: true,
    },
    reason: {
      type: String,
      maxlength: 500,
      trim: true,
    },
    startTime: {
      type: Date,
      required: true,
      index: true,
    },
    endTime: {
      type: Date,
      required: true,
      index: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringPattern: {
      type: String,
      enum: RecurringPattern,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true, timestamps: false }
);

// Main driver availability schema
const driverAvailabilitySchema = new Schema(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Driver",
      index: true,
    },
    status: {
      type: String,
      enum: AvailabilityStatus,
      default: AvailabilityStatus.OFFLINE,
      required: true,
    },
    currentLocation: {
      type: locationSchema,
      required: true,
    },
    recurringSchedule: {
      type: recurringScheduleSchema,
      default: null,
    },
    exceptions: {
      type: [availabilityExceptionSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "driver_availability",
  }
);

// Indexes for optimal querying
driverAvailabilitySchema.index({ driverId: 1, isActive: 1 });
driverAvailabilitySchema.index({ status: 1 });
driverAvailabilitySchema.index({
  "recurringSchedule.validity.startDate": 1,
});
driverAvailabilitySchema.index({
  "currentLocation.latitude": 1,
  "currentLocation.longitude": 1,
});
driverAvailabilitySchema.index({
  driverId: 1,
  isActive: 1,
  status: 1,
});
driverAvailabilitySchema.index(
  { driverId: 1, isActive: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true },
    name: "unique_active_availability_per_driver",
  }
);

driverAvailabilitySchema.index({
  "exceptions.startTime": 1,
  "exceptions.endTime": 1,
});

// Pre-save validation
driverAvailabilitySchema.pre("save", function (next) {
  if (this.recurringSchedule?.dailyRecurrence) {
    const { timeSlots, excludedTimeSlots } =
      this.recurringSchedule.dailyRecurrence;

    // Validate time slots
    for (const slot of timeSlots) {
      if (slot.startTime >= slot.endTime && slot.startTime !== 0) {
        return next(new Error("Time slot startTime must be less than endTime"));
      }
    }

    // Validate excluded time slots
    if (excludedTimeSlots) {
      for (const slot of excludedTimeSlots) {
        if (slot.startTime === slot.endTime) {
          return next(
            new Error("Excluded time slot cannot have same start and end time")
          );
        }
      }
    }

    // Validate days of week
    if (this.recurringSchedule.dailyRecurrence.daysOfWeek.length === 0) {
      return next(new Error("At least one day of week must be selected"));
    }
  }

  // Validate exceptions
  if (this.exceptions) {
    for (const exception of this.exceptions) {
      if (exception.startTime >= exception.endTime) {
        return next(new Error("Exception startTime must be less than endTime"));
      }
    }
  }

  next();
});

export const DriverAvailabilityModel = model<IDriverAvailabilityModel>(
  "DriverAvailability",
  driverAvailabilitySchema
);

export type {
  TimeSlot,
  DailyRecurrence,
  ScheduleValidity,
  AvailabilityException,
};
