"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverAvailabilityMapper = void 0;
const DriverAvailability_1 = require("@domain/entities/DriverAvailability");
const Location_1 = require("@domain/value-objects/Location");
const TimeSlot_1 = require("@domain/value-objects/TimeSlot");
const mongoose_1 = require("mongoose");
class DriverAvailabilityMapper {
    static mapLocation(raw) {
        return Location_1.Location.create({
            latitude: raw.latitude,
            longitude: raw.longitude,
            address: raw.address,
        });
    }
    static toDomain(raw) {
        const currentLocation = this.mapLocation(raw.currentLocation);
        const baseLocation = raw.baseLocation
            ? this.mapLocation(raw.baseLocation)
            : undefined;
        const timeSlots = raw.recurringSchedule?.dailyRecurrence.timeSlots.map((slot) => TimeSlot_1.TimeSlot.create(slot.startTime, slot.endTime)) || [];
        const excludedTimeSlots = raw.recurringSchedule?.dailyRecurrence
            .excludedTimeSlots
            ? raw.recurringSchedule.dailyRecurrence.excludedTimeSlots.map((slot) => TimeSlot_1.TimeSlot.create(slot.startTime, slot.endTime))
            : undefined;
        const recurringSchedule = raw.recurringSchedule
            ? {
                dailyRecurrence: {
                    daysOfWeek: raw.recurringSchedule.dailyRecurrence.daysOfWeek,
                    timeSlots,
                    excludedTimeSlots,
                },
                validity: raw.recurringSchedule.validity,
                notes: raw.recurringSchedule.notes,
            }
            : undefined;
        const exceptions = (raw.exceptions || []).map((exception) => ({
            id: exception.id,
            type: exception.type,
            reason: exception.reason,
            startTime: new Date(exception.startTime),
            endTime: new Date(exception.endTime),
            createdAt: new Date(exception.createdAt),
        }));
        return DriverAvailability_1.DriverAvailability.fromData({
            id: raw._id.toString(),
            driverId: raw.driverId.toString(),
            status: raw.status,
            currentLocation,
            baseLocation,
            recurringSchedule,
            exceptions,
            isActive: raw.isActive,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        });
    }
    static toPersistence(availability) {
        const currentLocation = availability.getCurrentLocation();
        const currentCoordinates = currentLocation.getCoordinates();
        const baseLocation = availability.getBaseLocation();
        const baseCoordinates = baseLocation?.getCoordinates();
        const recurringSchedule = availability.getRecurringSchedule();
        const persistenceData = {
            _id: new mongoose_1.Types.ObjectId(availability.getId()),
            driverId: new mongoose_1.Types.ObjectId(availability.getDriverId()),
            status: availability.getStatus(),
            currentLocation: {
                latitude: currentCoordinates.latitude,
                longitude: currentCoordinates.longitude,
                address: currentCoordinates.address,
                updatedAt: new Date(),
            },
            locationPoint: {
                type: "Point",
                coordinates: [
                    currentCoordinates.longitude,
                    currentCoordinates.latitude,
                ],
            },
            baseLocation: baseCoordinates
                ? {
                    latitude: baseCoordinates.latitude,
                    longitude: baseCoordinates.longitude,
                    address: baseCoordinates.address,
                    updatedAt: new Date(),
                }
                : undefined,
            baseLocationPoint: baseCoordinates
                ? {
                    type: "Point",
                    coordinates: [baseCoordinates.longitude, baseCoordinates.latitude],
                }
                : undefined,
            exceptions: availability.getExceptions().map((exception) => ({
                id: exception.id,
                type: exception.type,
                reason: exception.reason,
                startTime: exception.startTime,
                endTime: exception.endTime,
                createdAt: exception.createdAt,
            })),
            isActive: availability.getIsActive(),
            updatedAt: availability.getUpdatedAt(),
        };
        if (recurringSchedule) {
            persistenceData.recurringSchedule = {
                dailyRecurrence: {
                    daysOfWeek: recurringSchedule.dailyRecurrence.daysOfWeek,
                    timeSlots: recurringSchedule.dailyRecurrence.timeSlots.map((slot) => ({
                        startTime: slot.getStartTime(),
                        endTime: slot.getEndTime(),
                    })),
                    excludedTimeSlots: recurringSchedule.dailyRecurrence.excludedTimeSlots?.map((slot) => ({
                        startTime: slot.getStartTime(),
                        endTime: slot.getEndTime(),
                    })),
                },
                validity: recurringSchedule.validity,
                notes: recurringSchedule.notes,
            };
        }
        else {
            persistenceData.recurringSchedule = null;
        }
        return persistenceData;
    }
    static mapRawExceptionToDomain(rawException) {
        return {
            id: rawException.id,
            type: rawException.type,
            reason: rawException.reason,
            startTime: new Date(rawException.startTime),
            endTime: new Date(rawException.endTime),
            createdAt: new Date(rawException.createdAt),
        };
    }
}
exports.DriverAvailabilityMapper = DriverAvailabilityMapper;
//# sourceMappingURL=DriverAvailabilityMapper.js.map