import { Driver } from "@domain/entities/Driver";
import { DriverStatus } from "@domain/value-objects/DriverStatus";
import { IDriverModel } from "../models/DriverModel";

export class DriverDomainMapper {
  static toDomain(model: IDriverModel): Driver {
    return Driver.fromData({
      id: model._id.toString(),
      userId: model.userId,
      name: model.name,
      email: model.email,
      mobile: model.mobile,
      licenseNumber: model.licenseNumber,
      vehicleNumber: model.vehicleNumber,
      status: model.status as DriverStatus,
      profilePicture: model.profilePicture,
      licenseDocument: model.licenseDocument,
      vehicleDocument: model.vehicleDocument,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static toModel(driver: Driver): Partial<IDriverModel> {
    return {
      userId: driver.getUserId(),
      name: driver.getName(),
      email: driver.getEmail(),
      mobile: driver.getMobile(),
      licenseNumber: driver.getLicenseNumber(),
      vehicleNumber: driver.getVehicleNumber(),
      status: driver.getStatus(),
      profilePicture: driver.getProfilePicture(),
      licenseDocument: driver.getLicenseDocument(),
      vehicleDocument: driver.getVehicleDocument(),
      updatedAt: driver.getUpdatedAt(),
    };
  }
}
