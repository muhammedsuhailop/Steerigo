"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleValidityHelper = void 0;
class ScheduleValidityHelper {
    static isValidityActive(validity, now) {
        return (now >= validity.startDate &&
            (!validity.endDate || now <= validity.endDate));
    }
    static isSchedulePending(startDate, now) {
        return startDate > now;
    }
    static getTodayDayOfWeek() {
        return new Date().getDay();
    }
}
exports.ScheduleValidityHelper = ScheduleValidityHelper;
//# sourceMappingURL=ScheduleValidityHelper.js.map