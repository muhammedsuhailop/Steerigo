import { RideRequestGroup } from "../entities/RideRequestGroup";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";
import { RideRequestGroupStatus } from "../value-objects/RideRequestGroupStatus";
export interface IRideRequestGroupRepository extends IReadOnlyRepository<RideRequestGroup>, IWriteOnlyRepository<RideRequestGroup> {
    findActiveById(id: string): Promise<RideRequestGroup | null>;
    updateCurrentIndex(id: string, newIndex: number): Promise<RideRequestGroup | null>;
    updateStatus(id: string, status: RideRequestGroupStatus): Promise<RideRequestGroup | null>;
}
//# sourceMappingURL=IRideRequestGroupRepository.d.ts.map