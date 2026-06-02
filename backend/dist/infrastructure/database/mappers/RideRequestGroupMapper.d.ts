import { RideRequestGroup } from "@domain/entities/RideRequestGroup";
import { IRideRequestGroupDocument } from "../models/RideRequestGroupModel";
export declare class RideRequestGroupMapper {
    static toDomain(doc: IRideRequestGroupDocument): RideRequestGroup;
    static toPersistence(entity: RideRequestGroup): Partial<IRideRequestGroupDocument>;
}
//# sourceMappingURL=RideRequestGroupMapper.d.ts.map