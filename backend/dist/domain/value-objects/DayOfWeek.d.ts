export declare enum DayOfWeek {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}
export declare class DayOfWeekUtils {
    static isValidDay(day: number): boolean;
    static getDayName(day: DayOfWeek): string;
    static getCurrentDayOfWeekUtc(): DayOfWeek;
    static getDayFromDateUtc(date: Date): DayOfWeek;
}
//# sourceMappingURL=DayOfWeek.d.ts.map