export declare class TimeSlotHelper {
    static minutesToTimeSlot(startMinutes: number, endMinutes: number): {
        startTime: string;
        endTime: string;
        durationMinutes: number;
    };
    static getDayLabels(daysOfWeek: number[]): string[];
    static parseTime(timeString: string): number;
    static hasTimeOverlap(excStart: Date, excEnd: Date, slotStartTime: string, slotEndTime: string): boolean;
}
//# sourceMappingURL=TimeSlotHelper.d.ts.map