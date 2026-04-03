import { RideRequestGroup } from "@domain/entities/RideRequestGroup";
import { IReadOnlyRepository } from "./base/IReadOnlyRepository";
import { IWriteOnlyRepository } from "./base/IWriteOnlyRepository";

export interface IRideRequestGroupRepository
  extends IReadOnlyRepository<RideRequestGroup>,
    IWriteOnlyRepository<RideRequestGroup> {
  findActiveById(id: string): Promise<RideRequestGroup | null>;
}
