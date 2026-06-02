export declare class ScheduleValidityHelper {
    static isValidityActive(validity: {
        startDate: Date;
        endDate?: Date | null;
    }, now: Date): boolean;
    static isSchedulePending(startDate: Date, now: Date): boolean;
    static getTodayDayOfWeek(): number;
}
//# sourceMappingURL=ScheduleValidityHelper.d.ts.map