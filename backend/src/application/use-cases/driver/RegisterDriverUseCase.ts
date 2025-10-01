import { injectable, inject } from "inversify";
import { RegisterDriverDto } from "../../dto/driver/RegisterDriverDto";
import { IDriverRepository } from "@domain/repositories/driver/IDriverRepository";
import { IDriverKycRepository } from "@domain/repositories/driver/IDriverKycRepository";
import { IUserRepository } from "@domain/repositories";
import { Driver } from "@domain/entities/Driver";
import { DriverKycDocument } from "@domain/entities/DriverKycDocument";
import { Result } from "@shared/utils/Result";
import { v4 as uuid } from "uuid";
import { MobileAlreadyExistsError } from "@domain/errors";

@injectable()
export class RegisterDriverUseCase {
  constructor(
    @inject("IUserRepository") private userRepository: IUserRepository,
    @inject("IDriverRepository") private driverRepository: IDriverRepository,
    @inject("IDriverKycRepository") private kycRepository: IDriverKycRepository
  ) {}

  async execute(dto: RegisterDriverDto, userId: string): Promise<Result<void>> {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return Result.failure(new Error("User not found"));
      }

      const mobileExists = await this.userRepository.existsByMobile(dto.mobile);
      if (mobileExists && dto.mobile !== user.getMobile()) {
        return Result.failure(new MobileAlreadyExistsError());
      }

      const existingDriver = await this.driverRepository.findByUserId(userId);
      if (existingDriver) {
        return Result.failure(
          new Error("This user is already registered as a driver.")
        );
      }

      user.updateProfile({
        name: dto.name,
        mobile: dto.mobile,
        dob: new Date(dto.dob),
        gender: dto.gender,
        address: dto.getFullAddress(),
      });

      await this.userRepository.save(user);

      const driver = Driver.create({
        id: uuid(),
        userId,
        licenseNumber: dto.licenseNumber,
        licenseIssueDate: new Date(dto.dob),
        licenseExpiryDate: new Date(dto.dob),
        licenseCategory: dto.licenseCategory,
        eligibleVehicleType: dto.bodyTypes,
        eligibleGearType: dto.gearTypes,
      });
      const savedDriver = await this.driverRepository.save(driver);

      const kycDocs = [
        DriverKycDocument.create({
          id: uuid(),
          driverId: savedDriver.getId(),
          docType: dto.idType,
          docNumber: dto.idNumber,
          issueDate: new Date(dto.idIssueDate),
          expiryDate: new Date(dto.idExpiryDate),
          docImageUrls: [dto.idFrontImage, dto.idBackImage],
        }),

        DriverKycDocument.create({
          id: uuid(),
          driverId: savedDriver.getId(),
          docType: "DrivingLicense",
          docNumber: dto.licenseNumber,
          issueDate: new Date(dto.licenseIssueDate),
          expiryDate: new Date(dto.licenseExpiryDate),
          docImageUrls: [dto.licenseFrontImage, dto.licenseBackImage],
        }),
      ];

      for (const doc of kycDocs) {
        await this.kycRepository.save(doc);
      }

      return Result.success();
    } catch (error) {
      return Result.failure(error as Error);
    }
  }
}
