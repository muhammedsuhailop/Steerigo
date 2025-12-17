import { injectable, inject } from "inversify";
import { IDriverRepository } from "@domain/repositories/IDriverRepository";
import { IUserRepository } from "@domain/repositories/IUserRepository";
import { IKYCRepository } from "@domain/repositories/IKYCRepository";
import { DriverRegistrationRequestDto } from "@application/dto/driver/DriverRegistrationRequestDto";
import { DriverResponseDto } from "@application/dto/driver/DriverResponseDto";
import { Result } from "@shared/utils/Result";
import { Driver } from "@domain/entities/Driver";
import { KYC } from "@domain/entities/KYC";
import { DomainError } from "@domain/errors/DomainError";
import { Logger } from "@shared/utils/Logger";
import { TYPES } from "@shared/constants/DITypes";
import { UserRole } from "@shared/constants/AuthConstants";
import { Types } from "mongoose";
import { DocumentType } from "@domain/value-objects/DocumentType";
import { IUseCase } from "../interfaces/IUseCase";

export interface RegisterDriverResult {
  driver: DriverResponseDto;
  kycDocumentsCreated: {
    license: string;
    idDocument: string;
  };
  userUpdated: boolean;
}

@injectable()
export class DriverRegistrationUseCase
  implements
    IUseCase<
      DriverRegistrationRequestDto,
      Promise<Result<RegisterDriverResult>>
    >
{
  constructor(
    @inject(TYPES.DriverRepository) private driverRepository: IDriverRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.KYCRepository) private kycRepository: IKYCRepository
  ) {}

  async execute(
    dto: DriverRegistrationRequestDto
  ): Promise<Result<RegisterDriverResult>> {
    try {
      Logger.info("Comprehensive driver registration started", dto.getUserId());
      const user = await this.userRepository.findById(dto.getUserId());
      if (!user) {
        return Result.failure(new DomainError("User not found"));
      }

      const existingDriver = await this.driverRepository.findByUserId(
        dto.getUserId()
      );
      if (existingDriver) {
        return Result.failure(
          new DomainError("User is already registered as a driver")
        );
      }

      const now = new Date();
      if (dto.getLicenseExpiryDate() <= now) {
        return Result.failure(
          new DomainError("License expiry date must be in the future")
        );
      }

      if (dto.getLicenseIssueDate() > now) {
        return Result.failure(
          new DomainError("License issue date cannot be in the future")
        );
      }

      const idExpiryDate = dto.getIdExpiryDate();
      if (idExpiryDate !== null && idExpiryDate <= now) {
        return Result.failure(
          new DomainError("ID expiry date must be in the future")
        );
      }

      if (dto.getIdIssueDate() > now) {
        return Result.failure(
          new DomainError("ID issue date cannot be in the future")
        );
      }

      const driverId = new Types.ObjectId().toString();

      user.updateProfile({
        name: dto.getName(),
        mobile: dto.getMobile(),
        dob: dto.getDob(),
        gender: dto.getGender(),
        address: dto.getFullAddress(),
      });

      const driver = Driver.create(
        driverId,
        dto.getUserId(),
        dto.getEligibleGearTypes(),
        dto.getEligibleBodyTypes(),
        dto.getLicenseNumber(),
        dto.getLicenseCategory(),
        dto.getLicenseIssueDate(),
        dto.getLicenseExpiryDate()
      );

      const licenseKycId = new Types.ObjectId().toString();
      const idKycId = new Types.ObjectId().toString();

      const licenseKyc = KYC.create(
        licenseKycId,
        driverId,
        DocumentType.LICENSE,
        dto.getLicenseNumber(),
        dto.getLicenseIssueDate(),
        dto.getLicenseExpiryDate(),
        [dto.getLicenseFrontImage()],
        [dto.getLicenseBackImage()]
      );

      const idKyc = KYC.create(
        idKycId,
        driverId,
        dto.getIdType(),
        dto.getIdNumber(),
        dto.getIdIssueDate(),
        dto.getIdExpiryDate() ?? undefined,
        [dto.getIdFrontImage()],
        [dto.getIdBackImage()]
      );

      try {
        await this.userRepository.save(user);

        const savedDriver = await this.driverRepository.save(driver);
        if (!savedDriver) {
          throw new Error("Failed to save driver");
        }

        await this.kycRepository.save(licenseKyc);
        await this.kycRepository.save(idKyc);

        if (user.getRole() !== UserRole.DRIVER) {
          Logger.info("User role should be updated to DRIVER", dto.getUserId());
        }

        const response: RegisterDriverResult = {
          driver: {
            id: savedDriver.getId(),
            userId: savedDriver.getUserId(),
            eligibleGearTypes: savedDriver.getEligibleGearTypes(),
            eligibleBodyTypes: savedDriver.getEligibleBodyTypes(),
            licenceCategory: savedDriver.getLicenceCategory(),
            licenseIssueDate: savedDriver.getLicenseIssueDate(),
            licenseExpiryDate: savedDriver.getLicenseExpiryDate(),
            kycStatus: savedDriver.getKycStatus(),
            status: savedDriver.getStatus(),
            createdAt: savedDriver.getCreatedAt(),
            updatedAt: savedDriver.getUpdatedAt(),
          },
          kycDocumentsCreated: {
            license: licenseKycId,
            idDocument: idKycId,
          },
          userUpdated: true,
        };

        Logger.info("Comprehensive driver registration successful", {
          userId: savedDriver.getUserId(),
          driverId: savedDriver.getId(),
          licenseKycId,
          idKycId,
        });

        return Result.success(response);
      } catch (saveError) {
        Logger.error("Failed to save driver registration data", {
          userId: dto.getUserId(),
          error: saveError,
        });

        throw saveError;
      }
    } catch (error) {
      Logger.error("Comprehensive driver registration failed", {
        userId: dto.getUserId(),
        error,
      });
      return Result.failure(error as Error);
    }
  }
}
