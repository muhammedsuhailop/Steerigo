import { DriverKycDocument } from "../../entities/DriverKycDocument";

export interface IDriverKycRepository {
  save(document: DriverKycDocument): Promise<void>;
  findByDriverId(driverId: string): Promise<DriverKycDocument[]>;
}
