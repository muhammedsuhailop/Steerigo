import { RideRequest } from "../../../domain/entities/RideRequest";
import { IRideRequestDocument } from "../models/RideRequestModel";
export declare class RideRequestMapper {
    static toDomain(doc: IRideRequestDocument): RideRequest;
    static toPersistence(entity: RideRequest): Partial<IRideRequestDocument>;
}
//# sourceMappingURL=RideRequestMapper.d.ts.map