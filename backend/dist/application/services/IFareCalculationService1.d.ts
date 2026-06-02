import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { IFareConfigurationRepository } from "@domain/repositories/IFareConfigurationRepository";
export interface IFareCalculationParams {
    durationMinutes: number;
    searchDate?: Date;
}
export declare class IFareCalculationService {
    private fareConfigRepository;
    constructor(fareConfigRepository: IFareConfigurationRepository);
    calculateFare(params: IFareCalculationParams): Promise<FareBreakdown>;
    private calculateBaseFare;
}
//# sourceMappingURL=IFareCalculationService1.d.ts.map