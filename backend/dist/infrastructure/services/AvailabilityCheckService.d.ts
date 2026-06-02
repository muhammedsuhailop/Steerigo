import { IAvailabilityCheckService } from "@application/services/IAvailabilityCheckService";
import { IDriverAvailabilityRepository } from "@domain/repositories/IDriverAvailabilityRepository";
export declare class AvailabilityCheckService implements IAvailabilityCheckService {
    private availabilityRepository;
    constructor(availabilityRepository: IDriverAvailabilityRepository);
    isAvailableDuring(driverId: string, startDate: Date, endDate: Date): Promise<boolean>;
    private isDriverAvailableForDuration;
}
//# sourceMappingURL=AvailabilityCheckService.d.ts.map