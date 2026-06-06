"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlot = void 0;
class TimeSlot {
    constructor(startTime, endTime) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
    static create(startTime, endTime) {
        this.validate(startTime, endTime);
        return new TimeSlot(startTime, endTime);
    }
    static validate(startTime, endTime) {
        // Validate range
        if (startTime < 0 || startTime > 1440) {
            throw new Error("Start time must be between 0 and 1440 minutes");
        }
        if (endTime < 0 || endTime > 1440) {
            throw new Error("End time must be between 0 and 1440 minutes");
        }
        // For regular slots, end must be after start
        // For wrap-around slots (e.g., 10 PM to 5 AM), startTime > endTime is allowed
        if (startTime === endTime) {
            throw new Error("Start time and end time cannot be the same");
        }
    }
    static fromMinutes(startMinutes, endMinutes) {
        return TimeSlot.create(startMinutes, endMinutes);
    }
    getStartTime() {
        return this.startTime;
    }
    getEndTime() {
        return this.endTime;
    }
    containsTime(minutes) {
        if (this.startTime <= this.endTime) {
            // Normal slot: e.g., 5 AM (300) to 10 PM (1320)
            return minutes >= this.startTime && minutes < this.endTime;
        }
        else {
            // Wrap-around slot: e.g., 10 PM (1320) to 5 AM (300)
            return minutes >= this.startTime || minutes < this.endTime;
        }
    }
    static timeToMinutes(hours, minutes = 0) {
        if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            throw new Error("Invalid time");
        }
        return hours * 60 + minutes;
    }
    static minutesToTime(minutes) {
        if (minutes < 0 || minutes > 1440) {
            throw new Error("Minutes must be between 0 and 1440");
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    }
    toDTO() {
        return {
            startTime: this.startTime,
            endTime: this.endTime,
            displayStartTime: TimeSlot.minutesToTime(this.startTime),
            displayEndTime: TimeSlot.minutesToTime(this.endTime),
        };
    }
}
exports.TimeSlot = TimeSlot;
//# sourceMappingURL=TimeSlot.js.map