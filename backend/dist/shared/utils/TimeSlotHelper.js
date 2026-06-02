"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotHelper = void 0;
class TimeSlotHelper {
    static minutesToTimeSlot(startMinutes, endMinutes) {
        const format = (minutes) => {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
        };
        return {
            startTime: format(startMinutes),
            endTime: format(endMinutes),
            durationMinutes: endMinutes - startMinutes,
        };
    }
    static getDayLabels(daysOfWeek) {
        const dayNames = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];
        return daysOfWeek.map((day) => dayNames[day]);
    }
    static parseTime(timeString) {
        const [hours, minutes] = timeString.split(":").map(Number);
        return hours * 60 + minutes;
    }
    static hasTimeOverlap(excStart, excEnd, slotStartTime, slotEndTime) {
        const excStartMinutes = excStart.getHours() * 60 + excStart.getMinutes();
        const excEndMinutes = excEnd.getHours() * 60 + excEnd.getMinutes();
        const slotStartMinutes = this.parseTime(slotStartTime);
        const slotEndMinutes = this.parseTime(slotEndTime);
        return !(excEndMinutes <= slotStartMinutes || excStartMinutes >= slotEndMinutes);
    }
}
exports.TimeSlotHelper = TimeSlotHelper;
//# sourceMappingURL=TimeSlotHelper.js.map