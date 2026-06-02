import { DriverAvailability } from "@domain/entities/DriverAvailability";
import { AvailabilityException } from "@domain/entities/AvailabilityException";
import { ExceptionDocument, IDriverAvailabilityModel } from "../models/DriverAvailabilityModel";
export declare class DriverAvailabilityMapper {
    private static mapLocation;
    static toDomain(raw: IDriverAvailabilityModel): DriverAvailability;
    static toPersistence(availability: DriverAvailability): Partial<IDriverAvailabilityModel>;
    static mapRawExceptionToDomain(rawException: ExceptionDocument): AvailabilityException;
}
//# sourceMappingURL=DriverAvailabilityMapper.d.ts.map