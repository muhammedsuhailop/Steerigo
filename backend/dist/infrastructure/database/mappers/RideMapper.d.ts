import { Ride } from "../../../domain/entities/Ride";
import { IRideDocument } from "../models/RideModel";
export declare class RideMapper {
    static toDomain(doc: IRideDocument): Ride;
    static toPersistence(entity: Ride): Partial<IRideDocument>;
}
//# sourceMappingURL=RideMapper.d.ts.map