import { DayOfWeek } from "../../../domain/value-objects/DayOfWeek";
import { Document, Types } from "mongoose";
interface TimeSlot {
    startTime: number;
    endTime: number;
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
export interface IGeoPoint {
    type: "Point";
    coordinates: [number, number];
}
export interface IDriverAvailabilityModel extends Document {
    _id: Types.ObjectId;
    driverId: Types.ObjectId;
    status: string;
    currentLocation: {
        latitude: number;
        longitude: number;
        address?: string;
        updatedAt?: Date;
    };
    locationPoint: IGeoPoint;
    baseLocation: {
        latitude: number;
        longitude: number;
        address?: string;
        updatedAt?: Date;
    };
    baseLocationPoint?: IGeoPoint;
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
export declare const DriverAvailabilityModel: import("mongoose").Model<IDriverAvailabilityModel, {}, {}, {}, Document<unknown, {}, IDriverAvailabilityModel, {}, {}> & IDriverAvailabilityModel & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>;
export type { TimeSlot, DailyRecurrence, ScheduleValidity, ExceptionDocument };
//# sourceMappingURL=DriverAvailabilityModel.d.ts.map