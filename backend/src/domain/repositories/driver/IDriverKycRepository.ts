import { DriverKycDocument } from "../../entities/KYC";

export interface IDriverKycRepository {
  save(document: DriverKycDocument): Promise<void>;
  findByDriverId(driverId: string): Promise<DriverKycDocument[]>;
}
