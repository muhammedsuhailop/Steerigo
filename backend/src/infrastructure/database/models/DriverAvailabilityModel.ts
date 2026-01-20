import { AvailabilityExceptionType } from "@domain/value-objects/AvailabilityExceptionType";
import { AvailabilityStatus } from "@domain/value-objects/AvailabilityStatus";
import { DayOfWeek } from "@domain/value-objects/DayOfWeek";
import { Schema, model, Document, Types } from "mongoose";

interface TimeSlot {
  startTime: number; // 0-1439 minutes
  endTime: number; // 0-1439 minutes
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

interface ExceptionDocument {
  id: string;
  type: string;
  reason?: string;
  startTime: Date;
  endTime: Date;
  createdAt: Date;
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
  exceptions?: ExceptionDocument[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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

const timeSlotSchema = new Schema(
  {
    startTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1439,
    },
    endTime: {
      type: Number,
      required: true,
      min: 0,
      max: 1439,
    },
  },
  { _id: false }
);

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
        validator: (slots: TimeSlot[]): boolean => slots.length > 0,
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

const availabilityExceptionSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(AvailabilityExceptionType),
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
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true, timestamps: false }
);

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
      enum: Object.values(AvailabilityStatus),
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

// Composite index for driver + active status
driverAvailabilitySchema.index({ driverId: 1, isActive: 1 });

// Status index for fast filtering
driverAvailabilitySchema.index({ status: 1 });

// Schedule validity indexes for time-based queries
driverAvailabilitySchema.index({
  "recurringSchedule.validity.startDate": 1,
});

driverAvailabilitySchema.index({
  "recurringSchedule.validity.endDate": 1,
});

// Location indexes for geo-queries
driverAvailabilitySchema.index({
  "currentLocation.latitude": 1,
  "currentLocation.longitude": 1,
});

// Compound index for common queries
driverAvailabilitySchema.index({
  driverId: 1,
  isActive: 1,
  status: 1,
});

// Unique constraint for active availability per driver
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

driverAvailabilitySchema.pre("save", function (next) {
  // Validate recurring schedule if present
  if (this.recurringSchedule?.dailyRecurrence) {
    const { timeSlots, excludedTimeSlots } =
      this.recurringSchedule.dailyRecurrence;

    // Validate time slots
    for (const slot of timeSlots) {
      if (slot.startTime >= slot.endTime) {
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

    // Validate schedule validity
    if (
      this.recurringSchedule.validity.endDate &&
      this.recurringSchedule.validity.startDate >=
        this.recurringSchedule.validity.endDate
    ) {
      return next(
        new Error("Schedule validity end date must be after start date")
      );
    }
  }

  // Validate exceptions
  if (this.exceptions && this.exceptions.length > 0) {
    for (const exception of this.exceptions) {
      if (exception.startTime >= exception.endTime) {
        return next(new Error("Exception startTime must be less than endTime"));
      }
    }
  }

  // Validate location coordinates
  if (this.currentLocation) {
    const { latitude, longitude } = this.currentLocation;

    if (latitude < -90 || latitude > 90) {
      return next(new Error("Invalid latitude value"));
    }

    if (longitude < -180 || longitude > 180) {
      return next(new Error("Invalid longitude value"));
    }
  }

  next();
});

export const DriverAvailabilityModel = model<IDriverAvailabilityModel>(
  "DriverAvailability",
  driverAvailabilitySchema
);

export type { TimeSlot, DailyRecurrence, ScheduleValidity, ExceptionDocument };
