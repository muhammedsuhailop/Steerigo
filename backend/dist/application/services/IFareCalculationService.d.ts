import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
export interface IFareCalculationParams {
    durationMinutes: number;
    searchDate?: Date;
}
export interface IFareCalculationService {
    calculateFare(params: IFareCalculationParams): Promise<FareBreakdown>;
}
//# sourceMappingURL=IFareCalculationService.d.ts.map