"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayOfWeekUtils = exports.DayOfWeek = void 0;
var DayOfWeek;
(function (DayOfWeek) {
    DayOfWeek[DayOfWeek["SUNDAY"] = 0] = "SUNDAY";
    DayOfWeek[DayOfWeek["MONDAY"] = 1] = "MONDAY";
    DayOfWeek[DayOfWeek["TUESDAY"] = 2] = "TUESDAY";
    DayOfWeek[DayOfWeek["WEDNESDAY"] = 3] = "WEDNESDAY";
    DayOfWeek[DayOfWeek["THURSDAY"] = 4] = "THURSDAY";
    DayOfWeek[DayOfWeek["FRIDAY"] = 5] = "FRIDAY";
    DayOfWeek[DayOfWeek["SATURDAY"] = 6] = "SATURDAY";
})(DayOfWeek || (exports.DayOfWeek = DayOfWeek = {}));
class DayOfWeekUtils {
    static isValidDay(day) {
        return day >= 0 && day <= 6;
    }
    static getDayName(day) {
        const names = {
            [DayOfWeek.SUNDAY]: "Sunday",
            [DayOfWeek.MONDAY]: "Monday",
            [DayOfWeek.TUESDAY]: "Tuesday",
            [DayOfWeek.WEDNESDAY]: "Wednesday",
            [DayOfWeek.THURSDAY]: "Thursday",
            [DayOfWeek.FRIDAY]: "Friday",
            [DayOfWeek.SATURDAY]: "Saturday",
        };
        return names[day];
    }
    static getCurrentDayOfWeekUtc() {
        return new Date().getUTCDay();
    }
    static getDayFromDateUtc(date) {
        return date.getUTCDay();
    }
}
exports.DayOfWeekUtils = DayOfWeekUtils;
//# sourceMappingURL=DayOfWeek.js.map