import {
  DriverRegistrationData,
  ValidationResult,
  RegistrationStep,
} from "../types/driverRegistration.types";

class DriverValidationService {
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private validateMobile(mobile: string): boolean {
    const mobileRegex = /^(\+91[\s-]?)??(91)?[6789]\d{9}$/;
    return mobileRegex.test(mobile.replace(/[\s-]/g, ""));
  }

  private validateDate(dateString: string, minAge?: number): ValidationResult {
    const date = new Date(dateString);
    const today = new Date();

    if (isNaN(date.getTime())) {
      return { isValid: false, errors: { date: "Invalid date format" } };
    }

    if (date >= today) {
      return {
        isValid: false,
        errors: { date: "Date cannot be in the future" },
      };
    }

    if (minAge) {
      const ageDiff = today.getFullYear() - date.getFullYear();
      if (ageDiff < minAge) {
        return {
          isValid: false,
          errors: { date: `Minimum age required: ${minAge}` },
        };
      }
    }

    return { isValid: true, errors: {} };
  }

  validatePersonalInfo(
    data: Partial<DriverRegistrationData>
  ): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.name?.trim()) {
      errors.name = "Name is required";
    } else if (data.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!data.mobile?.trim()) {
      errors.mobile = "Mobile number is required";
    } else if (!this.validateMobile(data.mobile)) {
      errors.mobile = "Please enter a valid mobile number";
    }

    if (!data.dob) {
      errors.dob = "Date of birth is required";
    } else {
      const dobValidation = this.validateDate(data.dob, 18);
      if (!dobValidation.isValid) {
        errors.dob = dobValidation.errors.date || "Invalid date of birth";
      }
    }

    if (!data.gender) {
      errors.gender = "Gender is required";
    }

    if (!data.state?.trim()) {
      errors.state = "State is required";
    }

    if (!data.pin?.trim()) {
      errors.pin = "PIN code is required";
    } else if (!/^\d{6}$/.test(data.pin)) {
      errors.pin = "PIN code must be 6 digits";
    }

    if (!data.address?.trim()) {
      errors.address = "Address is required";
    } else if (data.address.length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateVehicleInfo(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.vehicleTypes?.length) {
      errors.vehicleTypes = "At least one vehicle type is required";
    }

    if (!data.gearTypes?.length) {
      errors.gearTypes = "At least one gear type is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateLicenseInfo(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.licenseCategory?.trim()) {
      errors.licenseCategory = "License category is required";
    }

    if (!data.licenseNumber?.trim()) {
      errors.licenseNumber = "License number is required";
    } else if (data.licenseNumber.length < 8) {
      errors.licenseNumber = "License number must be at least 8 characters";
    }

    if (!data.licenseBodyTypes?.length) {
      errors.licenseBodyTypes = "At least one body type is required";
    }

    if (!data.licenseGearTypes?.length) {
      errors.licenseGearTypes = "At least one gear type is required";
    }

    if (!data.licenseIssueDate) {
      errors.licenseIssueDate = "License issue date is required";
    }

    if (!data.licenseExpiryDate) {
      errors.licenseExpiryDate = "License expiry date is required";
    }

    if (data.licenseIssueDate && data.licenseExpiryDate) {
      const issueDate = new Date(data.licenseIssueDate);
      const expiryDate = new Date(data.licenseExpiryDate);

      if (expiryDate <= issueDate) {
        errors.licenseExpiryDate = "Expiry date must be after issue date";
      }

      if (expiryDate <= new Date()) {
        errors.licenseExpiryDate = "License is expired";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateIdInfo(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.idType?.trim()) {
      errors.idType = "ID type is required";
    }

    if (!data.idNumber?.trim()) {
      errors.idNumber = "ID number is required";
    } else if (
      data.idType === "Aadhaar" &&
      !/^\d{4}-\d{4}-\d{4}$/.test(data.idNumber)
    ) {
      errors.idNumber = "Aadhaar number format: XXXX-XXXX-XXXX";
    }

    if (!data.idIssueDate) {
      errors.idIssueDate = "ID issue date is required";
    }

    if (!data.idExpiryDate) {
      errors.idExpiryDate = "ID expiry date is required";
    }

    if (data.idIssueDate && data.idExpiryDate) {
      const issueDate = new Date(data.idIssueDate);
      const expiryDate = new Date(data.idExpiryDate);

      if (expiryDate <= issueDate) {
        errors.idExpiryDate = "Expiry date must be after issue date";
      }

      if (expiryDate <= new Date()) {
        errors.idExpiryDate = "ID is expired";
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateDocuments(data: Partial<DriverRegistrationData>): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.licenseFrontImage) {
      errors.licenseFrontImage = "License front image is required";
    }

    if (!data.licenseBackImage) {
      errors.licenseBackImage = "License back image is required";
    }

    if (!data.idFrontImage) {
      errors.idFrontImage = "ID front image is required";
    }

    if (!data.idBackImage) {
      errors.idBackImage = "ID back image is required";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateStep(
    step: RegistrationStep,
    data: Partial<DriverRegistrationData>
  ): ValidationResult {
    switch (step) {
      case RegistrationStep.PERSONAL_INFO:
        return this.validatePersonalInfo(data);
      case RegistrationStep.VEHICLE_INFO:
        return this.validateVehicleInfo(data);
      case RegistrationStep.LICENSE_INFO:
        return this.validateLicenseInfo(data);
      case RegistrationStep.ID_INFO:
        return this.validateIdInfo(data);
      case RegistrationStep.DOCUMENTS:
        return this.validateDocuments(data);
      default:
        return { isValid: true, errors: {} };
    }
  }

  validateAll(data: DriverRegistrationData): ValidationResult {
    const allErrors: Record<string, string> = {};

    const personalValidation = this.validatePersonalInfo(data);
    const vehicleValidation = this.validateVehicleInfo(data);
    const licenseValidation = this.validateLicenseInfo(data);
    const idValidation = this.validateIdInfo(data);
    const documentsValidation = this.validateDocuments(data);

    Object.assign(allErrors, personalValidation.errors);
    Object.assign(allErrors, vehicleValidation.errors);
    Object.assign(allErrors, licenseValidation.errors);
    Object.assign(allErrors, idValidation.errors);
    Object.assign(allErrors, documentsValidation.errors);

    return {
      isValid: Object.keys(allErrors).length === 0,
      errors: allErrors,
    };
  }
}

export const driverValidationService = new DriverValidationService();
