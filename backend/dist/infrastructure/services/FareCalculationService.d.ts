import { IFareCalculationService, IFareCalculationParams } from "@application/services/IFareCalculationService";
import { FareBreakdown } from "@domain/value-objects/FareBreakdown";
import { IFareConfigurationRepository } from "@domain/repositories/IFareConfigurationRepository";
export declare class FareCalculationService implements IFareCalculationService {
    private fareConfigRepository;
    constructor(fareConfigRepository: IFareConfigurationRepository);
    calculateFare(params: IFareCalculationParams): Promise<FareBreakdown>;
    private calculateBaseFare;
}
//# sourceMappingURL=FareCalculationService.d.ts.map