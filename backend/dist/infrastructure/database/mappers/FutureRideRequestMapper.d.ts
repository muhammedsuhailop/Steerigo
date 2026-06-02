import { FutureRideRequest } from "../../../domain/entities/FutureRideRequest";
import { IFutureRideRequestDocument } from "../models/FutureRideRequestModel";
export declare class FutureRideRequestMapper {
    static toDomain(doc: IFutureRideRequestDocument): FutureRideRequest;
    static toPersistence(entity: FutureRideRequest): Partial<IFutureRideRequestDocument>;
}
//# sourceMappingURL=FutureRideRequestMapper.d.ts.map