import { DriverCancellationContext, DriverCancellationOutcome, ICancellationChargeService, RiderCancellationContext } from "../../application/services/ICancellationChargeService";
import { FareBreakdown } from "../../domain/value-objects/FareBreakdown";
import { Money } from "../../domain/value-objects/Money";
import { IFareConfigurationRepository } from "../../domain/repositories/IFareConfigurationRepository";
export declare class CancellationChargeService implements ICancellationChargeService {
    private fareConfigRepository;
    private readonly MIN_FEE;
    private readonly DRIVER_WAIT_THRESHOLD_MINS;
    private readonly MAX_DRIVER_PENALTY;
    private readonly MIN_DRIVER_PENALTY;
    constructor(fareConfigRepository: IFareConfigurationRepository);
    calculateRiderCancellationCharge(params: {
        fareBreakdown: FareBreakdown;
        context: RiderCancellationContext;
        searchDate?: Date;
    }): Promise<Money>;
    calculateDriverCancellationOutcome(params: {
        fareBreakdown: FareBreakdown;
        context: DriverCancellationContext;
        searchDate?: Date;
    }): Promise<DriverCancellationOutcome>;
    private getRequiredConfig;
    private applyRiderFeeConstraints;
    private calculateArrivedCancellation;
    private calculateEnRouteCancellation;
    private calculateDriverPenalty;
}
//# sourceMappingURL=CancellationChargeService.d.ts.map