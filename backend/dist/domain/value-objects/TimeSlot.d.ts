export declare class TimeSlot {
    private readonly startTime;
    private readonly endTime;
    private constructor();
    static create(startTime: number, endTime: number): TimeSlot;
    private static validate;
    static fromMinutes(startMinutes: number, endMinutes: number): TimeSlot;
    getStartTime(): number;
    getEndTime(): number;
    containsTime(minutes: number): boolean;
    static timeToMinutes(hours: number, minutes?: number): number;
    static minutesToTime(minutes: number): string;
    toDTO(): {
        startTime: number;
        endTime: number;
        displayStartTime: string;
        displayEndTime: string;
    };
}
//# sourceMappingURL=TimeSlot.d.ts.map