import { IRideRequestGroupRepository } from "../../../domain/repositories/IRideRequestGroupRepository";
import { RideRequestGroup } from "../../../domain/entities/RideRequestGroup";
import { RideRequestGroupStatus } from "../../../domain/value-objects/RideRequestGroupStatus";
export declare class RideRequestGroupRepositoryImpl implements IRideRequestGroupRepository {
    save(entity: RideRequestGroup): Promise<RideRequestGroup>;
    exists(id: string): Promise<boolean>;
    findById(id: string): Promise<RideRequestGroup | null>;
    findActiveById(id: string): Promise<RideRequestGroup | null>;
    delete(id: string): Promise<boolean>;
    updateCurrentIndex(id: string, newIndex: number): Promise<RideRequestGroup | null>;
    updateStatus(id: string, status: RideRequestGroupStatus): Promise<RideRequestGroup | null>;
}
//# sourceMappingURL=RideRequestGroupRepositoryImpl.d.ts.map